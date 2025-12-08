[**ink-scroll-view**](../README.md)

---

# Interface: ScrollListRef

Ref interface for controlling the ScrollList programmatically.

## Remarks

Extends ScrollViewRef with selection management methods.

## Extends

- `ScrollViewRef`

## Properties

### getContentHeight()

> **getContentHeight**: () => `number`

Gets the total height of the content.

#### Returns

`number`

The total content height in terminal rows.

#### Remarks

This is the sum of the heights of all child items.

#### Inherited from

`ScrollViewRef.getContentHeight`

---

### getItemCount()

> **getItemCount**: () => `number`

Gets the total number of items.

#### Returns

`number`

The count of child elements.

---

### getItemHeight()

> **getItemHeight**: (`index`) => `number`

Gets the height of a specific item by its index.

#### Parameters

##### index

`number`

The index of the item.

#### Returns

`number`

The height of the item in terminal rows, or 0 if not found.

#### Inherited from

`ScrollViewRef.getItemHeight`

---

### getItemPosition()

> **getItemPosition**: (`index`) => \{ `height`: `number`; `top`: `number`; \} \| `null`

Gets the position of a specific item.

#### Parameters

##### index

`number`

The index of the item.

#### Returns

\{ `height`: `number`; `top`: `number`; \} \| `null`

The position (top offset) and height of the item, or null if not found.

#### Inherited from

`ScrollViewRef.getItemPosition`

---

### getScrollOffset()

> **getScrollOffset**: () => `number`

Gets the current scroll offset (distance scrolled from the top).

#### Returns

`number`

The current scroll offset in terminal rows.

#### Remarks

The scroll offset represents how many terminal rows the content has been
scrolled up from its initial position. A value of 0 means the content is
at the very top (no scrolling has occurred).

#### Inherited from

`ScrollViewRef.getScrollOffset`

---

### getSelectedIndex()

> **getSelectedIndex**: () => `number`

Gets the currently selected index.

#### Returns

`number`

The current selection index, or `-1` if nothing is selected.

---

### getViewportHeight()

> **getViewportHeight**: () => `number`

Gets the current height of the visible viewport.

#### Returns

`number`

The viewport height in terminal rows.

#### Inherited from

`ScrollViewRef.getViewportHeight`

---

### remeasure()

> **remeasure**: () => `void`

Re-measures the ScrollView viewport dimensions.

#### Returns

`void`

#### Remarks

Checks the current dimensions of the viewport and updates state if they have changed.
This is crucial for handling terminal resizes, as Ink does not automatically propagate resize events to components.

#### Example

```tsx
// Handle terminal resize manually
useEffect(() => {
  const onResize = () => ref.current?.remeasure();
  process.stdout.on("resize", onResize);
  return () => process.stdout.off("resize", onResize);
}, []);
```

#### Inherited from

`ScrollViewRef.remeasure`

---

### remeasureItem()

> **remeasureItem**: (`index`) => `void`

Triggers re-measurement of a specific child item.

#### Parameters

##### index

`number`

The index of the child to re-measure.

#### Returns

`void`

#### Remarks

Use this if a child's internal content changes size in a way that doesn't trigger a standard React render cycle update
(e.g., internal state change within the child that affects its height).

#### Inherited from

`ScrollViewRef.remeasureItem`

---

### scrollBy()

> **scrollBy**: (`delta`) => `void`

Scrolls by a relative amount.

#### Parameters

##### delta

`number`

Positive for down, negative for up.

#### Returns

`void`

#### Example

```tsx
useInput((input, key) => {
  if (key.downArrow) ref.current?.scrollBy(1);
  if (key.upArrow) ref.current?.scrollBy(-1);
});
```

#### Inherited from

`ScrollViewRef.scrollBy`

---

### scrollTo()

> **scrollTo**: (`offset`) => `void`

Scrolls to a specific vertical position.

#### Parameters

##### offset

`number`

The target Y offset (distance from top).

#### Returns

`void`

#### Example

```tsx
// Scroll to the very top
ref.current?.scrollTo(0);
```

#### Inherited from

`ScrollViewRef.scrollTo`

---

### scrollToBottom()

> **scrollToBottom**: () => `void`

Scrolls to the very bottom.

#### Returns

`void`

#### Remarks

This calculates the target offset as `contentHeight - viewportHeight`.

#### Inherited from

`ScrollViewRef.scrollToBottom`

---

### scrollToItem()

> **scrollToItem**: (`index`, `mode?`) => `void`

Scrolls to a specific child item by index.

#### Parameters

##### index

`number`

The index of the child to scroll to.

##### mode?

[`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode. Defaults to component's `scrollAlignment` prop.

#### Returns

`void`

#### Example

```tsx
// Scroll to the 5th item, aligning it to the top of the view
ref.current?.scrollToItem(4, "top");
```

---

### scrollToTop()

> **scrollToTop**: () => `void`

Scrolls to the very top (position 0).

#### Returns

`void`

#### Inherited from

`ScrollViewRef.scrollToTop`

---

### select()

> **select**: (`index`, `mode?`) => `void`

Selects an item by index and scrolls to make it visible.

#### Parameters

##### index

`number`

The index to select.

##### mode?

[`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode. Defaults to component's `scrollAlignment` prop.

#### Returns

`void`

#### Example

```tsx
// Select the 10th item
ref.current?.select(9);
```

---

### selectFirst()

> **selectFirst**: () => `number`

Selects the first item and scrolls to the top.

#### Returns

`number`

The new selected index (0).

---

### selectLast()

> **selectLast**: () => `number`

Selects the last item and scrolls to the bottom.

#### Returns

`number`

The new selected index.

---

### selectNext()

> **selectNext**: () => `number`

Selects the next item and scrolls to make it visible.

#### Returns

`number`

The new selected index.

#### Remarks

Does nothing if already at the last item.

---

### selectPrevious()

> **selectPrevious**: () => `number`

Selects the previous item and scrolls to make it visible.

#### Returns

`number`

The new selected index.

#### Remarks

Does nothing if already at the first item.
