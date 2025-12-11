# ink-scroll-list

A high-level ScrollList component for [Ink](https://github.com/vadimdemedes/ink) CLI applications, built on top of [ink-scroll-view](https://github.com/BytelandTechnology/ink-scroll-view).

![License](https://img.shields.io/npm/l/ink-scroll-list)
![Version](https://img.shields.io/npm/v/ink-scroll-list)

## ✨ Features

- **Selection Management**: High-level API for managing selection state (`selectedIndex`).
- **Auto-Scrolling**: Automatically scrolls to ensure the selected item is visible.
- **Performance**: Optimized to track selection position efficiently without full re-layouts.
- **Navigation**: Built-in support for programmatic scrolling and selection (next/previous/first/last).
- **Flexible Alignment**: Control how the selected item aligns in the viewport (`auto`, `top`, `bottom`, `center`).

## 🎬 Demos

### Selection & Navigation

![Selection Demo](docs/_media/selection.svg)

### Scroll Alignment Modes

![Alignment Demo](docs/_media/alignment.svg)

### Expand/Collapse

![Expand Demo](docs/_media/expand.svg)

### Dynamic Items

![Dynamic Demo](docs/_media/dynamic.svg)

## 📦 Installation

```bash
npm install ink-scroll-list
# Peer dependencies
npm install ink react
```

## 🚀 Usage

`ScrollList` manages the `selectedIndex` state internally if you don't provide it, but typically you'll want to control it to respond to user input.

```tsx
import React, { useRef, useState } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";

const App = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = Array.from({ length: 20 }).map((_, i) => `Item ${i + 1}`);

  useInput((input, key) => {
    if (key.upArrow) {
      // selectPrevious returns the new index
      const newIndex = listRef.current?.selectPrevious() ?? 0;
      setSelectedIndex(newIndex);
    }
    if (key.downArrow) {
      // selectNext returns the new index
      const newIndex = listRef.current?.selectNext() ?? 0;
      setSelectedIndex(newIndex);
    }
    if (key.return) {
      console.log(`Selected: ${items[selectedIndex]}`);
    }
  });

  return (
    <Box borderStyle="single" height={10}>
      <ScrollList
        ref={listRef}
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
    </Box>
  );
};

render(<App />);
```

## 📚 API Reference

For detailed API documentation, see [API Reference](docs/api/README.md).

### Props (`ScrollListProps`)

Extends `ScrollViewProps` from `ink-scroll-view`.

| Prop                | Type                                      | Description                                                             |
| :------------------ | :---------------------------------------- | :---------------------------------------------------------------------- |
| `selectedIndex`     | `number`                                  | The currently selected item index.                                      |
| `scrollAlignment`   | `'auto' \| 'top' \| 'bottom' \| 'center'` | Alignment mode for selected item. Default: `'auto'`.                    |
| `onSelectionChange` | `(index: number) => void`                 | Callback when selection changes internally (e.g. via `selectNext`).     |
| ...                 | `ScrollViewProps`                         | All props from `ScrollView` (`onScroll`, `onViewportSizeChange`, etc.). |

### Ref Methods (`ScrollListRef`)

Extends `ScrollViewRef` from `ink-scroll-view`. Access these via `ref.current`.

| Method             | Signature                                   | Description                                                                |
| :----------------- | :------------------------------------------ | :------------------------------------------------------------------------- |
| `scrollToItem`     | `(index: number, mode?: Alignment) => void` | Scroll to a specific item.                                                 |
| `select`           | `(index: number, mode?: Alignment) => void` | Select an item and scroll to it.                                           |
| `selectNext`       | `() => number`                              | Select the next item. Returns new index.                                   |
| `selectPrevious`   | `() => number`                              | Select the previous item. Returns new index.                               |
| `selectFirst`      | `() => number`                              | Select the first item. Returns 0.                                          |
| `selectLast`       | `() => number`                              | Select the last item. Returns new index.                                   |
| `getSelectedIndex` | `() => number`                              | Get current selected index.                                                |
| `getItemCount`     | `() => number`                              | Get total number of items.                                                 |
| ...                | `ScrollViewRef`                             | All methods from `ScrollView` (`scrollTo`, `scrollBy`, `remeasure`, etc.). |

## 💡 Tips

1.  **Controlled vs Uncontrolled**: While `ScrollList` can manage its own state, it's best practice to lift the `selectedIndex` state up to your component (as shown in the usage example) so you can use it for rendering your items (highlighting, etc.).
2.  **Performance**: `ScrollList` uses `ink-scroll-view` under the hood, so it benefits from the same performance optimizations (virtual viewport, optimistic updates).
3.  **Dynamic Heights**: Just like `ScrollView`, `ScrollList` supports items with variable and changing heights.
4.  **Terminal Resizing**: Ink components don't automatically know when the terminal window resizes. You need to listen to `process.stdout`'s `resize` event and call `remeasure()` on the ref.

## 🔗 Related Packages

This package is part of a family of Ink scroll components:

| Package                                                                  | Description                                                               |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| [ink-scroll-view](https://github.com/ByteLandTechnology/ink-scroll-view) | Core scroll container component                                           |
| [ink-scroll-list](https://github.com/ByteLandTechnology/ink-scroll-list) | A scrollable list with focus management and item selection (this package) |
| [ink-scroll-bar](https://github.com/ByteLandTechnology/ink-scroll-bar)   | A standalone scrollbar component for any scroll container                 |

## License

MIT
