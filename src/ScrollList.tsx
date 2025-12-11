import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { ScrollView, ScrollViewRef, ScrollViewProps } from "ink-scroll-view";

/**
 * Alignment mode for scrolling to items.
 */
export type ScrollAlignment = "auto" | "top" | "bottom" | "center";

/**
 * Props for the ScrollList component.
 *
 * @remarks
 * Extends {@link ScrollViewProps} and adds selection state management
 * with automatic scroll-into-view behavior.
 */
export interface ScrollListProps extends ScrollViewProps {
  /**
   * The currently selected item index.
   *
   * @remarks
   * When this value changes, the component will automatically scroll to ensure
   * the selected item is visible in the viewport.
   */
  selectedIndex?: number;

  /**
   * Alignment mode when scrolling to the selected item.
   *
   * @remarks
   * - `'auto'`: Minimal scrolling to bring item into view (default).
   * - `'top'`: Align item to the top of the viewport.
   * - `'bottom'`: Align item to the bottom of the viewport.
   * - `'center'`: Align item to the center of the viewport.
   *
   * @defaultValue `'auto'`
   */
  scrollAlignment?: ScrollAlignment;

  /**
   * Callback fired when the selected index changes internally.
   *
   * @remarks
   * This is called when selection changes due to internal navigation methods
   * like `selectNext()` or `selectPrevious()`.
   *
   * @param index - The new selected index.
   */
  onSelectionChange?: (index: number) => void;
}

/**
 * Ref interface for controlling the ScrollList programmatically.
 *
 * @remarks
 * Extends {@link ScrollViewRef} with selection management methods.
 */
export interface ScrollListRef extends ScrollViewRef {
  /**
   * Scrolls to a specific child item by index.
   *
   * @param index - The index of the child to scroll to.
   * @param mode - Alignment mode. Defaults to component's `scrollAlignment` prop.
   *
   * @example
   * ```tsx
   * // Scroll to the 5th item, aligning it to the top of the view
   * ref.current?.scrollToItem(4, 'top');
   * ```
   */
  scrollToItem: (index: number, mode?: ScrollAlignment) => void;

  /**
   * Gets the currently selected index.
   *
   * @returns The current selection index, or `-1` if nothing is selected.
   */
  getSelectedIndex: () => number;

  /**
   * Selects an item by index and scrolls to make it visible.
   *
   * @param index - The index to select.
   * @param mode - Alignment mode. Defaults to component's `scrollAlignment` prop.
   *
   * @example
   * ```tsx
   * // Select the 10th item
   * ref.current?.select(9);
   * ```
   */
  select: (index: number, mode?: ScrollAlignment) => void;

  /**
   * Selects the next item and scrolls to make it visible.
   *
   * @remarks
   * Does nothing if already at the last item.
   *
   * @returns The new selected index.
   */
  selectNext: () => number;

  /**
   * Selects the previous item and scrolls to make it visible.
   *
   * @remarks
   * Does nothing if already at the first item.
   *
   * @returns The new selected index.
   */
  selectPrevious: () => number;

  /**
   * Selects the first item and scrolls to the top.
   *
   * @returns The new selected index (0).
   */
  selectFirst: () => number;

  /**
   * Selects the last item and scrolls to the bottom.
   *
   * @returns The new selected index.
   */
  selectLast: () => number;

  /**
   * Gets the total number of items.
   *
   * @returns The count of child elements.
   */
  getItemCount: () => number;
}

/**
 * Hook to manage state with immediate ref synchronization.
 * Useful for values that need to be read synchronously in imperative methods
 * but also trigger re-renders when changed.
 */
function useStateRef<T>(initialValue: T) {
  const [state, setStateInternal] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setState = useCallback((update: React.SetStateAction<T>) => {
    const nextValue =
      typeof update === "function"
        ? (update as (prev: T) => T)(ref.current)
        : update;
    ref.current = nextValue;
    setStateInternal(nextValue);
  }, []);

  const getState = useCallback(() => ref.current, []);

  return [state, setState, getState] as const;
}

