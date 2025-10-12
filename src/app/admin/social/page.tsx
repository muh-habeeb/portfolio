"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/image-upload";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const socialLinksSchema = z.object({
  github: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  githubIcon: z.string().optional(),
  linkedinIcon: z.string().optional(),
  twitterIcon: z.string().optional(),
  websiteIcon: z.string().optional(),
});

type SocialLinksData = z.infer<typeof socialLinksSchema>;

interface SocialPlatform {
  key: keyof SocialLinksData;
  label: string;
  placeholder: string;
  defaultEmoji: string;
  color: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    key: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
    defaultEmoji: "🐙",
    color: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    defaultEmoji: "💼",
    color: "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
  },
  {
    key: "twitter",
    label: "Twitter/X",
    placeholder: "https://twitter.com/username",
    defaultEmoji: "🐦",
    color: "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
  },
  {
    key: "website",
    label: "Website",
    placeholder: "https://yourwebsite.com",
    defaultEmoji: "🌐",
    color: "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800"
  }
];

export default function AdminSocialLinks() {
  const socialLinks = useQuery(api.public.getSettings, { key: "social_links" });
  const updateSettings = useMutation(api.settings.update);

  const [customIcons, setCustomIcons] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SocialLinksData>({
    resolver: zodResolver(socialLinksSchema),
    values: socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
      githubIcon: "",
      linkedinIcon: "",
      twitterIcon: "",
      websiteIcon: ""
    }
  });

  // Load custom icons from the form data
  React.useEffect(() => {
    if (socialLinks) {
      setCustomIcons({
        github: socialLinks.githubIcon || "",
        linkedin: socialLinks.linkedinIcon || "",
        twitter: socialLinks.twitterIcon || "",
        website: socialLinks.websiteIcon || ""
      });
    }
  }, [socialLinks]);

  const onSubmit = async (data: SocialLinksData) => {
    try {
      await updateSettings({
        key: "social_links",
        value: { ...data, ...customIcons }
      });
      toast.success("Social links updated successfully!");
    } catch (error) {
      toast.error("Failed to update social links");
      console.error(error);
    }
  };

  const handleIconUpload = (platform: string, url: string) => {
    setCustomIcons(prev => ({ ...prev, [platform]: url }));
    setValue(`${platform}Icon` as keyof SocialLinksData, url);
  };

  const handleIconRemove = (platform: string) => {
    setCustomIcons(prev => ({ ...prev, [platform]: "" }));
    setValue(`${platform}Icon` as keyof SocialLinksData, "");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Links & Icons</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your social media links and customize their icons
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => {
            const currentUrl = watch(platform.key);
            const currentIcon = customIcons[platform.key];

            return (
              <Card key={platform.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {currentIcon ? (
                      <div className="w-8 h-8 relative">
                        <Image
                          src={currentIcon}
                          alt={platform.label}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <span className="text-lg">{platform.defaultEmoji}</span>
                      </div>
                    )}
                    {platform.label}
                    {currentUrl && (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={platform.key}>URL</Label>
                    <Input
                      id={platform.key}
                      {...register(platform.key)}
                      placeholder={platform.placeholder}
                      className={errors[platform.key] ? "border-red-500" : ""}
                    />
                    {errors[platform.key] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[platform.key]?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Custom Icon
                    </Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Upload a custom icon or use an image URL. Leave empty to use the default emoji.
                    </p>
                    <ImageUpload
                      currentImage={currentIcon}
                      onImageUpload={(url) => handleIconUpload(platform.key, url)}
                      onImageRemove={() => handleIconRemove(platform.key)}
                      section="social"
                      width={100}
                      height={100}
                    />
                  </div>

                  {/* Preview */}
                  {(currentUrl || currentIcon) && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium mb-2 block">Preview</Label>
                      <div className={`inline-flex w-10 h-10 rounded-lg items-center justify-center ${platform.color} transition-colors`}>
                        {currentIcon ? (
                          <div className="w-6 h-6 relative">
                            <Image
                              src={currentIcon}
                              alt={platform.label}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                        ) : (
                          <span className="text-lg">{platform.defaultEmoji}</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="min-w-[200px]">
            <Save className="w-4 h-4 mr-2" />
            Save Social Links
          </Button>
        </div>
      </form>

      {/* Current Settings Preview */}
      {socialLinks && Object.values(socialLinks).some(value => value) && (
        <Card>
          <CardHeader>
            <CardTitle>Current Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {socialPlatforms.map((platform) => {
                const url = socialLinks[platform.key];
                const iconUrl = socialLinks[`${platform.key}Icon`];
                
                if (!url) return null;

                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${platform.color}`}
                    title={platform.label}
                  >
                    {iconUrl ? (
                      <div className="w-6 h-6 relative">
                        <Image
                          src={iconUrl}
                          alt={platform.label}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                    ) : (
                      <span className="text-lg">{platform.defaultEmoji}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}