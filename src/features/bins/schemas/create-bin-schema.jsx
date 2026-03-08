import { optionalString, requiredString, z } from "@/lib/validators";

export const createBinSchema = z.object({
  name: requiredString("Bin name"),
  description: optionalString(),
  areaId: requiredString("Area"),
  address: optionalString(),
  esp32ChipId: optionalString(),
  firmwareVersion: optionalString(),
  cnnModelVersion: optionalString(),
});
