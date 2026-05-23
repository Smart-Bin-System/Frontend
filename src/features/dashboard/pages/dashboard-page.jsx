import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Trash2, WifiOff } from "lucide-react";
import { getDashboardData } from "@/features/dashboard/api/get-dashboard-data";
import { useAuth } from "@/hooks/use-auth";
import { getWorkerTasks } from "@/features/dashboard/api/get-worker-tasks";
import { completeTask } from "@/features/dashboard/api/complete-task";
import { emptyBinDirectly } from "@/features/dashboard/api/empty-bin";
import { getBins } from "@/features/bins/api/get-bins";

const iconMap = {
  Trash2,
  CheckCircle2,
  WifiOff,
  AlertTriangle,
};

function severityClass(severity) {
  switch ((severity || "").toLowerCase()) {
    case "critical":
    case "high":
      return "bg-rose-100 text-rose-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function resolveStatIcon(iconName) {
  return iconMap[iconName] || Trash2;
}

function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardData,
  });

  const statCards = Array.isArray(data?.statCards) ? data.statCards : [];
  const recentAlerts = Array.isArray(data?.recentAlerts) ? data.recentAlerts : [];
  const areaStatus = Array.isArray(data?.areaStatus) ? data.areaStatus : [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = resolveStatIcon(card.icon);

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</h3>
                  <p className="mt-2 text-sm text-slate-500">{card.change}</p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg || "bg-slate-100"} ${card.iconText || "text-slate-700"}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
              <p className="text-sm text-slate-500">
                Latest operational issues detected across smart bins
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-2 font-medium">Bin</th>
                  <th className="pb-2 font-medium">Area</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Severity</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert, index) => (
                    <tr
                      key={alert.id || `${alert.bin || "BIN"}-${alert.time || index}`}
                      className="rounded-xl bg-slate-50"
                    >
                      <td className="rounded-l-xl px-4 py-3 text-sm font-medium text-slate-900">
                        {alert.bin}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{alert.area}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{alert.type}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass(alert.severity)}`}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="rounded-r-xl px-4 py-3 text-sm text-slate-500">
                        {alert.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                      No recent alerts available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Area Status Overview</h2>
          <p className="text-sm text-slate-500">Summary of area-wise smart bin availability</p>

          <div className="mt-5 space-y-4">
            {areaStatus.length > 0 ? (
              areaStatus.map((item) => {
                const binsCount = Number(item.bins) || 0;
                const active = Number(item.active) || 0;
                const uptime = binsCount > 0 ? Math.round((active / binsCount) * 100) : 0;

                return (
                  <div key={item.area} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{item.area}</h3>
                        <p className="mt-1 text-xs text-slate-500">{binsCount} total bins</p>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {active} active
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${uptime}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Issues: {item.issues}</span>
                      <span>Uptime: {uptime}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                No area status available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useQuery({
    queryKey: ["tasks", "my-tasks"],
    queryFn: getWorkerTasks,
  });

  const { data: bins, isLoading: binsLoading, isError: binsError } = useQuery({
    queryKey: ["bins"],
    queryFn: getBins,
  });

  const completeMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });

  const emptyBinMutation = useMutation({
    mutationFn: emptyBinDirectly,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });

  if (tasksLoading || binsLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        Loading worker console...
      </div>
    );
  }

  if (tasksError || binsError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">
        Failed to load worker data.
      </div>
    );
  }

  const userId = user?.id || user?._id;
  const myBins = Array.isArray(bins)
    ? bins.filter(
        (b) =>
          b.assignedWorkerId === userId ||
          b.assignedWorkerId?._id === userId ||
          (typeof b.assignedWorkerId === "object" && b.assignedWorkerId?.toString() === userId?.toString())
      )
    : [];

  const activeTasks = Array.isArray(tasks)
    ? tasks.filter((t) => t.status === "open" || t.status === "in_progress")
    : [];

  const completedToday = Array.isArray(tasks)
    ? tasks.filter((t) => {
        if (t.status !== "done" || !t.completedAt) return false;
        const compDate = new Date(t.completedAt);
        const today = new Date();
        return (
          compDate.getDate() === today.getDate() &&
          compDate.getMonth() === today.getMonth() &&
          compDate.getFullYear() === today.getFullYear()
        );
      }).length
    : 0;

  // Calculate highest fill level among assigned bins
  let highestFill = 0;
  myBins.forEach((b) => {
    if (b.fillLevel > highestFill) {
      highestFill = b.fillLevel;
    }
  });

  const binsNeedingAttention = myBins.filter((b) => b.fillLevel >= 75).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Welcome back, {user?.name}!</h2>
          <p className="text-sm text-slate-500">Here are your assigned waste collection tasks and routes for today.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Jobs</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-900">{activeTasks.length}</h3>
              <p className="mt-2 text-sm text-slate-500">Pending emptying tasks</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Trash2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Bins Needing Emptying</p>
              <h3 className="mt-3 text-3xl font-semibold text-rose-600">{binsNeedingAttention}</h3>
              <p className="mt-2 text-sm text-slate-500">Filled to 75% or higher</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Highest Fill Level</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-900">{highestFill}%</h3>
              <p className="mt-2 text-sm text-slate-500">Peak bin fill capacity</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Trash2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed Today</p>
              <h3 className="mt-3 text-3xl font-semibold text-emerald-600">{completedToday}</h3>
              <p className="mt-2 text-sm text-slate-500">Bins emptied successfully</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Jobs & Routes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Routes & Jobs</h2>
            <p className="text-sm text-slate-500">
              Assigned collection jobs generated automatically from full bins.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => {
                const bin = task.binId;
                const area = task.areaId;
                if (!bin) return null;

                return (
                  <div key={task._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 uppercase">
                          {task.priority} Priority
                        </span>
                        <h3 className="text-base font-semibold text-slate-900">{bin.name || "Unnamed Bin"}</h3>
                        <p className="text-sm text-slate-600">
                          <strong>Area:</strong> {area?.name || "Unassigned"}
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Location:</strong> {bin.location?.address || "No address provided"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => completeMutation.mutate(task._id)}
                        disabled={completeMutation.isPending}
                        className="self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
                      >
                        Mark as Emptied
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-sans">Compartments</p>
                      <div className="grid gap-4 sm:grid-cols-4">
                        {bin.compartments?.map((c) => (
                          <div key={c.slot} className="rounded-xl border border-slate-200 bg-white p-3">
                            <span className="text-xs font-medium text-slate-500">{c.name}</span>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-sm font-semibold ${c.fillPercent >= 75 ? "text-rose-600" : "text-slate-700"}`}>
                                {c.fillPercent}%
                              </span>
                              <span className="text-xs text-slate-400">Slot {c.slot}</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${c.fillPercent >= 75 ? "bg-rose-500" : "bg-emerald-500"}`}
                                style={{ width: `${c.fillPercent}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No active routes or jobs. Rest up!
              </div>
            )}
          </div>
        </div>

        {/* Assigned Bins Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Assigned Smart Bins</h2>
            <p className="text-sm text-slate-500">Real-time status of all smart bins assigned to you.</p>
          </div>

          <div className="mt-5 space-y-4">
            {myBins.length > 0 ? (
              myBins.map((bin) => (
                <div key={bin._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{bin.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ID: {bin.publicId}</p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                        bin.status === "online"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {bin.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-sans">Max Fill Level:</span>
                    <span className={`text-sm font-bold ${bin.fillLevel >= 75 ? "text-rose-600" : "text-emerald-700"}`}>
                      {bin.fillLevel}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${bin.fillLevel >= 75 ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Seen: {bin.lastSeen}</span>
                    <button
                      type="button"
                      onClick={() => emptyBinMutation.mutate(bin._id)}
                      disabled={emptyBinMutation.isPending}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                    >
                      Force Empty
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No bins assigned to you yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "worker") {
    return <WorkerDashboard />;
  }

  return <AdminDashboard />;
}

export default DashboardPage;
