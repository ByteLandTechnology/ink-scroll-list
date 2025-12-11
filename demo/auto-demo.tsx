/**
 * @fileoverview Auto Demo for ink-scroll-list
 *
 * This file provides automated demonstrations of ScrollList capabilities.
 * It is used to generate animated SVG recordings (via termtosvg) for documentation.
 *
 * Each demo category showcases a specific feature of the ScrollList component:
 * - selection: Basic selection operations and auto-scrolling
 * - alignment: Different scroll alignment modes (auto, top, center, bottom)
 * - expand: Expand/collapse items with dynamic height changes
 * - dynamic: Dynamic item management (adding/removing items)
 *
 * @usage
 * ```bash
 * # Run a specific demo category
 * npx tsx demo/auto-demo.tsx selection
 * npx tsx demo/auto-demo.tsx alignment
 * npx tsx demo/auto-demo.tsx expand
 * npx tsx demo/auto-demo.tsx dynamic
 *
 * # Generate SVG animation (requires termtosvg)
 * termtosvg selection.svg -c "npx tsx demo/auto-demo.tsx selection" -t putty -g 70x20
 * ```
 */

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";
import { render, Text, Box, Spacer } from "ink";
import { ScrollList, ScrollListRef, ScrollAlignment } from "../src/index";

// =============================================================================
// Configuration
// =============================================================================

/**
 * Get the demo category from command line argument.
 * Defaults to "selection" if no argument is provided.
 */
const DEMO_CATEGORY = process.argv[2] || "selection";

/**
 * Available demo categories with their display names.
 * Used for validation and display purposes.
 */
const CATEGORIES: Record<string, string> = {
  selection: "Selection & Navigation",
  alignment: "Scroll Alignment Modes",
  expand: "Dynamic Expand/Collapse",
  dynamic: "Dynamic Items",
};

// Validate the provided category
if (!Object.keys(CATEGORIES).includes(DEMO_CATEGORY)) {
  console.error(`Invalid category: ${DEMO_CATEGORY}`);
  console.error(`Available categories: ${Object.keys(CATEGORIES).join(", ")}`);
  process.exit(1);
}

// =============================================================================
// Split Demo Layout Component
// =============================================================================

/**
 * Props for the SplitDemoLayout component.
 */
interface SplitDemoLayoutProps {
  /** Title of the demo (not displayed, kept for reference) */
  title: string;
  /** Current action description shown at the top */
  description?: string;
  /** Content to render in both ScrollLists */
  children?: ReactNode;
  /** Ref to the left (debug mode) ScrollList */
  leftRef?: React.RefObject<ScrollListRef | null>;
  /** Ref to the right (normal mode) ScrollList */
  rightRef?: React.RefObject<ScrollListRef | null>;
  /** Default items to render if children is not provided */
  items?: ReactElement[];
  /** Height of the ScrollList viewport */
  height?: number;
  /** Current selected index (for display) */
  selectedIndex?: number;
  /** Current scroll offset (for display) */
  scrollOffset?: number;
  /** Current alignment mode (for display) */
  alignment?: ScrollAlignment;
  /** Additional props passed to the left ScrollList */
  leftScrollListProps?: any;
  /** Additional props passed to the right ScrollList */
  rightScrollListProps?: any;
}

/**
 * SplitDemoLayout - A side-by-side comparison layout for demos.
 *
 * This component renders two ScrollLists side by side:
 * - Left side: Debug mode enabled (shows viewport boundaries)
 * - Right side: Normal mode (production-like rendering)
 *
 * Both ScrollLists receive the same content and props, allowing users
 * to compare the debug visualization with the actual rendered output.
 *
 * @example
 * ```tsx
 * <SplitDemoLayout
 *   title="My Demo"
 *   description="Demonstrating selection..."
 *   leftRef={leftRef}
 *   rightRef={rightRef}
 *   selectedIndex={0}
 *   scrollOffset={0}
 *   height={10}
 * >
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </SplitDemoLayout>
 * ```
 */
