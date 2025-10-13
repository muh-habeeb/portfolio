"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail,
  MailOpen,
  Reply,
  Trash,
  ArrowLeft,
  Search
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function AdminMessages() {
  const [selectedMessages, setSelectedMessages] = useState<Set<Id<"contactMessages">>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const allMessages = useQuery(api.admin.getContactMessages) || [];
  const updateStatus = useMutation(api.admin.updateContactStatus);
  const bulkUpdateStatus = useMutation(api.admin.bulkUpdateMessageStatus);
  const deleteMessage = useMutation(api.admin.deleteContactMessage);
  const bulkDelete = useMutation(api.admin.bulkDeleteMessages);

  // Filter messages based on status and search term
  const filteredMessages = allMessages.filter(msg => {
    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    const matchesSearch = searchTerm === "" ||
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      // Filter out any invalid IDs before adding to Set
      const validIds = filteredMessages
        .map(msg => msg._id)
        .filter(id => id && typeof id === 'string' && id !== 'undefined' && id !== 'null');
      setSelectedMessages(new Set(validIds));
    }
  };

  const handleSelectMessage = (messageId: Id<"contactMessages">) => {
    // Validate the message ID before adding to the Set
    if (!messageId || typeof messageId !== 'string' || messageId === 'undefined' || messageId === 'null') {
      console.error('Invalid message ID passed to handleSelectMessage:', messageId);
      return;
    }

    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.size === 0) {
      toast.error("Please select messages first");
      return;
    }

    setIsLoading(true);
    try {
      // Clear and comprehensive validation
      console.log('=== BULK ACTION DEBUG START ===');
      console.log('Selected messages Set:', selectedMessages);
      console.log('Set size:', selectedMessages.size);

      // Convert to array and inspect each element
      const rawArray = Array.from(selectedMessages);
      console.log('Raw array from Set:', rawArray);

      // Comprehensive filtering with detailed logging
      const validIds = rawArray.filter((id, index) => {
        console.log(`Checking item ${index}:`, {
          value: id,
          type: typeof id,
          isString: typeof id === 'string',
          isNotUndefined: id !== undefined,
          isNotNull: id !== null,
          isNotStringUndefined: id !== "undefined",
          length: typeof id === 'string' ? id.length : 'N/A'
        });

        // Strict validation
        if (typeof id !== 'string') {
          console.error(`❌ Item ${index} is not a string:`, id);
          return false;
        }

        if (!id || id.length < 20) { // Convex IDs are long
          console.error(`❌ Item ${index} is too short or empty:`, id);
          return false;
        }

        console.log(`✅ Item ${index} is valid:`, id);
        return true;
      });

      console.log('Valid IDs after filtering:', validIds);
      console.log('=== BULK ACTION DEBUG END ===');

      if (validIds.length === 0) {
        toast.error("No valid messages selected");
        setIsLoading(false);
        return;
      }

      console.log('Proceeding with bulk action:', action);
      console.log('Final IDs to send to Convex:', validIds);

      switch (action) {
        case "markRead":
          await bulkUpdateStatus({ ids: validIds, status: "read" });
          toast.success(`Marked ${validIds.length} messages as read`);
          break;
        case "markUnread":
          await bulkUpdateStatus({ ids: validIds, status: "new" });
          toast.success(`Marked ${validIds.length} messages as unread`);
          break;
        case "markReplied":
          await bulkUpdateStatus({ ids: validIds, status: "replied" });
          toast.success(`Marked ${validIds.length} messages as replied`);
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${validIds.length} messages?`)) {
            await bulkDelete({ ids: validIds });
            toast.success(`Deleted ${validIds.length} messages`);
          }
          break;
      }

      setSelectedMessages(new Set());
    } catch (error) {
      toast.error("Failed to perform bulk action");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleAction = async (messageId: Id<"contactMessages">, action: string) => {
    try {
      switch (action) {
        case "markRead":
          await updateStatus({ id: messageId, status: "read" });
          toast.success("Marked as read");
          break;
        case "markReplied":
          await updateStatus({ id: messageId, status: "replied" });
          toast.success("Marked as replied");
          break;
        case "delete":
          if (confirm("Are you sure you want to delete this message?")) {
            await deleteMessage({ id: messageId });
            toast.success("Message deleted");
          }
          break;
      }
    } catch (error) {
      toast.error("Failed to perform action");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "read": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "replied": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Mail className="w-4 h-4" />;
      case "read": return <MailOpen className="w-4 h-4" />;
      case "replied": return <Reply className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage contact messages and communications
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedMessages.size === filteredMessages.length && filteredMessages.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMessages.size > 0 ? `${selectedMessages.size} selected` : "Select all"}
                </span>
              </div>

              {selectedMessages.size > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("markRead")}
                    disabled={isLoading}
                  >
                    <MailOpen className="w-4 h-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("markUnread")}
                    disabled={isLoading}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Mark Unread
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("markReplied")}
                    disabled={isLoading}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Mark Replied
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("delete")}
                    disabled={isLoading}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{allMessages.length}</span> total messages
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{allMessages.filter(m => m.status === "new").length}</span> new
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{allMessages.filter(m => m.status === "read").length}</span> read
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{allMessages.filter(m => m.status === "replied").length}</span> replied
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-2">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterStatus !== "all"
                  ? "No messages match your filters"
                  : "No messages yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card
              key={message._id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${message.status === "new" ? "border-l-4 border-l-blue-500" : ""
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedMessages.has(message._id)}
                    onCheckedChange={() => handleSelectMessage(message._id)}
                  />

                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/messages/${message._id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded ${getStatusColor(message.status)}`}>
                            {getStatusIcon(message.status)}
                          </div>
                          <div>
                            <p className={`font-medium ${message.status === "new" ? "font-bold" : ""}`}>
                              {message.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {message.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm text-gray-700 dark:text-gray-300 line-clamp-2 ${message.status === "new" ? "font-medium" : ""
                        }`}>
                        {message.message}
                      </p>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">

                    {/* mark as btn/ */}
                    <Tooltip>
                      <TooltipTrigger asChild>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSingleAction(message._id, "markRead");
                          }}
                        >
                          <MailOpen className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as read</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* replay btn */}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/admin/messages/${message._id}?reply=true`}>
                          <Button size="sm" variant="ghost">
                            <Reply className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reply</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* delete btn   */}


                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSingleAction(message._id, "delete");
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete message</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}