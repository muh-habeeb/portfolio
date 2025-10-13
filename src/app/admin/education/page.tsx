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
import { Save, ArrowLeft, Plus, Edit, Trash, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

interface Education {
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

const educationSchema = z.object({
  title: z.string().min(2, "Degree/Program must be at least 2 characters"),
  organization: z.string().min(2, "Institution name must be at least 2 characters"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  highlights: z.string().optional(),
  order: z.number().min(0),
});

type EducationData = z.infer<typeof educationSchema>;

export default function AdminEducation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);

  const education = useQuery(api.public.getEducation) || [];
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
  } = useForm<EducationData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      title: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: "",
      order: education.length,
    },
  });

  const watchCurrent = watch("current");

  const onSubmit = async (data: EducationData) => {
    setIsSubmitting(true);
    try {
      const highlightsArray = data.highlights
        ? data.highlights.split('\n').map(h => h.trim()).filter(Boolean)
        : undefined;
      
      const educationData = {
        type: "education" as const,
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

      if (editingEducation) {
        await updateExperience({
          id: editingEducation._id,
          ...educationData,
        });
        toast.success("Education updated successfully!");
        setEditingEducation(null);
      } else {
        await createExperience(educationData);
        toast.success("Education created successfully!");
      }

      reset();
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save education");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setShowForm(true);
    
    // Fill form with existing data
    setValue("title", edu.title);
    setValue("organization", edu.organization);
    setValue("location", edu.location || "");
    setValue("startDate", edu.startDate);
    setValue("endDate", edu.endDate || "");
    setValue("current", edu.current);
    setValue("description", edu.description);
    setValue("highlights", edu.highlights?.join('\n') || "");
    setValue("order", edu.order);
  };

  const handleDelete = async (id: Id<"experience">) => {
    if (confirm("Are you sure you want to delete this education?")) {
      try {
        await deleteExperience({ id });
        toast.success("Education deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete education");
        console.error(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEducation(null);
    setShowForm(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold">Education</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your educational background, degrees, and certifications
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
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              {editingEducation ? "Edit Education" : "Add New Education"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Degree/Program</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Bachelor of Science, Master's in Computer Science, etc."
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organization">Institution</Label>
                  <Input
                    id="organization"
                    {...register("organization")}
                    placeholder="University Name"
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
                  <Label htmlFor="endDate">Graduation Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    {...register("endDate")}
                    disabled={watchCurrent}
                    placeholder={watchCurrent ? "Currently studying" : ""}
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
                <Label htmlFor="current">Currently studying</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your studies, coursework, and academic achievements..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="highlights">Academic Achievements (Optional)</Label>
                <Textarea
                  id="highlights"
                  {...register("highlights")}
                  placeholder="• Dean's List&#10;• Graduated Summa Cum Laude&#10;• Published research paper"
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
                  {editingEducation ? "Update" : "Create"} Education
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Education List */}
      <div className="grid gap-6 capitalize">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Educational Background ({education.length})
        </h3>
        
        {education.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No education added yet. Add your educational background to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {education.map((edu: Education) => (
              <Card key={edu._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        <Badge className="bg-green-600">Education</Badge>
                        <Badge className="bg-gray-600">#{edu.order}</Badge>
                        {edu.current && (
                          <Badge className="bg-blue-600">Currently studying</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{edu.title}</CardTitle>
                      <CardDescription className="text-base font-medium">
                        {edu.organization}
                        {edu.location && ` • ${edu.location}`}
                      </CardDescription>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {edu.startDate} - {edu.current ? "Present" : edu.endDate || "Present"}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(edu)}
                        className="text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(edu._id)}
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
                    {edu.description}
                  </p>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Academic Achievements:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {edu.highlights.slice(0, 3).map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                        {edu.highlights.length > 3 && (
                          <li className="text-gray-500 italic">
                            +{edu.highlights.length - 3} more achievements
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