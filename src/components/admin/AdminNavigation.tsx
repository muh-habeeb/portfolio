"use client";

import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Mail,
  FolderOpen,
  Code,
  Settings,
  Users,
  Briefcase,
  GraduationCap,
  Eye,
} from "lucide-react";

const adminPages = [
  {
    name: "Settings",
    href: "/admin/settings",
    target: "_self",
    icon: Settings,
    description: "Manage profile and social links",
    otherInfo: ""
  },
  {
    name: "Projects",
    href: "/admin/projects",
    target: "_self",
    icon: FolderOpen,
    description: "Add and edit your projects",
    otherInfo: ""
  },
  {
    name: "Skills",
    href: "/admin/skills",
    target: "_self",
    icon: Code,
    description: "Manage skills and custom icons",
    otherInfo: ""
  },
  {
    name: "Work Experience",
    href: "/admin/work-experience",
    target: "_self",
    icon: Briefcase,
    description: "Manage professional experience",
    otherInfo: ""
  },
  {
    name: "Education",
    href: "/admin/education",
    target: "_self",
    icon: GraduationCap,
    description: "Manage educational background",
    otherInfo: ""
  },
  {
    name: "Messages",
    href: "/admin/messages",
    target: "_self",
    icon: Mail,
    description: "Manage contact messages",
    otherInfo: ""
  },
  {
    name: "Social Links",
    href: "/admin/social",
    target: "_self",
    icon: Users,
    description: "Customize social media icons",
    otherInfo: ""
  },
  {
    name: "Preview Site",
    href: "/",
    target: "_blank",
    icon: Eye,
    description: "View your live portfolio",
    otherInfo: ""
  }
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const contactMessages = useQuery(api.admin.getContactMessages) || [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminPages.map((page) => {
          const Icon = page.icon;
          const isActive = pathname === page.href;
          const otherInfo =
            page.name === "Messages"
              ? `${contactMessages.filter((m) => m.status === "new").length}`
              : page.otherInfo;

          return (
            <Link key={page.href} href={page.href} rel="noopener noreferrer " target={page.target}>
              <Card
                className={`cursor-pointer duration-200  bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all ${
                  isActive
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <CardContent className="p-6 text-center relative">
                  <Icon
                    className={`relative w-8 h-8 mx-auto mb-3 ${isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-400 hover:text-white"}`}
                  />
                  <span className="capitalize text-sm text-gray-600 dark:text-green-500  absolute top-3 right-[45%] translate-x-1/2">
                    {otherInfo}
                    </span>
                  <h3
                    className={`font-medium mb-2 ${isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"}`}
                  >
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
      <hr className="my-8 h-1 bg-gray-200 dark:bg-gray-700" />
    </>
  );
}
