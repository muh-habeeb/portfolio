import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingProjects = await ctx.db.query("projects").collect();
    const existingSkills = await ctx.db.query("skills").collect();
    const existingExperience = await ctx.db.query("experience").collect();
    const existingSettings = await ctx.db.query("settings").collect();

    // // Delete existing data
    // for (const project of existingProjects) {
    //   await ctx.db.delete(project._id);
    // }
    // for (const skill of existingSkills) {
    //   await ctx.db.delete(skill._id);
    // }
    // for (const exp of existingExperience) {
    //   await ctx.db.delete(exp._id);
    // }
    // for (const setting of existingSettings) {
    //   await ctx.db.delete(setting._id);
    // }

    const now = Date.now();

    // Seed Projects
    const projects = [
      {
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution with payment integration",
        longDescription: "A complete e-commerce platform built with Next.js, featuring user authentication, product catalog, shopping cart, and Stripe payment integration. Includes admin dashboard for inventory management.",
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
        liveUrl: "https://demo-ecommerce.vercel.app",
        codeUrl: "https://github.com/yourusername/ecommerce-platform",
        imageUrl: "/projects/ecommerce.jpg",
        featured: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Task Management App",
        description: "Collaborative task management with real-time updates",
        longDescription: "A collaborative task management application with real-time synchronization, drag-and-drop kanban boards, team collaboration features, and deadline tracking.",
        techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
        liveUrl: "https://task-manager-demo.vercel.app",
        codeUrl: "https://github.com/yourusername/task-manager",
        imageUrl: "/projects/taskmanager.jpg",
        featured: true,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Weather Dashboard",
        description: "Beautiful weather app with location-based forecasts",
        longDescription: "A responsive weather dashboard that provides current weather conditions and 7-day forecasts. Features location detection, weather maps, and detailed meteorological data visualization.",
        techStack: ["Vue.js", "OpenWeather API", "Chart.js", "CSS3"],
        liveUrl: "https://weather-dashboard-demo.vercel.app",
        codeUrl: "https://github.com/yourusername/weather-dashboard",
        imageUrl: "/projects/weather.jpg",
        featured: false,
        order: 3,
        createdAt: now,
        updatedAt: now,
      }
    ];

    for (const project of projects) {
      await ctx.db.insert("projects", project);
    }

    // Seed Skills
    const skills = [
      // Frontend
      { name: "JavaScript", category: "frontend", level: 5, icon: "js", order: 1, createdAt: now, updatedAt: now },
      { name: "TypeScript", category: "frontend", level: 5, icon: "ts", order: 2, createdAt: now, updatedAt: now },
      { name: "React", category: "frontend", level: 5, icon: "react", order: 3, createdAt: now, updatedAt: now },
      { name: "Next.js", category: "frontend", level: 4, icon: "nextjs", order: 4, createdAt: now, updatedAt: now },
      { name: "Vue.js", category: "frontend", level: 4, icon: "vue", order: 5, createdAt: now, updatedAt: now },
      { name: "Tailwind CSS", category: "frontend", level: 5, icon: "tailwind", order: 6, createdAt: now, updatedAt: now },
      
      // Backend
      { name: "Node.js", category: "backend", level: 4, icon: "nodejs", order: 7, createdAt: now, updatedAt: now },
      { name: "Python", category: "backend", level: 4, icon: "python", order: 8, createdAt: now, updatedAt: now },
      { name: "Express.js", category: "backend", level: 4, icon: "express", order: 9, createdAt: now, updatedAt: now },
      { name: "FastAPI", category: "backend", level: 3, icon: "fastapi", order: 10, createdAt: now, updatedAt: now },
      
      // Database
      { name: "PostgreSQL", category: "database", level: 4, icon: "postgresql", order: 11, createdAt: now, updatedAt: now },
      { name: "MongoDB", category: "database", level: 4, icon: "mongodb", order: 12, createdAt: now, updatedAt: now },
      { name: "Redis", category: "database", level: 3, icon: "redis", order: 13, createdAt: now, updatedAt: now },
      
      // Tools
      { name: "Git", category: "tools", level: 5, icon: "git", order: 14, createdAt: now, updatedAt: now },
      { name: "Docker", category: "tools", level: 3, icon: "docker", order: 15, createdAt: now, updatedAt: now },
      { name: "AWS", category: "tools", level: 3, icon: "aws", order: 16, createdAt: now, updatedAt: now },
    ];

    for (const skill of skills) {
      await ctx.db.insert("skills", skill);
    }

    // Seed Experience
    const experience = [
      {
        type: "work" as const,
        title: "Senior Full Stack Developer",
        organization: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01",
        endDate: undefined,
        current: true,
        description: "Leading development of scalable web applications using modern JavaScript frameworks. Architecting microservices and implementing CI/CD pipelines.",
        highlights: [
          "Led a team of 5 developers in building a customer portal that increased user engagement by 40%",
          "Implemented automated testing strategies that reduced bugs by 60%",
          "Optimized application performance resulting in 50% faster load times"
        ],
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "work" as const,
        title: "Full Stack Developer",
        organization: "Digital Solutions LLC",
        location: "New York, NY",
        startDate: "2020-03",
        endDate: "2021-12",
        current: false,
        description: "Developed and maintained full-stack applications using React, Node.js, and PostgreSQL. Collaborated with design and product teams to deliver user-centric solutions.",
        highlights: [
          "Built responsive web applications serving 10,000+ daily active users",
          "Integrated third-party APIs and payment systems",
          "Mentored junior developers and conducted code reviews"
        ],
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "work" as const,
        title: "Frontend Developer",
        organization: "StartupXYZ",
        location: "Austin, TX",
        startDate: "2018-06",
        endDate: "2020-02",
        current: false,
        description: "Focused on creating exceptional user experiences with React and modern CSS. Worked closely with UX designers to implement pixel-perfect designs.",
        highlights: [
          "Developed mobile-first responsive designs",
          "Improved website accessibility to WCAG 2.1 AA standards",
          "Reduced bundle size by 30% through code optimization"
        ],
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: "education" as const,
        title: "Bachelor of Science in Computer Science",
        organization: "University of Technology",
        location: "Boston, MA",
        startDate: "2014-08",
        endDate: "2018-05",
        current: false,
        description: "Comprehensive computer science education with focus on software engineering, algorithms, and data structures. Graduated Magna Cum Laude.",
        highlights: [
          "GPA: 3.8/4.0",
          "Dean's List for 6 semesters",
          "Senior project: Machine learning recommendation system"
        ],
        order: 4,
        createdAt: now,
        updatedAt: now,
      }
    ];

    for (const exp of experience) {
      await ctx.db.insert("experience", exp);
    }

    // Seed Settings
    const settings = [
      {
        key: "personal_info",
        value: {
          name: "John Doe",
          title: "Full Stack Developer",
          bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating beautiful, functional, and user-friendly digital experiences.",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          avatarUrl: "/avatar.jpg",
          resumeUrl: "/resume.pdf"
        },
        updatedAt: now,
      },
      {
        key: "social_links",
        value: {
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
          twitter: "https://twitter.com/johndoe",
          website: "https://johndoe.dev"
        },
        updatedAt: now,
      },
      {
        key: "contact_settings",
        value: {
          adminEmail: "admin@johndoe.dev",
          autoReply: true,
          autoReplyMessage: "Thank you for your message! I'll get back to you within 24 hours."
        },
        updatedAt: now,
      },
      {
        key: "site_settings",
        value: {
          title: "John Doe - Full Stack Developer",
          description: "Portfolio of John Doe, a passionate full-stack developer specializing in modern web technologies.",
          keywords: ["full stack developer", "react", "next.js", "typescript", "web development"],
          ogImage: "/og-image.jpg"
        },
        updatedAt: now,
      }
    ];

    for (const setting of settings) {
      await ctx.db.insert("settings", setting);
    }

    return { message: "Database seeded successfully!" };
  },
});