import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import FormInput from "@/components/ui/input/form-input";
import FormSelect from "@/components/ui/input/form-select";
import PageHeader from "@/components/ui/page-header";
import Toast from "@/components/ui/toast";
import GeofenceMapEditor from "@/features/areas/components/geofence-map-editor";
import { createArea } from "@/features/areas/api/create-area";
import { getAreaList } from "@/features/areas/api/get-area-list";
import { createAreaSchema } from "@/features/areas/schemas/create-area-schema";

function CreateAreaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [geoFence, setGeoFence] = useState(null);

  const areasQuery = useQuery({
    queryKey: ["area-list"],
    queryFn: getAreaList,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: "",
      code: "",
      parentAreaId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area-list"] });
      navigate("/areas");
    },
  });

  const areas = areasQuery.data?.data || [];
  const areaOptions = areas.map((area) => ({
    value: area.id,
    label: area.name,
  }));

  const onSubmit = (values) => {
    mutation.mutate({
      name: values.name,
      code: values.code,
      parentAreaId: values.parentAreaId || null,
      geoFence: geoFence || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Area Management"
        title="Create Area"
        description="Add a new operational area and optionally define its geofence."
        breadcrumbs={[{ label: "Areas", to: "/areas" }, { label: "Create" }]}
      />

      {mutation.isError ? (
        <Toast
          variant="error"
          title="Failed to create area"
          description={
            mutation.error?.response?.data?.message ||
            mutation.error?.message ||
            "Please try again."
          }
        />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5">
              <FormInput
                label="Area Name"
                name="name"
                placeholder="e.g. BCI Campus"
                register={register}
                error={errors.name?.message}
                disabled={mutation.isPending}
              />

              <FormInput
                label="Area Code"
                name="code"
                placeholder="e.g. MLB"
                register={register}
                error={errors.code?.message}
                disabled={mutation.isPending}
              />

              <FormSelect
                label="Parent Area"
                name="parentAreaId"
                register={register}
                error={errors.parentAreaId?.message}
                options={areaOptions}
                placeholder="No parent area"
                disabled={mutation.isPending || areasQuery.isLoading}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Geofence Editor</h3>
            <p className="mt-1 text-sm text-slate-500">
              Draw a polygon to define the area boundary.
            </p>

            <div className="mt-5">
              <GeofenceMapEditor value={geoFence} onChange={setGeoFence} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Creating..." : "Create Area"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/areas")}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAreaPage;
