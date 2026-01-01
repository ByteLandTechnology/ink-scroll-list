/**
 * @file ScrollList.tsx
 * @description A scrollable list component with externally controlled selection for Ink CLI applications.
 *
 * This component provides a high-level abstraction over ink-scroll-view with automatic
 * scroll-into-view behavior when the selected item changes. Unlike traditional list components
 * that manage selection state internally, ScrollList is a fully controlled component where
 * the parent component owns and manages the selection state.
 *
 * @packageDocumentation
 * @module ink-scroll-list
 */

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { ScrollView, ScrollViewRef, ScrollViewProps } from "ink-scroll-view";

/**
 * Alignment mode for scrolling to items.
 *
 * Determines how the selected item is positioned within the viewport when
 * the component auto-scrolls to make it visible.
 *
 * @remarks
 * - `'auto'`: Performs minimal scrolling to bring the item into view. If the item
 *   is above the viewport, scrolls to show its top. If below, scrolls to show its bottom.
 *   Does not scroll if the item is already fully visible.
 * - `'top'`: Always aligns the top of the selected item with the top of the viewport.
 * - `'bottom'`: Always aligns the bottom of the selected item with the bottom of the viewport.
 * - `'center'`: Always centers the selected item vertically within the viewport.
 *
 * All modes respect scroll bounds - the scroll offset will be clamped to valid range
 * (0 to contentHeight - viewportHeight).
 */
export type ScrollAlignment = "auto" | "top" | "bottom" | "center";

/**
 * Props for the ScrollList component.
 *
 * @remarks
 * Extends {@link ScrollViewProps} from ink-scroll-view and adds externally controlled
 * selection with automatic scroll-into-view behavior.
 *
 * **Key Differences from Previous Versions**:
 * - Selection state is now fully controlled by the parent (no internal state)
 * - Removed `onSelectionChange` callback (parent manages state directly)
 * - Removed imperative selection methods (`select`, `selectNext`, etc.)
 */
export interface ScrollListProps extends ScrollViewProps {
  /**
   * The currently selected item index (controlled by parent).
   *
   * @remarks
   * When this value changes, the component will automatically scroll to ensure
   * the selected item is visible in the viewport according to the `scrollAlignment` mode.
   *
   * **Important Behaviors**:
   * - The selection state is entirely controlled by the parent component.
   * - Invalid indices (negative or >= item count) are handled gracefully - no scrolling occurs.
   * - When `undefined`, the component does not perform auto-scrolling (useful for manual scroll control).
   * - The component does NOT clamp or modify this value - the parent is responsible for bounds checking.
   *
   * @example
   * ```tsx
   * const [selectedIndex, setSelectedIndex] = useState(0);
   *
   * useInput((input, key) => {
   *   if (key.downArrow) {
   *     setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
   *   }
   * });
   *
   * <ScrollList selectedIndex={selectedIndex}>
   *   {items.map((item, i) => <ListItem key={i} selected={i === selectedIndex} />)}
   * </ScrollList>
   * ```
   */
  selectedIndex?: number;

  /**
   * Alignment mode when scrolling to the selected item.
   *
   * @remarks
   * Controls how the selected item is positioned within the viewport when auto-scrolling.
   *
   * **Modes**:
   * - `'auto'`: Minimal scrolling to bring item into view (default). Best for keyboard navigation.
   * - `'top'`: Align item to the top of the viewport. Good for "jump to" navigation.
   * - `'bottom'`: Align item to the bottom of the viewport.
   * - `'center'`: Align item to the center of the viewport. Best for search result highlighting.
   *
   * **Examples**:
   * ```tsx
   * // Default auto behavior - minimal scrolling
   * <ScrollList selectedIndex={index} scrollAlignment="auto" />
   *
   * // Always center the selected item - good for search/spotlight UX
   * <ScrollList selectedIndex={searchResultIndex} scrollAlignment="center" />
   * ```
   *
   * @defaultValue `'auto'`
   */
  scrollAlignment?: ScrollAlignment;
}

