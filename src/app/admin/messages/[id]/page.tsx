"use client";

import { useState, useEffect, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  MailOpen, 
  Reply, 
  Trash, 
  Send,
  User,
  Calendar,
  AtSign
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

export default function MessageView({ params }: { params: Promise<{ id: string }> }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoReply = searchParams.get("reply") === "true";

  // Use React.use() to unwrap the params Promise
  const resolvedParams = use(params);
  const messageId = resolvedParams.id as Id<"contactMessages">;
  const message = useQuery(api.admin.getContactMessage, { id: messageId });
  const markAsRead = useMutation(api.admin.markMessageAsRead);
  const markAsUnread = useMutation(api.admin.markMessageAsUnread);
  const updateStatus = useMutation(api.admin.updateContactStatus);
  const deleteMessage = useMutation(api.admin.deleteContactMessage);

  // Mark as read when opened
  useEffect(() => {
    if (message && message.status === "new") {
      markAsRead({ id: messageId });
    }
  }, [message, messageId, markAsRead]);

  // Auto-open reply if requested
  useEffect(() => {
    if (shouldAutoReply && message) {
      setIsReplying(true);
      // Set a default reply
      setReplyMessage(`Hi ${message.name},\n\nThank you for your message. `);
    }
  }, [shouldAutoReply, message]);

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    if (!message) return;

    setIsLoading(true);
    try {
      // Send email through API
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: messageId,
          replyMessage: replyMessage,
          adminName: process.env.REPLAY_EMAIL_NAME, // You can make this configurable
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reply');
      }

      toast.success("Reply sent successfully via email!");
      setIsReplying(false);
      setReplyMessage("");
      
      // Refresh the message data to show updated status
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to send reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteMessage({ id: messageId });
      toast.success("Message deleted successfully");
      router.push("/admin/messages");
    } catch (error) {
      toast.error("Failed to delete message");
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus: "new" | "read" | "replied") => {
    try {
      if (newStatus === "new") {
        await markAsUnread({ id: messageId });
      } else if (newStatus === "read") {
        await markAsRead({ id: messageId });
      } else {
        await updateStatus({ id: messageId, status: newStatus });
      }
      toast.success(`Message marked as ${newStatus === "new" ? "unread" : newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
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

  if (!message) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/messages">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Message Details</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Received {format(new Date(message.createdAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(message.status)}>
            {message.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Message Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{message.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <AtSign className="w-3 h-3" />
                      {message.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(message.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("read")}
                disabled={message.status === "read"}
              >
                <MailOpen className="w-4 h-4 mr-1" />
                Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("new")}
                disabled={message.status === "new"}
              >
                <Mail className="w-4 h-4 mr-1" />
                Mark Unread
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Message:</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Reply Section */}
      {message.status === "replied" && message.replyText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Reply className="w-5 h-5 text-green-600" />
              Reply Sent
            </CardTitle>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sent on {message.repliedAt ? format(new Date(message.repliedAt), "MMM dd, yyyy 'at' HH:mm") : 'Unknown date'}
              {message.emailSent && (
                <span className="ml-2 text-green-600">✓ Email delivered</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 whitespace-pre-wrap border-l-4 border-green-500">
              {message.replyText}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Section */}
      {isReplying && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Reply className="w-5 h-5" />
              Reply to {message.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={8}
                className="mt-2"
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                How it works:
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Your reply will be sent directly via email to the sender</li>
                <li>• The recipient will be: {message.email}</li>
                <li>• A professional email template will be used</li>
                <li>• This message will be automatically marked as &quot;replied&quot;</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleReply} disabled={isLoading}>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                )}
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsReplying(false);
                  setReplyMessage("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}