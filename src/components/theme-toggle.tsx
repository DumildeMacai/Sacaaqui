
"use client"

import * as React from "react"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  )
}
