import { useMemo } from "react";
import { CircleMarker, MapContainer, Polygon, TileLayer, useMapEvents } from "react-leaflet";

function MapClickHandler({ points, setPoints, parentPolygon = null }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      const nextPoint = [lat, lng];

      if (parentPolygon && !isPointInsidePolygon(nextPoint, parentPolygon)) {
        return;
      }

      setPoints([...points, nextPoint]);
    },
  });

  return null;
}

function isPointInsidePolygon(point, polygonPoints) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const [xi, yi] = polygonPoints[i];
    const [xj, yj] = polygonPoints[j];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-10) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function pointsToGeoJson(points) {
  if (!points || points.length < 3) return null;

  const ring = points.map(([lat, lng]) => [lng, lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];

  const closed = first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];

  return {
    type: "Polygon",
    coordinates: [closed],
  };
}

function geoJsonToPoints(geoFence) {
  if (
    !geoFence ||
    geoFence.type !== "Polygon" ||
    !Array.isArray(geoFence.coordinates) ||
    !Array.isArray(geoFence.coordinates[0])
  ) {
    return [];
  }

  const ring = geoFence.coordinates[0];

  const withoutClosingPoint =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring;

  return withoutClosingPoint.map(([lng, lat]) => [lat, lng]);
}

function getPolygonCenter(points, fallback) {
  if (!points.length) return fallback;

  const lat = points.reduce((sum, [pLat]) => sum + pLat, 0) / points.length;
  const lng = points.reduce((sum, [, pLng]) => sum + pLng, 0) / points.length;

  return [lat, lng];
}

function GeofenceMapEditor({
  value,
  onChange,
  parentGeoFence = null,
  center = [7.8731, 80.7718],
  zoom = 8,
}) {
  const points = useMemo(() => geoJsonToPoints(value), [value]);
  const parentPoints = useMemo(() => geoJsonToPoints(parentGeoFence), [parentGeoFence]);

  const setPoints = (nextPoints) => {
    onChange(pointsToGeoJson(nextPoints));
  };

  const mapCenter =
    parentPoints.length > 0
      ? getPolygonCenter(parentPoints, center)
      : points.length > 0
        ? getPolygonCenter(points, center)
        : center;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={mapCenter}
          zoom={parentPoints.length > 0 ? 12 : zoom}
          scrollWheelZoom
          className="h-105 w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            points={points}
            setPoints={setPoints}
            parentPolygon={parentPoints.length >= 3 ? parentPoints : null}
          />

          {parentPoints.length >= 3 && (
            <Polygon
              positions={parentPoints}
              pathOptions={{
                color: "#0f172a",
                weight: 2,
                fillOpacity: 0.08,
              }}
            />
          )}

          {points.map((point, index) => (
            <CircleMarker
              key={`${point[0]}-${point[1]}-${index}`}
              center={point}
              radius={6}
              pathOptions={{
                color: "#059669",
                fillColor: "#10b981",
                fillOpacity: 1,
              }}
            />
          ))}

          {points.length >= 3 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#10b981",
                weight: 3,
                fillOpacity: 0.2,
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPoints([])}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Polygon
        </button>

        <button
          type="button"
          onClick={() => {
            if (points.length > 0) {
              setPoints(points.slice(0, -1));
            }
          }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Undo Last Point
        </button>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        {parentPoints.length >= 3
          ? "Click inside the parent area boundary to draw the sub-area polygon."
          : "Click on the map to add polygon points. A valid geofence needs at least 3 points."}
      </div>
    </div>
  );
}

export default GeofenceMapEditor;
