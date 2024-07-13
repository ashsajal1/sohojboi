// import { Roles } from "@/types/globals"
import { Roles } from "@/app/types/globals";
import { auth } from "@clerk/nextjs/server"

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth()

  // console.log("Role : ", sessionClaims?.metadata.role)
  return sessionClaims?.metadata.role === role;
}