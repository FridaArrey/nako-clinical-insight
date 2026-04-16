import { cn } from "@/lib/utils";

export interface NakoModule {
  id: string;
  title: string;
  description: string;
  variables: number;
  status: "active" | "pending";
}

const modules: NakoModule[] = [
  {
    id: "anthropometry",
    title: "Anthropometry & BP",
    description: "Height, weight, waist circumference, systolic/diastolic blood pressure, heart rate",
    variables: 12,
    status: "active",
  },
  {
    id: "metabolic",
    title: "Metabolic Markers",
    description: "HbA1c, fasting glucose, lipid panel, liver enzymes (ALT, AST, GGT)",
    variables: 18,
    status: "active",
  },
  {
    id: "mri",
    title: "MRI Incidental Findings",
    description: "Whole-body MRI screening, liver fat quantification, cardiac function assessment",
    variables: 24,
    status: "pending",
  },
  {
    id: "quantum",
    title: "Quantum Analysis",
    description: "Quantum-enhanced metabolic risk prediction via Guppy/Hugr IR pipeline (classical simulation)",
    variables: 6,
    status: "pending",
  },
];

interface ResearchModulesProps {
  selectedModule: string | null;
  onSelectModule: (id: string) => void;
}

export function ResearchModules({ selectedModule, onSelectModule }: ResearchModulesProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">NAKO Study Modules</h2>
            <p className="text-xs text-muted-foreground">German National Cohort</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Assessment Modules
        </p>
        <div className="space-y-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={cn(
                "clinical-module-card w-full cursor-pointer rounded-md bg-card p-3 text-left transition-all",
                selectedModule === mod.id && "active"
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-foreground">{mod.title}</span>
                <span className={cn(
                  "clinical-badge",
                  mod.status === "active" ? "clinical-badge-normal" : "clinical-badge-elevated"
                )}>
                  {mod.status}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mod.description}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                </svg>
                {mod.variables} variables
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-md border bg-secondary/50 p-3">
          <p className="text-xs font-medium text-foreground">Data Source</p>
          <p className="mt-0.5 text-xs text-muted-foreground">NAKO Gesundheitsstudie, Baseline (n=205,000)</p>
          <p className="mt-1 text-xs text-muted-foreground">Ref: PMC9581448</p>
        </div>
      </div>
    </div>
  );
}
