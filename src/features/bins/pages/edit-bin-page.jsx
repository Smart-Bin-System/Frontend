import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import SearchableSelect from "@/components/ui/input/searchable-select";
import PageHeader from "@/components/ui/page-header";
import { createBinSchema } from "@/features/bins/schemas/create-bin-schema";
import { getBinById } from "@/features/bins/api/get-bin-by-id";
import { updateBin } from "@/features/bins/api/update-bin";
import { getAreas } from "@/features/areas/api/get-areas";
import { getAdmins } from "@/features/users/api/get-admins";
import { getWorkers } from "@/features/users/api/get-workers";

function getUserOptions(data) {
  const users = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  return users.map((user) => {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    const label = fullName || user.name || user.email || user.username || user._id;

    return {
      value: String(user._id || user.id || ""),
      label,
    };
  });
}

function getAreaIdFromBin(bin) {
  const rawArea = bin?.areaId || bin?.area?._id || "";

  if (rawArea && typeof rawArea === "object") {
    return String(rawArea._id || rawArea.id || "");
  }

  return String(rawArea || "");
}

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

  const adminsQuery = useQuery({
    queryKey: ["users", "admins"],
    queryFn: getAdmins,
  });

  const workersQuery = useQuery({
    queryKey: ["users", "workers"],
    queryFn: getWorkers,
  });

  const bin = useMemo(() => binQuery.data?.data || binQuery.data || null, [binQuery.data]);
  const areas = useMemo(() => areasQuery.data?.data || areasQuery.data || [], [areasQuery.data]);

  const areasById = useMemo(() => {
    return new Map(areas.map((area) => [String(area._id), area]));
  }, [areas]);

  const areaIdFromBin = useMemo(() => {
    return getAreaIdFromBin(bin);
  }, [bin]);

  const selectedArea = useMemo(() => {
    if (!areaIdFromBin) return null;
    return areasById.get(areaIdFromBin) || null;
  }, [areaIdFromBin, areasById]);

  const provinceIdFromBin = useMemo(() => {
    if (!selectedArea) return "";

    if (Number(selectedArea.level) === 1) return String(selectedArea._id);
    if (Number(selectedArea.level) === 2) return String(selectedArea.parentAreaId || "");

    if (Number(selectedArea.level) === 3) {
      const district = areasById.get(String(selectedArea.parentAreaId));
      return String(district?.parentAreaId || "");
    }

    return "";
  }, [areasById, selectedArea]);

  const districtIdFromBin = useMemo(() => {
    if (!selectedArea) return "";

    if (Number(selectedArea.level) === 2) return String(selectedArea._id);
    if (Number(selectedArea.level) === 3) return String(selectedArea.parentAreaId || "");

    return "";
  }, [selectedArea]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBinSchema),
    defaultValues: {
      name: "",
      description: "",
      provinceId: "",
      districtId: "",
      areaId: "",
      address: "",
      latitude: "",
      longitude: "",
      assignedAdminId: "",
      assignedWorkerId: "",
    },
  });

  const provinceId = useWatch({ control, name: "provinceId" }) || "";
  const districtId = useWatch({ control, name: "districtId" }) || "";
  const areaId = useWatch({ control, name: "areaId" }) || "";
  const assignedAdminId = useWatch({ control, name: "assignedAdminId" }) || "";
  const assignedWorkerId = useWatch({ control, name: "assignedWorkerId" }) || "";

  const provinces = useMemo(() => areas.filter((area) => Number(area.level) === 1), [areas]);

  const districts = useMemo(
    () =>
      areas.filter(
        (area) => Number(area.level) === 2 && String(area.parentAreaId) === String(provinceId),
      ),
    [areas, provinceId],
  );

  const cities = useMemo(
    () =>
      areas.filter(
        (area) => Number(area.level) === 3 && String(area.parentAreaId) === String(districtId),
      ),
    [areas, districtId],
  );

  const provinceOptions = provinces.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const districtOptions = districts.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const cityOptions = cities.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const adminOptions = useMemo(() => getUserOptions(adminsQuery.data), [adminsQuery.data]);
  const workerOptions = useMemo(() => getUserOptions(workersQuery.data), [workersQuery.data]);

  useEffect(() => {
    if (!bin) return;

    const coordinates = bin.location?.geo?.coordinates;

    reset({
      name: bin.name || "",
      description: bin.description || "",
      provinceId: provinceIdFromBin,
      districtId: districtIdFromBin,
      areaId: areaIdFromBin,
      address: bin.location?.address || "",
      latitude:
        Array.isArray(coordinates) && coordinates.length > 1 && coordinates[1] !== null
          ? String(coordinates[1])
          : "",
      longitude:
        Array.isArray(coordinates) && coordinates.length > 0 && coordinates[0] !== null
          ? String(coordinates[0])
          : "",
      assignedAdminId: bin.assignedAdminId || "",
      assignedWorkerId: bin.assignedWorkerId || "",
    });
  }, [areaIdFromBin, bin, districtIdFromBin, provinceIdFromBin, reset]);

  const mutation = useMutation({
    mutationFn: (values) => updateBin(binId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", binId] });
      navigate(`/bins/${binId}`);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
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
        description="Update smart bin information and connect it to an operational area."
        breadcrumbs={[
          { label: "Bins", to: "/bins" },
          { label: bin?.name || "Bin", to: `/bins/${binId}` },
          { label: "Edit" },
        ]}
      />

      {(binQuery.isError || areasQuery.isError) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Some data could not be loaded from the API.
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

          <SearchableSelect
            label="Province"
            value={provinceId}
            onChange={(value) => {
              setValue("provinceId", value, { shouldValidate: true });
              setValue("districtId", "", { shouldValidate: true });
              setValue("areaId", "", { shouldValidate: true });
            }}
            error={errors.provinceId?.message}
            options={provinceOptions}
            placeholder={areasQuery.isLoading ? "Loading provinces..." : "Select a province"}
            disabled={mutation.isPending || areasQuery.isLoading}
          />

          <SearchableSelect
            label="District"
            value={districtId}
            onChange={(value) => {
              setValue("districtId", value, { shouldValidate: true });
              setValue("areaId", "", { shouldValidate: true });
            }}
            error={errors.districtId?.message}
            options={districtOptions}
            placeholder={!provinceId ? "Select a province first" : "Select a district"}
            disabled={mutation.isPending || !provinceId}
          />

          <SearchableSelect
            label="City"
            value={areaId}
            onChange={(value) => setValue("areaId", value, { shouldValidate: true })}
            error={errors.areaId?.message}
            options={cityOptions}
            placeholder={!districtId ? "Select a district first" : "Select a city"}
            disabled={mutation.isPending || !districtId}
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
            label="Latitude"
            name="latitude"
            placeholder="e.g. 6.9271"
            register={register}
            error={errors.latitude?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="Longitude"
            name="longitude"
            placeholder="e.g. 79.8612"
            register={register}
            error={errors.longitude?.message}
            disabled={mutation.isPending}
          />

          <SearchableSelect
            label="Assigned Admin"
            value={assignedAdminId}
            onChange={(value) => setValue("assignedAdminId", value, { shouldValidate: true })}
            error={errors.assignedAdminId?.message}
            options={adminOptions}
            placeholder={adminsQuery.isLoading ? "Loading admins..." : "Select an admin"}
            disabled={mutation.isPending || adminsQuery.isLoading}
          />

          <SearchableSelect
            label="Assigned Worker"
            value={assignedWorkerId}
            onChange={(value) => setValue("assignedWorkerId", value, { shouldValidate: true })}
            error={errors.assignedWorkerId?.message}
            options={workerOptions}
            placeholder={workersQuery.isLoading ? "Loading workers..." : "Select a worker"}
            disabled={mutation.isPending || workersQuery.isLoading}
          />
        </div>

        {areasQuery.isError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load areas. Bin update needs a valid area from the backend.
          </div>
        ) : null}

        {adminsQuery.isError || workersQuery.isError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load admin or worker users. Assignment fields are currently unavailable.
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {mutation.error?.response?.data?.message ||
              "Failed to update bin. Please verify the backend payload shape and try again."}
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
