"use client";

/**
 * @file NavigationDemo.tsx
 * @description Demonstrates basic navigation in ScrollList
 *
 * Shows the controlled component pattern:
 * - selectedIndex is managed by parent state
 * - Navigation is done by updating selectedIndex
 * - ScrollList automatically scrolls to keep selection visible
 *
 * This is the fundamental pattern for using ScrollList.
 */

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { THEME, Btn, ActionFeedback, StatusRow } from "./shared";
import { HiChevronUp, HiChevronDown, HiArrowUp } from "react-icons/hi2";

export default function NavigationDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="w-full md:w-48 space-y-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          Navigation
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn
            onClick={() => {
              setSelectedIndex((prev) => Math.max(0, prev - 1));
              showFeedback("setSelectedIndex(prev - 1)");
            }}
            color={THEME.blue}
          >
            <HiChevronUp className="w-4 h-4" /> Prev
          </Btn>
          <Btn
            onClick={() => {
              setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
              showFeedback("setSelectedIndex(prev + 1)");
            }}
            color={THEME.blue}
          >
            <HiChevronDown className="w-4 h-4" /> Next
          </Btn>
          <Btn
            onClick={() => {
              setSelectedIndex(0);
              showFeedback("setSelectedIndex(0)");
            }}
            color={THEME.purple}
          >
            <HiArrowUp className="w-4 h-4" /> First
          </Btn>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <StatusRow
            label="Selected"
            value={selectedIndex}
            color={THEME.blue}
          />
          <StatusRow
            label="Total"
            value={items.length}
            color={THEME.textMuted}
          />
        </div>
        <ActionFeedback message={actionMsg} color={THEME.blue} />
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a] bg-[#0a0a0f]">
        <InkCanvas>
          <Box height="100%" width="100%">
            <ScrollBarBox
              borderStyle="single"
              borderColor="blue"
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
                    <Text color={i === selectedIndex ? "blue" : "white"}>
                      {i === selectedIndex ? "> " : "  "} {item}
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
