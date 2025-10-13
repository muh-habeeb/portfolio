
/**
|--------------------------------------------------
| this page is for managing the project and configurations

|--------------------------------------------------
*/

"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "@/components/ui/image-upload";
import Link from "next/link";

// Add this interface for the project type
interface Project {
    _id: Id<"projects">;
    title: string;
    description: string;
    longDescription?: string;
    techStack: string[];
    liveUrl?: string;
    codeUrl?: string;
    imageUrl?: string;
    featured: boolean;
    order: number;
    createdAt: number;
    updatedAt: number;
}

const projectSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    longDescription: z.string().optional(),
    techStack: z.string().min(1, "Please add at least one technology"),
    liveUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    codeUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    featured: z.boolean(),
    order: z.number().min(0),
});

type ProjectData = z.infer<typeof projectSchema>;

export default function AdminProjects() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [projectImage, setProjectImage] = useState<string>("");
    const [showForm, setShowForm] = useState(false);

    const projects = useQuery(api.public.getProjects) || [];
    const createProject = useMutation(api.admin.createProject);
    const updateProject = useMutation(api.admin.updateProject);
    const deleteProject = useMutation(api.admin.deleteProject);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProjectData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            longDescription: "",
            techStack: "",
            liveUrl: "",
            codeUrl: "",
            featured: false,
            order: projects.length,
        },
    });

    const onSubmit = async (data: ProjectData) => {
        setIsSubmitting(true);
        try {
            const techStackArray = data.techStack.split(',').map(tech => tech.trim()).filter(Boolean);

            const projectData = {
                title: data.title,
                description: data.description,
                longDescription: data.longDescription || undefined,
                techStack: techStackArray,
                liveUrl: data.liveUrl || undefined,
                codeUrl: data.codeUrl || undefined,
                imageUrl: projectImage || undefined,
                featured: data.featured,
                order: data.order,
            };

            if (editingProject) {
                await updateProject({
                    id: editingProject._id as Id<"projects">,
                    ...projectData,
                });
                toast.success("Project updated successfully!");
                setEditingProject(null);
            } else {
                await createProject(projectData);
                toast.success("Project created successfully!");
            }

            reset();
            setProjectImage("");
            setShowForm(false);
        } catch (error) {
            toast.error("Failed to save project");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setProjectImage(project.imageUrl || "");
        setValue("title", project.title);
        setValue("description", project.description);
        setValue("longDescription", project.longDescription || "");
        setValue("techStack", project.techStack.join(", "));
        setValue("liveUrl", project.liveUrl || "");
        setValue("codeUrl", project.codeUrl || "");
        setValue("featured", project.featured);
        setValue("order", project.order);
        setShowForm(true);
    };

    const handleDelete = async (projectId: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProject({ id: projectId as Id<"projects"> });
                toast.success("Project deleted successfully!");
            } catch (error) {
                toast.error("Failed to delete project");
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        reset();
        setProjectImage("");
        setEditingProject(null);
        setShowForm(false);
    };

    const handleImageUpload = (imageUrl: string) => {
        setProjectImage(imageUrl);
    };

    const handleImageRemove = () => {
        setProjectImage("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage your portfolio projects.
                        </p>
                    </div>
                </div>

                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                    </Button>
                )}
            </div>


            {/* Projects List */}
            <div className="grid gap-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Existing Projects ({projects.length})
                </h3>
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                No projects yet. Create your first project to get started!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card key={project._id} className="overflow-hidden">
                                {project.imageUrl && (
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            {project.featured && (
                                                <Badge className="bg-blue-600">Featured</Badge>
                                            )}
                                            <Badge className="bg-gray-600">Order: {project.order}</Badge>
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg flex-1">{project.title}</CardTitle>
                                        {!project.imageUrl && (
                                            <div className="flex gap-1 ml-2">
                                                {project.featured && (
                                                    <Badge className="bg-blue-600 text-xs">Featured</Badge>
                                                )}
                                                <Badge className="bg-gray-600 text-xs">#{project.order}</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription className="text-sm">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex flex-wrap gap-1">
                                        {project.techStack.slice(0, 3).map((tech) => (
                                            <Badge key={tech} variant="secondary" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{project.techStack.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(project)}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(project._id)}
                                        >
                                            <Trash className="w-3 h-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Add/Edit Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editingProject ? "Edit Project" : "Add New Project"}
                        </CardTitle>
                        <CardDescription>
                            {editingProject
                                ? "Update the project information and image."
                                : "Create a new project for your portfolio."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Project Image Upload */}
                            <div className="space-y-2">
                                <Label>Project Image</Label>
                                <ImageUpload
                                    section="projects"
                                    currentImage={projectImage}
                                    onImageUpload={handleImageUpload}
                                    onImageRemove={handleImageRemove}
                                    width={400}
                                    height={250}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input
                                        id="title"
                                        {...register("title")}
                                        placeholder="My Awesome Project"
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        {...register("order", { valueAsNumber: true })}
                                        placeholder="0"
                                        className={errors.order ? "border-red-500" : ""}
                                    />
                                    {errors.order && (
                                        <p className="text-sm text-red-500">{errors.order.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="A brief description of your project..."
                                    rows={2}
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longDescription">Detailed Description (Optional)</Label>
                                <Textarea
                                    id="longDescription"
                                    {...register("longDescription")}
                                    placeholder="A detailed description of your project, features, challenges, etc..."
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="techStack">Technologies (comma-separated)</Label>
                                <Input
                                    id="techStack"
                                    {...register("techStack")}
                                    placeholder="React, Node.js, MongoDB, TypeScript"
                                    className={errors.techStack ? "border-red-500" : ""}
                                />
                                {errors.techStack && (
                                    <p className="text-sm text-red-500">{errors.techStack.message}</p>
                                )}
                                <div className="text-sm text-gray-500">
                                    Preview: {watch("techStack")?.split(',').filter(Boolean).map(tech => tech.trim()).slice(0, 5).map((tech, i) => (
                                        <Badge key={i} variant="secondary" className="mr-1 mb-1">{tech}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="liveUrl">Live URL (Optional)</Label>
                                    <Input
                                        id="liveUrl"
                                        {...register("liveUrl")}
                                        placeholder="https://myproject.com"
                                        className={errors.liveUrl ? "border-red-500" : ""}
                                    />
                                    {errors.liveUrl && (
                                        <p className="text-sm text-red-500">{errors.liveUrl.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codeUrl">Code URL (Optional)</Label>
                                    <Input
                                        id="codeUrl"
                                        {...register("codeUrl")}
                                        placeholder="https://github.com/user/repo"
                                        className={errors.codeUrl ? "border-red-500" : ""}
                                    />
                                    {errors.codeUrl && (
                                        <p className="text-sm text-red-500">{errors.codeUrl.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={watch("featured")}
                                    onCheckedChange={(checked: boolean) => setValue("featured", !!checked)}
                                />
                                <Label htmlFor="featured">Featured Project</Label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {editingProject ? "Update Project" : "Create Project"}
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}