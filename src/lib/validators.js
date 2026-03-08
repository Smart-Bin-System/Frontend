import { z } from "zod";

export const requiredString = (label, min = 1) =>
  z.string().trim().min(min, `${label} is required`);

export const optionalString = () => z.string().trim().optional().or(z.literal(""));

export { z };
