"use client";

/**
 * @file HeroDemo.tsx
 * @description Auto-playing demonstration component for the homepage hero section
 *
 * Features four auto-cycling scenes that showcase ScrollList capabilities:
 * 1. Navigation: Basic selection and navigation
 * 2. Alignment: Different scroll alignment modes
 * 3. Dynamic: Adding and removing items
 * 4. Viewport: Responsive viewport sizing
 *
 * Uses ink-canvas to render Ink components in the browser.
 */

import "ink-canvas/shims/process";
import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text } from "ink";
import { ScrollList, ScrollListRef, ScrollAlignment } from "ink-scroll-list";
import { ScrollBarBox } from "@byteland/ink-scroll-bar";
import { InkCanvas } from "ink-canvas";
import { HiArrowsUpDown, HiViewColumns, HiPlusCircle } from "react-icons/hi2";
import { HiCursorClick } from "react-icons/hi";

// ===================================
// Theme Colors (ByteLand Brand)
// ===================================
const THEME = {
  blue: "#007aff",
  green: "#34c759",
  red: "#ff3b30",
  dark: "#0a0a0f",
  surface: "#12121a",
  surfaceLight: "#1a1a25",
  border: "#2a2a3a",
  text: "#e0e0e8",
  textMuted: "#8888a0",
};

// ===================================
// Shared Types & Interfaces
// ===================================
interface DemoState {
  activity: string;
  offset: number;
  total: number;
  meta?: string;
  selectedIndex?: number;
}

interface SceneProps {
  active: boolean;
  onUpdate: (state: DemoState) => void;
}

// ===================================
// Scene 1: Navigation Demo
// ===================================
const NavigationScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollListRef>(null);
  const [activity, setActivity] = useState("Ready");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewportHeight = 10;
  const items = Array.from({ length: 30 }, (_, i) => `Item ${i}`);

  const updateParent = useCallback(() => {
    if (!ref.current) return;
    onUpdate({
      activity,
      offset: ref.current.getScrollOffset(),
      total: items.length,
      meta: `Selected: ${selectedIndex}`,
      selectedIndex,
    });
  }, [activity, selectedIndex, onUpdate, items.length]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent, selectedIndex]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;

      setActivity("Select Next loop");
      for (let i = 0; i < 15; i++) {
        if (!isRun) return;
        setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
        await wait(200);
      }

      setActivity("Select Previous");
      for (let i = 0; i < 5; i++) {
        if (!isRun) return;
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        await wait(200);
      }

      setActivity("Select First");
      setSelectedIndex(0);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active, items.length]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="blue"
        height={viewportHeight + 2}
        contentHeight={items.length}
        viewportHeight={viewportHeight}
        scrollOffset={ref.current?.getScrollOffset() ?? 0}
      >
        <ScrollList
          ref={ref}
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
  );
};

// ===================================
// Scene 2: Alignment Demo
// ===================================
const AlignmentScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollListRef>(null);
  const [activity, setActivity] = useState("Ready");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollAlignment, setScrollAlignment] =
    useState<ScrollAlignment>("auto");
  const viewportHeight = 6;
  const items = Array.from({ length: 20 }, (_, i) => `Option ${i}`);

  const updateParent = useCallback(() => {
    if (!ref.current) return;
    onUpdate({
      activity,
      offset: ref.current.getScrollOffset(),
      total: items.length,
      meta: `Idx: ${selectedIndex}`,
      selectedIndex,
    });
  }, [activity, selectedIndex, onUpdate, items.length]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent, selectedIndex]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;

      // Select 10
      setActivity("Select 10 (Auto)");
      setScrollAlignment("auto");
      setSelectedIndex(10);
      await wait(1500);

      if (!isRun) return;
      setActivity("Select 10 (Center)");
      setScrollAlignment("center");
      // Trigger re-scroll by changing alignment
      setSelectedIndex(10);
      await wait(1500);

      if (!isRun) return;
      setActivity("Select 10 (Top)");
      setScrollAlignment("top");
      setSelectedIndex(10);
      await wait(1500);

      if (!isRun) return;
      setActivity("Select 10 (Bottom)");
      setScrollAlignment("bottom");
      setSelectedIndex(10);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="double"
        borderColor="green"
        height={viewportHeight + 2}
        contentHeight={items.length}
        viewportHeight={viewportHeight}
        scrollOffset={ref.current?.getScrollOffset() ?? 0}
      >
        <ScrollList
          ref={ref}
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
  );
};

