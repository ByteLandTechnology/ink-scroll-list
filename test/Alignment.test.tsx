import { useRef, useEffect } from "react";
import { render, Box, Text } from "ink";
import { describe, it, expect } from "vitest";
import { ScrollList, ScrollListRef } from "../src/ScrollList.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("ScrollAlignment", () => {
  describe("Auto", () => {
    it("should scroll to top if item is above current viewport", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5} scrollAlignment="auto">
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Scroll to 10
      scrollList.scrollTo(10);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(10);

      // Select 5 (which is at top 5). Viewport is 10-15.
      // 5 < 10. Should scroll so 5 is at top? Or just visible?
      // 'auto' scrolls to minimal position.
      // If target < current, target becomes new current.
      scrollList.select(5);
      await delay(50);

      expect(scrollList.getScrollOffset()).toBe(5);

      unmount();
    });

    it("should scroll to bottom if item is below current viewport", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5} scrollAlignment="auto">
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Offset 0. Viewport 0-5.
      // Select 8. (Top 8, Bottom 9).
      // Should scroll so 8 is visible at bottom.
      // New offset + 5 = 9 => Offset = 4.

      scrollList.select(8);
      await delay(50);

      expect(scrollList.getScrollOffset()).toBe(4);

      unmount();
    });

    it("should not scroll if item is already visible", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5} scrollAlignment="auto">
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Initial offset 0. Viewport 0-5.
      // Select 2. (Top 2, Bottom 3). Visible.
      scrollList.select(2);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(0);

      // Scroll to 5. Viewport 5-10.
      scrollList.scrollTo(5);
      await delay(50);

      // Select 7. (Top 7, Bottom 8). Visible.
      scrollList.select(7);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(5);

      unmount();
    });
  });

  describe("Explicit Modes", () => {
    it("should align to top", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Select 10 with top. Should be at offset 10.
      scrollList.select(10, "top");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(10);

      unmount();
    });

    it("should align to bottom", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Select 10 with bottom. Item 10 is at 10..11.
      // Viewport bottom should be at 11.
      // Offset + 5 = 11 => Offset = 6.
      scrollList.select(10, "bottom");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(6);

      unmount();
    });

    it("should align to center", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Select 10 with center. Item 10 center is 10.5.
      // Viewport center is Offset + 2.5.
      // Offset + 2.5 = 10.5 => Offset = 8.
      scrollList.select(10, "center");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(8);

      unmount();
    });
  });

  describe("Clamping", () => {
    it("should clamp to bounds when aligning would go out of bounds", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            {Array.from({ length: 10 }).map((_, i) => (
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
      // Total height 10. Viewport 5. Max Scroll 5.

      // Select 1 with center.
      // Center of 1 is 1.5. Target offset = 1.5 - 2.5 = -1.
      // Should clamp to 0.
      scrollList.select(1, "center");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(0);

      // Select 8 with center.
      // Center of 8 is 8.5. Target offset = 8.5 - 2.5 = 6.
      // Max offset is 5. Should clamp to 5.
      scrollList.select(8, "center");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(5);

      unmount();
    });
  });
  describe("Boundary Cases", () => {
    it("should handle aligning items larger than the viewport", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5} scrollAlignment="auto">
            <Box height={1}>
              <Text>Small</Text>
            </Box>
            <Box height={10}>
              <Text>Large</Text>
            </Box>
            <Box height={1}>
              <Text>Small</Text>
            </Box>
          </ScrollList>
        );
      };
      const { unmount } = render(<TestComponent />);
      await delay(100);
      const scrollList = scrollListRef!;

      // Select Large item (index 1). Top: 1. Height: 10.

      // Auto:
      // If we are at 0 (viewport 0-5), item top 1 is visible. Bottom 11 is not.
      // Auto typically keeps top visible if it fits? Or minimizes scrolling.
      // If we scroll to 6 (viewport 6-11), bottom is visible.
      // The implementation checks:
      // if (top < current) target=top
      // else if (bottom > current + viewport) target=bottom-viewport

      // Initially offset 0.
      // Top 1 >= 0.
      // Bottom 11 > 5. Target = 11 - 5 = 6.
      // So it should scroll to 6 to show bottom?
      // Wait, is this desired? Usually for large items showing top is preferred.
      // ink-scroll-list logic:
      // if (position.top < currentScrollOffset) targetScrollOffset = position.top;
      // else if (itemBottom > currentScrollOffset + viewportHeight) targetScrollOffset = itemBottom - viewportHeight;

      // So yes, it prioritizes showing bottom if it's below.
      // Let's verify this behavior.

      scrollList.select(1);
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(6);

      // Explicit Top
      scrollList.select(1, "top");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(1);

      unmount();
    });

    it("should handle aligning the first item to bottom (clamped)", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            {Array.from({ length: 20 }).map((_, i) => (
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

      // Select 0 with bottom.
      // Top 0, Bottom 1.
      // Target = 1 - 5 = -4.
      // Clamped to 0.
      scrollList.select(0, "bottom");
      await delay(50);
      expect(scrollList.getScrollOffset()).toBe(0);

      unmount();
    });
  });
});