export const SplitDemoLayout: React.FC<SplitDemoLayoutProps> = ({
  title,
  description,
  children,
  leftRef,
  rightRef,
  items = [],
  height = 8,
  selectedIndex = 0,
  scrollOffset = 0,
  alignment = "auto",
  leftScrollListProps = {},
  rightScrollListProps = {},
}) => {
  // Container height includes padding for the outer box
  const containerHeight = height + 4;

  // Create default items if no children or items are provided
  const defaultItems =
    items.length > 0
      ? items
      : Array.from({ length: 20 }, (_, i) => (
          <Text key={i}>{i + 1}. Item</Text>
        ));

  return (
    <Box flexDirection="column" width={70}>
      {/* Description bar - shows current action being demonstrated */}
      {description && (
        <Box paddingX={1}>
          <Text color="yellow" wrap="truncate">
            ⏵ {description}
          </Text>
        </Box>
      )}

      {/* Split view container - two ScrollLists side by side */}
      <Box flexDirection="row">
        {/* Left side - DEBUG MODE */}
        {/* Shows the ScrollList with debug=true, displaying viewport boundaries */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          {/* Header showing mode, alignment, and scroll offset */}
          <Box paddingX={1}>
            <Text color="green" bold>
              DEBUG
            </Text>
            <Spacer />
            <Text color="gray">
              A:
              <Text color="yellow">{alignment.slice(0, 3).toUpperCase()}</Text>
            </Text>
            <Spacer />
            {typeof scrollOffset === "number" && (
              <Text color="gray">S:{scrollOffset}</Text>
            )}
          </Box>
          {/* Container box with overflow hidden to simulate viewport clipping */}
          <Box
            height={containerHeight}
            borderStyle="single"
            borderColor="blue"
            flexDirection="column"
            overflow="hidden"
            paddingY={1}
          >
            <ScrollList
              ref={leftRef}
              debug={true}
              height={height}
              width="100%"
              selectedIndex={selectedIndex}
              scrollAlignment={alignment}
              borderStyle="single"
              borderColor="green"
              {...leftScrollListProps}
            >
              {children || defaultItems}
            </ScrollList>
          </Box>
        </Box>

        {/* Right side - NORMAL MODE */}
        {/* Shows the ScrollList without debug mode (production-like) */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          {/* Header showing mode, selected index */}
          <Box paddingX={1}>
            <Text color="magenta" bold>
              NORMAL
            </Text>
            <Spacer />
            <Text color="gray">
              Sel:<Text color="cyan">{selectedIndex}</Text>
            </Text>
            <Spacer />
            {typeof scrollOffset === "number" && (
              <Text color="gray">S:{scrollOffset}</Text>
            )}
          </Box>
          {/* Container box with overflow hidden to simulate viewport clipping */}
          <Box
            height={containerHeight}
            borderStyle="single"
            borderColor="red"
            flexDirection="column"
            overflow="hidden"
            paddingY={1}
          >
            <ScrollList
              ref={rightRef}
              height={height}
              width="100%"
              selectedIndex={selectedIndex}
              scrollAlignment={alignment}
              borderStyle="single"
              borderColor="magenta"
              {...rightScrollListProps}
            >
              {children || defaultItems}
            </ScrollList>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// =============================================================================
// List Item Component
// =============================================================================

/**
 * ListItem - A styled list item for demos.
 */
const ListItem = ({
  index,
  isSelected,
  isExpanded,
  content,
}: {
  index: number;
  isSelected: boolean;
  isExpanded?: boolean;
  content?: string;
}) => {
  return (
    <Box
      flexDirection="column"
      borderStyle={isSelected ? "double" : "single"}
      borderColor={isSelected ? "cyan" : "gray"}
      paddingX={1}
    >
      <Box>
        <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
          {isSelected ? "▶ " : "  "}
          Item {index + 1}
        </Text>
        <Spacer />
        {isExpanded !== undefined && (
          <Text color="gray">{isExpanded ? "[-]" : "[+]"}</Text>
        )}
      </Box>
      {isExpanded && content && (
        <Box marginTop={0} paddingLeft={2}>
          <Text color="yellow" wrap="wrap">
            {content}
          </Text>
        </Box>
      )}
    </Box>
  );
};

/**
 * SimpleListItem - A simple list item without borders for cleaner demos.
 */
const SimpleListItem = ({
  index,
  isSelected,
}: {
  index: number;
  isSelected: boolean;
}) => {
  return (
    <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
      {isSelected ? "▶ " : "  "}
      Item {index + 1}
    </Text>
  );
};

// =============================================================================
// Demo Components
// =============================================================================

/**
 * SelectionDemo - Demonstrates basic selection operations.
 *
 * This demo showcases:
 * 1. Selecting next item (arrow down navigation)
 * 2. Selecting previous item (arrow up navigation)
 * 3. Jumping to the first item
 * 4. Jumping to the last item
 *
 * The demo runs automatically with timed actions and exits after completion.
 */
const SelectionDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<ScrollListRef | null>;
  rightRef: React.RefObject<ScrollListRef | null>;
}) => {
  const [description, setDescription] = useState(
    "Initializing selection demo...",
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // === Demo Sequence ===

    // Step 1: Navigate down through items
    timeouts.push(
      setTimeout(() => setDescription("Selecting next items..."), 1000),
    );

    // Select next items one by one
    for (let i = 1; i <= 8; i++) {
      timeouts.push(
        setTimeout(
          () => {
            const newIndex = leftRef.current?.selectNext() ?? 0;
            rightRef.current?.select(newIndex);
            setSelectedIndex(newIndex);
          },
          1000 + i * 400,
        ),
      );
    }

    // Step 2: Navigate up
    timeouts.push(
      setTimeout(() => setDescription("Selecting previous items..."), 5500),
    );

    for (let i = 1; i <= 4; i++) {
      timeouts.push(
        setTimeout(
          () => {
            const newIndex = leftRef.current?.selectPrevious() ?? 0;
            rightRef.current?.select(newIndex);
            setSelectedIndex(newIndex);
          },
          5500 + i * 400,
        ),
      );
    }

    // Step 3: Jump to last
    timeouts.push(
      setTimeout(() => setDescription("Jumping to last item..."), 8000),
    );
    timeouts.push(
      setTimeout(() => {
        const newIndex = leftRef.current?.selectLast() ?? 0;
        rightRef.current?.select(newIndex);
        setSelectedIndex(newIndex);
      }, 8500),
    );

    // Step 4: Jump to first
    timeouts.push(
      setTimeout(() => setDescription("Jumping to first item..."), 10000),
    );
    timeouts.push(
      setTimeout(() => {
        const newIndex = leftRef.current?.selectFirst() ?? 0;
        rightRef.current?.select(newIndex);
        setSelectedIndex(newIndex);
      }, 10500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => setDescription("Demo complete! ✓"), 11500));
    timeouts.push(setTimeout(() => process.exit(0), 12500));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, [leftRef, rightRef]);

  // Create list items
  const items = Array.from({ length: 15 }, (_, i) => (
    <SimpleListItem key={i} index={i} isSelected={i === selectedIndex} />
  ));

  return (
    <SplitDemoLayout
      title="📜 Selection & Navigation Demo"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      selectedIndex={selectedIndex}
      scrollOffset={scrollOffset}
      height={8}
    >
      {items}
    </SplitDemoLayout>
  );
};

/**
 * AlignmentDemo - Demonstrates different scroll alignment modes.
 *
 * This demo showcases:
 * 1. Auto alignment (default - keeps item visible)
 * 2. Top alignment (selected item at top of viewport)
 * 3. Center alignment (selected item in center of viewport)
 * 4. Bottom alignment (selected item at bottom of viewport)
 */
const AlignmentDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<ScrollListRef | null>;
  rightRef: React.RefObject<ScrollListRef | null>;
}) => {
  const [description, setDescription] = useState(
    "Initializing alignment demo...",
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [alignment, setAlignment] = useState<ScrollAlignment>("auto");

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // Helper to select and demonstrate alignment
    const selectWithAlignment = (index: number, mode: ScrollAlignment) => {
      setAlignment(mode);
      leftRef.current?.select(index, mode);
      rightRef.current?.select(index, mode);
      setSelectedIndex(index);
    };

    // === Demo Sequence ===

    // Step 1: Demonstrate AUTO alignment
    timeouts.push(
      setTimeout(
        () => setDescription("AUTO alignment - scrolls minimum needed"),
        1000,
      ),
    );
    timeouts.push(setTimeout(() => selectWithAlignment(5, "auto"), 1500));
    timeouts.push(setTimeout(() => selectWithAlignment(10, "auto"), 2500));

    // Step 2: Demonstrate TOP alignment
    timeouts.push(
      setTimeout(
        () => setDescription("TOP alignment - item at viewport top"),
        4000,
      ),
    );
    timeouts.push(setTimeout(() => selectWithAlignment(3, "top"), 4500));
    timeouts.push(setTimeout(() => selectWithAlignment(8, "top"), 5500));

    // Step 3: Demonstrate CENTER alignment
    timeouts.push(
      setTimeout(
        () => setDescription("CENTER alignment - item in viewport center"),
        7000,
      ),
    );
    timeouts.push(setTimeout(() => selectWithAlignment(5, "center"), 7500));
    timeouts.push(setTimeout(() => selectWithAlignment(12, "center"), 8500));

    // Step 4: Demonstrate BOTTOM alignment
    timeouts.push(
      setTimeout(
        () => setDescription("BOTTOM alignment - item at viewport bottom"),
        10000,
      ),
    );
    timeouts.push(setTimeout(() => selectWithAlignment(2, "bottom"), 10500));
    timeouts.push(setTimeout(() => selectWithAlignment(8, "bottom"), 11500));

    // Exit after demo completes
    timeouts.push(setTimeout(() => setDescription("Demo complete! ✓"), 13000));
    timeouts.push(setTimeout(() => process.exit(0), 14000));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, [leftRef, rightRef]);

  // Create list items
  const items = Array.from({ length: 15 }, (_, i) => (
    <SimpleListItem key={i} index={i} isSelected={i === selectedIndex} />
  ));

  return (
    <SplitDemoLayout
      title="🎯 Scroll Alignment Demo"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      selectedIndex={selectedIndex}
      scrollOffset={scrollOffset}
      alignment={alignment}
      height={8}
    >
      {items}
    </SplitDemoLayout>
  );
};

