"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaComputer } from "react-icons/fa6";
import { useState, useRef } from "react";

interface PersonalInfo {
    name: string;
    bio: string;
    avatarUrl: string;
    location: string;
}

interface AboutProps {
    personalInfo: PersonalInfo | null;
}

export default function About({ personalInfo }: AboutProps) {
    const [transform, setTransform] = useState('');
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current || window.innerWidth <= 600) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -15;
        const rotateY = (x - centerX) / centerX * 15;
        
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    };

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
                            <div 
                                ref={imageRef}
                                className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-shadow duration-300"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <div 
                                    className="w-full h-full relative"
                                    style={{
                                        transform: transform,
                                        transition: 'transform 0.1s ease-out'
                                    }}
                                >
                                    {/* Gradient overlay for depth */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none z-10"></div>
                                    
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
                                    
                                    <Image
                                        alt={personalInfo?.name || "Profile"}
                                        src={personalInfo?.avatarUrl || "/images/profile/avatar.jpg"}
                                        fill
                                        className="object-cover filter brightness-110 contrast-105 select-none pointer-none:"
                                        priority
                                    />
                                </div>
                                
                                {/* Floating glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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