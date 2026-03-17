import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen bg-background">
			<Sidebar />
			<div className="flex min-h-screen flex-1 flex-col">
				<Topbar />
				<main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
				<Footer />
			</div>
		</div>
	);
}