/**
 * ExpandDemo - Demonstrates expand/collapse with dynamic heights.
 *
 * This demo showcases how ScrollList handles items that change height:
 * 1. Select Item 2 and scroll to top (alignment top)
 * 2. Expand Item 1, Item 3, Item 2 sequentially
 * 3. Collapse Item 1, Item 2, Item 3 sequentially
 * 4. Expand all items
 * 5. Collapse all items
 */
const ExpandDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<ScrollListRef | null>;
  rightRef: React.RefObject<ScrollListRef | null>;
}) => {
  const [description, setDescription] = useState("Initializing expand demo...");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Total number of items
  const itemCount = 6;

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // Helper to select an item with alignment
    const selectItem = (
      index: number,
      mode: "auto" | "top" | "bottom" | "center" = "auto",
    ) => {
      leftRef.current?.select(index, mode);
      rightRef.current?.select(index, mode);
      setSelectedIndex(index);
    };

    // Helper to expand an item
    const expandItem = (index: number) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      // Remeasure the item after height change
      setTimeout(() => {
        leftRef.current?.remeasureItem(index);
        rightRef.current?.remeasureItem(index);
      }, 50);
    };

    // Helper to collapse an item
    const collapseItem = (index: number) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      // Remeasure the item after height change
      setTimeout(() => {
        leftRef.current?.remeasureItem(index);
        rightRef.current?.remeasureItem(index);
      }, 50);
    };

    // Helper to expand all items
    const expandAll = () => {
      const all = new Set(Array.from({ length: itemCount }, (_, i) => i));
      setExpandedItems(all);
      setTimeout(() => {
        leftRef.current?.remeasure();
        rightRef.current?.remeasure();
      }, 50);
    };

    // Helper to collapse all items
    const collapseAll = () => {
      setExpandedItems(new Set());
      setTimeout(() => {
        leftRef.current?.remeasure();
        rightRef.current?.remeasure();
      }, 50);
    };

    // === Demo Sequence ===
    let t = 0;
    const step = 1200; // Time between steps

    // Step 1: Select Item 2 and scroll to top
    t += 1000;
    timeouts.push(
      setTimeout(() => setDescription("Select Item 2, scroll to top..."), t),
    );
    t += 500;
    timeouts.push(setTimeout(() => selectItem(1, "top"), t));

    // Step 2: Expand Item 1 (index 0)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Expanding Item 1..."), t));
    t += 500;
    timeouts.push(setTimeout(() => expandItem(0), t));

    // Step 3: Expand Item 3 (index 2)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Expanding Item 3..."), t));
    t += 500;
    timeouts.push(setTimeout(() => expandItem(2), t));

    // Step 4: Expand Item 2 (index 1)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Expanding Item 2..."), t));
    t += 500;
    timeouts.push(setTimeout(() => expandItem(1), t));

    // Step 5: Collapse Item 1 (index 0)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Collapsing Item 1..."), t));
    t += 500;
    timeouts.push(setTimeout(() => collapseItem(0), t));

    // Step 6: Collapse Item 2 (index 1)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Collapsing Item 2..."), t));
    t += 500;
    timeouts.push(setTimeout(() => collapseItem(1), t));

    // Step 7: Collapse Item 3 (index 2)
    t += step;
    timeouts.push(setTimeout(() => setDescription("Collapsing Item 3..."), t));
    t += 500;
    timeouts.push(setTimeout(() => collapseItem(2), t));

    // Step 8: Expand all items
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Expanding all items..."), t),
    );
    t += 500;
    timeouts.push(setTimeout(() => expandAll(), t));

    // Step 9: Collapse all items
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Collapsing all items..."), t),
    );
    t += 500;
    timeouts.push(setTimeout(() => collapseAll(), t));

    // Exit after demo completes
    t += step;
    timeouts.push(setTimeout(() => setDescription("Demo complete! ✓"), t));
    t += 1000;
    timeouts.push(setTimeout(() => process.exit(0), t));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, [leftRef, rightRef]);

  // Create list items with expand state
  const items = Array.from({ length: itemCount }, (_, i) => (
    <ListItem
      key={i}
      index={i}
      isSelected={i === selectedIndex}
      isExpanded={expandedItems.has(i)}
      content={`Expanded content for Item ${i + 1}.`}
    />
  ));

  return (
    <SplitDemoLayout
      title="📏 Dynamic Expand/Collapse Demo"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      selectedIndex={selectedIndex}
      scrollOffset={scrollOffset}
      height={8}
    >
      {items}
    </SplitDemoLayout>
  );
};

