import { optionalString, requiredString, z } from "@/lib/validators";

export const createAreaSchema = z.object({
  name: requiredString("Area name"),
  description: optionalString(),
  address: optionalString(),
});
