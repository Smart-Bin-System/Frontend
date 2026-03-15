import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  LineChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "@/components/ui/page-header";
import StatusCard from "@/components/ui/card/status-card";
import SectionCard from "@/components/ui/card/section-card";
import { BarChart3, ChartNoAxesColumn, Layers3, PieChart as PieChartIcon } from "lucide-react";

const wasteTypesByArea = [
  { area: "Malabe", PET: 240, HDPE: 160, LDPE: 120, PP: 190 },
  { area: "Library", PET: 130, HDPE: 90, LDPE: 70, PP: 100 },
  { area: "Food Court", PET: 280, HDPE: 170, LDPE: 150, PP: 210 },
  { area: "Hostel", PET: 200, HDPE: 120, LDPE: 100, PP: 140 },
];

const wasteDistributionAreas = [
  { name: "Malabe", value: 31, color: "#10b981" },
  { name: "Library", value: 16, color: "#3b82f6" },
  { name: "Food Court", value: 34, color: "#f59e0b" },
  { name: "Hostel", value: 19, color: "#ef4444" },
];

const dailyFillingAmounts = [
  { day: "Mon", amount: 52 },
  { day: "Tue", amount: 61 },
  { day: "Wed", amount: 67 },
  { day: "Thu", amount: 74 },
  { day: "Fri", amount: 88 },
  { day: "Sat", amount: 79 },
  { day: "Sun", amount: 70 },
];

const mostCollectedWasteTypes = [
  { type: "PET", collected: 850 },
  { type: "PP", collected: 640 },
  { type: "HDPE", collected: 540 },
  { type: "LDPE", collected: 440 },
];

const compartmentTrend = [
  { month: "Jan", PET: 320, HDPE: 210, LDPE: 180, PP: 260 },
  { month: "Feb", PET: 340, HDPE: 220, LDPE: 190, PP: 270 },
  { month: "Mar", PET: 380, HDPE: 240, LDPE: 200, PP: 300 },
  { month: "Apr", PET: 410, HDPE: 250, LDPE: 215, PP: 325 },
  { month: "May", PET: 430, HDPE: 270, LDPE: 230, PP: 340 },
];

const fillLevelVsCollections = [
  { day: "Mon", fill: 48, collections: 12 },
  { day: "Tue", fill: 62, collections: 15 },
  { day: "Wed", fill: 57, collections: 13 },
  { day: "Thu", fill: 74, collections: 18 },
  { day: "Fri", fill: 81, collections: 21 },
  { day: "Sat", fill: 68, collections: 16 },
  { day: "Sun", fill: 72, collections: 17 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance Insights"
        title="Analytics"
        description="Advanced visual insights for waste patterns, area performance, and collection trends."
        breadcrumbs={[{ label: "Analytics" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Total Collected"
          value="2.47T"
          description="Across all monitored areas"
          icon={BarChart3}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <StatusCard
          title="Highest Waste Area"
          value="Food Court"
          description="Leading in total collected waste"
          icon={Layers3}
          iconClassName="bg-amber-100 text-amber-700"
        />
        <StatusCard
          title="Most Collected Type"
          value="PET"
          description="Top waste type by volume"
          icon={PieChartIcon}
          iconClassName="bg-sky-100 text-sky-700"
        />
        <StatusCard
          title="Avg Daily Filling"
          value="70%"
          description="Average daily fill rate"
          icon={ChartNoAxesColumn}
          iconClassName="bg-violet-100 text-violet-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Waste Types by Area"
          description="Compare PET, HDPE, LDPE, and PP collection volumes by area."
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteTypesByArea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="PET" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="HDPE" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="LDPE" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="PP" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Waste Distribution Around Areas"
          description="Overall share of collected waste by operational area."
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteDistributionAreas}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label
                >
                  {wasteDistributionAreas.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Daily Filling Amounts"
          description="Track average fill accumulation through the week."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyFillingAmounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.18}
                  strokeWidth={3}
                  name="Filling %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Most Collected Waste Types"
          description="Compare total collected amounts by waste type."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostCollectedWasteTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" />
                <Tooltip />
                <Bar dataKey="collected" fill="#0f172a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Monthly Waste Type Trend"
          description="Waste collection growth trend across months."
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={compartmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="PET" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="HDPE" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="LDPE" stroke="#f59e0b" strokeWidth={3} />
                <Line type="monotone" dataKey="PP" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Fill Levels vs Collection Runs"
          description="Compare average fill percentages with collection activity."
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fillLevelVsCollections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fill" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="collections" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default AnalyticsPage;