/**
 * DynamicItemsDemo - Demonstrates dynamic item management.
 *
 * This demo showcases how ScrollList handles:
 * 1. Adding items at the top (prepend)
 * 2. Adding items at the bottom (append)
 * 3. Removing items from the bottom
 * 4. Removing items from the top
 */
const DynamicItemsDemo = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<ScrollListRef | null>;
  rightRef: React.RefObject<ScrollListRef | null>;
}) => {
  const [description, setDescription] = useState(
    "Initializing dynamic items demo...",
  );
  const [selectedIndex, setSelectedIndex] = useState(2); // Start in the middle
  const [scrollOffset, setScrollOffset] = useState(0);
  const [items, setItems] = useState<
    { id: number; label: string; color?: string }[]
  >(Array.from({ length: 5 }, (_, i) => ({ id: i, label: `Item ${i + 1}` })));

  // Track items added at top/bottom for removal
  const [topItemCount, setTopItemCount] = useState(0);
  const [bottomItemCount, setBottomItemCount] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Continuously sync and display the current scroll offset
    const syncInterval = setInterval(() => {
      if (leftRef.current && rightRef.current) {
        setScrollOffset(leftRef.current.getScrollOffset());
      }
    }, 100);

    // === Demo Sequence ===
    let t = 0;
    const step = 1200;

    // Initial selection
    t += 500;
    timeouts.push(
      setTimeout(() => {
        leftRef.current?.select(2, "center");
        rightRef.current?.select(2, "center");
      }, t),
    );

    // Step 1: Add first item at the top
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Adding item at the top..."), t),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => [
          { id: Date.now(), label: "🔴 Top Item 1", color: "red" },
          ...prev,
        ]);
        setTopItemCount((prev) => prev + 1);
        setSelectedIndex((prev) => prev + 1); // Adjust selection
      }, t),
    );

    // Step 2: Add second item at the top
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Adding another item at the top..."), t),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => [
          { id: Date.now(), label: "🟠 Top Item 2", color: "yellow" },
          ...prev,
        ]);
        setTopItemCount((prev) => prev + 1);
        setSelectedIndex((prev) => prev + 1); // Adjust selection
      }, t),
    );

    // Step 3: Add first item at the bottom
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Adding item at the bottom..."), t),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          { id: Date.now(), label: "🟢 Bottom Item 1", color: "green" },
        ]);
        setBottomItemCount((prev) => prev + 1);
      }, t),
    );

    // Step 4: Add second item at the bottom
    t += step;
    timeouts.push(
      setTimeout(
        () => setDescription("Adding another item at the bottom..."),
        t,
      ),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          { id: Date.now(), label: "🔵 Bottom Item 2", color: "blue" },
        ]);
        setBottomItemCount((prev) => prev + 1);
      }, t),
    );

    // Step 5: Remove items from the bottom
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Removing items from the bottom..."), t),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => prev.slice(0, -2)); // Remove last 2 items
        setBottomItemCount(0);
      }, t),
    );

    // Step 6: Remove items from the top
    t += step;
    timeouts.push(
      setTimeout(() => setDescription("Removing items from the top..."), t),
    );
    t += 500;
    timeouts.push(
      setTimeout(() => {
        setItems((prev) => prev.slice(2)); // Remove first 2 items
        setTopItemCount(0);
        setSelectedIndex((prev) => Math.max(0, prev - 2)); // Adjust selection
      }, t),
    );

    // Exit after demo completes
    t += step;
    timeouts.push(setTimeout(() => setDescription("Demo complete! ✓"), t));
    t += 1000;
    timeouts.push(setTimeout(() => process.exit(0), t));

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(syncInterval);
    };
  }, [leftRef, rightRef]);

  // Render dynamic items
  const renderedItems = items.map((item, i) => (
    <Text
      key={item.id}
      color={i === selectedIndex ? "cyan" : item.color || "white"}
      bold={i === selectedIndex}
    >
      {i === selectedIndex ? "▶ " : "  "}
      {item.label}
    </Text>
  ));

  return (
    <SplitDemoLayout
      title="➕ Dynamic Items Demo"
      description={description}
      leftRef={leftRef}
      rightRef={rightRef}
      selectedIndex={selectedIndex}
      scrollOffset={scrollOffset}
      height={8}
    >
      {renderedItems}
    </SplitDemoLayout>
  );
};

