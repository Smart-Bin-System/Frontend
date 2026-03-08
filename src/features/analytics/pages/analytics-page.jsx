import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fillTrendData = [
  { day: "Mon", fill: 48 },
  { day: "Tue", fill: 62 },
  { day: "Wed", fill: 57 },
  { day: "Thu", fill: 74 },
  { day: "Fri", fill: 81 },
  { day: "Sat", fill: 68 },
  { day: "Sun", fill: 72 },
];

const areaCollectionData = [
  { area: "Malabe", bins: 8 },
  { area: "Library", bins: 5 },
  { area: "Food Court", bins: 6 },
  { area: "Hostel", bins: 5 },
];

const plasticCategoryData = [
  { name: "PET", value: 28, color: "#10b981" },
  { name: "HDPE", value: 22, color: "#3b82f6" },
  { name: "LDPE", value: 18, color: "#f59e0b" },
  { name: "PP", value: 32, color: "#ef4444" },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Visual insights for waste collection patterns and smart bin usage
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Weekly Fill Trend</h3>
          <p className="mt-1 text-sm text-slate-500">
            Average fill level progression across the week
          </p>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fillTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fill"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Fill Level %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Area-wise Bin Distribution</h3>
          <p className="mt-1 text-sm text-slate-500">
            Number of smart bins assigned per operational area
          </p>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bins" fill="#0f172a" radius={[8, 8, 0, 0]} name="Bins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Plastic Category Distribution</h3>
        <p className="mt-1 text-sm text-slate-500">
          Estimated segregation share across supported plastic types
        </p>

        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={plasticCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {plasticCategoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
