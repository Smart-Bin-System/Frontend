import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().optional().default(""),
  nic: z.string().trim().optional().default(""),
  shift: z.string().optional().default(""),
  role: z.enum([ROLES.ADMIN, ROLES.WORKER], {
    message: "Role is required",
  }),
}).refine((data) => {
  if (data.role === ROLES.WORKER && !data.shift) {
    return false;
  }
  return true;
}, {
  message: "Shift is required for workers",
  path: ["shift"],
});
