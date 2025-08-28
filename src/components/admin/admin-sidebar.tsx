
"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CreditCard, Lightbulb } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin/panel", label: "Dashboard", icon: Home },
    { href: "/admin/atms", label: "ATMs", icon: CreditCard },
    { href: "/admin/users", label: "Usuários", icon: Users },
    { href: "/admin/suggestions", label: "Sugestões", icon: Lightbulb },
  ]

  return (
    <nav className="flex flex-col gap-2 p-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname.startsWith(href) && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
    </nav>
  )
}