// ===================================
// Scene 3: Dynamic List Demo
// ===================================
const DynamicScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollListRef>(null);
  const [items, setItems] = useState(["Task A", "Task B", "Task C"]);
  const [activity, setActivity] = useState("Ready");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewportHeight = 8;

  const updateParent = useCallback(() => {
    if (!ref.current) return;
    onUpdate({
      activity,
      offset: ref.current.getScrollOffset(),
      total: items.length,
      meta: `Count: ${items.length}`,
      selectedIndex,
    });
  }, [activity, selectedIndex, items.length, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent, selectedIndex]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;
      setActivity("Add Items");
      setItems((prev) => [...prev, "Task D", "Task E", "Task F"]);

      await wait(1000);
      if (!isRun) return;
      setActivity("Select New Item");
      setSelectedIndex(4); // Select Task E

      await wait(1500);
      if (!isRun) return;
      setActivity("Prepend Item");
      setItems((prev) => ["URGENT Task", ...prev]);
      // Shift selection to keep pointing to same item
      setSelectedIndex((prev) => prev + 1);

      await wait(1000);
      if (!isRun) return;
      setActivity("Go to URGENT");
      setSelectedIndex(0);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="red"
        height={viewportHeight + 2}
        contentHeight={items.length}
        viewportHeight={viewportHeight}
        scrollOffset={ref.current?.getScrollOffset() ?? 0}
      >
        <ScrollList
          ref={ref}
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
  );
};

// ===================================
// Scene 4: Large Items Demo
// ===================================
const LargeItemsScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollListRef>(null);
  const [activity, setActivity] = useState("Ready");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewportHeight = 8;
  const items = Array.from({ length: 10 }, (_, i) => `Large Item ${i}`);

  const updateParent = useCallback(() => {
    if (!ref.current) return;
    onUpdate({
      activity,
      offset: ref.current.getScrollOffset(),
      total: items.length,
      meta: `Selected: ${selectedIndex}`,
      selectedIndex,
    });
  }, [activity, selectedIndex, items.length, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent, selectedIndex]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;
      setActivity("Select Large Item 1");
      setSelectedIndex(1);

      await wait(2000);
      if (!isRun) return;
      setActivity("Select Large Item 2");
      setSelectedIndex(2);

      await wait(2000);
      if (!isRun) return;
      setActivity("Back to Top");
      setSelectedIndex(0);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="yellow"
        height={viewportHeight + 2}
        contentHeight={items.length * 4} // Approx
        viewportHeight={viewportHeight}
        scrollOffset={ref.current?.getScrollOffset() ?? 0}
      >
        <ScrollList
          ref={ref}
          height={viewportHeight}
          selectedIndex={selectedIndex}
        >
          {items.map((item, i) => (
            <Box
              key={i}
              height={4}
              borderStyle="single"
              borderColor={i === selectedIndex ? "yellow" : "gray"}
            >
              <Text color={i === selectedIndex ? "yellow" : "white"}>
                {item} (Height: 4)
                {"\n"}
                Line 2 description
              </Text>
            </Box>
          ))}
        </ScrollList>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene 5: Controlled Mode Demo
// ===================================
const ControlledScene = ({ active, onUpdate }: SceneProps) => {
  const ref = useRef<ScrollListRef>(null);
  const [activity, setActivity] = useState("Ready");
  // Controlled state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewportHeight = 10;
  const items = Array.from({ length: 20 }, (_, i) => `Ctrl Item ${i}`);

  const updateParent = useCallback(() => {
    if (!ref.current) return;
    onUpdate({
      activity,
      offset: ref.current.getScrollOffset(),
      total: items.length,
      meta: `Controlled: ${selectedIndex}`,
      selectedIndex,
    });
  }, [activity, selectedIndex, items.length, onUpdate]);

  useEffect(() => {
    if (active) updateParent();
  }, [active, updateParent, selectedIndex]);

  useEffect(() => {
    if (!active) return;
    let isRun = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      await wait(1000);
      if (!isRun) return;
      setActivity("Set Index = 5");
      setSelectedIndex(5); // External control

      await wait(1500);
      if (!isRun) return;
      setActivity("Set Index = 15");
      setSelectedIndex(15);

      await wait(1500);
      if (!isRun) return;
      setActivity("Set Index = 0");
      setSelectedIndex(0);
    };
    run();
    return () => {
      isRun = false;
    };
  }, [active]);

  return (
    <Box height="100%" width="100%">
      <ScrollBarBox
        borderStyle="single"
        borderColor="magenta"
        height={viewportHeight + 2}
        contentHeight={items.length}
        viewportHeight={viewportHeight}
        scrollOffset={ref.current?.getScrollOffset() ?? 0}
      >
        <ScrollList
          ref={ref}
          height={viewportHeight}
          selectedIndex={selectedIndex}
        >
          {items.map((item, i) => (
            <Box key={i}>
              <Text color={i === selectedIndex ? "magenta" : "white"}>
                {i === selectedIndex ? "● " : "  "} {item}{" "}
                {i === selectedIndex ? "(Controlled)" : ""}
              </Text>
            </Box>
          ))}
        </ScrollList>
      </ScrollBarBox>
    </Box>
  );
};

