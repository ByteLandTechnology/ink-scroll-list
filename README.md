# ink-scroll-list

A high-level ScrollList component for [Ink](https://github.com/vadimdemedes/ink) CLI applications, built on top of [ink-scroll-view](https://github.com/BytelandTechnology/ink-scroll-view).

![License](https://img.shields.io/npm/l/ink-scroll-list)
![Version](https://img.shields.io/npm/v/ink-scroll-list)

## Features

- **Selection Management**: High-level API for managing selection state (`selectedIndex`).
- **Auto-Scrolling**: Automatically scrolls to ensure the selected item is visible.
- **Performance**: Optimized to track selection position efficiently without full re-layouts.
- **Navigation**: Built-in support for programmatic scrolling and selection (next/previous/first/last).

## Installation

```bash
npm install ink-scroll-list
# Peer dependencies
npm install ink react ink-scroll-view
```

## Usage

```tsx
import React, { useRef, useState } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";

const App = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];

  useInput((input, key) => {
    if (key.upArrow) listRef.current?.selectPrevious();
    if (key.downArrow) listRef.current?.selectNext();
  });

  return (
    <ScrollList
      ref={listRef}
      height={4}
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
    >
      {items.map((item, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? "green" : "white"}>
            {i === selectedIndex ? "> " : "  "}
            {item}
          </Text>
        </Box>
      ))}
    </ScrollList>
  );
};

render(<App />);
```

## API

### ScrollListRef

Extends `ScrollViewRef` (from `ink-scroll-view`).

| Method                       | Description                       |
| ---------------------------- | --------------------------------- |
| `scrollToItem(index, mode?)` | Scroll to a specific item         |
| `select(index, mode?)`       | Select an item and scroll to it   |
| `selectNext()`               | Select the next item              |
| `selectPrevious()`           | Select the previous item          |
| `selectFirst()`              | Select the first item             |
| `selectLast()`               | Select the last item              |
| `getSelectedIndex()`         | Get current selected index        |
| `isSelectedVisible()`        | Check if selected item is visible |
| `getItemCount()`             | Get total number of items         |

### Props

Extends `ScrollViewProps` (from `ink-scroll-view`).

| Prop                | Type                                      | Description                                 |
| ------------------- | ----------------------------------------- | ------------------------------------------- |
| `selectedIndex`     | `number`                                  | The currently selected item index.          |
| `scrollAlignment`   | `'auto' \| 'top' \| 'bottom' \| 'center'` | Alignment mode for selected item.           |
| `onSelectionChange` | `(index: number) => void`                 | Callback when selection changes internally. |

## License

MIT
