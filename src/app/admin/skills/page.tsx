/**
|--------------------------------------------------
| this page used to customize the skills and their icons
|--------------------------------------------------
*/

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/image-upload";
import Image from "next/image";

interface Skill {
    _id: string;
    name: string;
    category: string;
    level: number;
    icon?: string;
    iconUrl?: string;
}

interface NewSkill {
    name: string;
    category: string;
    level: number;
    icon: string;
    iconUrl: string;
}

const skillCategories = [
    "frontend",
    "backend",
    "database",
    "tools",
    "mobile",
    "cloud",
    "design"
];

export default function AdminSkills() {
    const skills = useQuery(api.public.getSkills) || [];
    const createSkill = useMutation(api.skills.create);
    const updateSkill = useMutation(api.skills.update);
    const deleteSkill = useMutation(api.skills.remove);

    const [newSkill, setNewSkill] = useState<NewSkill>({
        name: "",
        category: "frontend",
        level: 1,
        icon: "",
        iconUrl: ""
    });

    const [editingSkill, setEditingSkill] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<Skill>>({});

    const handleCreateSkill = async () => {
        if (!newSkill.name.trim()) {
            toast.error("Please enter a skill name");
            return;
        }

        try {
            await createSkill({
                name: newSkill.name,
                category: newSkill.category,
                level: newSkill.level,
                icon: newSkill.icon,
                iconUrl: newSkill.iconUrl
            });

            toast.success("Skill created successfully!");
            setNewSkill({
                name: "",
                category: "frontend",
                level: 1,
                icon: "",
                iconUrl: ""
            });
        } catch (error) {
            toast.error("Failed to create skill");
            console.error(error);
        }
    };

    const handleUpdateSkill = async (skillId: string) => {
        try {
            await updateSkill({
                id: skillId as any,
                ...editData
            });

            toast.success("Skill updated successfully!");
            setEditingSkill(null);
            setEditData({});
        } catch (error) {
            toast.error("Failed to update skill");
            console.error(error);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        try {
            await deleteSkill({ id: skillId as any });
            toast.success("Skill deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete skill");
            console.error(error);
        }
    };

    const startEditing = (skill: Skill) => {
        setEditingSkill(skill._id);
        setEditData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            icon: skill.icon,
            iconUrl: skill.iconUrl
        });
    };

    const cancelEditing = () => {
        setEditingSkill(null);
        setEditData({});
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Skills Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your skills and their custom icons
                </p>
            </div>

            {/* Add New Skill */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Skill
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="skill-name">Skill Name</Label>
                            <Input
                                id="skill-name"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., React, Node.js, PostgreSQL"
                            />
                        </div>

                        <div>
                            <Label htmlFor="skill-category">Category</Label>
                            <Select
                                value={newSkill.category}
                                onValueChange={(value: string) => setNewSkill(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {skillCategories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="skill-level">Proficiency Level (1-5)</Label>
                            <Input
                                id="skill-level"
                                type="number"
                                min="1"
                                max="5"
                                value={newSkill.level}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="skill-icon">Icon Text/Emoji (Optional)</Label>
                            <Input
                                id="skill-icon"
                                value={newSkill.icon}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, icon: e.target.value }))}
                                placeholder="🔧 or custom text"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2 block">Custom Icon Image</Label>
                        <ImageUpload
                            currentImage={newSkill.iconUrl}
                            onImageUpload={(url) => setNewSkill(prev => ({ ...prev, iconUrl: url }))}
                            onImageRemove={() => setNewSkill(prev => ({ ...prev, iconUrl: "" }))}
                            section="skills"
                            width={100}
                            height={100}
                        />
                    </div>

                    <Button onClick={handleCreateSkill} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                    </Button>
                </CardContent>
            </Card>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill: any) => (
                    <Card key={skill._id} className="relative">
                        <CardContent className="p-4">
                            {editingSkill === skill._id ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={editData.name || ""}
                                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <Label>Category</Label>
                                        <Select
                                            value={editData.category || skill.category}
                                            onValueChange={(value: string) => setEditData(prev => ({ ...prev, category: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {skillCategories.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Level (1-5)</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={editData.level || skill.level}
                                            onChange={(e) => setEditData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                                        />
                                    </div>

                                    <div>
                                        <Label>Icon Text/Emoji</Label>
                                        <Input
                                            value={editData.icon || ""}
                                            onChange={(e) => setEditData(prev => ({ ...prev, icon: e.target.value }))}
                                            placeholder="🔧 or custom text"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Custom Icon Image</Label>
                                        <ImageUpload
                                            currentImage={editData.iconUrl}
                                            onImageUpload={(url) => setEditData(prev => ({ ...prev, iconUrl: url }))}
                                            onImageRemove={() => setEditData(prev => ({ ...prev, iconUrl: "" }))}
                                            section="skills"
                                            width={80}
                                            height={80}
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button onClick={() => handleUpdateSkill(skill._id)} size="sm" className="flex-1">
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
                                            {skill.iconUrl ? (
                                                <div className="w-8 h-8 relative">
                                                    <Image
                                                        src={skill.iconUrl}
                                                        alt={skill.name}
                                                        fill
                                                        className="object-contain rounded"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-2xl">
                                                    {skill.icon || "🔧"}
                                                </span>
                                            )}
                                            <div>
                                                <h3 className="font-medium">{skill.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {skill.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                onClick={() => startEditing(skill)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteSkill(skill._id)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Level {skill.level}/5</span>
                                            <span>{(skill.level / 5 * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                style={{ width: `${(skill.level / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {skills.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No skills found. Add your first skill above!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}