/**
 * A scrollable list with built-in selection state management.
 *
 * @remarks
 * This component extends {@link ScrollView} to provide:
 * - Selection state tracking
 * - Automatic scroll-into-view when selection changes
 * - Navigation methods (`selectNext`, `selectPrevious`, etc.)
 *
 * **IMPORTANT**:
 * - This component does NOT handle user input. Use `useInput` to control selection.
 * - This component does NOT automatically respond to terminal resize events.
 *   Call `remeasure()` on resize.
 *
 * @example
 * ```tsx
 * import React, { useRef, useState } from 'react';
 * import { Box, Text, useInput } from 'ink';
 * import { ScrollList, ScrollListRef } from 'ink-scroll-list';
 *
 * const Demo = () => {
 *   const listRef = useRef<ScrollListRef>(null);
 *   const [selectedIndex, setSelectedIndex] = useState(0);
 *   const items = ['Item 1', 'Item 2', 'Item 3'];
 *
 *   useInput((input, key) => {
 *     if (key.downArrow) {
 *       // Use internal logic to select next
 *       listRef.current?.selectNext();
 *     }
 *     if (key.upArrow) {
 *       // Use internal logic to select previous
 *       listRef.current?.selectPrevious();
 *     }
 *   });
 *
 *   return (
 *     <ScrollList
 *       ref={listRef}
 *       height={5}
 *       selectedIndex={selectedIndex}
 *       onSelectionChange={setSelectedIndex}
 *     >
 *       {items.map((item, i) => (
 *         <Box key={i}>
 *           <Text color={i === selectedIndex ? 'blue' : 'white'}>
 *             {item}
 *           </Text>
 *         </Box>
 *       ))}
 *     </ScrollList>
 *   );
 * };
 * ```
 */
