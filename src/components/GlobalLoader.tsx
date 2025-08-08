import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export function GlobalLoader({ fullScreen = false, text = "Loading..." }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" : ""
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
