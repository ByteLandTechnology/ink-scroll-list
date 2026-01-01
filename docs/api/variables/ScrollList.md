[**ink-scroll-list**](../README.md)

---

# Variable: ScrollList

> `const` **ScrollList**: `ForwardRefExoticComponent`\<[`ScrollListProps`](../interfaces/ScrollListProps.md) & `RefAttributes`\<[`ScrollListRef`](../interfaces/ScrollListRef.md)\>\>

A scrollable list with externally controlled selection.

## Remarks

This component extends [ScrollView](https://github.com/ByteLandTechnology/ink-scroll-view) from ink-scroll-view to provide:

- **Externally controlled selection**: Selection state is managed by the parent via `selectedIndex` prop
- **Automatic scroll-into-view**: When `selectedIndex` changes, the component scrolls to ensure visibility
- **Configurable alignment**: Control how selected items are positioned within the viewport
- **Responsive to layout changes**: Maintains selected item visibility when viewport or content changes

## Design Philosophy

ScrollList follows the "controlled component" pattern where the parent component owns all state.
This provides several benefits:

- **Predictable behavior**: The parent always knows the current selection
- **Easy integration**: Works seamlessly with state management libraries
- **Flexible input handling**: Parent decides how keyboard/mouse events affect selection
- **Testable**: Selection logic lives in the parent and is easy to unit test

## Automatic Scroll Behavior

The component automatically scrolls to keep the selected item visible in these scenarios:

1. When `selectedIndex` prop changes
2. When viewport size changes (e.g., terminal resize)
3. When content height changes (e.g., items added/removed)
4. When an item's height changes and it affects the selected item's position

## Important Caveats

- **No input handling**: This component does NOT handle keyboard input.
  Use `useInput` from Ink to update `selectedIndex` in the parent.
- **No resize detection**: Does NOT automatically respond to terminal resize.
  Listen to `process.stdout`'s `resize` event and call `remeasure()` on the ref.
- **Parent manages bounds**: The component does NOT clamp `selectedIndex`.
  The parent should ensure the value is within valid range [0, itemCount - 1].

## Examples

### Basic Usage with Keyboard Navigation

```tsx
import React, { useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";

const Demo = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  // Handle keyboard navigation
  useInput((input, key) => {
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (input === "g") {
      setSelectedIndex(0); // Go to first
    }
    if (input === "G") {
      setSelectedIndex(items.length - 1); // Go to last
    }
  });

  return (
    <ScrollList ref={listRef} height={5} selectedIndex={selectedIndex}>
      {items.map((item, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? "blue" : "white"}>
            {i === selectedIndex ? "> " : "  "}
            {item}
          </Text>
        </Box>
      ))}
    </ScrollList>
  );
};
```

### With Different Alignment Modes

```tsx
// Center alignment - great for search results or spotlight features
<ScrollList
  height={10}
  selectedIndex={searchResultIndex}
  scrollAlignment="center"
>
  {results.map((result, i) => (
    <SearchResult key={i} result={result} highlighted={i === searchResultIndex} />
  ))}
</ScrollList>

// Top alignment - always shows selected item at top
<ScrollList
  height={5}
  selectedIndex={selectedIndex}
  scrollAlignment="top"
>
  {items.map((item, i) => <Item key={i} {...item} />)}
</ScrollList>
```