// =============================================================================
// Main Demo Component
// =============================================================================

/**
 * Demo - Main component that renders the selected demo category.
 *
 * This component:
 * 1. Creates refs for both ScrollLists (left and right)
 * 2. Maps the category name to the corresponding demo component
 * 3. Renders the selected demo within a fixed-size container
 */
const Demo = () => {
  const leftRef = useRef<ScrollListRef>(null);
  const rightRef = useRef<ScrollListRef>(null);

  // Map category names to their corresponding demo components
  const categoryMap: Record<
    string,
    React.ComponentType<{
      leftRef: React.RefObject<ScrollListRef | null>;
      rightRef: React.RefObject<ScrollListRef | null>;
    }>
  > = {
    selection: SelectionDemo,
    alignment: AlignmentDemo,
    expand: ExpandDemo,
    dynamic: DynamicItemsDemo,
  };

  const DemoComponent = categoryMap[DEMO_CATEGORY];

  if (!DemoComponent) {
    return <Text color="red">Category not found: {DEMO_CATEGORY}</Text>;
  }

  return (
    <Box flexDirection="column" width={70} height={20}>
      <DemoComponent leftRef={leftRef} rightRef={rightRef} />
    </Box>
  );
};

// =============================================================================
// Entry Point
// =============================================================================

// Clear the terminal before starting the demo
console.clear();

// Render the demo with incremental rendering for smoother updates
render(<Demo />, {
  incrementalRendering: true,
  exitOnCtrlC: true,
});
