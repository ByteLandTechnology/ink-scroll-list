[**ink-scroll-view**](../README.md)

---

# Interface: ScrollListProps

Props for the ScrollList component.

## Remarks

Extends ScrollViewProps and adds selection state management
with automatic scroll-into-view behavior.

## Extends

- `ScrollViewProps`

## Properties

### alignItems?

> `readonly` `optional` **alignItems**: `"center"` \| `"flex-start"` \| `"flex-end"` \| `"stretch"`

The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).

#### Inherited from

`ScrollViewProps.alignItems`

---

### alignSelf?

> `readonly` `optional` **alignSelf**: `"auto"` \| `"center"` \| `"flex-start"` \| `"flex-end"`

It makes possible to override the align-items value for specific flex items.
See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).

#### Inherited from

`ScrollViewProps.alignSelf`

---

### aria-hidden?

> `readonly` `optional` **aria-hidden**: `boolean`

Hide the element from screen readers.

#### Inherited from

`ScrollViewProps.aria-hidden`

---

### aria-label?

> `readonly` `optional` **aria-label**: `string`

A label for the element for screen readers.

#### Inherited from

`ScrollViewProps.aria-label`

---

### aria-role?

> `readonly` `optional` **aria-role**: `"button"` \| `"checkbox"` \| `"combobox"` \| `"list"` \| `"listbox"` \| `"listitem"` \| `"menu"` \| `"menuitem"` \| `"option"` \| `"progressbar"` \| `"radio"` \| `"radiogroup"` \| `"tab"` \| `"tablist"` \| `"table"` \| `"textbox"` \| `"timer"` \| `"toolbar"`

The role of the element.

#### Inherited from

`ScrollViewProps.aria-role`

---

### aria-state?

> `readonly` `optional` **aria-state**: `object`

The state of the element.

#### busy?

> `readonly` `optional` **busy**: `boolean`

#### checked?

> `readonly` `optional` **checked**: `boolean`

#### disabled?

> `readonly` `optional` **disabled**: `boolean`

#### expanded?

> `readonly` `optional` **expanded**: `boolean`

#### multiline?

> `readonly` `optional` **multiline**: `boolean`

#### multiselectable?

> `readonly` `optional` **multiselectable**: `boolean`

#### readonly?

> `readonly` `optional` **readonly**: `boolean`

#### required?

> `readonly` `optional` **required**: `boolean`

#### selected?

> `readonly` `optional` **selected**: `boolean`

#### Inherited from

`ScrollViewProps.aria-state`

---

### backgroundColor?

> `readonly` `optional` **backgroundColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Background color for the element.

Accepts the same values as `color` in the `<Text>` component.

#### Inherited from

`ScrollViewProps.backgroundColor`

---

### borderBottom?

> `readonly` `optional` **borderBottom**: `boolean`

Determines whether bottom border is visible.

#### Default

```ts
true;
```

#### Inherited from

`ScrollViewProps.borderBottom`

---

### borderBottomColor?

> `readonly` `optional` **borderBottomColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change bottom border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`ScrollViewProps.borderBottomColor`

---

### borderBottomDimColor?

> `readonly` `optional` **borderBottomDimColor**: `boolean`

Dim the bottom border color.

#### Default

```ts
false;
```

#### Inherited from

`ScrollViewProps.borderBottomDimColor`

---

### borderColor?

> `readonly` `optional` **borderColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change border color. A shorthand for setting `borderTopColor`, `borderRightColor`, `borderBottomColor`, and `borderLeftColor`.

#### Inherited from

`ScrollViewProps.borderColor`

---

### borderDimColor?

> `readonly` `optional` **borderDimColor**: `boolean`

Dim the border color. A shorthand for setting `borderTopDimColor`, `borderBottomDimColor`, `borderLeftDimColor`, and `borderRightDimColor`.

#### Default

```ts
false;
```

#### Inherited from

`ScrollViewProps.borderDimColor`

---

### borderLeft?

> `readonly` `optional` **borderLeft**: `boolean`

Determines whether left border is visible.

#### Default

```ts
true;
```

#### Inherited from

`ScrollViewProps.borderLeft`

---

### borderLeftColor?

> `readonly` `optional` **borderLeftColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change left border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`ScrollViewProps.borderLeftColor`

---

### borderLeftDimColor?

> `readonly` `optional` **borderLeftDimColor**: `boolean`

Dim the left border color.

#### Default

```ts
false;
```

#### Inherited from

`ScrollViewProps.borderLeftDimColor`

---

### borderRight?

> `readonly` `optional` **borderRight**: `boolean`

Determines whether right border is visible.

#### Default

```ts
true;
```

#### Inherited from

`ScrollViewProps.borderRight`

---

### borderRightColor?

> `readonly` `optional` **borderRightColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change right border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`ScrollViewProps.borderRightColor`

---

### borderRightDimColor?

> `readonly` `optional` **borderRightDimColor**: `boolean`

Dim the right border color.

#### Default

```ts
false;
```

#### Inherited from

