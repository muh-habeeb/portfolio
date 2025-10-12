import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface EmailAddress {
  id: string;
  emailAddress: string;
}

export async function requireAdmin() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses.find((email: EmailAddress) => email.id === user.primaryEmailAddressId)?.emailAddress;

  if (userEmail !== adminEmail) {
    redirect("/");
  }

  return { userId, user, userEmail };
}

export async function isAdmin() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.emailAddresses.find((email: EmailAddress) => email.id === user.primaryEmailAddressId)?.emailAddress;

    return userEmail === adminEmail;
  } catch {
    return false;
  }
}