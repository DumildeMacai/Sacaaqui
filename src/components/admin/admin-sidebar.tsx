
"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, CreditCard, Lightbulb, LayoutDashboard, Home } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/atms", label: "ATMs", icon: CreditCard },
    { href: "/admin/users", label: "Usuários", icon: Users },
    { href: "/admin/suggestions", label: "Sugestões", icon: Lightbulb },
    { href: "/dashboard", label: "Painel do Utilizador", icon: Home },
  ]

  return (
    <nav className="flex flex-col gap-2 p-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            target={href === '/dashboard' ? '_blank' : '_self'}
            rel={href === '/dashboard' ? 'noopener noreferrer' : ''}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname.startsWith(href) && href !== '/dashboard' && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
    </nav>
  )
}
