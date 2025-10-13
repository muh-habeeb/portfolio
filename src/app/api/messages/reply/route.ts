import { NextRequest, NextResponse } from 'next/server';
import { sendReplyEmail } from '@/lib/email';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { messageId, replyMessage, adminName } = await request.json();

    if (!messageId || !replyMessage) {
      return NextResponse.json(
        { error: 'Message ID and reply message are required' },
        { status: 400 }
      );
    }

    // Get the original message from Convex
    const originalMessage = await convex.query(api.admin.getContactMessage, {
      id: messageId as Id<"contactMessages">
    });

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Original message not found' },
        { status: 404 }
      );
    }

    // Send the reply email
    const emailResult = await sendReplyEmail({
      to: originalMessage.email,
      replyToMessageId: messageId,
      subject: "Re: for your message", // Using name as subject since there's no subject field
      message: replyMessage,
      adminName: adminName,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      );
    }

    // Update message status to "replied" and add reply info in Convex
    await convex.mutation(api.admin.addMessageReply, {
      messageId: messageId as Id<"contactMessages">,
      replyText: replyMessage,
      repliedAt: new Date().toISOString(),
      emailSent: true,
      emailMessageId: emailResult.messageId
    });

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      emailMessageId: emailResult.messageId
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}