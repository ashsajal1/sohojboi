"use server";

import { Roles } from "@/app/types/globals";
import { checkRole } from "@/lib/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(userId: string, role: Roles) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient().users.updateUser(
      userId,
      {
        publicMetadata: { role: role },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
