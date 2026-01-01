"use client";

/**
 * @file AlignmentDemo.tsx
 * @description Demonstrates scroll alignment modes in ScrollList
 *
 * Shows how the scrollAlignment prop affects item positioning:
 * - auto: Minimal scrolling to bring item into view
 * - center: Center the selected item in viewport
 * - top: Align selected item to top of viewport
 * - bottom: Align selected item to bottom of viewport
 */

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef, ScrollAlignment } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { THEME, Btn, ActionFeedback, StatusRow } from "./shared";

export default function AlignmentDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollAlignment, setScrollAlignment] =
    useState<ScrollAlignment>("auto");
  const [scrollOffset, setScrollOffset] = useState(0);
  const items = Array.from({ length: 20 }, (_, i) => `Option ${i}`);
  const viewportHeight = 6;
  const targetIndex = 10;

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

  const selectWithAlignment = (alignment: ScrollAlignment) => {
    setScrollAlignment(alignment);
    setSelectedIndex(targetIndex);
    showFeedback(`select(${targetIndex}, '${alignment}')`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="w-full md:w-48 space-y-4">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          Scroll Alignment
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Target: Item {targetIndex}
        </div>
        <div className="flex flex-col gap-2">
          <Btn onClick={() => selectWithAlignment("auto")} color={THEME.green}>
            Auto (Default)
          </Btn>
          <Btn
            onClick={() => selectWithAlignment("center")}
            color={THEME.green}
          >
            Center
          </Btn>
          <Btn onClick={() => selectWithAlignment("top")} color={THEME.green}>
            Top
          </Btn>
          <Btn
            onClick={() => selectWithAlignment("bottom")}
            color={THEME.green}
          >
            Bottom
          </Btn>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <StatusRow
            label="Selected"
            value={selectedIndex}
            color={THEME.green}
          />
          <StatusRow
            label="Alignment"
            value={scrollAlignment}
            color={THEME.green}
          />
        </div>
        <ActionFeedback message={actionMsg} color={THEME.green} />
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a] bg-[#0a0a0f]">
        <InkCanvas>
          <Box height="100%" width="100%">
            <ScrollBarBox
              borderStyle="double"
              borderColor="green"
              height={viewportHeight + 2}
              contentHeight={items.length}
              viewportHeight={viewportHeight}
              scrollOffset={scrollOffset}
            >
              <ScrollList
                ref={scrollRef}
                height={viewportHeight}
                selectedIndex={selectedIndex}
                scrollAlignment={scrollAlignment}
              >
                {items.map((item, i) => (
                  <Box key={i}>
                    <Text color={i === selectedIndex ? "green" : "white"}>
                      {i === selectedIndex ? "● " : "○ "} {item}
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
