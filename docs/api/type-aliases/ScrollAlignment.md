[**ink-scroll-list**](../README.md)

---

# Type Alias: ScrollAlignment

> **ScrollAlignment** = `"auto"` \| `"top"` \| `"bottom"` \| `"center"`

Alignment mode for scrolling to items.

Determines how the selected item is positioned within the viewport when
the component auto-scrolls to make it visible.

## Remarks

- `'auto'`: Performs minimal scrolling to bring the item into view. If the item
  is above the viewport, scrolls to show its top. If below, scrolls to show its bottom.
  Does not scroll if the item is already fully visible.
- `'top'`: Always aligns the top of the selected item with the top of the viewport.
- `'bottom'`: Always aligns the bottom of the selected item with the bottom of the viewport.
- `'center'`: Always centers the selected item vertically within the viewport.

All modes respect scroll bounds - the scroll offset will be clamped to valid range
(0 to contentHeight - viewportHeight).
