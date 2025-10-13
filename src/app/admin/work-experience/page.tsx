"use client";

import { useState } from "react";
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
import { Save, ArrowLeft, Plus, Edit, Trash, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

interface WorkExperience {
  _id: Id<"experience">;
  type: "work" | "education";
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights?: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

const workExperienceSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  organization: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  highlights: z.string().optional(),
  order: z.number().min(0),
});

type WorkExperienceData = z.infer<typeof workExperienceSchema>;

export default function AdminWorkExperience() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const workExperience = useQuery(api.public.getWorkExperience) || [];
  const createExperience = useMutation(api.admin.createExperience);
  const updateExperience = useMutation(api.admin.updateExperience);
  const deleteExperience = useMutation(api.admin.deleteExperience);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WorkExperienceData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      title: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: "",
      order: workExperience.length,
    },
  });

  const watchCurrent = watch("current");

  const onSubmit = async (data: WorkExperienceData) => {
    setIsSubmitting(true);
    try {
      const highlightsArray = data.highlights
        ? data.highlights.split('\n').map(h => h.trim()).filter(Boolean)
        : undefined;
      
      const experienceData = {
        type: "work" as const,
        title: data.title,
        organization: data.organization,
        location: data.location || undefined,
        startDate: data.startDate,
        endDate: data.current ? undefined : (data.endDate || undefined),
        current: data.current,
        description: data.description,
        highlights: highlightsArray,
        order: data.order,
      };

      if (editingExperience) {
        await updateExperience({
          id: editingExperience._id,
          ...experienceData,
        });
        toast.success("Work experience updated successfully!");
        setEditingExperience(null);
      } else {
        await createExperience(experienceData);
        toast.success("Work experience created successfully!");
      }

      reset();
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save work experience");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingExperience(exp);
    setShowForm(true);
    
    // Fill form with existing data
    setValue("title", exp.title);
    setValue("organization", exp.organization);
    setValue("location", exp.location || "");
    setValue("startDate", exp.startDate);
    setValue("endDate", exp.endDate || "");
    setValue("current", exp.current);
    setValue("description", exp.description);
    setValue("highlights", exp.highlights?.join('\n') || "");
    setValue("order", exp.order);
  };

  const handleDelete = async (id: Id<"experience">) => {
    if (confirm("Are you sure you want to delete this work experience?")) {
      try {
        await deleteExperience({ id });
        toast.success("Work experience deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete work experience");
        console.error(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingExperience(null);
    setShowForm(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Work Experience</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your professional work experience and career history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              {editingExperience ? "Edit Work Experience" : "Add New Work Experience"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Senior Developer, Marketing Manager, etc."
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organization">Company</Label>
                  <Input
                    id="organization"
                    {...register("organization")}
                    placeholder="Tech Company Inc."
                    className={errors.organization ? "border-red-500" : ""}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">{errors.organization.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="month"
                    {...register("startDate")}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    {...register("endDate")}
                    disabled={watchCurrent}
                    placeholder={watchCurrent ? "Current" : ""}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={watchCurrent}
                  onCheckedChange={(checked) => setValue("current", checked as boolean)}
                />
                <Label htmlFor="current">I currently work here</Label>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  placeholder="Higher numbers show first"
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-sm text-red-500">{errors.order.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your role, responsibilities, and key achievements..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="highlights">Key Achievements (Optional)</Label>
                <Textarea
                  id="highlights"
                  {...register("highlights")}
                  placeholder="• Increased sales by 30%&#10;• Led a team of 5 developers&#10;• Implemented new processes"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter each achievement on a new line
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  {editingExperience ? "Update" : "Create"} Work Experience
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Work Experience List */}
      <div className="grid gap-6 capitalize">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience History ({workExperience.length})
        </h3>
        
        {workExperience.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No work experience added yet. Add your first job to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workExperience.map((exp) => (
              <Card key={exp._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <Badge className="bg-blue-600">Work</Badge>
                        <Badge className="bg-gray-600">#{exp.order}</Badge>
                        {exp.current && (
                          <Badge className="bg-green-600">Current</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <CardDescription className="text-base font-medium">
                        {exp.organization}
                        {exp.location && ` • ${exp.location}`}
                      </CardDescription>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate || "Present"}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(exp)}
                        className="text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp._id)}
                        className="text-xs"
                      >
                        <Trash className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Key Achievements:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {exp.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                        {exp.highlights.length > 3 && (
                          <li className="text-gray-500 italic">
                            +{exp.highlights.length - 3} more achievements
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}