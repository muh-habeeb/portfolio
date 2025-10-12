/**
 * Home Page Component
 * 
 * The main portfolio page that displays all sections:
 * - Hero section with name, title, and CTA buttons
 * - About section with personal information
 * - Projects showcase with featured and other projects
 * - Skills section with technical abilities
 * - Experience section with work history
 * - Contact form for inquiries
 * - Floating theme toggle for dark/light mode switching
 * 
 * Data is fetched from Convex database using real-time queries
 */

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
  // Fetch all necessary data from Convex database
  const projects = useQuery(api.public.getProjects) || [];
  const skills = useQuery(api.public.getSkills) || [];
  const experience = useQuery(api.public.getExperience) || [];
  const personalInfo = useQuery(api.public.getSettings, { key: "personal_info" });
  const socialLinks = useQuery(api.public.getSocialLinks) || [];

  return (
    <main className="min-h-screen">
      {/* Floating theme toggle button */}
      <FloatingThemeToggle />
      
      {/* Hero section - Introduction and main CTA */}
      <Hero personalInfo={personalInfo} />
      
      {/* About section - Personal information and bio */}
      <About personalInfo={personalInfo} />
      
      {/* Projects section - Portfolio showcase */}
      <Projects projects={projects} />
      
      {/* Skills section - Technical abilities */}
      <Skills skills={skills} />
      
      {/* Experience section - Work history */}
      <Experience experience={experience} />
      
      {/* Contact section - Contact form and information */}
      <Contact personalInfo={personalInfo} socialLinks={socialLinks} />
    </main>
  );
}