/**
 * Ref interface for controlling the ScrollList programmatically.
 *
 * @remarks
 * Extends {@link ScrollViewRef} from ink-scroll-view. Since selection is now controlled
 * externally via props, this interface no longer includes selection-related methods.
 *
 * **Scroll Constraint Behavior**:
 * When a `selectedIndex` is set, all scroll methods (`scrollTo`, `scrollBy`, `scrollToTop`,
 * `scrollToBottom`) are constrained to keep the selected item visible in the viewport.
 * This prevents accidentally scrolling the selection out of view.
 *
 * For items larger than the viewport, scrolling is allowed within the item's bounds,
 * letting users view different parts of the large item while keeping at least part
 * of it visible.
 *
 * **Available Methods** (inherited from ScrollViewRef):
 * - `scrollTo(y)`: Scroll to a specific offset (constrained if selected item exists)
 * - `scrollBy(delta)`: Scroll by a relative amount (constrained)
 * - `scrollToTop()`: Scroll as far up as possible while keeping selection visible
 * - `scrollToBottom()`: Scroll as far down as possible while keeping selection visible
 * - `getScrollOffset()`: Get the current scroll offset
 * - `getContentHeight()`: Get the total content height
 * - `getViewportHeight()`: Get the viewport height
 * - `getBottomOffset()`: Get the offset from the bottom
 * - `getItemHeight(index)`: Get a specific item's height
 * - `getItemPosition(index)`: Get a specific item's position (top and height)
 * - `remeasure()`: Force remeasurement of all items
 * - `remeasureItem(index)`: Force remeasurement of a specific item
 *
 * **Note**: Unlike previous versions, there are no selection methods (select, selectNext, etc.)
 * as selection is now controlled externally via the `selectedIndex` prop.
 */
export interface ScrollListRef extends ScrollViewRef {}

/**
 * A scrollable list with externally controlled selection.
 *
 * @remarks
 * This component extends {@link ScrollView} from ink-scroll-view to provide:
 * - **Externally controlled selection**: Selection state is managed by the parent via `selectedIndex` prop
 * - **Automatic scroll-into-view**: When `selectedIndex` changes, the component scrolls to ensure visibility
 * - **Configurable alignment**: Control how selected items are positioned within the viewport
 * - **Responsive to layout changes**: Maintains selected item visibility when viewport or content changes
 *
 * ## Design Philosophy
 *
 * ScrollList follows the "controlled component" pattern where the parent component owns all state.
 * This provides several benefits:
 * - **Predictable behavior**: The parent always knows the current selection
 * - **Easy integration**: Works seamlessly with state management libraries
 * - **Flexible input handling**: Parent decides how keyboard/mouse events affect selection
 * - **Testable**: Selection logic lives in the parent and is easy to unit test
 *
 * ## Automatic Scroll Behavior
 *
 * The component automatically scrolls to keep the selected item visible in these scenarios:
 * 1. When `selectedIndex` prop changes
 * 2. When viewport size changes (e.g., terminal resize)
 * 3. When content height changes (e.g., items added/removed)
 * 4. When an item's height changes and it affects the selected item's position
 *
 * ## Important Caveats
 *
 * - **No input handling**: This component does NOT handle keyboard input.
 *   Use `useInput` from Ink to update `selectedIndex` in the parent.
 * - **No resize detection**: Does NOT automatically respond to terminal resize.
 *   Listen to `process.stdout`'s `resize` event and call `remeasure()` on the ref.
 * - **Parent manages bounds**: The component does NOT clamp `selectedIndex`.
 *   The parent should ensure the value is within valid range [0, itemCount - 1].
 *
 * @example
 * ### Basic Usage with Keyboard Navigation
 * ```tsx
 * import React, { useRef, useState } from 'react';
 * import { Box, Text, useInput } from 'ink';
 * import { ScrollList, ScrollListRef } from 'ink-scroll-list';
 *
 * const Demo = () => {
 *   const listRef = useRef<ScrollListRef>(null);
 *   const [selectedIndex, setSelectedIndex] = useState(0);
 *   const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
 *
 *   // Handle keyboard navigation
 *   useInput((input, key) => {
 *     if (key.downArrow) {
 *       setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
 *     }
 *     if (key.upArrow) {
 *       setSelectedIndex(prev => Math.max(prev - 1, 0));
 *     }
 *     if (input === 'g') {
 *       setSelectedIndex(0); // Go to first
 *     }
 *     if (input === 'G') {
 *       setSelectedIndex(items.length - 1); // Go to last
 *     }
 *   });
 *
 *   return (
 *     <ScrollList
 *       ref={listRef}
 *       height={5}
 *       selectedIndex={selectedIndex}
 *     >
 *       {items.map((item, i) => (
 *         <Box key={i}>
 *           <Text color={i === selectedIndex ? 'blue' : 'white'}>
 *             {i === selectedIndex ? '> ' : '  '}{item}
 *           </Text>
 *         </Box>
 *       ))}
 *     </ScrollList>
 *   );
 * };
 * ```
 *
 * @example
 * ### With Different Alignment Modes
 * ```tsx
 * // Center alignment - great for search results or spotlight features
 * <ScrollList
 *   height={10}
 *   selectedIndex={searchResultIndex}
 *   scrollAlignment="center"
 * >
 *   {results.map((result, i) => (
 *     <SearchResult key={i} result={result} highlighted={i === searchResultIndex} />
 *   ))}
 * </ScrollList>
 *
 * // Top alignment - always shows selected item at top
 * <ScrollList
 *   height={5}
 *   selectedIndex={selectedIndex}
 *   scrollAlignment="top"
 * >
 *   {items.map((item, i) => <Item key={i} {...item} />)}
 * </ScrollList>
 * ```
 */
