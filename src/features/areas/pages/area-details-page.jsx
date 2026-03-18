import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Pencil, Plus, Trash2 } from "lucide-react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import ConfirmModal from "@/components/ui/modal/confirm-modal";
import Toast from "@/components/ui/toast";
import { getAreaById } from "@/features/areas/api/get-area-by-id";
import { deleteArea } from "@/features/areas/api/delete-area";

function getMapPoints(geoFence) {
  if (
    !geoFence ||
    geoFence.type !== "Polygon" ||
    !Array.isArray(geoFence.coordinates) ||
    !Array.isArray(geoFence.coordinates[0])
  ) {
    return [];
  }

  return geoFence.coordinates[0].map(([lng, lat]) => [lat, lng]);
}

function getAreaTypeLabel(area) {
  if (area?.level === 1) return "Province";
  if (area?.level === 2) return "District";
  if (area?.level === 3) return "City";
  return "Linked Administrative Area";
}

function getParentAreaName(parentAreaId) {
  if (!parentAreaId) return "No parent area";
  if (typeof parentAreaId === "object" && parentAreaId?.name) {
    return parentAreaId.name;
  }
  return "Parent linked";
}

function FitPolygonBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, points]);

  return null;
}

function createMaskPolygon(points) {
  if (!points?.length) return [];

  const worldRing = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
    [90, -180],
  ];

  return [worldRing, points];
}

function AreaDetailsPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const area = useMemo(() => data?.data || null, [data]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      navigate("/areas");
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading area details...
      </div>
    );
  }

  if (isError || !area) {
    return (
      <Toast
        variant="error"
        title="Failed to load area"
        description="The requested area could not be loaded."
      />
    );
  }

  const polygonPoints = getMapPoints(area.geoFence);
  const maskPolygon = createMaskPolygon(polygonPoints);

  return (
    <div className="space-y-6">
      {deleteMutation.isError ? (
        <Toast
          variant="error"
          title="Failed to delete area"
          description={
            deleteMutation.error?.response?.data?.message ||
            deleteMutation.error?.message ||
            "Please try again."
          }
        />
      ) : null}

      <PageHeader
        eyebrow="Area Details"
        title={area.name}
        description={`Area code: ${area.code}`}
        breadcrumbs={[{ label: "Areas", to: "/areas" }, { label: area.name }]}
        actions={
          <>
            <Link
              to={`/areas/${areaId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit Area
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Bin
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="space-y-6">
          <SectionCard title="Area Information">
            <div className="grid gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">Name</span>
                <p className="mt-2 text-sm font-medium text-slate-900">{area.name}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">Code</span>
                <p className="mt-2 text-sm font-medium text-slate-900">{area.code}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">Area Type</span>
                <p className="mt-2 text-sm font-medium text-slate-900">{getAreaTypeLabel(area)}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <GitBranch className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider">Parent Area</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {getParentAreaName(area.parentAreaId)}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Area Actions">
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/areas/${areaId}/edit`}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Edit Area
              </Link>

              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Area
                </span>
              </button>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Selected Geofence Preview"
          description="Only the selected area boundary is highlighted and focused"
        >
          {polygonPoints.length >= 3 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <MapContainer
                center={polygonPoints[0]}
                zoom={13}
                scrollWheelZoom
                className="h-105 w-full"
              >
                <FitPolygonBounds points={polygonPoints} />

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polygon
                  positions={maskPolygon}
                  pathOptions={{
                    fillColor: "#020618",
                    fillOpacity: 0.45,
                    stroke: false,
                  }}
                />

                <Polygon
                  positions={polygonPoints}
                  pathOptions={{
                    color: "#00bc7d",
                    weight: 3,
                    fillColor: "#00bc7d",
                    fillOpacity: 0.2,
                  }}
                />
              </MapContainer>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
              No boundary preview available for this area.
            </div>
          )}
        </SectionCard>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete area"
        description={`Are you sure you want to delete ${area.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}

export default AreaDetailsPage;
