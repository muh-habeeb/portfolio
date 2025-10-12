"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveUrl?: string;
  codeUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-full group hover-lift">
                <Card className="h-full border-2 border-transparent hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:scale-105 hover:-translate-y-2">
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Hover Action Buttons */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative z-30"
                          >
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400 hover:border-blue-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-200 pointer-events-auto relative z-30"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </Button>
                          </a>
                        )}
                        {project.codeUrl && (
                          <a 
                            href={project.codeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative z-30"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-900/80 border-2 border-gray-600 hover:border-gray-400 text-white hover:bg-gray-800 shadow-lg transform hover:scale-110 transition-all duration-200 pointer-events-auto relative z-30"
                            >
                              <Github className="w-4 h-4 mr-2" />
                              View Code
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-full border border-blue-200 dark:border-blue-700 group-hover:shadow-sm transition-shadow duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white"
            >
              Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-full hover-lift">
                    <Card className="h-full border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:scale-105 hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-800 dark:text-purple-200 text-xs rounded border border-purple-200 dark:border-purple-700"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-300 dark:border-gray-600">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-600 dark:hover:border-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200 hover:scale-105"
                              asChild
                            >
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Live
                              </a>
                            </Button>
                          )}
                          {project.codeUrl && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-400 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
                              asChild
                            >
                              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3 mr-1" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}