import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/ui/input/form-input";
import FormSelect from "@/components/ui/input/form-select";
import PageHeader from "@/components/ui/page-header";
import Toast from "@/components/ui/toast";
import GeofenceMapEditor from "@/features/areas/components/geofence-map-editor";
import { getAreaById } from "@/features/areas/api/get-area-by-id";
import { getAreaList } from "@/features/areas/api/get-area-list";
import { updateArea } from "@/features/areas/api/update-area";
import { createAreaSchema } from "@/features/areas/schemas/create-area-schema";

function getAreaIdValue(area) {
  return area?._id || area?.id || "";
}

function getParentIdValue(parentAreaId) {
  if (!parentAreaId) return "";
  if (typeof parentAreaId === "object") return parentAreaId._id || "";
  return parentAreaId || "";
}

function inferAreaLevel(area, allAreas) {
  if (!area?.parentAreaId) return "1";

  const parentId = getParentIdValue(area.parentAreaId);
  const parent = allAreas.find((item) => getAreaIdValue(item) === parentId);

  if (!parent) return "2";

  const parentHasNoParent = !parent.parentAreaId;
  return parentHasNoParent ? "2" : "3";
}

function EditAreaPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [geoFence, setGeoFence] = useState(null);

  const areaQuery = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const areasQuery = useQuery({
    queryKey: ["area-list"],
    queryFn: getAreaList,
  });

  const area = useMemo(() => areaQuery.data?.data || null, [areaQuery.data]);
  const allAreas = useMemo(() => areasQuery.data?.data || [], [areasQuery.data]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: "",
      code: "",
      level: "1",
      parentAreaId: "",
    },
  });

  const selectedLevel = watch("level");

  const rootAreas = useMemo(() => {
    return allAreas.filter((item) => !item.parentAreaId && getAreaIdValue(item) !== areaId);
  }, [allAreas, areaId]);

  const level2Areas = useMemo(() => {
    return allAreas.filter((item) => {
      const itemId = getAreaIdValue(item);
      if (itemId === areaId) return false;

      const parentId = getParentIdValue(item.parentAreaId);
      if (!parentId) return false;

      const parent = allAreas.find((candidate) => getAreaIdValue(candidate) === parentId);
      return parent && !parent.parentAreaId;
    });
  }, [allAreas, areaId]);

  const parentAreaOptions = useMemo(() => {
    if (selectedLevel === "1") return [];

    if (selectedLevel === "2") {
      return rootAreas.map((item) => ({
        value: getAreaIdValue(item),
        label: item.name,
      }));
    }

    if (selectedLevel === "3") {
      return level2Areas.map((item) => ({
        value: getAreaIdValue(item),
        label: item.name,
      }));
    }

    return [];
  }, [selectedLevel, rootAreas, level2Areas]);

  useEffect(() => {
    if (!area || !allAreas.length) return;

    const inferredLevel = inferAreaLevel(area, allAreas);
    const currentParentId = getParentIdValue(area.parentAreaId);

    reset({
      name: area.name || "",
      code: area.code || "",
      level: inferredLevel,
      parentAreaId: inferredLevel === "1" ? "" : currentParentId,
    });

    setGeoFence(area.geoFence || null);
  }, [area, allAreas, reset]);

  useEffect(() => {
    if (selectedLevel === "1") {
      setValue("parentAreaId", "");
    }
  }, [selectedLevel, setValue]);

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateArea(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area-list"] });
      queryClient.invalidateQueries({ queryKey: ["area", areaId] });
      navigate(`/areas/${areaId}`);
    },
  });

  const handleReset = () => {
    if (!area) return;

    const inferredLevel = inferAreaLevel(area, allAreas);
    const currentParentId = getParentIdValue(area.parentAreaId);

    reset({
      name: area.name || "",
      code: area.code || "",
      level: inferredLevel,
      parentAreaId: inferredLevel === "1" ? "" : currentParentId,
    });

    setGeoFence(area.geoFence || null);
  };

  const onSubmit = (values) => {
    mutation.mutate({
      id: areaId,
      payload: {
        name: values.name,
        code: values.code,
        parentAreaId: values.level === "1" ? null : values.parentAreaId || null,
        geoFence: geoFence || undefined,
      },
    });
  };

  if (areaQuery.isLoading || areasQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading area data...
      </div>
    );
  }

  if (areaQuery.isError || !area) {
    return (
      <Toast
        variant="error"
        title="Failed to load area"
        description="The requested area could not be loaded."
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Area Management"
        title="Edit Area"
        description="Update area details, hierarchy, and boundary definition."
        breadcrumbs={[
          { label: "Areas", to: "/areas" },
          { label: area.name || "Area", to: `/areas/${areaId}` },
          { label: "Edit" },
        ]}
      />

      {mutation.isError ? (
        <Toast
          variant="error"
          title="Failed to update area"
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
                placeholder="e.g. Central Province"
                register={register}
                error={errors.name?.message}
                disabled={mutation.isPending}
              />

              <FormInput
                label="Area Code"
                name="code"
                placeholder="e.g. CENTRAL"
                register={register}
                error={errors.code?.message}
                disabled={mutation.isPending}
              />

              <FormSelect
                label="Level"
                name="level"
                register={register}
                error={errors.level?.message}
                disabled={mutation.isPending}
                options={[
                  { value: "1", label: "Level 1 - Province" },
                  { value: "2", label: "Level 2 - District" },
                  { value: "3", label: "Level 3 - Secretariat Division" },
                ]}
              />

              <FormSelect
                label="Parent Area"
                name="parentAreaId"
                register={register}
                error={errors.parentAreaId?.message}
                options={parentAreaOptions}
                placeholder={
                  selectedLevel === "1"
                    ? "No parent area required"
                    : selectedLevel === "2"
                      ? "Select a province"
                      : "Select a district"
                }
                disabled={
                  mutation.isPending || selectedLevel === "1" || parentAreaOptions.length === 0
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Geofence Editor</h3>
            <p className="mt-1 text-sm text-slate-500">
              Update the polygon boundary for this area.
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
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => navigate(`/areas/${areaId}`)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAreaPage;
