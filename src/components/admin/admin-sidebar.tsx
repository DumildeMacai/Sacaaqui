"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CreditCard } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin/panel", label: "Dashboard", icon: Home },
    { href: "/admin/atms", label: "ATMs", icon: CreditCard },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ]

  return (
    <div className="p-4 w-60 border-r bg-background h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">Macai</h1>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
              pathname === href
                ? "bg-muted text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

