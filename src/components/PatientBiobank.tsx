import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const baselineData = {
  participantId: "NAKO-SYN-048291",
  cohort: "Synthetic NAKO Baseline",
  collectionDate: "2023-09-14",
  assessmentCenter: "Charité – Universitätsmedizin Berlin",
  biomarkers: [
    { label: "BMI", value: "27.4", unit: "kg/m²", status: "elevated" as const },
    { label: "Fasting Glucose", value: "112", unit: "mg/dL", status: "elevated" as const },
    { label: "Liver Fat (PDFF)", value: "8.3", unit: "%", status: "high" as const },
    { label: "Systolic BP", value: "134", unit: "mmHg", status: "elevated" as const },
    { label: "HbA1c", value: "5.9", unit: "%", status: "elevated" as const },
    { label: "Total Cholesterol", value: "218", unit: "mg/dL", status: "elevated" as const },
  ],
  icdCodes: [
    { code: "E11.9", description: "Type 2 diabetes mellitus, without complications" },
    { code: "K76.0", description: "Fatty liver, not elsewhere classified" },
    { code: "I10", description: "Essential (primary) hypertension" },
    { code: "E66.0", description: "Obesity due to excess calories" },
  ],
};

const statusBadgeClass: Record<string, string> = {
  normal: "clinical-badge clinical-badge-normal",
  elevated: "clinical-badge clinical-badge-elevated",
  high: "clinical-badge clinical-badge-high",
};

export function PatientBiobank() {
  const handleFlag = () => {
    toast.success("Flagged for Longitudinal Follow-up", {
      description: `Participant ${baselineData.participantId} added to 5-year follow-up cohort.`,
    });
  };

  const handleSync = () => {
    toast.success("Synced to Hospital HIS", {
      description: "Data transmitted to Charité SAP i.s.h.med via HL7 FHIR R4.",
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Patient Biobank Profile</h2>
            <p className="text-xs text-muted-foreground">{baselineData.participantId}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cohort Info */}
        <div className="rounded-md border bg-secondary/30 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cohort</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{baselineData.cohort}</p>
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{baselineData.assessmentCenter}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Collected: {baselineData.collectionDate}</p>
        </div>

        {/* Biomarkers */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biomarkers</p>
          <div className="rounded-md border bg-card">
            {baselineData.biomarkers.map((marker, i) => (
              <div key={i} className="data-row px-3">
                <span className="text-sm text-foreground">{marker.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium text-foreground">
                    {marker.value} <span className="text-xs text-muted-foreground">{marker.unit}</span>
                  </span>
                  <span className={statusBadgeClass[marker.status]}>{marker.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ICD-10-GM Codes */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ICD-10-GM Codes</p>
          <div className="space-y-1.5">
            {baselineData.icdCodes.map((icd, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border bg-card px-3 py-2">
                <span className="clinical-badge clinical-badge-icd mt-0.5">{icd.code}</span>
                <span className="text-xs leading-relaxed text-foreground">{icd.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t p-3 space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleFlag}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          Flag for Longitudinal Follow-up
        </Button>
        <Button size="sm" className="w-full justify-start gap-2" onClick={handleSync}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Sync to Hospital HIS
        </Button>
      </div>
    </div>
  );
}
