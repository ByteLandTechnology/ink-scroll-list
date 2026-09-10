# ink-scroll-list

A high-level ScrollList component for [Ink](https://github.com/vadimdemedes/ink) CLI applications, built on top of [ink-scroll-view](https://github.com/BytelandTechnology/ink-scroll-view).

![License](https://img.shields.io/npm/l/ink-scroll-list)
![Version](https://img.shields.io/npm/v/ink-scroll-list)

📖 **[Documentation Website](https://ink-scroll-list.byteland.app)**

## ✨ Features

- **Controlled Selection**: Selection state is managed by the parent via `selectedIndex` prop.
- **Auto-Scrolling**: Automatically scrolls to ensure the selected item is visible.
- **Flexible Alignment**: Control how the selected item aligns in the viewport (`auto`, `top`, `bottom`, `center`).
- **Performance**: Optimized to track selection position efficiently without full re-layouts.
- **Responsive**: Maintains selection visibility when viewport or content changes.

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
npm install ink@^7 react@">=19.2.0"
```

Requires Node.js 22 or newer, Ink 7, and React 19.2 or newer; uses `ink-scroll-view` 0.4.x.

## 🚀 Usage

`ScrollList` is a **controlled component** - the parent component owns and manages the selection state via the `selectedIndex` prop.

```tsx
import React, { useRef, useState } from "react";
import { render, Text, Box, useInput } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";

const App = () => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = Array.from({ length: 20 }).map((_, i) => `Item ${i + 1}`);

  // Handle keyboard navigation in the parent
  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
    if (input === "g") {
      setSelectedIndex(0); // Jump to first
    }
    if (input === "G") {
      setSelectedIndex(items.length - 1); // Jump to last
    }
    if (key.return) {
      console.log(`Selected: ${items[selectedIndex]}`);
    }
  });

  return (
    <Box borderStyle="single" height={10}>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
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

| Prop              | Type                                      | Description                                          |
| :---------------- | :---------------------------------------- | :--------------------------------------------------- |
| `selectedIndex`   | `number`                                  | The currently selected item index (controlled).      |
| `scrollAlignment` | `'auto' \| 'top' \| 'bottom' \| 'center'` | Alignment mode for selected item. Default: `'auto'`. |
| ...               | `ScrollViewProps`                         | All props from `ScrollView`.                         |

#### Scroll Alignment Modes

- **`'auto'`** (default): Minimal scrolling to bring the item into view. Best for keyboard navigation.
- **`'top'`**: Always aligns the selected item to the top of the viewport.
- **`'bottom'`**: Always aligns the selected item to the bottom of the viewport.
- **`'center'`**: Always centers the selected item in the viewport. Best for search/spotlight UX.

### Ref Methods (`ScrollListRef`)

Extends `ScrollViewRef` from `ink-scroll-view`. Access these via `ref.current`.

**Note**: When a `selectedIndex` is set, all scroll methods are constrained to keep the selected item visible. This prevents accidentally scrolling the selection out of view.

| Method              | Signature                                  | Description                                                          |
| :------------------ | :----------------------------------------- | :------------------------------------------------------------------- |
| `scrollTo`          | `(y: number) => void`                      | Scroll to a specific offset (constrained to keep selection visible). |
| `scrollBy`          | `(delta: number) => void`                  | Scroll by a relative amount (constrained).                           |
| `scrollToTop`       | `() => void`                               | Scroll as far up as possible while keeping selection visible.        |
| `scrollToBottom`    | `() => void`                               | Scroll as far down as possible while keeping selection visible.      |
| `getScrollOffset`   | `() => number`                             | Get current scroll offset.                                           |
| `getContentHeight`  | `() => number`                             | Get total content height.                                            |
| `getViewportHeight` | `() => number`                             | Get viewport height.                                                 |
| `getBottomOffset`   | `() => number`                             | Get distance from bottom.                                            |
| `getItemHeight`     | `(index: number) => number`                | Get a specific item's height.                                        |
| `getItemPosition`   | `(index: number) => {top, height} \| null` | Get a specific item's position.                                      |
| `remeasure`         | `() => void`                               | Re-check viewport dimensions. See note below.                        |
| `remeasureItem`     | `(index: number) => void`                  | Force remeasurement of a single item. See note below.                |

**Large Items**: For items that are larger than the viewport, scrolling is allowed within the item's bounds. This lets users scroll to see different parts of the large item while at least part of it remains visible.

**Manual measurement**: `remeasure()` re-checks viewport dimensions; it does not force all items to be measured. Viewport layout changes are tracked automatically. Item measurement runs when the measuring wrapper's inputs change, such as new child elements or a new viewport width. If an item changes height through its own internal state while those inputs stay unchanged, call `remeasureItem(index)` after the update has committed.

## 💡 Tips

1. **Controlled Component Pattern**: `ScrollList` is a fully controlled component. The parent must manage `selectedIndex` and update it based on user input.

2. **Input Handling**: Use `useInput` from Ink to handle keyboard events and update `selectedIndex` accordingly. The component does NOT handle input internally.

3. **Layout Changes**: With Ink 7 and `ink-scroll-view` 0.4.x, viewport dimensions are measured automatically when the surrounding layout changes, including terminal resizes. Remove resize listeners whose only job is to call `remeasure()`.

   **Keep your existing layout.** The upgrade does not require a new `height` prop or a terminal-sized container. A fixed-height parent such as `<Box height={10}>` still works. Percentage and flex dimensions (`height="100%"`, `flexGrow={1}`) still use the space provided by their parent. Automatic measurement observes that space; it does not choose the container's height.

4. **Dynamic Items**: When items are added or removed, the parent should update `selectedIndex` if necessary:
   - When adding items at the beginning: `setSelectedIndex(prev => prev + addedCount)`
   - When removing items: Clamp to valid range: `setSelectedIndex(prev => Math.min(prev, newLength - 1))`

5. **Performance**: `ScrollList` uses `ink-scroll-view` under the hood, so it benefits from the same performance optimizations (item height caching, efficient re-layouts).

## ⚠️ Breaking Changes: Ink 7

This release requires **Ink 7**, **React 19.2+**, and **Node.js 22+** (required by Ink 7). The peer range narrowed from `ink >=6` to `ink ^7`, so projects still on Ink 6 must upgrade Ink before upgrading this package.

**What changed:** Previously, the documentation instructed you to listen for terminal resizes and call `remeasure()`. With Ink 7 and `ink-scroll-view` 0.4.x, viewport measurement follows layout changes automatically, including changes driven by a parent container or terminal resize.

**Migration:** Keep your existing height, percentage, or flex layout. Delete the listener below if its only purpose is to trigger remeasurement:

```diff
- useEffect(() => {
-   const handleResize = () => listRef.current?.remeasure();
-   process.stdout.on("resize", handleResize);
-   return () => process.stdout.off("resize", handleResize);
- }, []);
```

No new height prop or layout change is required. If a resize listener also updates app-specific dimensions or performs other work, remove only its `remeasure()` call and keep that other behavior.

The component's props and ref methods remain available; manual remeasurement is no longer required to track viewport layout changes.

## ⚠️ Breaking Changes in v0.4.0

This version introduces a **major architectural change**: `ScrollList` is now a **fully controlled component**.

### Removed Features

The following props have been removed:

- `onSelectionChange` - No longer needed; parent owns the state directly.

The following ref methods have been removed:

- `select(index, mode)` - Use `setSelectedIndex(index)` + `scrollAlignment` prop instead.
- `selectNext()` - Use `setSelectedIndex(prev => Math.min(prev + 1, length - 1))` instead.
- `selectPrevious()` - Use `setSelectedIndex(prev => Math.max(prev - 1, 0))` instead.
- `selectFirst()` - Use `setSelectedIndex(0)` instead.
- `selectLast()` - Use `setSelectedIndex(length - 1)` instead.
- `scrollToItem(index, mode)` - Use `selectedIndex` prop instead.
- `getSelectedIndex()` - Parent already knows the index.
- `getItemCount()` - Parent already knows the item count.

### Migration Guide

**Before (v0.3.x):**

```tsx
const listRef = useRef<ScrollListRef>(null);
const [selectedIndex, setSelectedIndex] = useState(0);

useInput((input, key) => {
  if (key.downArrow) {
    const newIndex = listRef.current?.selectNext() ?? 0;
    setSelectedIndex(newIndex);
  }
});

<ScrollList ref={listRef} selectedIndex={selectedIndex} onSelectionChange={setSelectedIndex}>
  {items.map(...)}
</ScrollList>
```

**After (v0.4.0):**

```tsx
const listRef = useRef<ScrollListRef>(null);
const [selectedIndex, setSelectedIndex] = useState(0);

useInput((input, key) => {
  if (key.downArrow) {
    setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
  }
});

<ScrollList ref={listRef} selectedIndex={selectedIndex}>
  {items.map(...)}
</ScrollList>
```

### Why This Change?

The controlled component pattern provides:

- **Predictability**: The parent always knows the exact selection state.
- **Simplicity**: No need to sync internal state with external state.
- **Flexibility**: The parent has full control over how selection changes.
- **Testability**: Selection logic lives in the parent and is easy to unit test.

## 🔗 Related Packages

This package is part of a family of Ink scroll components:

| Package                                                                  | Description                                                               |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| [ink-scroll-view](https://github.com/ByteLandTechnology/ink-scroll-view) | Core scroll container component                                           |
| [ink-scroll-list](https://github.com/ByteLandTechnology/ink-scroll-list) | A scrollable list with focus management and item selection (this package) |
| [ink-scroll-bar](https://github.com/ByteLandTechnology/ink-scroll-bar)   | A standalone scrollbar component for any scroll container                 |

## License

MIT
