"use client";

import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Mail, FolderOpen, Code, Settings, Users } from "lucide-react";

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
    const contactMessages = useQuery(api.admin.getContactMessages) || [];

    return (
        <><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminPages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname === page.href;

                return (
                    <Link key={page.href} href={page.href} rel="noopener noreferrer">
                        <Card className={`cursor-pointer transition-all duration-200  bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all${isActive
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                            <CardContent className="p-6 text-center">
                                <Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`} />
                                <h3 className={`font-medium mb-2 ${isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"}`}>
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
        </div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                <Card className="bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle>Experience</CardTitle>
                        <CardDescription>Edit work and education history</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full" asChild>
                            <a href="/admin/experience">
                                <Edit className="w-4 h-4 mr-2" />
                                Manage Experience
                            </a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="/admin/experience/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Experience
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle>Contact Messages</CardTitle>
                        <CardDescription>View and respond to inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <a href="/admin/messages">
                                <Mail className="w-4 h-4 mr-2" />
                                View Messages ({contactMessages.filter(m => m.status === "new").length} new)
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Update personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <a href="/admin/settings">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Settings
                            </a>
                        </Button>
                    </CardContent>
                </Card>
                {/*
           <Card className="bg-transparent shadow-none hover:bg-sky-900/50 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>Preview Site</CardTitle>
                <CardDescription>View your live portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    View Live Site
                  </a>
                </Button>
              </CardContent>
            </Card> */}
            </div></>
    );
}