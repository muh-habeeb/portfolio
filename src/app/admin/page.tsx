"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Mail, FolderOpen, Code } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { PiSuitcaseSimple } from "react-icons/pi";
import Link from "next/link";

export default function AdminDashboard() {
  const projects = useQuery(api.public.getProjects) || [];
  const skills = useQuery(api.public.getSkills) || [];
  const experience = useQuery(api.public.getExperience) || [];
  const contactMessages = useQuery(api.admin.getContactMessages) || [];

  const stats = [
    { name: "Projects", value: projects.length, icon: <FolderOpen /> },
    { name: "Skills", value: skills.length, icon: <Code /> },
    { name: "Experience", value: experience.length, icon: <PiSuitcaseSimple /> },
    { name: "Messages", value: contactMessages.length, icon: <Mail /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your portfolio content and view analytics.
        </p>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} >
            <CardHeader className=" flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <span className="w-full  bg-slate-700 h-0.5 rounded-4xl"></span>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Navigation Links */}

      <h1 className="text-2xl font-bold"> Quick Actions</h1>
      <AdminNavigation />

      {/* Quick Actions */}


      {/* Recent Messages */}
      {contactMessages.length > 0 && (
        <Card >
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              {contactMessages.slice(0, 5).map((message) => (
                <div
                  key={message._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {message.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      {message.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md">
                      {message.message}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${message.status === "new"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : message.status === "read"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                    >
                      <p className="capitalize">{message.status}</p>
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link  href={`/admin/messages/${message._id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {contactMessages.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/admin/messages">View All Messages</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}