export const ScrollList = forwardRef<ScrollListRef, ScrollListProps>(
  (props, ref) => {
    const {
      children,
      selectedIndex: controlledSelectedIndex,
      scrollAlignment = "auto",
      onScroll,
      onSelectionChange,
      onViewportSizeChange,
      onContentHeightChange,
      onItemHeightChange,
      ...boxProps
    } = props;

    // Internal selection state (used when not controlled)
    const [selectedIndex, setSelectedIndex, getSelectedIndex] = useStateRef(0);

    const scrollViewRef = useRef<ScrollViewRef>(null);

    const itemCount = useMemo(() => React.Children.count(children), [children]);

    useEffect(() => {
      if (
        controlledSelectedIndex !== undefined &&
        controlledSelectedIndex != getSelectedIndex() &&
        controlledSelectedIndex >= 0 &&
        controlledSelectedIndex < itemCount
      ) {
        updateSelection(controlledSelectedIndex);
      }
    }, [controlledSelectedIndex]);

    // Scroll to item helper
    const scrollToItem = useCallback(
      (index: number, mode: ScrollAlignment = scrollAlignment) => {
        const position = scrollViewRef.current?.getItemPosition(index);
        if (position === undefined || position === null) {
          return;
        }
        const viewportHeight = scrollViewRef.current?.getViewportHeight() ?? 0;
        const currentScrollOffset =
          scrollViewRef.current?.getScrollOffset() ?? 0;
        const contentHeight = scrollViewRef.current?.getContentHeight() ?? 0;

        let targetScrollOffset = currentScrollOffset;

        if (mode === "top") {
          targetScrollOffset = position.top;
        } else if (mode === "bottom") {
          targetScrollOffset = position.top + position.height - viewportHeight;
        } else if (mode === "center") {
          targetScrollOffset =
            position.top + position.height / 2 - viewportHeight / 2;
        } else {
          // auto - minimal scrolling
          const itemBottom = position.top + position.height;
          if (position.top < currentScrollOffset) {
            targetScrollOffset = position.top;
          } else if (itemBottom > currentScrollOffset + viewportHeight) {
            targetScrollOffset = itemBottom - viewportHeight;
          }
        }
        const clampedScrollOffset = Math.max(
          0,
          Math.min(targetScrollOffset, contentHeight),
        );
        if (clampedScrollOffset !== currentScrollOffset) {
          scrollViewRef.current?.scrollTo(clampedScrollOffset);
        }
      },
      [scrollAlignment],
    );

    // Update selection and notify
    const updateSelection = useCallback(
      (newIndex: number, mode?: ScrollAlignment) => {
        const clampedIndex = Math.max(0, Math.min(newIndex, itemCount - 1));
        // Always update internal state to keep it in sync
        setSelectedIndex(clampedIndex);
        // Scroll to item after a tick to ensure layout is measured
        scrollToItem(clampedIndex, mode);
        onSelectionChange?.(clampedIndex);
        return clampedIndex;
      },
      [itemCount, onSelectionChange, scrollToItem, selectedIndex],
    );

    // Handle layout changes (viewport resize)
    const handleViewportSizeChange = useCallback(
      (
        size: { width: number; height: number },
        previousSize: { width: number; height: number },
      ) => {
        onViewportSizeChange?.(size, previousSize);
        // Ensure selected item is aligned per spec when viewport changes
        scrollToItem(getSelectedIndex());
      },
      [onViewportSizeChange, getSelectedIndex, scrollToItem],
    );

    // Handle item layout changes (e.g. expansion)
    const handleItemHeightChange = useCallback(
      (index: number, height: number, previousHeight: number) => {
        // If changed item is same or above selected, the selected item's position
        // effectively changes relative to viewport or needs re-check.
        const currentSelectedIndex = getSelectedIndex();
        if (index < currentSelectedIndex) {
          scrollViewRef.current?.scrollBy(height - previousHeight);
        } else if (index == currentSelectedIndex) {
          scrollToItem(index);
        }
        onItemHeightChange?.(index, height, previousHeight);
      },
      [onItemHeightChange, getSelectedIndex, scrollToItem],
    );

    // Expose API via ref
    useImperativeHandle(ref, () => ({
      // Delegate to ScrollView
      scrollTo: (y: number) => scrollViewRef.current?.scrollTo(y),
      scrollBy: (delta: number) => scrollViewRef.current?.scrollBy(delta),
      scrollToTop: () => scrollViewRef.current?.scrollToTop(),
      scrollToBottom: () => scrollViewRef.current?.scrollToBottom(),
      getScrollOffset: () => scrollViewRef.current?.getScrollOffset() ?? 0,
      getContentHeight: () => scrollViewRef.current?.getContentHeight() ?? 0,
      getViewportHeight: () => scrollViewRef.current?.getViewportHeight() ?? 0,
      getBottomOffset: () => scrollViewRef.current?.getBottomOffset() ?? 0,
      getItemHeight: (index: number) =>
        scrollViewRef.current?.getItemHeight(index) ?? 0,
      getItemPosition: (index: number) =>
        scrollViewRef.current?.getItemPosition(index) ?? null,
      remeasure: () => scrollViewRef.current?.remeasure(),
      remeasureItem: (index: number) =>
        scrollViewRef.current?.remeasureItem(index),

      // Selection-specific methods
      scrollToItem,
      getSelectedIndex,
      select: (index: number, mode?: ScrollAlignment) =>
        updateSelection(index, mode),
      selectNext: () => updateSelection(getSelectedIndex() + 1),
      selectPrevious: () => updateSelection(getSelectedIndex() - 1),
      selectFirst: () => updateSelection(0, "top"),
      selectLast: () => updateSelection(itemCount - 1, "bottom"),
      getItemCount: () => itemCount,
    }));

    return (
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onViewportSizeChange={handleViewportSizeChange}
        onContentHeightChange={onContentHeightChange}
        onItemHeightChange={handleItemHeightChange}
        {...boxProps}
      >
        {children}
      </ScrollView>
    );
  },
);
