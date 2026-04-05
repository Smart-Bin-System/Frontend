import { z } from "zod";

export const createBinSchema = z.object({
  name: z.string().min(1, "Bin name is required"),
  description: z.string().optional().default(""),
  areaId: z.string().min(1, "Area is required"),
  address: z.string().optional().default(""),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
  assignedAdminId: z.string().optional().default(""),
  assignedWorkerId: z.string().optional().default(""),
});
