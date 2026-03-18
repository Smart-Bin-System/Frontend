import { z } from "zod";

export const createAreaSchema = z.object({
  name: z.string().trim().min(1, "Area name is required"),
  code: z.string().trim().min(1, "Area code is required"),
  parentAreaId: z.string().nullable().optional(),
  geoFence: z.any().optional(),
});
