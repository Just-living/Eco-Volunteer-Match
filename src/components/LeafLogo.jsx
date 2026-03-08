import React from "react";

export default function LeafLogo({ size = 54, strokeWidth = 2.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M48.5 10.5C36 11 25 19 20 29.5c-4.5 9.7-1.5 20.4 7 25.8 9.6 6.1 22.8 1.3 28.3-10.6 4.7-10.2 3.2-27.2-6.8-34.2z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 52c6.5-12.5 17.5-18 31-22"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M30 34c2.5 3 8 4 14.5 0"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
