import { useQuery } from "@tanstack/react-query";
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
import { getAnalyticsSummary } from "@/features/analytics/api/get-analytics-summary";
import { getDailyFillingAmounts } from "@/features/analytics/api/get-daily-filling-amounts";
import { getWasteTypesByArea } from "@/features/analytics/api/get-waste-types-by-area";

function AnalyticsPage() {
  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
  });

  const { data: dailyData, isLoading: isDailyLoading, isError: isDailyError } = useQuery({
    queryKey: ["analytics", "daily"],
    queryFn: getDailyFillingAmounts,
  });

  const { data: areaData, isLoading: isAreaLoading, isError: isAreaError } = useQuery({
    queryKey: ["analytics", "area"],
    queryFn: getWasteTypesByArea,
  });

  const isLoading = isSummaryLoading || isDailyLoading || isAreaLoading;
  const isError = isSummaryError || isDailyError || isAreaError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Performance Insights"
          title="Analytics"
          description="Advanced visual insights for waste patterns, area performance, and collection trends."
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Performance Insights"
          title="Analytics"
          description="Advanced visual insights for waste patterns, area performance, and collection trends."
          breadcrumbs={[{ label: "Analytics" }]}
        />
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">
          Failed to load analytics data.
        </div>
      </div>
    );
  }

  const totalCollected = summaryData?.totalCollected || "0.00T";
  const highestWasteArea = summaryData?.highestWasteArea || "N/A";
  const mostCollectedType = summaryData?.mostCollectedType || "N/A";
  const avgDailyFilling = summaryData?.avgDailyFilling || "0%";

  const wasteDistributionAreas = Array.isArray(summaryData?.wasteDistributionAreas)
    ? summaryData.wasteDistributionAreas
    : [];

  const mostCollectedWasteTypes = Array.isArray(summaryData?.mostCollectedWasteTypes)
    ? summaryData.mostCollectedWasteTypes
    : [];

  const compartmentTrend = Array.isArray(summaryData?.compartmentTrend)
    ? summaryData.compartmentTrend
    : [];

  const dailyFillingAmounts = Array.isArray(dailyData?.dailyFillingAmounts)
    ? dailyData.dailyFillingAmounts
    : [];

  const fillLevelVsCollections = Array.isArray(dailyData?.fillLevelVsCollections)
    ? dailyData.fillLevelVsCollections
    : [];

  const wasteTypesByArea = Array.isArray(areaData)
    ? areaData
    : [];

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
          value={totalCollected}
          description="Across all monitored areas"
          icon={BarChart3}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <StatusCard
          title="Highest Waste Area"
          value={highestWasteArea}
          description="Leading in total collected waste"
          icon={Layers3}
          iconClassName="bg-amber-100 text-amber-700"
        />
        <StatusCard
          title="Most Collected Type"
          value={mostCollectedType}
          description="Top waste type by volume"
          icon={PieChartIcon}
          iconClassName="bg-sky-100 text-sky-700"
        />
        <StatusCard
          title="Avg Daily Filling"
          value={avgDailyFilling}
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
