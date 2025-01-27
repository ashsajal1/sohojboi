"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        className="hidden dark:flex "
        onClick={() => setTheme("light")}
        variant="outline"
        size="icon"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Button
        className="dark:hidden"
        onClick={() => setTheme("dark")}
        variant="outline"
        size="icon"
      >
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
