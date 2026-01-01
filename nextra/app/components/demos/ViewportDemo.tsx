"use client";

/**
 * @file ViewportDemo.tsx
 * @description Demonstrates viewport resizing behavior in ScrollList
 *
 * Shows how ScrollList handles viewport size changes:
 * - Automatically adjusts scroll position to keep selected item visible
 * - Demonstrates the responsive behavior when viewport shrinks/grows
 *
 * Use case: Terminal window resizing, dynamic layout changes
 */

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { THEME, Btn, ActionFeedback, StatusRow } from "./shared";
import { HiPlus, HiMinus } from "react-icons/hi2";

export default function ViewportDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState(6);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const items = Array.from({ length: 20 }, (_, i) => `Entry ${i + 1}`);

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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="w-full md:w-48 space-y-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          Variable Viewport
        </div>
        <div className="flex items-center gap-2">
          <Btn
            onClick={() => {
              setViewportHeight((h) => Math.max(3, h - 1));
              showFeedback("Height -1");
            }}
            color={THEME.yellow}
          >
            <HiMinus />
          </Btn>
          <span className="font-mono text-sm">{viewportHeight} lines</span>
          <Btn
            onClick={() => {
              setViewportHeight((h) => Math.min(12, h + 1));
              showFeedback("Height +1");
            }}
            color={THEME.yellow}
          >
            <HiPlus />
          </Btn>
        </div>
        <div className="text-xs text-gray-500">
          Resizing the viewport automatically keeps the selected item visible.
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => setSelectedIndex(15)} color={THEME.yellow} small>
            Select 15
          </Btn>
          <Btn onClick={() => setSelectedIndex(5)} color={THEME.yellow} small>
            Select 5
          </Btn>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <StatusRow
            label="Selected"
            value={selectedIndex}
            color={THEME.yellow}
          />
        </div>
        <ActionFeedback message={actionMsg} color={THEME.yellow} />
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a] bg-[#0a0a0f]">
        <InkCanvas>
          <Box height="100%" width="100%">
            <ScrollBarBox
              borderStyle="single"
              borderColor="yellow"
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
                    <Text color={i === selectedIndex ? "yellow" : "white"}>
                      {i === selectedIndex ? "★ " : "  "} {item}
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
