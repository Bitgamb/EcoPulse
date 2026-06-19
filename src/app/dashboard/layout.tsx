import { Sidebar } from "@/components/layout/sidebar";import { DataProvider } from "@/components/dashboard/data-provider";
export default function DashboardLayout({children}:{children:React.ReactNode}){return <DataProvider><Sidebar/><main className="min-h-screen bg-paper px-4 pb-20 pt-20 lg:ml-64 lg:px-8 lg:pt-8"><div className="mx-auto max-w-6xl">{children}</div></main></DataProvider>}
