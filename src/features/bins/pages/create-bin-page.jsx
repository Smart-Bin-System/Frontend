import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import SearchableSelect from "@/components/ui/input/searchable-select";
import PageHeader from "@/components/ui/page-header";
import { createBinSchema } from "@/features/bins/schemas/create-bin-schema";
import { getAreas } from "@/features/areas/api/get-areas";
import { getAdmins } from "@/features/users/api/get-admins";
import { getWorkers } from "@/features/users/api/get-workers";
import { registerBin } from "@/features/bins/api/register-bin";
import { syncBin } from "@/features/bins/api/sync-bin";

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

function CreateBinPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [createdBin, setCreatedBin] = useState(null);
  const [pairingCode, setPairingCode] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
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

  const createMutation = useMutation({
    mutationFn: registerBin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      setCreatedBin(data?.data || null);
      setPairingCode("");
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncBin,
    onSuccess: (data) => {
      setPairingCode(data?.data?.code || "");
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });

  const areas = useMemo(() => areasQuery.data?.data || areasQuery.data || [], [areasQuery.data]);

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
    resetField("districtId");
    resetField("areaId");
  }, [provinceId, resetField]);

  useEffect(() => {
    resetField("areaId");
  }, [districtId, resetField]);

  const onSubmit = (values) => {
    createMutation.mutate(values);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Bin Management"
        title="Create Bin"
        description="Register a new smart bin and connect it to an operational area."
        breadcrumbs={[{ label: "Bins", to: "/bins" }, { label: "Create" }]}
      />

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
            disabled={createMutation.isPending}
          />

          <SearchableSelect
            label="Province"
            value={provinceId}
            onChange={(value) => setValue("provinceId", value, { shouldValidate: true })}
            error={errors.provinceId?.message}
            options={provinceOptions}
            placeholder={areasQuery.isLoading ? "Loading provinces..." : "Select a province"}
            disabled={createMutation.isPending || areasQuery.isLoading}
          />

          <SearchableSelect
            label="District"
            value={districtId}
            onChange={(value) => setValue("districtId", value, { shouldValidate: true })}
            error={errors.districtId?.message}
            options={districtOptions}
            placeholder={!provinceId ? "Select a province first" : "Select a district"}
            disabled={createMutation.isPending || !provinceId}
          />

          <SearchableSelect
            label="City"
            value={areaId}
            onChange={(value) => setValue("areaId", value, { shouldValidate: true })}
            error={errors.areaId?.message}
            options={cityOptions}
            placeholder={!districtId ? "Select a district first" : "Select a city"}
            disabled={createMutation.isPending || !districtId}
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Description"
              name="description"
              placeholder="Describe this smart bin"
              register={register}
              error={errors.description?.message}
              disabled={createMutation.isPending}
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              name="address"
              placeholder="Optional location address"
              register={register}
              error={errors.address?.message}
              disabled={createMutation.isPending}
            />
          </div>

          <FormInput
            label="Latitude"
            name="latitude"
            placeholder="e.g. 6.9271"
            register={register}
            error={errors.latitude?.message}
            disabled={createMutation.isPending}
          />

          <FormInput
            label="Longitude"
            name="longitude"
            placeholder="e.g. 79.8612"
            register={register}
            error={errors.longitude?.message}
            disabled={createMutation.isPending}
          />

          <SearchableSelect
            label="Assigned Admin"
            value={assignedAdminId}
            onChange={(value) => setValue("assignedAdminId", value, { shouldValidate: true })}
            error={errors.assignedAdminId?.message}
            options={adminOptions}
            placeholder={adminsQuery.isLoading ? "Loading admins..." : "Select an admin"}
            disabled={createMutation.isPending || adminsQuery.isLoading}
          />

          <SearchableSelect
            label="Assigned Worker"
            value={assignedWorkerId}
            onChange={(value) => setValue("assignedWorkerId", value, { shouldValidate: true })}
            error={errors.assignedWorkerId?.message}
            options={workerOptions}
            placeholder={workersQuery.isLoading ? "Loading workers..." : "Select a worker"}
            disabled={createMutation.isPending || workersQuery.isLoading}
          />
        </div>

        {areasQuery.isError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load areas. Bin creation needs a valid area from the backend.
          </div>
        ) : null}

        {adminsQuery.isError || workersQuery.isError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load admin or worker users. Assignment fields are currently unavailable.
          </div>
        ) : null}

        {createMutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {createMutation.error?.response?.data?.message ||
              "Failed to create bin. Please verify the backend payload shape and try again."}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? "Creating..." : "Create Bin"}
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

      {createdBin ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Bin Created</h3>
          <p className="mt-2 text-sm text-slate-500">
            The smart bin was created successfully. You can now sync it to generate a pairing code.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Bin ID</p>
              <p className="mt-1 text-sm text-slate-900">{createdBin.id}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Public ID
              </p>
              <p className="mt-1 text-sm text-slate-900">{createdBin.publicId}</p>
            </div>
          </div>

          {syncMutation.isError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {syncMutation.error?.response?.data?.message ||
                "Failed to sync bin. Please try again."}
            </div>
          ) : null}

          {pairingCode ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Pairing Code
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[0.2em] text-emerald-700">
                {pairingCode}
              </p>
              <p className="mt-2 text-sm text-emerald-700">
                Use this code on the ESP32 pairing flow before it expires.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => syncMutation.mutate(createdBin.id)}
              disabled={syncMutation.isPending}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {syncMutation.isPending ? "Syncing..." : "Sync Bin"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/bins")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Go to Bins
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CreateBinPage;
