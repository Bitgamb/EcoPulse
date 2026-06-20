import { DataErrorBanner } from "@/components/dashboard/data-error-banner";
import { DataProvider } from "@/components/dashboard/data-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { loadDashboardData } from "@/lib/dashboard-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialData = await loadDashboardData();

  return (
    <DataProvider initialData={initialData}>
      <a
        href="#dashboard-content"
        className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-md bg-ink px-4 py-2 font-bold text-white focus:translate-y-0"
      >
        Skip to dashboard content
      </a>
      <Sidebar />
      <main
        id="dashboard-content"
        tabIndex={-1}
        className="min-h-screen bg-paper px-4 pb-20 pt-20 lg:ml-64 lg:px-8 lg:pt-8"
      >
        <div className="mx-auto max-w-6xl">
          <DataErrorBanner />
          {children}
        </div>
      </main>
    </DataProvider>
  );
}
