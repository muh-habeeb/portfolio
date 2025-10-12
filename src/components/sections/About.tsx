"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaComputer } from "react-icons/fa6";

interface PersonalInfo {
    name: string;
    bio: string;
    avatarUrl?: string;
    location?: string;
}

interface AboutProps {
    personalInfo: PersonalInfo | null;
}

export default function About({ personalInfo }: AboutProps) {
    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
                        About Me
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={personalInfo?.avatarUrl || "/avatar.jpg"}
                                    alt={personalInfo?.name || "Profile"}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {personalInfo?.bio || "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating beautiful, functional, and user-friendly digital experiences."}
                            </p>

                            {personalInfo?.location && (
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}

                            <div className="pt-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    What I Do
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-3xl mb-2">🎨</div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">UI/UX Design</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-3xl mb-2 text-center flex items-center justify-center"><FaComputer className="text-center" />  </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Frontend Dev</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-3xl mb-2">⚙️</div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend Dev</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-3xl mb-2">☁️</div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Services</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}