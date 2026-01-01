"use client";

/**
 * @file FreePlayDemo.tsx
 * @description Free-play sandbox for ink-scroll-list - compact version
 */

import "ink-canvas/shims/process";
import { useState, useEffect, useRef } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import {
  HiChevronUp,
  HiChevronDown,
  HiArrowUp,
  HiArrowDown,
  HiPlus,
  HiMinus,
  HiArrowPath,
  HiCog6Tooth,
} from "react-icons/hi2";
import { THEME, Btn } from "./demos/shared";

// ===================================
// Types
// ===================================
interface FreePlayItem {
  id: number;
  title: string;
}

// ===================================
// Main Component
// ===================================
export default function FreePlayDemo() {
  const scrollRef = useRef<ScrollListRef>(null);
  const nextIdRef = useRef(15);
  const [mounted, setMounted] = useState(false);

  const [items, setItems] = useState<FreePlayItem[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      title: `Item ${i + 1}`,
    })),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(8);
  const [width, setWidth] = useState(50);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const log = (msg: string) => setActionLog((p) => [msg, ...p].slice(0, 6));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll offset for ScrollBarBox
  useEffect(() => {
    const interval = setInterval(() => {
      const offset = scrollRef.current?.getScrollOffset() ?? 0;
      setScrollOffset(offset);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Navigation - now using external state control
  const selectPrev = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
    log("selectedIndex--");
  };
  const selectNext = () => {
    setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
    log("selectedIndex++");
  };
  const selectFirst = () => {
    setSelectedIndex(0);
    log("selectedIndex = 0");
  };
  const selectLast = () => {
    setSelectedIndex(items.length - 1);
    log(`selectedIndex = ${items.length - 1}`);
  };

  // Items
  const addTop = () => {
    nextIdRef.current += 1;
    setItems((p) => [
      { id: nextIdRef.current, title: `NEW (top) ${nextIdRef.current}` },
      ...p,
    ]);
    // When adding to top, shift selection to keep pointing to same item
    setSelectedIndex((p) => p + 1);
    log("Add top");
  };
  const addEnd = () => {
    nextIdRef.current += 1;
    setItems((p) => [
      ...p,
      { id: nextIdRef.current, title: `NEW (end) ${nextIdRef.current}` },
    ]);
    log("Add end");
  };
  const rmTop = () => {
    if (items.length > 1) {
      setItems((p) => p.slice(1));
      // When removing from top, shift selection back (clamp to 0)
      setSelectedIndex((p) => Math.max(0, p - 1));
      log("Remove first");
    }
  };
  const rmEnd = () => {
    if (items.length > 1) {
      setItems((p) => {
        const newItems = p.slice(0, -1);
        return newItems;
      });
      // Clamp selection if it was pointing to removed item
      setSelectedIndex((p) => Math.min(p, items.length - 2));
      log("Remove last");
    }
  };

  // Dimensions
  const decWidth = () => {
    setWidth((w) => Math.max(w - 10, 25));
    log("Width -10");
  };
  const incWidth = () => {
    setWidth((w) => Math.min(w + 10, 70));
    log("Width +10");
  };
  const decHeight = () => {
    setViewportHeight((h) => Math.max(h - 2, 4));
    log("Height -2");
  };
  const incHeight = () => {
    setViewportHeight((h) => Math.min(h + 2, 14));
    log("Height +2");
  };

  // Reset
  const reset = () => {
    setItems(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
      })),
    );
    setSelectedIndex(0);
    setViewportHeight(8);
    setWidth(50);
    setActionLog([]);
    log("Reset");
  };

  if (!mounted)
    return (
      <div className="h-[320px] w-full rounded-xl bg-slate-900 animate-pulse" />
    );

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          🎮 Sandbox
        </span>
        <Btn onClick={reset}>
          <HiArrowPath className="w-3 h-3" />
          Reset
        </Btn>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Controls */}
        <div className="lg:w-64 p-3 border-b lg:border-b-0 lg:border-r space-y-3 border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
          {/* Navigation */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Navigation
            </div>
            <div className="flex flex-wrap gap-1">
              <Btn onClick={selectPrev} color={THEME.blue}>
                <HiChevronUp className="w-3 h-3" />
                Prev
              </Btn>
              <Btn onClick={selectNext} color={THEME.blue}>
                <HiChevronDown className="w-3 h-3" />
                Next
              </Btn>
              <Btn onClick={selectFirst} color={THEME.purple}>
                <HiArrowUp className="w-3 h-3" />
                First
              </Btn>
              <Btn onClick={selectLast} color={THEME.purple}>
                <HiArrowDown className="w-3 h-3" />
                Last
              </Btn>
            </div>
          </div>
          {/* Items */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Items
            </div>
            <div className="flex flex-wrap gap-1">
              <Btn onClick={addTop} color={THEME.yellow}>
                <HiPlus className="w-3 h-3" />
                Top
              </Btn>
              <Btn onClick={addEnd} color={THEME.green}>
                <HiPlus className="w-3 h-3" />
                End
              </Btn>
              <Btn onClick={rmTop} color={THEME.red}>
                <HiMinus className="w-3 h-3" />
                1st
              </Btn>
              <Btn onClick={rmEnd} color={THEME.red}>
                <HiMinus className="w-3 h-3" />
                Last
              </Btn>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
              Size
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400 w-6">W:</span>
              <Btn onClick={decWidth} color={THEME.blue} small>
                <HiMinus className="w-2.5 h-2.5" />
              </Btn>
              <span className="font-mono text-gray-600 dark:text-white w-8 text-center">
                {width}
              </span>
              <Btn onClick={incWidth} color={THEME.blue} small>
                <HiPlus className="w-2.5 h-2.5" />
              </Btn>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-gray-500 dark:text-gray-400 w-6">H:</span>
              <Btn onClick={decHeight} color={THEME.purple} small>
                <HiMinus className="w-2.5 h-2.5" />
              </Btn>
              <span className="font-mono text-gray-600 dark:text-white w-8 text-center">
                {viewportHeight}
              </span>
              <Btn onClick={incHeight} color={THEME.purple} small>
                <HiPlus className="w-2.5 h-2.5" />
              </Btn>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-3 bg-white dark:bg-[#12121a]">
          <div
            className="rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a3a]"
            style={{ background: THEME.dark }}
          >
            <InkCanvas>
              <Box height="100%" width="100%">
                <Box width={width}>
                  <ScrollBarBox
                    borderStyle="single"
                    borderColor="cyan"
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
                        <Box key={item.id}>
                          <Text
                            color={i === selectedIndex ? "green" : "white"}
                            bold={i === selectedIndex}
                            backgroundColor={
                              i === selectedIndex ? "#003300" : undefined
                            }
                          >
                            {i === selectedIndex ? "> " : "  "} {item.title}
                          </Text>
                        </Box>
                      ))}
                    </ScrollList>
                  </ScrollBarBox>
                </Box>
              </Box>
            </InkCanvas>
          </div>
        </div>

        {/* Status */}
        <div className="lg:w-48 p-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
          <div className="flex items-center gap-1 mb-2">
            <HiCog6Tooth className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              Status
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Items</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {items.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Selected</span>
              <span className="font-mono text-green-600 dark:text-green-400">
                {selectedIndex}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Viewport</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {viewportHeight}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">
              Log
            </div>
            <div
              className="rounded p-1.5 space-y-0.5 max-h-24 overflow-auto text-[10px] font-mono"
              style={{ background: THEME.dark }}
            >
              {actionLog.length === 0 ? (
                <span className="text-gray-600">...</span>
              ) : (
                actionLog.map((a, i) => (
                  <div
                    key={i}
                    style={{ color: i === 0 ? THEME.green : THEME.textMuted }}
                  >
                    {i === 0 && "→ "}
                    {a}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
