"use client";

/**
 * @file DynamicItemsDemo.tsx
 * @description Demonstrates dynamic item management in ScrollList
 *
 * Shows how to handle:
 * - Adding items to the beginning or end of the list
 * - Removing items from the list
 * - Maintaining correct selection when items change
 *
 * Key concept: When adding/removing items, the parent must update
 * selectedIndex to keep pointing to the intended item.
 */

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { THEME, Btn, ActionFeedback, StatusRow } from "./shared";
import { HiPlus, HiMinus } from "react-icons/hi2";

export default function DynamicItemsDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [items, setItems] = useState(["Task A", "Task B", "Task C"]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const viewportHeight = 8;

  const showFeedback = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 1000);
  };

  // Track scroll offset for ScrollBarBox
  useEffect(() => {
    const interval = setInterval(() => {
      const offset = scrollRef.current?.getScrollOffset() ?? 0;
      setScrollOffset(offset);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const addStart = () => {
    setItems((prev) => [`New ${Date.now().toString().slice(-4)}`, ...prev]);
    // Shift selection to keep pointing to the same item
    setSelectedIndex((prev) => prev + 1);
    showFeedback("Prepend Item");
  };
  const addEnd = () => {
    setItems((prev) => [...prev, `New ${Date.now().toString().slice(-4)}`]);
    showFeedback("Append Item");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="w-full md:w-48 space-y-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          Dynamic List
        </div>
        <div className="flex flex-col gap-2">
          <Btn onClick={addStart} color={THEME.red}>
            <HiPlus className="w-4 h-4" /> Add to Top
          </Btn>
          <Btn onClick={addEnd} color={THEME.red}>
            <HiPlus className="w-4 h-4" /> Add to End
          </Btn>
          <Btn
            onClick={() => {
              if (items.length > 0) {
                setItems((prev) => prev.slice(1));
                // Shift selection back when removing from top
                setSelectedIndex((prev) => Math.max(0, prev - 1));
                showFeedback("Remove First");
              }
            }}
            color={THEME.red}
          >
            <HiMinus className="w-4 h-4" /> Remove First
          </Btn>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <StatusRow
            label="Item Count"
            value={items.length}
            color={THEME.red}
          />
          <StatusRow label="Selected" value={selectedIndex} color={THEME.red} />
        </div>
        <ActionFeedback message={actionMsg} color={THEME.red} />
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a] bg-[#0a0a0f]">
        <InkCanvas>
          <Box height="100%" width="100%">
            <ScrollBarBox
              borderStyle="single"
              borderColor="red"
              height={viewportHeight + 2}
              contentHeight={items.length}
              viewportHeight={viewportHeight}
              scrollOffset={scrollOffset}
            >
              <ScrollList
                ref={scrollRef}
                height={viewportHeight}
                selectedIndex={selectedIndex}
              >
                {items.map((item, i) => (
                  <Box key={i}>
                    <Text color={i === selectedIndex ? "red" : "white"}>
                      {i === selectedIndex ? ">> " : "   "} {item}
                    </Text>
                  </Box>
                ))}
              </ScrollList>
            </ScrollBarBox>
          </Box>
        </InkCanvas>
      </div>
    </div>
  );
}
