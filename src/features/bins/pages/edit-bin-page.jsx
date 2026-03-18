import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import FormSelect from "@/components/ui/input/form-select";
import PageHeader from "@/components/ui/page-header";
import { createBinSchema } from "@/features/bins/schemas/create-bin-schema";

const fallbackBin = {
  _id: "1",
  name: "Main Entrance Bin",
  description: "Smart waste bin near the main entrance",
  areaId: "1",
  location: {
    address: "Main Entrance, BCI Campus",
  },
  device: {
    esp32ChipId: "ESP32-7A91X",
    firmwareVersion: "1.0.4",
    cnnModelVersion: "cnn-v2",
  },
};

const fallbackAreas = [
  { _id: "1", name: "BCI Campus" },
  { _id: "2", name: "Library Zone" },
];

const getBinById = async (binId) => {
  const response = await axiosClient.get(`/bins/${binId}`);
  return response.data;
};

const getAreas = async () => {
  const response = await axiosClient.get("/areas");
  return response.data;
};

const updateBin = async ({ binId, payload }) => {
  const response = await axiosClient.put(`/bins/${binId}`, payload);
  return response.data;
};

function EditBinPage() {
  const { binId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const binQuery = useQuery({
    queryKey: ["bin", binId],
    queryFn: () => getBinById(binId),
    enabled: Boolean(binId),
  });

  const areasQuery = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const bin = useMemo(() => binQuery.data?.data || binQuery.data || fallbackBin, [binQuery.data]);

  const areas = areasQuery.data?.data || areasQuery.data || fallbackAreas;
  const areaOptions = areas.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBinSchema),
    values: {
      name: bin.name || "",
      description: bin.description || "",
      areaId: bin.areaId || bin.area?._id || "",
      address: bin.location?.address || "",
      esp32ChipId: bin.device?.esp32ChipId || "",
      firmwareVersion: bin.device?.firmwareVersion || "",
      cnnModelVersion: bin.device?.cnnModelVersion || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateBin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", binId] });
      navigate(`/bins/${binId}`);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      binId,
      payload: {
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
      },
    });
  };

  if (binQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading bin data...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Bin Management"
        title="Edit Bin"
        description="Update smart bin information and assigned area."
        breadcrumbs={[
          { label: "Bins", to: "/bins" },
          { label: bin.name || "Bin", to: `/bins/${binId}` },
          { label: "Edit" },
        ]}
      />

      {(binQuery.isError || areasQuery.isError) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Some data could not be loaded from the API. Fallback sample data is being used.
        </div>
      )}

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

        {mutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to update bin. Please try again.
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => navigate(`/bins/${binId}`)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBinPage;
