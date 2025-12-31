import { useRef, useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { describe, it, expect, vi } from "vitest";
import { ScrollList, ScrollListRef } from "../src/ScrollList.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Tests for viewport dimension management in ScrollList.
 */
describe("Viewport", () => {
  /**
   * Verifies that content height updates when ScrollList width changes (due to text wrapping).
   */
  it("should update ContentHeight when ScrollList width changes (text wrapping)", async () => {
    let scrollListRef: ScrollListRef | null = null;
    let setWidthFn: any;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      const [width, setWidth] = useState(10);
      useEffect(() => {
        scrollListRef = ref.current;
        setWidthFn = setWidth;
      }, []);

      return (
        <ScrollList ref={ref} height={5} width={width}>
          {/* 20 chars. Width 10 -> 2 lines. Width 25 -> 1 line. */}
          <Box flexShrink={0}>
            <Text>12345678901234567890</Text>
          </Box>
          <Box flexShrink={0}>
            <Text>Item 2</Text>
          </Box>
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    const scrollList = scrollListRef!;

    // Initial width 10.
    // Item 1: 20 chars -> wraps to 2 lines?
    // Ink's Text wraps.
    // So height should be 2 for Item 1 (roughly), + 1 for Item 2 = 3.
    const h1 = scrollList.getContentHeight();
    expect(h1).toBeGreaterThanOrEqual(1);

    // Increase width to 25.
    setWidthFn(25);
    await delay(100);

    const h2 = scrollList.getContentHeight();
    // Should decrease (less wrapping)
    if (h1 > 2) {
      expect(h2).toBeLessThan(h1);
    }
    expect(h2).toBe(2); // 1 for Item 1 (now fits), 1 for Item 2

    unmount();
  });

  /**
   * Verifies that the `onViewportSizeChange` callback is triggered when dimensions change.
   */
  it("should trigger onViewportSizeChange when dimensions change", async () => {
    let setSizeFn: any;
    const onViewportSizeChange = vi.fn();

    const TestComponent = () => {
      const [size, setSize] = useState({ w: 10, h: 5 });
      useEffect(() => {
        setSizeFn = setSize;
      }, []);

      return (
        <ScrollList
          width={size.w}
          height={size.h}
          onViewportSizeChange={onViewportSizeChange}
        >
          <Text>Content</Text>
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    // Initial call
    expect(onViewportSizeChange).toHaveBeenCalled();
    const initialCall = onViewportSizeChange.mock.calls[0];
    expect(initialCall?.[0]).toEqual({ width: 10, height: 5 });

    // Change size
    onViewportSizeChange.mockClear();
    setSizeFn({ w: 15, h: 8 });
    await delay(100);

    expect(onViewportSizeChange).toHaveBeenCalled();
    const lastCall = onViewportSizeChange.mock.calls[0];
    expect(lastCall?.[0]).toEqual({ width: 15, height: 8 });

    unmount();
  });

  /**
   * Verifies that currently selected item stays selected and visible when height changes,
   * or clamped if necessary (handled by selection logic, but here we check offset validity).
   */
  it("should maintain valid ScrollOffset and Selection when height changes", async () => {
    let scrollListRef: ScrollListRef | null = null;
    let setHeightFn: any;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      const [height, setHeight] = useState(5);
      useEffect(() => {
        scrollListRef = ref.current;
        setHeightFn = setHeight;
      }, []);

      return (
        <ScrollList ref={ref} height={height}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Box key={i}>
              <Text>Item {i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    const scrollList = scrollListRef!;

    // Initial height 5. Content 20.
    // Select item 10.
    scrollList.select(10);
    await delay(50);
    const offsetBefore = scrollList.getScrollOffset();
    expect(scrollList.getSelectedIndex()).toBe(10);
    // Offset should ensure 10 is visible.

    // Increase height to 15.
    setHeightFn(15);
    await delay(100);

    // Selection should stay 10.
    expect(scrollList.getSelectedIndex()).toBe(10);
    // Offset might maintain if valid, or adjust if bounds changed logic triggers.
    // ScrollView maintains offset if valid, but ScrollList now enforces strict bounds.
    // offsetBefore was 6. With height 15, max scroll is 20-15=5.
    // So it should clamp to 5.
    expect(scrollList.getScrollOffset()).toBe(5);

    // Now shrink height to 2.
    setHeightFn(2);
    await delay(100);

    // Selection must stay 10.
    expect(scrollList.getSelectedIndex()).toBe(10);
    // Check if invisible? select(10) runs automatically when viewport changes?
    // In ScrollList implementation:
    // const handleViewportSizeChange = ... { scrollToItem(getSelectedIndex()); ... }
    // So it should auto-scroll to keep it visible!

    const offsetAfter = scrollList.getScrollOffset();
    const itemTop = 10;
    const itemBottom = 11;
    const viewportHeight = 2;
    // Visible range: [offset, offset + 2]
    // 10 must be in [offset, offset+2) -> offset <= 10 and offset+2 >= 11 => offset >= 9
    // So offset should be 9 or 10.
    expect(offsetAfter).toBeGreaterThanOrEqual(9);
    expect(offsetAfter).toBeLessThanOrEqual(10);

    unmount();
  });
  describe("Boundary Cases", () => {
    it("should clamp scroll offset to 0 when viewport is larger than content", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={10}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} height={1}>
                <Text>{i}</Text>
              </Box>
            ))}
          </ScrollList>
        );
      };

      const { unmount } = render(<TestComponent />);
      await delay(100);
      const scrollList = scrollListRef!;

      // Scroll to 5 (valid if content was larger, but invalid here)
      // Content height 3. Viewport 10. Max scroll 0.
      scrollList.scrollTo(5);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(0);

      unmount();
    });

    it("should handle viewport size 1", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={1}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} height={1}>
                <Text>{i}</Text>
              </Box>
            ))}
          </ScrollList>
        );
      };

      const { unmount } = render(<TestComponent />);
      await delay(100);
      const scrollList = scrollListRef!;

      // Content 5. Viewport 1.
      // Max scroll 4.
      scrollList.scrollTo(10);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(4);

      unmount();
    });
  });
});