`ScrollViewProps.borderRightDimColor`

---

### borderStyle?

> `readonly` `optional` **borderStyle**: keyof Boxes \| `BoxStyle`

Add a border with a specified style. If `borderStyle` is `undefined` (the default), no border will be added.

#### Inherited from

`ScrollViewProps.borderStyle`

---

### borderTop?

> `readonly` `optional` **borderTop**: `boolean`

Determines whether top border is visible.

#### Default

```ts
true;
```

#### Inherited from

`ScrollViewProps.borderTop`

---

### borderTopColor?

> `readonly` `optional` **borderTopColor**: `LiteralUnion`\<keyof ForegroundColor, `string`\>

Change top border color. Accepts the same values as `color` in `Text` component.

#### Inherited from

`ScrollViewProps.borderTopColor`

---

### borderTopDimColor?

> `readonly` `optional` **borderTopDimColor**: `boolean`

Dim the top border color.

#### Default

```ts
false;
```

#### Inherited from

`ScrollViewProps.borderTopDimColor`

---

### children

> **children**: `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

The content to be scrolled.

#### Remarks

Accepts an array of React elements. Each element should have a unique `key`
prop, which will be preserved during rendering for proper reconciliation.

#### Inherited from

`ScrollViewProps.children`

---

### columnGap?

> `readonly` `optional` **columnGap**: `number`

Size of the gap between an element's columns.

#### Inherited from

`ScrollViewProps.columnGap`

---

### display?

> `readonly` `optional` **display**: `"flex"` \| `"none"`

Set this property to `none` to hide the element.

#### Inherited from

`ScrollViewProps.display`

---

### flexBasis?

> `readonly` `optional` **flexBasis**: `string` \| `number`

It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).

#### Inherited from

`ScrollViewProps.flexBasis`

---

### flexDirection?

> `readonly` `optional` **flexDirection**: `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).

#### Inherited from

`ScrollViewProps.flexDirection`

---

### flexGrow?

> `readonly` `optional` **flexGrow**: `number`

This property defines the ability for a flex item to grow if necessary.
See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).

#### Inherited from

`ScrollViewProps.flexGrow`

---

### flexShrink?

> `readonly` `optional` **flexShrink**: `number`

It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).

#### Inherited from

`ScrollViewProps.flexShrink`

---

### flexWrap?

> `readonly` `optional` **flexWrap**: `"nowrap"` \| `"wrap"` \| `"wrap-reverse"`

It defines whether the flex items are forced in a single line or can be flowed into multiple lines. If set to multiple lines, it also defines the cross-axis which determines the direction new lines are stacked in.
See [flex-wrap](https://css-tricks.com/almanac/properties/f/flex-wrap/).

#### Inherited from

`ScrollViewProps.flexWrap`

---

### gap?

> `readonly` `optional` **gap**: `number`

Size of the gap between an element's columns and rows. A shorthand for `columnGap` and `rowGap`.

#### Inherited from

`ScrollViewProps.gap`

---

### height?

> `readonly` `optional` **height**: `string` \| `number`

Height of the element in lines (rows). You can also set it as a percentage, which will calculate the height based on the height of the parent element.

#### Inherited from

`ScrollViewProps.height`

---

### justifyContent?

> `readonly` `optional` **justifyContent**: `"center"` \| `"flex-start"` \| `"flex-end"` \| `"space-between"` \| `"space-around"` \| `"space-evenly"`

It defines the alignment along the main axis.
See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).

#### Inherited from

`ScrollViewProps.justifyContent`

---

### margin?

