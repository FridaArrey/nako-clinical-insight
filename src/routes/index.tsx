import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { ResearchModules } from "@/components/ResearchModules";
import { ClinicalChat } from "@/components/ClinicalChat";
import { PatientBiobank } from "@/components/PatientBiobank";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NAKO Clinical Decision Support" },
      { name: "description", content: "AI-assisted clinical decision support integrated with NAKO German National Cohort research standards" },
    ],
  }),
});

function Index() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Toaster position="top-right" richColors />
      {/* Top bar */}
      <header className="clinical-header flex items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-primary-foreground">
              Clinical Decision Support System
            </h1>
            <p className="text-xs text-primary-foreground/70">
              NAKO Gesundheitsstudie · Evidence-Based Protocol Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-2.5 py-1 text-xs text-primary-foreground/80">
            <span className="pulse-dot" style={{ backgroundColor: "oklch(0.75 0.18 150)" }} />
            System Online
          </span>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="grid flex-1 grid-cols-[280px_1fr_320px] overflow-hidden">
        {/* Left — Research Modules */}
        <aside className="border-r bg-card overflow-hidden">
          <ResearchModules selectedModule={selectedModule} onSelectModule={setSelectedModule} />
        </aside>

        {/* Center — Clinical AI Chat */}
        <main className="overflow-hidden bg-background">
          <ClinicalChat selectedModule={selectedModule} />
        </main>

        {/* Right — Patient Biobank Profile */}
        <aside className="border-l bg-card overflow-hidden">
          <PatientBiobank />
        </aside>
      </div>
    </div>
  );
}
