import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axiosClient from "@/lib/axios";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import { createAreaSchema } from "@/features/areas/schemas/create-area-schema";

const createArea = async (payload) => {
  const response = await axiosClient.post("/areas", payload);
  return response.data;
};

function CreateAreaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      navigate("/areas");
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create Area</h2>
        <p className="mt-2 text-sm text-slate-500">
          Add a new operational area for Mihashi&apos;s Smart Waste Management System.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5">
          <FormInput
            label="Area Name"
            name="name"
            placeholder="e.g. Malabe Campus"
            register={register}
            error={errors.name?.message}
            disabled={mutation.isPending}
          />

          <FormTextarea
            label="Description"
            name="description"
            placeholder="Describe the purpose of this area"
            register={register}
            error={errors.description?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="Address"
            name="address"
            placeholder="Optional address or location description"
            register={register}
            error={errors.address?.message}
            disabled={mutation.isPending}
          />
        </div>

        {mutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to create area. Please check the backend request and try again.
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
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
