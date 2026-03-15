import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";

const themes = [
  { name: "Light", icon: Sun, active: true },
  { name: "Dark", icon: Moon, active: false },
  { name: "System", icon: Monitor, active: false },
];

const accentColors = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

function AppearancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interface Preferences"
        title="Appearance"
        description="Adjust the dashboard theme, accents, and visual presentation."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Appearance" }]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Theme Mode">
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((theme) => {
              const Icon = theme.icon;

              return (
                <button
                  key={theme.name}
                  type="button"
                  className={`rounded-2xl border p-5 text-left transition ${
                    theme.active
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    {theme.active ? <Check className="h-5 w-5 text-emerald-600" /> : null}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{theme.name}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Accent Colors">
          <div className="flex flex-wrap gap-4">
            {accentColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`h-12 w-12 rounded-full ${color} ring-4 ring-white shadow`}
              />
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Palette className="h-4 w-4" />
              <p className="text-sm font-medium">Preview</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Theme controls are UI-only for now and will be wired later.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default AppearancePage;
