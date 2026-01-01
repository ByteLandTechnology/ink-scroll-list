"use client";

/**
 * @file GuidedDemo.tsx
 * @description Guided interactive demo for ink-scroll-list
 *
 * Compact, step-by-step guided demonstration of ink-scroll-list features.
 */

import "ink-canvas/shims/process";
import { useState, useEffect } from "react";
import React from "react";
import { THEME } from "./demos/shared";
import pkg from "ink-scroll-list/package.json";

// Imported Demos
import NavigationDemo from "./demos/NavigationDemo";
import AlignmentDemo from "./demos/AlignmentDemo";
import DynamicItemsDemo from "./demos/DynamicItemsDemo";
import ViewportDemo from "./demos/ViewportDemo";
import ScrollConstraintDemo from "./demos/ScrollConstraintDemo";

const { version } = pkg;

// ===================================
// Main Component
// ===================================
const DEMO_SECTIONS = [
  {
    id: "nav",
    title: "Navigation",
    desc: "Controlled selection",
    component: NavigationDemo,
  },
  {
    id: "align",
    title: "Alignment",
    desc: "Scroll positioning",
    component: AlignmentDemo,
  },
  {
    id: "constraint",
    title: "Constraints",
    desc: "Scroll limits",
    component: ScrollConstraintDemo,
  },
  {
    id: "dynamic",
    title: "Dynamic",
    desc: "Add/Remove items",
    component: DynamicItemsDemo,
  },
  {
    id: "viewport",
    title: "Viewport",
    desc: "Resizing behavior",
    component: ViewportDemo,
  },
];

export default function GuidedDemo() {
  const [activeSection, setActiveSection] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[360px] w-full rounded-xl bg-slate-900 animate-pulse" />
    );
  }

  const ActiveComponent = DEMO_SECTIONS[activeSection].component;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121a]">
      {/* Header Tabs */}
      <div className="flex overflow-x-auto border-b no-scrollbar border-gray-200 dark:border-[#2a2a3a] bg-gray-50 dark:bg-[#1a1a25]">
        {DEMO_SECTIONS.map((section, idx) => {
          const isActive = idx === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(idx)}
              className="flex-1 min-w-[120px] px-4 py-3 flex flex-col items-center gap-1 transition-colors relative hover:bg-gray-100 dark:hover:bg-gray-800/50"
            >
              <div
                className={`text-sm font-medium ${
                  isActive
                    ? "text-blue-600 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {section.title}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                {section.desc}
              </div>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: THEME.blue }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Demo Content */}
      <div className="p-4 bg-white dark:bg-[#12121a]">
        <ActiveComponent />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t text-[10px] flex justify-between border-gray-200 dark:border-[#2a2a3a] text-gray-400 dark:text-[#8888a0]">
        <span>
          Controlled component: manage selection via selectedIndex prop.
        </span>
        <span>ink-scroll-list v{version}</span>
      </div>
    </div>
  );
}
