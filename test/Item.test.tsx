import { useRef, useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { describe, it, expect } from "vitest";
import { ScrollList, ScrollListRef } from "../src/ScrollList.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Item", () => {
  it("should maintain selected index clamping when items are removed", async () => {
    let scrollListRef: ScrollListRef | null = null;
    let setItemsFn: any;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      const [items, setItems] = useState([1, 2, 3, 4, 5]);

      // Update ref on every render to ensure we have the latest handle
      useEffect(() => {
        scrollListRef = ref.current;
      });

      useEffect(() => {
        setItemsFn = setItems;
      }, []);

      return (
        <ScrollList ref={ref} height={5}>
          {items.map((i) => (
            <Box key={i} height={1}>
              <Text>{i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    // Select last item (4)
    scrollListRef!.select(4);
    expect(scrollListRef!.getSelectedIndex()).toBe(4);

    // Remove items to leave only 2 items
    setItemsFn([1, 2]);
    await delay(100);

    // Should clamp to new last index (1)
    expect(scrollListRef!.getSelectedIndex()).toBe(1);

    // Add items back
    setItemsFn([1, 2, 3]);
    await delay(100);
    // Selection should stay at 1
    expect(scrollListRef!.getSelectedIndex()).toBe(1);

    unmount();
  });

  it("should expose item count correctly", async () => {
    let scrollListRef: ScrollListRef | null = null;
    let setItemsFn: any;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      const [count, setCount] = useState(3);

      useEffect(() => {
        scrollListRef = ref.current;
      });

      useEffect(() => {
        setItemsFn = setCount;
      }, []);

      return (
        <ScrollList ref={ref} height={5}>
          {Array.from({ length: count }).map((_, i) => (
            <Box key={i} height={1}>
              <Text>{i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    expect(scrollListRef!.getItemCount()).toBe(3);

    setItemsFn(5);
    await delay(100);
    expect(scrollListRef!.getItemCount()).toBe(5);

    unmount();
  });

  it("should handle empty list gracefully", async () => {
    let scrollListRef: ScrollListRef | null = null;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      useEffect(() => {
        scrollListRef = ref.current;
      }, []);
      return (
        <ScrollList ref={ref} height={5}>
          {/* Empty */}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);
    const scrollList = scrollListRef!;

    expect(scrollList.getSelectedIndex()).toBe(0);
    scrollList.selectNext();
    expect(scrollList.getSelectedIndex()).toBe(0);

    unmount();
  });
});
