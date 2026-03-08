import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axiosClient from "@/lib/axios";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import FormSelect from "@/components/ui/input/form-select";
import { createBinSchema } from "@/features/bins/schemas/create-bin-schema";

const getAreas = async () => {
  const response = await axiosClient.get("/areas");
  return response.data;
};

const createBin = async (values) => {
  const payload = {
    name: values.name,
    description: values.description,
    areaId: values.areaId,
    location: {
      address: values.address,
    },
    device: {
      esp32ChipId: values.esp32ChipId || null,
      firmwareVersion: values.firmwareVersion || "",
      cnnModelVersion: values.cnnModelVersion || "",
    },
  };

  const response = await axiosClient.post("/bins", payload);
  return response.data;
};

function CreateBinPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBinSchema),
    defaultValues: {
      name: "",
      description: "",
      areaId: "",
      address: "",
      esp32ChipId: "",
      firmwareVersion: "",
      cnnModelVersion: "",
    },
  });

  const areasQuery = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const mutation = useMutation({
    mutationFn: createBin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      navigate("/bins");
    },
  });

  const areas = areasQuery.data?.data || areasQuery.data || [];
  const areaOptions = areas.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create Bin</h2>
        <p className="mt-2 text-sm text-slate-500">
          Register a new smart bin and connect it to an operational area.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="Bin Name"
            name="name"
            placeholder="e.g. Main Entrance Bin"
            register={register}
            error={errors.name?.message}
            disabled={mutation.isPending}
          />

          <FormSelect
            label="Area"
            name="areaId"
            register={register}
            error={errors.areaId?.message}
            options={areaOptions}
            placeholder={areasQuery.isLoading ? "Loading areas..." : "Select an area"}
            disabled={mutation.isPending || areasQuery.isLoading}
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Description"
              name="description"
              placeholder="Describe this smart bin"
              register={register}
              error={errors.description?.message}
              disabled={mutation.isPending}
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              name="address"
              placeholder="Optional location address"
              register={register}
              error={errors.address?.message}
              disabled={mutation.isPending}
            />
          </div>

          <FormInput
            label="ESP32 Chip ID"
            name="esp32ChipId"
            placeholder="Optional device chip ID"
            register={register}
            error={errors.esp32ChipId?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="Firmware Version"
            name="firmwareVersion"
            placeholder="e.g. 1.0.4"
            register={register}
            error={errors.firmwareVersion?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="CNN Model Version"
            name="cnnModelVersion"
            placeholder="e.g. cnn-v2"
            register={register}
            error={errors.cnnModelVersion?.message}
            disabled={mutation.isPending}
          />
        </div>

        {areasQuery.isError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load areas. Bin creation needs a valid area from the backend.
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to create bin. Please verify the backend payload shape and try again.
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Creating..." : "Create Bin"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/bins")}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBinPage;
