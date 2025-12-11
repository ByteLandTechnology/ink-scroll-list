[**ink-scroll-list**](../README.md)

---

# Variable: ScrollList

> `const` **ScrollList**: `ForwardRefExoticComponent`\<[`ScrollListProps`](../interfaces/ScrollListProps.md) & `RefAttributes`\<[`ScrollListRef`](../interfaces/ScrollListRef.md)\>\>

A scrollable list with built-in selection state management.

## Remarks

This component extends [ScrollView](https://github.com/ByteLandTechnology/ink-scroll-view) to provide:

- Selection state tracking
- Automatic scroll-into-view when selection changes
- Navigation methods (`selectNext`, `selectPrevious`, etc.)

**IMPORTANT**:

- This component does NOT handle user input. Use `useInput` to control selection.
- This component does NOT automatically respond to terminal resize events.
  Call `remeasure()` on resize.

## Example

```tsx
import React, { useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";

const Demo = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["Item 1", "Item 2", "Item 3"];

  useInput((input, key) => {
    if (key.downArrow) {
      // Use internal logic to select next
      listRef.current?.selectNext();
    }
    if (key.upArrow) {
      // Use internal logic to select previous
      listRef.current?.selectPrevious();
    }
  });

  return (
    <ScrollList
      ref={listRef}
      height={5}
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
    >
      {items.map((item, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? "blue" : "white"}>{item}</Text>
        </Box>
      ))}
    </ScrollList>
  );
};
```
