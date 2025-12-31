import { useRef, useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { describe, it, expect } from "vitest";
import { ScrollList, ScrollListRef } from "../src/ScrollList.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Selection", () => {
  it("should handle basic selection navigation", async () => {
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
              <Text>Item {i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    const scrollList = scrollListRef!;

    // Initial state
    expect(scrollList.getSelectedIndex()).toBe(0);

    // Select next
    scrollList.selectNext();
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(1);

    // Select specific
    scrollList.select(5);
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(5);

    // Select previous
    scrollList.selectPrevious();
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(4);

    unmount();
  });

  it("should support controlled selectedIndex", async () => {
    let scrollListRef: ScrollListRef | null = null;
    let setIndexFn: (i: number) => void;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      const [index, setIndex] = useState(0);

      useEffect(() => {
        scrollListRef = ref.current;
        setIndexFn = setIndex;
      }, []);

      return (
        <ScrollList
          ref={ref}
          height={5}
          selectedIndex={index}
          onSelectionChange={setIndex}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} height={1}>
              <Text>Item {i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    const scrollList = scrollListRef!;
    expect(scrollList.getSelectedIndex()).toBe(0);

    // Update via prop
    setIndexFn!(3);
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(3);

    // Update via internal method should trigger onSelectionChange
    scrollList.selectNext();
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(4);

    unmount();
  });

  it("should clamp selection to valid bounds", async () => {
    let scrollListRef: ScrollListRef | null = null;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      useEffect(() => {
        scrollListRef = ref.current;
      }, []);
      return (
        <ScrollList ref={ref} height={5}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} height={1}>
              <Text>Item {i}</Text>
            </Box>
          ))}
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);

    const scrollList = scrollListRef!;

    // Try invalid
    scrollList.select(-1);
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(0);

    scrollList.select(100);
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(4); // max index

    unmount();
  });

  it("should handle selectNext/Previous at edges", async () => {
    let scrollListRef: ScrollListRef | null = null;

    const TestComponent = () => {
      const ref = useRef<ScrollListRef>(null);
      useEffect(() => {
        scrollListRef = ref.current;
      }, []);
      return (
        <ScrollList ref={ref} height={5}>
          <Box height={1}>
            <Text>0</Text>
          </Box>
          <Box height={1}>
            <Text>1</Text>
          </Box>
        </ScrollList>
      );
    };

    const { unmount } = render(<TestComponent />);
    await delay(100);
    const scrollList = scrollListRef!;

    // At 0, previous should stay 0
    scrollList.selectPrevious();
    expect(scrollList.getSelectedIndex()).toBe(0);

    // Go to end
    scrollList.selectNext();
    expect(scrollList.getSelectedIndex()).toBe(1);

    // At end, next should stay at end
    scrollList.selectNext();
    expect(scrollList.getSelectedIndex()).toBe(1);

    unmount();
  });

  it("should support selectFirst and selectLast", async () => {
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

    scrollList.selectLast();
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(9);
    expect(scrollList.getScrollOffset()).toBeGreaterThan(0); // Should have scrolled

    scrollList.selectFirst();
    await delay(50);
    expect(scrollList.getSelectedIndex()).toBe(0);
    expect(scrollList.getScrollOffset()).toBe(0);

    unmount();
  });
  describe("Dynamic Updates", () => {
    it("should maintain selected index when items are added at the end", async () => {
      let scrollListRef: ScrollListRef | null = null;
      let setItemsFn: any;

      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        const [items, setItems] = useState([1, 2, 3]);

        // Ensure ref is up to date
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

      // Select index 2 (Item 3)
      scrollListRef!.select(2);
      expect(scrollListRef!.getSelectedIndex()).toBe(2);

      // Add items at end
      setItemsFn([1, 2, 3, 4, 5]);
      await delay(100);

      // Should stay at index 2 (Item 3)
      expect(scrollListRef!.getSelectedIndex()).toBe(2);

      unmount();
    });

    it("should maintain selected index when items are added at the start (selection points to new item)", async () => {
      let scrollListRef: ScrollListRef | null = null;
      let setItemsFn: any;

      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        const [items, setItems] = useState([1, 2, 3]);

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

      // Select index 0 (Item 1)
      scrollListRef!.select(0);
      expect(scrollListRef!.getSelectedIndex()).toBe(0);

      // Add 0 at start: [0, 1, 2, 3]
      setItemsFn([0, 1, 2, 3]);
      await delay(100);

      // Should stay at index 0 (now Item 0)
      // Note: ScrollList tracks index, not item identity.
      expect(scrollListRef!.getSelectedIndex()).toBe(0);

      unmount();
    });

    it("should maintain selected index when items are removed before selection (selection shifts to new item)", async () => {
      let scrollListRef: ScrollListRef | null = null;
      let setItemsFn: any;

      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        const [items, setItems] = useState([1, 2, 3, 4, 5]);

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

      // Select index 2 (Item 3)
      scrollListRef!.select(2);
      expect(scrollListRef!.getSelectedIndex()).toBe(2);

      // Remove Item 1 (index 0). New list: [2, 3, 4, 5]
      setItemsFn([2, 3, 4, 5]);
      await delay(100);

      // Should stay at index 2.
      // Index 0: 2
      // Index 1: 3
      // Index 2: 4
      // So now selected item is 4.
      expect(scrollListRef!.getSelectedIndex()).toBe(2);

      unmount();
    });
  });
  describe("Boundary Cases", () => {
    it("should handle navigation in a single-item list", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5}>
            <Box height={1}>
              <Text>Item 0</Text>
            </Box>
          </ScrollList>
        );
      };

      const { unmount } = render(<TestComponent />);
      await delay(100);
      const scrollList = scrollListRef!;

      expect(scrollList.getSelectedIndex()).toBe(0);

      scrollList.selectNext();
      expect(scrollList.getSelectedIndex()).toBe(0);

      scrollList.selectPrevious();
      expect(scrollList.getSelectedIndex()).toBe(0);

      scrollList.selectLast();
      expect(scrollList.getSelectedIndex()).toBe(0);

      unmount();
    });

    it("should clamp controlled selectedIndex if passed out of bounds", async () => {
      let scrollListRef: ScrollListRef | null = null;
      const TestComponent = () => {
        const ref = useRef<ScrollListRef>(null);
        useEffect(() => {
          scrollListRef = ref.current;
        }, []);
        return (
          <ScrollList ref={ref} height={5} selectedIndex={100}>
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

      // Should auto-clamp to max index (4)
      expect(scrollList.getSelectedIndex()).toBe(4);

      unmount();
    });
  });
});
