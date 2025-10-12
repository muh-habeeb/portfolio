"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

export default function Home() {
  const projects = useQuery(api.public.getProjects) || [];
  const skills = useQuery(api.public.getSkills) || [];
  const experience = useQuery(api.public.getExperience) || [];
  const personalInfo = useQuery(api.public.getSettings, { key: "personal_info" });
  const socialLinks = useQuery(api.public.getSettings, { key: "social_links" });

  return (
    <main className="min-h-screen">
      <FloatingThemeToggle />
      <Hero personalInfo={personalInfo} />
      <About personalInfo={personalInfo} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Experience experience={experience} />
      <Contact personalInfo={personalInfo} socialLinks={socialLinks} />
    </main>
  );
}