export const ScrollList = forwardRef<ScrollListRef, ScrollListProps>(
  (props, ref) => {
    // =========================================================================
    // Props Destructuring
    // =========================================================================
    const {
      children,
      selectedIndex,
      scrollAlignment = "auto",
      onScroll,
      onViewportSizeChange,
      onContentHeightChange,
      onItemHeightChange,
      ...boxProps
    } = props;

    // =========================================================================
    // Refs
    // =========================================================================

    /**
     * Reference to the underlying ScrollView component.
     * Used to delegate scroll operations and query layout information.
     */
    const scrollViewRef = useRef<ScrollViewRef>(null);

    /**
     * Ref to store the current selectedIndex for use in callbacks.
     *
     * This is necessary because the callback functions (handleViewportSizeChange, etc.)
     * are memoized with useCallback, and we need to access the latest selectedIndex
     * value without including it in the dependency array (which would cause
     * unnecessary re-creations of the callbacks).
     */
    const selectedIndexRef = useRef(selectedIndex);
    selectedIndexRef.current = selectedIndex;

    // =========================================================================
    // Internal Helper Functions
    // =========================================================================

    /**
     * Calculates the scroll offset bounds that keep the selected item visible.
     *
     * @internal
     * @returns An object with `min` and `max` scroll offsets, or `null` if no
     *          selected item or selection is invalid.
     *
     * @remarks
     * When a selected item exists, scrolling should be constrained so the item
     * remains visible in the viewport. The valid scroll range is:
     * - **min**: The offset where the selected item is at the BOTTOM of the viewport
     *   - `min = itemTop + itemHeight - viewportHeight`
     * - **max**: The offset where the selected item is at the TOP of the viewport
     *   - `max = itemTop`
     *
     * **Normal case (itemHeight <= viewportHeight)**:
     * - Example: Item at position 10, height 1, viewport 5
     * - min = 10 + 1 - 5 = 6 (item at bottom of viewport)
     * - max = 10 (item at top of viewport)
     * - Valid scroll range: [6, 10]
     *
     * **Large item case (itemHeight > viewportHeight)**:
     * - Example: Item at position 5, height 10, viewport 5
     * - Calculated min = 5 + 10 - 5 = 10, max = 5
     * - Since min > max, we swap them to allow scrolling within the item
     * - This lets users scroll to see different parts of the large item
     * - Valid scroll range: [5, 10] (from item top to item bottom minus viewport)
     */
    const getSelectionVisibleBounds = useCallback((): {
      min: number;
      max: number;
    } | null => {
      const currentSelectedIndex = selectedIndexRef.current;
      if (currentSelectedIndex === undefined || currentSelectedIndex < 0) {
        return null; // No selection constraint
      }

      const position =
        scrollViewRef.current?.getItemPosition(currentSelectedIndex);
      if (!position) {
        return null; // Invalid index
      }

      const viewportHeight = scrollViewRef.current?.getViewportHeight() ?? 0;
      const contentHeight = scrollViewRef.current?.getContentHeight() ?? 0;

      // Calculate bounds where selected item remains visible
      // min: item at bottom of viewport
      // max: item at top of viewport
      let minOffset = position.top + position.height - viewportHeight;
      let maxOffset = position.top;

      // Handle large items (height > viewport)
      // When item is larger than viewport, swap min/max to allow scrolling within the item
      if (minOffset > maxOffset) {
        [minOffset, maxOffset] = [maxOffset, minOffset];
      }

      // Also clamp to global scroll bounds
      const globalMaxScroll = Math.max(0, contentHeight - viewportHeight);

      return {
        min: Math.max(0, minOffset),
        max: Math.min(globalMaxScroll, maxOffset),
      };
    }, []);

    /**
     * Clamps a scroll offset to keep the selected item visible.
     *
     * @internal
     * @param targetOffset - The desired scroll offset
     * @returns The clamped offset that keeps the selected item visible
     *
     * @remarks
     * If there's no selected item, only clamps to global scroll bounds [0, maxScroll].
     * If there IS a selected item, additionally constrains to keep it visible.
     */
    const clampToSelectionBounds = useCallback(
      (targetOffset: number): number => {
        const contentHeight = scrollViewRef.current?.getContentHeight() ?? 0;
        const viewportHeight = scrollViewRef.current?.getViewportHeight() ?? 0;
        const globalMaxScroll = Math.max(0, contentHeight - viewportHeight);

        // First clamp to global bounds
        let clampedOffset = Math.max(
          0,
          Math.min(targetOffset, globalMaxScroll),
        );

        // Then apply selection constraint if applicable
        const selectionBounds = getSelectionVisibleBounds();
        if (selectionBounds) {
          // Clamp to the range that keeps selected item visible
          clampedOffset = Math.max(
            selectionBounds.min,
            Math.min(clampedOffset, selectionBounds.max),
          );
        }

        return clampedOffset;
      },
      [getSelectionVisibleBounds],
    );

    /**
     * Scrolls the viewport to make a specific item visible according to the alignment mode.
     *
     * @internal
     * @param index - The index of the item to scroll to
     * @param mode - The alignment mode to use (defaults to component's scrollAlignment prop)
     * @param viewportHeightOverride - Optional override for viewport height (used during resize)
     *
     * @remarks
     * This function handles all the scroll position calculations including:
     * - Looking up the item's position via getItemPosition
     * - Calculating the target scroll offset based on alignment mode
     * - Clamping the result to valid scroll bounds [0, maxScroll]
     * - Only scrolling if the target differs from current position
     *
     * **Alignment Mode Calculations**:
     * - `top`: offset = itemTop
     * - `bottom`: offset = itemTop + itemHeight - viewportHeight
     * - `center`: offset = itemTop + itemHeight/2 - viewportHeight/2
     * - `auto`: minimal scroll - only adjusts if item is outside viewport
     */
    const scrollToIndex = useCallback(
      (
        index: number,
        mode: ScrollAlignment = scrollAlignment,
        viewportHeightOverride?: number,
      ) => {
        // Get item position from ScrollView - returns null if index is invalid
        const position = scrollViewRef.current?.getItemPosition(index);
        if (position === undefined || position === null) {
          return; // Invalid index or component not mounted - silently fail
        }

        // Get current layout dimensions
        const viewportHeight =
          viewportHeightOverride ??
          scrollViewRef.current?.getViewportHeight() ??
          0;
        const currentScrollOffset =
          scrollViewRef.current?.getScrollOffset() ?? 0;
        const contentHeight = scrollViewRef.current?.getContentHeight() ?? 0;

        // Calculate target scroll offset based on alignment mode
        let targetScrollOffset = currentScrollOffset;

        if (mode === "top") {
          // Align item's top edge with viewport's top edge
          targetScrollOffset = position.top;
        } else if (mode === "bottom") {
          // Align item's bottom edge with viewport's bottom edge
          targetScrollOffset = position.top + position.height - viewportHeight;
        } else if (mode === "center") {
          // Align item's center with viewport's center
          targetScrollOffset =
            position.top + position.height / 2 - viewportHeight / 2;
        } else {
          // Auto mode - minimal scrolling to bring item into view
          const itemBottom = position.top + position.height;

          if (position.top < currentScrollOffset) {
            // Item is above viewport - scroll up to show item's top
            targetScrollOffset = position.top;
          } else if (itemBottom > currentScrollOffset + viewportHeight) {
            // Item is below viewport - scroll down to show item's bottom
            targetScrollOffset = itemBottom - viewportHeight;
          }
          // If item is already visible, don't scroll (targetScrollOffset stays unchanged)
        }

        // Clamp scroll offset to valid bounds
        // maxScroll is the maximum offset where viewport doesn't show empty space at bottom
        const maxScroll = Math.max(0, contentHeight - viewportHeight);
        const clampedScrollOffset = Math.max(
          0,
          Math.min(targetScrollOffset, maxScroll),
        );

        // Only trigger scroll if position actually changed
        if (clampedScrollOffset !== currentScrollOffset) {
          scrollViewRef.current?.scrollTo(clampedScrollOffset);
        }
      },
      [scrollAlignment],
    );

    // =========================================================================
    // Effects
    // =========================================================================

    /**
     * Effect: Scroll to selected item when selectedIndex changes.
     *
     * This is the primary effect that implements the auto-scroll-into-view behavior.
     * Whenever the parent updates the selectedIndex prop, this effect ensures
     * the newly selected item is visible in the viewport.
     *
     * @remarks
     * - Only triggers for valid indices (>= 0)
     * - Undefined selectedIndex means "no auto-scroll" mode
     */
    useEffect(() => {
      if (selectedIndex !== undefined && selectedIndex >= 0) {
        scrollToIndex(selectedIndex);
      }
    }, [selectedIndex, scrollToIndex]);

    // =========================================================================
    // Event Handlers
    // =========================================================================

    /**
     * Handles viewport size changes (e.g., terminal resize).
     *
     * When the viewport dimensions change, we need to re-scroll to ensure
     * the selected item is still visible. This is especially important when
     * the viewport shrinks - an item that was visible may become hidden.
     *
     * @param size - New viewport dimensions
     * @param previousSize - Previous viewport dimensions
     */
    const handleViewportSizeChange = useCallback(
      (
        size: { width: number; height: number },
        previousSize: { width: number; height: number },
      ) => {
        // Re-scroll to keep selected item visible with new viewport size
        if (
          selectedIndexRef.current !== undefined &&
          selectedIndexRef.current >= 0
        ) {
          // Pass the new height to avoid stale value during resize
          scrollToIndex(selectedIndexRef.current, undefined, size.height);
        }
        // Forward callback to parent
        onViewportSizeChange?.(size, previousSize);
      },
      [onViewportSizeChange, scrollToIndex],
    );

    /**
     * Handles individual item height changes (e.g., accordion expand/collapse).
     *
     * When an item's height changes, it can affect the position of all items below it.
     * This handler ensures the selected item remains at the same visual position
     * or becomes visible if it was affected.
     *
     * @param index - Index of the item that changed height
     * @param height - New height of the item
     * @param previousHeight - Previous height of the item
     *
     * @remarks
     * **Strategy**:
     * - If the changed item is ABOVE the selected item: Adjust scroll offset by the height delta
     *   to keep the selected item at the same visual position.
     * - If the changed item IS the selected item: Re-scroll to ensure it's visible
     *   (in case it grew larger than the viewport).
     * - If the changed item is BELOW the selected item: No action needed.
     */
    const handleItemHeightChange = useCallback(
      (index: number, height: number, previousHeight: number) => {
        const currentSelectedIndex = selectedIndexRef.current;
        if (currentSelectedIndex !== undefined && currentSelectedIndex >= 0) {
          if (index < currentSelectedIndex) {
            // Item above selected changed - compensate scroll offset
            // This keeps the selected item at the same visual position
            scrollViewRef.current?.scrollBy(height - previousHeight);
          } else if (index === currentSelectedIndex) {
            // Selected item itself changed - ensure it's still visible
            scrollToIndex(index);
          }
          // Items below selected don't affect its position
        }
        // Forward callback to parent
        onItemHeightChange?.(index, height, previousHeight);
      },
      [onItemHeightChange, scrollToIndex],
    );

    /**
     * Handles overall content height changes (e.g., items added/removed, text wrapping).
     *
     * When the total content height changes, the scroll bounds change as well.
     * We re-scroll to ensure the selected item remains visible and the scroll
     * position is within valid bounds.
     *
     * @param height - New total content height
     * @param previousHeight - Previous total content height
     */
    const handleContentHeightChange = useCallback(
      (height: number, previousHeight: number) => {
        // Re-scroll to keep selected item visible after content changes
        if (
          selectedIndexRef.current !== undefined &&
          selectedIndexRef.current >= 0
        ) {
          scrollToIndex(selectedIndexRef.current);
        }
        // Forward callback to parent
        onContentHeightChange?.(height, previousHeight);
      },
      [onContentHeightChange, scrollToIndex],
    );

    // =========================================================================
    // Imperative Handle (Ref API)
    // =========================================================================

    /**
     * Exposes a subset of ScrollView methods to the parent via ref.
     *
     * @remarks
     * This component enforces strict scroll bounds - you cannot scroll past
     * the content to show empty space at the bottom, unlike the base ScrollView
     * which might allow it.
     *
     * **Available Methods**:
     * - Scroll control: scrollTo, scrollBy, scrollToTop, scrollToBottom
     * - State queries: getScrollOffset, getContentHeight, getViewportHeight, getBottomOffset
     * - Item queries: getItemHeight, getItemPosition
     * - Measurement: remeasure, remeasureItem
     */
    useImperativeHandle(ref, () => ({
      /**
       * Scrolls to a specific Y offset.
       *
       * @param y - Target scroll offset
       * @remarks
       * - Clamps to valid bounds [0, maxScroll]
       * - If a selected item exists, additionally constrains scroll to keep it visible
       */
      scrollTo: (y: number) => {
        const clampedY = clampToSelectionBounds(y);
        scrollViewRef.current?.scrollTo(clampedY);
      },

      /**
       * Scrolls by a relative amount.
       *
       * @param delta - Amount to scroll (positive = down, negative = up)
       * @remarks
       * - Clamps result to valid bounds
       * - If a selected item exists, additionally constrains scroll to keep it visible
       */
      scrollBy: (delta: number) => {
        const currentOffset = scrollViewRef.current?.getScrollOffset() ?? 0;
        const clampedY = clampToSelectionBounds(currentOffset + delta);
        scrollViewRef.current?.scrollTo(clampedY);
      },

      /**
       * Scrolls to the top (offset 0), or as close as possible while keeping selected item visible.
       *
       * @remarks If a selected item exists, scrolls to the minimum offset that keeps it visible.
       */
      scrollToTop: () => {
        const clampedY = clampToSelectionBounds(0);
        scrollViewRef.current?.scrollTo(clampedY);
      },

      /**
       * Scrolls to the bottom, or as close as possible while keeping selected item visible.
       *
       * @remarks If a selected item exists, scrolls to the maximum offset that keeps it visible.
       */
      scrollToBottom: () => {
        const contentHeight = scrollViewRef.current?.getContentHeight() ?? 0;
        const viewportHeight = scrollViewRef.current?.getViewportHeight() ?? 0;
        const maxScroll = Math.max(0, contentHeight - viewportHeight);
        const clampedY = clampToSelectionBounds(maxScroll);
        scrollViewRef.current?.scrollTo(clampedY);
      },

      /** @returns Current scroll offset in lines */
      getScrollOffset: () => scrollViewRef.current?.getScrollOffset() ?? 0,

      /** @returns Total content height in lines */
      getContentHeight: () => scrollViewRef.current?.getContentHeight() ?? 0,

      /** @returns Viewport height in lines */
      getViewportHeight: () => scrollViewRef.current?.getViewportHeight() ?? 0,

      /** @returns Distance from current scroll position to bottom of content */
      getBottomOffset: () => scrollViewRef.current?.getBottomOffset() ?? 0,

      /**
       * Gets the height of a specific item.
       * @param index - Item index
       * @returns Item height in lines, or 0 if not found
       */
      getItemHeight: (index: number) =>
        scrollViewRef.current?.getItemHeight(index) ?? 0,

      /**
       * Gets the position of a specific item.
       * @param index - Item index
       * @returns Object with top and height properties, or null if not found
       */
      getItemPosition: (index: number) =>
        scrollViewRef.current?.getItemPosition(index) ?? null,

      /** Forces remeasurement of all items. Call this on terminal resize. */
      remeasure: () => scrollViewRef.current?.remeasure(),

      /**
       * Forces remeasurement of a specific item.
       * @param index - Item index to remeasure
       */
      remeasureItem: (index: number) =>
        scrollViewRef.current?.remeasureItem(index),
    }));

    // =========================================================================
    // Render
    // =========================================================================

    return (
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onViewportSizeChange={handleViewportSizeChange}
        onContentHeightChange={handleContentHeightChange}
        onItemHeightChange={handleItemHeightChange}
        {...boxProps}
      >
        {children}
      </ScrollView>
    );
  },
);
