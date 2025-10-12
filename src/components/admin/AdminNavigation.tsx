"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, FolderOpen, Code, Users } from "lucide-react";

const adminPages = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Manage profile and social links"
  },
  {
    name: "Projects",
    href: "/admin/projects", 
    icon: FolderOpen,
    description: "Add and edit your projects"
  },
  {
    name: "Skills",
    href: "/admin/skills",
    icon: Code,
    description: "Manage skills and custom icons"
  },
  {
    name: "Social Links",
    href: "/admin/social",
    icon: Users,
    description: "Customize social media icons"
  }
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {adminPages.map((page) => {
        const Icon = page.icon;
        const isActive = pathname === page.href;
        
        return (
          <Link key={page.href} href={page.href}>
            <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isActive 
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950" 
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}>
              <CardContent className="p-6 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${
                  isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                }`} />
                <h3 className={`font-medium mb-2 ${
                  isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"
                }`}>
                  {page.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {page.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}