> `readonly` `optional` **margin**: `number`

Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft`, and `marginRight`.

#### Inherited from

`ScrollViewProps.margin`

---

### marginBottom?

> `readonly` `optional` **marginBottom**: `number`

Bottom margin.

#### Inherited from

`ScrollViewProps.marginBottom`

---

### marginLeft?

> `readonly` `optional` **marginLeft**: `number`

Left margin.

#### Inherited from

`ScrollViewProps.marginLeft`

---

### marginRight?

> `readonly` `optional` **marginRight**: `number`

Right margin.

#### Inherited from

`ScrollViewProps.marginRight`

---

### marginTop?

> `readonly` `optional` **marginTop**: `number`

Top margin.

#### Inherited from

`ScrollViewProps.marginTop`

---

### marginX?

> `readonly` `optional` **marginX**: `number`

Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.

#### Inherited from

`ScrollViewProps.marginX`

---

### marginY?

> `readonly` `optional` **marginY**: `number`

Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.

#### Inherited from

`ScrollViewProps.marginY`

---

### minHeight?

> `readonly` `optional` **minHeight**: `string` \| `number`

Sets a minimum height of the element.

#### Inherited from

`ScrollViewProps.minHeight`

---

### minWidth?

> `readonly` `optional` **minWidth**: `string` \| `number`

Sets a minimum width of the element.

#### Inherited from

`ScrollViewProps.minWidth`

---

### onContentHeightChange()?

> `optional` **onContentHeightChange**: (`height`, `previousHeight`) => `void`

Callback fired when the total height of the content changes.

#### Parameters

##### height

`number`

The new total content height.

##### previousHeight

`number`

The previous total content height.

#### Returns

`void`

#### Remarks

Useful for debug logging or adjusting external layouts based on content size.

#### Inherited from

`ScrollViewProps.onContentHeightChange`

---

### onItemHeightChange()?

> `optional` **onItemHeightChange**: (`index`, `height`, `previousHeight`) => `void`

Callback fired when an individual child item's height changes.

#### Parameters

##### index

`number`

The index of the item.

##### height

`number`

The new height of the item.

##### previousHeight

`number`

The previous height of the item.

#### Returns

`void`

#### Remarks

This is triggered whenever an item is re-measured and its height differs from the previous value.

#### Inherited from

`ScrollViewProps.onItemHeightChange`

---

### onScroll()?

> `optional` **onScroll**: (`scrollOffset`) => `void`

Callback fired when the scroll position changes.

#### Parameters

##### scrollOffset

`number`

The new scroll offset (distance from top).

#### Returns

`void`

#### Remarks

Use this to sync external state or UI (e.g., scrollbars) with the current scroll position.

#### Inherited from

`ScrollViewProps.onScroll`

---

### onSelectionChange()?

> `optional` **onSelectionChange**: (`index`) => `void`

Callback fired when the selected index changes internally.

#### Parameters

##### index

`number`

The new selected index.

#### Returns

`void`

#### Remarks

This is called when selection changes due to internal navigation methods
like `selectNext()` or `selectPrevious()`.

---

### onViewportSizeChange()?

> `optional` **onViewportSizeChange**: (`size`, `previousSize`) => `void`

Callback fired when the ScrollView viewport (visible area) dimensions change.

#### Parameters

##### size

The new dimensions of the viewport (width, height).

###### height

`number`

###### width

`number`

##### previousSize

The previous dimensions of the viewport (width, height).

###### height

`number`

###### width

`number`

#### Returns

`void`

#### Remarks

Fired whenever the outer container size changes (e.g., terminal resize or layout update).

#### Inherited from

`ScrollViewProps.onViewportSizeChange`

---

### overflow?

> `readonly` `optional` **overflow**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in both directions.

#### Default

```ts
"visible";
```

#### Inherited from

`ScrollViewProps.overflow`

---

### overflowX?

> `readonly` `optional` **overflowX**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the horizontal direction.

#### Default

```ts
"visible";
```

#### Inherited from

`ScrollViewProps.overflowX`

---

### overflowY?

> `readonly` `optional` **overflowY**: `"visible"` \| `"hidden"`

Behavior for an element's overflow in the vertical direction.

#### Default

```ts
"visible";
```

#### Inherited from

`ScrollViewProps.overflowY`

---

### padding?

> `readonly` `optional` **padding**: `number`

Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.

#### Inherited from

`ScrollViewProps.padding`

---

### paddingBottom?

> `readonly` `optional` **paddingBottom**: `number`

Bottom padding.

#### Inherited from

`ScrollViewProps.paddingBottom`

---

### paddingLeft?

> `readonly` `optional` **paddingLeft**: `number`

Left padding.

#### Inherited from

`ScrollViewProps.paddingLeft`

---

### paddingRight?

> `readonly` `optional` **paddingRight**: `number`

Right padding.

#### Inherited from

`ScrollViewProps.paddingRight`

---

### paddingTop?

> `readonly` `optional` **paddingTop**: `number`

Top padding.

#### Inherited from

`ScrollViewProps.paddingTop`

---

### paddingX?

> `readonly` `optional` **paddingX**: `number`

Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.

#### Inherited from

`ScrollViewProps.paddingX`

---

### paddingY?

> `readonly` `optional` **paddingY**: `number`

Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.

#### Inherited from

`ScrollViewProps.paddingY`

---

### position?

> `readonly` `optional` **position**: `"absolute"` \| `"relative"`

#### Inherited from

`ScrollViewProps.position`

---

### rowGap?

> `readonly` `optional` **rowGap**: `number`

Size of the gap between an element's rows.

#### Inherited from

`ScrollViewProps.rowGap`

---

### scrollAlignment?

> `optional` **scrollAlignment**: [`ScrollAlignment`](../type-aliases/ScrollAlignment.md)

Alignment mode when scrolling to the selected item.

#### Remarks

- `'auto'`: Minimal scrolling to bring item into view (default).
- `'top'`: Align item to the top of the viewport.
- `'bottom'`: Align item to the bottom of the viewport.
- `'center'`: Align item to the center of the viewport.

#### Default Value

`'auto'`

---

### selectedIndex?

> `optional` **selectedIndex**: `number`

The currently selected item index.

#### Remarks

When this value changes, the component will automatically scroll to ensure
the selected item is visible in the viewport.

---

### width?

> `readonly` `optional` **width**: `string` \| `number`

Width of the element in spaces. You can also set it as a percentage, which will calculate the width based on the width of the parent element.

#### Inherited from

`ScrollViewProps.width`
