"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "@/components/ui/image-upload";
import Link from "next/link";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const socialLinksSchema = z.object({
  github: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type SocialLinksData = z.infer<typeof socialLinksSchema>;

export default function AdminSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");

  const personalInfo = useQuery(api.public.getSettings, { key: "personal_info" });
  const socialLinks = useQuery(api.public.getSettings, { key: "social_links" });
  const updateSetting = useMutation(api.admin.updateSetting);

  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    formState: { errors: personalErrors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    values: personalInfo || {
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      resumeUrl: "",
    },
  });

  const {
    register: registerSocial,
    handleSubmit: handleSubmitSocial,
    formState: { errors: socialErrors },
  } = useForm<SocialLinksData>({
    resolver: zodResolver(socialLinksSchema),
    values: socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  // Set profile image from personal info
  useState(() => {
    if (personalInfo?.avatarUrl && !profileImage) {
      setProfileImage(personalInfo.avatarUrl);
    }
  });

  const onSubmitPersonal = async (data: PersonalInfoData) => {
    setIsSubmitting(true);
    try {
      await updateSetting({
        key: "personal_info",
        value: {
          ...data,
          avatarUrl: profileImage,
        },
      });
      toast.success("Personal information updated successfully!");
    } catch (error) {
      toast.error("Failed to update personal information");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSocial = async (data: SocialLinksData) => {
    setIsSubmitting(true);
    try {
      await updateSetting({
        key: "social_links",
        value: data,
      });
      toast.success("Social links updated successfully!");
    } catch (error) {
      toast.error("Failed to update social links");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  const handleImageRemove = () => {
    setProfileImage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Update your personal information and social links.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your basic information and profile photo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <ImageUpload
                section="profile"
                currentImage={profileImage}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                width={200}
                height={200}
              />
            </div>

            <form onSubmit={handleSubmitPersonal(onSubmitPersonal)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...registerPersonal("name")}
                    placeholder="Your full name"
                    className={personalErrors.name ? "border-red-500" : ""}
                  />
                  {personalErrors.name && (
                    <p className="text-sm text-red-500">{personalErrors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    {...registerPersonal("title")}
                    placeholder="e.g. Full Stack Developer"
                    className={personalErrors.title ? "border-red-500" : ""}
                  />
                  {personalErrors.title && (
                    <p className="text-sm text-red-500">{personalErrors.title.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...registerPersonal("bio")}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className={personalErrors.bio ? "border-red-500" : ""}
                />
                {personalErrors.bio && (
                  <p className="text-sm text-red-500">{personalErrors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerPersonal("email")}
                    placeholder="your.email@example.com"
                    className={personalErrors.email ? "border-red-500" : ""}
                  />
                  {personalErrors.email && (
                    <p className="text-sm text-red-500">{personalErrors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...registerPersonal("phone")}
                    placeholder="+1 (555) 123-4567"
                    className={personalErrors.phone ? "border-red-500" : ""}
                  />
                  {personalErrors.phone && (
                    <p className="text-sm text-red-500">{personalErrors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...registerPersonal("location")}
                    placeholder="City, Country"
                    className={personalErrors.location ? "border-red-500" : ""}
                  />
                  {personalErrors.location && (
                    <p className="text-sm text-red-500">{personalErrors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">Resume URL</Label>
                  <Input
                    id="resumeUrl"
                    {...registerPersonal("resumeUrl")}
                    placeholder="https://example.com/resume.pdf"
                    className={personalErrors.resumeUrl ? "border-red-500" : ""}
                  />
                  {personalErrors.resumeUrl && (
                    <p className="text-sm text-red-500">{personalErrors.resumeUrl.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Personal Info
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Add your social media and professional profiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitSocial(onSubmitSocial)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  {...registerSocial("github")}
                  placeholder="https://github.com/yourusername"
                  className={socialErrors.github ? "border-red-500" : ""}
                />
                {socialErrors.github && (
                  <p className="text-sm text-red-500">{socialErrors.github.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  {...registerSocial("linkedin")}
                  placeholder="https://linkedin.com/in/yourusername"
                  className={socialErrors.linkedin ? "border-red-500" : ""}
                />
                {socialErrors.linkedin && (
                  <p className="text-sm text-red-500">{socialErrors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  {...registerSocial("twitter")}
                  placeholder="https://twitter.com/yourusername"
                  className={socialErrors.twitter ? "border-red-500" : ""}
                />
                {socialErrors.twitter && (
                  <p className="text-sm text-red-500">{socialErrors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...registerSocial("website")}
                  placeholder="https://yourwebsite.com"
                  className={socialErrors.website ? "border-red-500" : ""}
                />
                {socialErrors.website && (
                  <p className="text-sm text-red-500">{socialErrors.website.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Social Links
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}