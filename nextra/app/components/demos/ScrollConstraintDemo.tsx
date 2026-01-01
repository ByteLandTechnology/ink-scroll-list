"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { THEME, Btn, ActionFeedback, StatusRow } from "./shared";
import {
  HiChevronUp,
  HiChevronDown,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi2";

/**
 * ScrollConstraintDemo - Demonstrates the scroll constraint behavior
 *
 * When a selectedIndex is set, scroll methods are constrained to keep
 * the selected item visible. This demo shows:
 * - scrollTo() is limited to the visible range
 * - scrollToTop/Bottom respects selection constraint
 * - Large items allow scrolling within their bounds
 */
export default function ScrollConstraintDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(5);
  const [scrollOffset, setScrollOffset] = useState(0);
  const items = Array.from({ length: 15 }, (_, i) => `Item ${i + 1}`);
  const viewportHeight = 6;

  const showFeedback = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 1500);
  };

  // Track scroll offset for ScrollBarBox
  useEffect(() => {
    const interval = setInterval(() => {
      const offset = scrollRef.current?.getScrollOffset() ?? 0;
      setScrollOffset(offset);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate visible bounds for the selected item
  const itemTop = selectedIndex;
  const minOffset = Math.max(0, itemTop + 1 - viewportHeight);
  const maxOffset = itemTop;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="w-full md:w-56 space-y-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          Scroll Constraints
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          When an item is selected, scroll methods are constrained to keep it
          visible.
        </p>

        <div className="flex flex-wrap gap-2">
          <Btn
            onClick={() => {
              scrollRef.current?.scrollToTop();
              showFeedback(`scrollToTop() → ${minOffset}`);
            }}
            color={THEME.blue}
          >
            <HiArrowUp className="w-4 h-4" /> Scroll Top
          </Btn>
          <Btn
            onClick={() => {
              scrollRef.current?.scrollToBottom();
              showFeedback(`scrollToBottom() → ${maxOffset}`);
            }}
            color={THEME.blue}
          >
            <HiArrowDown className="w-4 h-4" /> Scroll Bottom
          </Btn>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Btn
            onClick={() => {
              setSelectedIndex((prev) => Math.max(0, prev - 1));
              showFeedback("selectedIndex--");
            }}
            color={THEME.purple}
          >
            <HiChevronUp className="w-4 h-4" /> Select Prev
          </Btn>
          <Btn
            onClick={() => {
              setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
              showFeedback("selectedIndex++");
            }}
            color={THEME.purple}
          >
            <HiChevronDown className="w-4 h-4" /> Select Next
          </Btn>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <StatusRow
            label="Selected"
            value={selectedIndex}
            color={THEME.purple}
          />
          <StatusRow label="Scroll" value={scrollOffset} color={THEME.blue} />
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            Valid scroll range: [{minOffset}, {maxOffset}]
          </div>
        </div>
        <ActionFeedback message={actionMsg} color={THEME.blue} />
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[180px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a] bg-[#0a0a0f]">
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
