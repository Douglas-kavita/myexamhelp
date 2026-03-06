"use client";

import { ReactNode } from "react";

export default function OpenChatButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-chat"))}
    >
      {children}
    </button>
  );
}