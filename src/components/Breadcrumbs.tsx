import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  const capitalizeAndFormat = (str: string) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
    >
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/${pathSegments.slice(0, index + 1).join("/")}`}
            className={cn(
              "hover:text-primary transition-colors",
              index === pathSegments.length - 1 && "text-foreground font-medium"
            )}
          >
            {capitalizeAndFormat(segment)}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
