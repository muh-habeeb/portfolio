/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ExternalLink, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/image-upload";
import Image from "next/image";

interface SocialLink {
  _id: string;
  name: string; // Display name (e.g., "GitHub", "My Portfolio", "Professional Network")
  url: string;
  iconUrl?: string;
  defaultEmoji: string;
  color: string; // CSS classes for styling
  order: number;
}

interface NewSocialLink {
  name: string;
  url: string;
  iconUrl: string;
  defaultEmoji: string;
  color: string;
}

const defaultColors = [
  "bg-transparent",
  "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800",
  "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
  "bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800",
  "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800",
  "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800",
  "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800",
  "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800",
  "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800",
];

const defaultEmojis = ["🔗", "🌐", "📱", "💼", "🎯", "🚀", "⭐", "💡", "🎨", "📧"];

export default function AdminSocialLinks() {
  const socialLinks = useQuery(api.public.getSocialLinks) || [];
  const createSocialLink = useMutation(api.socialLinks.create);
  const updateSocialLink = useMutation(api.socialLinks.update);
  const deleteSocialLink = useMutation(api.socialLinks.remove);

  const [newLink, setNewLink] = useState<NewSocialLink>({
    name: "",
    url: "",
    iconUrl: "",
    defaultEmoji: "🔗",
    color: defaultColors[0]
  });

  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SocialLink>>({});

  const handleCreateLink = async () => {
    if (!newLink.name.trim()) {
      toast.error("Please enter a name for the social link");
      return;
    }

    if (!newLink.url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      // Validate URL format
      new URL(newLink.url);
      
      await createSocialLink({
        name: newLink.name,
        url: newLink.url,
        iconUrl: newLink.iconUrl,
        defaultEmoji: newLink.defaultEmoji,
        color: newLink.color
      });

      toast.success("Social link created successfully!");
      setNewLink({
        name: "",
        url: "",
        iconUrl: "",
        defaultEmoji: "🔗",
        color: defaultColors[0]
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid URL")) {
        toast.error("Please enter a valid URL (include http:// or https://)");
      } else {
        toast.error("Failed to create social link");
      }
      console.error(error);
    }
  };

  const handleUpdateLink = async (linkId: string) => {
    try {
      if (editData.url) {
        // Validate URL if it's being updated
        new URL(editData.url);
      }

      await updateSocialLink({
        id: linkId as any, // TODO: Fix type
        ...editData
      });

      toast.success("Social link updated successfully!");
      setEditingLink(null);
      setEditData({});
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid URL")) {
        toast.error("Please enter a valid URL (include http:// or https://)");
      } else {
        toast.error("Failed to update social link");
      }
      console.error(error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    try {
      await deleteSocialLink({ id: linkId as any });
      toast.success("Social link deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete social link");
      console.error(error);
    }
  };

  const startEditing = (link: SocialLink) => {
    setEditingLink(link._id);
    setEditData({
      name: link.name,
      url: link.url,
      iconUrl: link.iconUrl,
      defaultEmoji: link.defaultEmoji,
      color: link.color
    });
  };

  const cancelEditing = () => {
    setEditingLink(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Links Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create, customize, and manage your social media links and icons
        </p>
      </div>

      {/* Add New Social Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Social Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link-name">Display Name</Label>
              <Input
                id="link-name"
                value={newLink.name}
                onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., GitHub, My Portfolio, Professional Network"
              />
            </div>

            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="link-emoji">Default Emoji</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="link-emoji"
                  value={newLink.defaultEmoji}
                  onChange={(e) => setNewLink(prev => ({ ...prev, defaultEmoji: e.target.value }))}
                  placeholder="🔗"
                  className="w-20"
                />
                <div className="flex space-x-1">
                  {defaultEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewLink(prev => ({ ...prev, defaultEmoji: emoji }))}
                      className="w-8 h-8 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="link-color">Color Theme</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {defaultColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNewLink(prev => ({ ...prev, color }))}
                    className={`w-full h-8 rounded ${color} ${
                      newLink.color === color ? "ring-2 ring-blue-500" : ""
                    }`}
                    title={`Color option ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Custom Icon</Label>
            <ImageUpload
              currentImage={newLink.iconUrl}
              onImageUpload={(url) => setNewLink(prev => ({ ...prev, iconUrl: url }))}
              onImageRemove={() => setNewLink(prev => ({ ...prev, iconUrl: "" }))}
              section="social"
              width={100}
              height={100}
            />
          </div>

          {/* Preview */}
          {(newLink.name || newLink.url) && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${newLink.color}`}>
                  {newLink.iconUrl ? (
                    <div className="w-6 h-6 relative">
                      <Image
                        src={newLink.iconUrl}
                        alt={newLink.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                  ) : (
                    <span className="text-lg">{newLink.defaultEmoji}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{newLink.name || "Social Link"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{newLink.url || "URL"}</p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleCreateLink} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </CardContent>
      </Card>

      {/* Social Links List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {socialLinks.map((link: SocialLink) => (
          <Card key={link._id}>
            <CardContent className="p-4">
              {editingLink === link._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <Label>Display Name</Label>
                    <Input
                      value={editData.name || ""}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>URL</Label>
                    <Input
                      value={editData.url || ""}
                      onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Default Emoji</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editData.defaultEmoji || ""}
                        onChange={(e) => setEditData(prev => ({ ...prev, defaultEmoji: e.target.value }))}
                        className="w-20"
                      />
                      <div className="flex space-x-1">
                        {defaultEmojis.slice(0, 5).map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setEditData(prev => ({ ...prev, defaultEmoji: emoji }))}
                            className="w-6 h-6 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {defaultColors.slice(0, 8).map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setEditData(prev => ({ ...prev, color }))}
                          className={`w-full h-6 rounded ${color} ${
                            editData.color === color ? "ring-2 ring-blue-500" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Custom Icon</Label>
                    <ImageUpload
                      currentImage={editData.iconUrl}
                      onImageUpload={(url) => setEditData(prev => ({ ...prev, iconUrl: url }))}
                      onImageRemove={() => setEditData(prev => ({ ...prev, iconUrl: "" }))}
                      section="social"
                      width={80}
                      height={80}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={() => handleUpdateLink(link._id)} size="sm" className="flex-1">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button onClick={cancelEditing} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${link.color}`}>
                        {link.iconUrl ? (
                          <div className="w-6 h-6 relative">
                            <Image
                              src={link.iconUrl}
                              alt={link.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                        ) : (
                          <span className="text-lg">{link.defaultEmoji}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{link.name}</h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => startEditing(link)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteLink(link._id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {socialLinks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No social links found. Add your first social link above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}