// ===================================
// Scene Configuration
// ===================================
const SCENES = [
  {
    id: "nav",
    label: "Navigation",
    icon: HiCursorClick,
    description: "Navigate with selectedIndex",
    duration: 6000,
    component: NavigationScene,
    color: THEME.blue,
  },
  {
    id: "align",
    label: "Alignment",
    icon: HiViewColumns,
    description: "Control scroll alignment",
    duration: 6000,
    component: AlignmentScene,
    color: THEME.green,
  },
  {
    id: "dynamic",
    label: "Dynamic Updates",
    icon: HiPlusCircle,
    description: "Robust selection stability",
    duration: 6000,
    component: DynamicScene,
    color: THEME.red,
  },
  {
    id: "large",
    label: "Large Items",
    icon: HiArrowsUpDown,
    description: "Autoscroll large items",
    duration: 6000,
    component: LargeItemsScene,
    color: "#ffd60a",
  },
  {
    id: "controlled",
    label: "Controlled",
    icon: HiCursorClick,
    description: "External property control",
    duration: 5000,
    component: ControlledScene,
    color: "#bf5af2",
  },
];

// ===================================
// Main HeroDemo Component
// ===================================
export default function HeroDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>({
    activity: "Ready",
    offset: 0,
    total: 0,
    selectedIndex: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-cycle and progress effect
  useEffect(() => {
    const duration = SCENES[activeTab].duration;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && document.hidden) return; // Pause if tab hidden
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        setActiveTab((prev) => (prev + 1) % SCENES.length);
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  if (!mounted) {
    return (
      <div className="h-[360px] w-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 animate-pulse flex items-center justify-center">
        <div className="text-slate-600 text-sm">Loading demo...</div>
      </div>
    );
  }

  const ActiveComponent = SCENES[activeTab].component;
  const activeScene = SCENES[activeTab];

  return (
    <>
      <div className="w-full flex flex-col rounded-xl overflow-hidden font-mono text-sm shadow-xl border border-gray-200 dark:border-[#2a2a3a] bg-white dark:bg-[#12121a]">
        {/* ========== Header ========== */}
        <div className="h-10 flex items-center px-4 select-none bg-gray-50 dark:bg-[#1a1a25] border-b border-gray-200 dark:border-[#2a2a3a]">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>

          {/* Title: Current Demo Name with Gradient */}
          <div className="flex-1 text-center">
            <span
              className="font-bold text-sm tracking-wide text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(90deg, ${THEME.blue}, ${THEME.green}, ${THEME.red})`,
              }}
            >
              {activeScene.label}
            </span>
          </div>

          {/* Step Indicator */}
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            {activeTab + 1}/{SCENES.length}
          </div>
        </div>

        {/* ========== Progress Bar ========== */}
        <div className="h-[2px] relative bg-gray-200 dark:bg-[#2a2a3a]">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${THEME.blue}, ${THEME.green}, ${THEME.red})`,
            }}
          />
        </div>

        {/* ========== Main Content ========== */}
        <div
          className="flex-1 relative overflow-hidden p-3"
          style={{ background: THEME.dark, minHeight: "280px" }}
        >
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(${THEME.textMuted} 1px, transparent 1px), linear-gradient(90deg, ${THEME.textMuted} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Canvas */}
          <div className="relative z-10 h-full rounded-lg overflow-hidden border border-[#2a2a3a]">
            <InkCanvas>
              <ActiveComponent active={true} onUpdate={setDemoState} />
            </InkCanvas>
          </div>
        </div>

        {/* ========== Footer Status Bar ========== */}
        <div
          className="h-6 flex items-center px-3 text-[10px] select-none"
          style={{
            background: `linear-gradient(90deg, ${THEME.blue}dd, ${THEME.green}cc, ${THEME.red}bb)`,
          }}
        >
          {/* Left: Activity */}
          <div className="flex-1 flex items-center gap-2 text-white">
            <span className="font-bold uppercase tracking-wider">
              {demoState.activity}
            </span>
            {demoState.meta && (
              <>
                <span className="opacity-30">│</span>
                <span className="opacity-80">{demoState.meta}</span>
              </>
            )}
          </div>

          {/* Right: Position */}
          <div className="flex items-center gap-2 text-white/70">
            <span>Offset {demoState.offset}</span>
            <span className="opacity-30">│</span>
            <span>Idx {demoState.selectedIndex ?? "-"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
