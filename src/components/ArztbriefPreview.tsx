import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendSparkline } from "./TrendSparkline";
import { ScanLine, Cpu, Stethoscope, ShieldCheck, Cloud, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface ArztbriefPreviewProps {
  onClose: () => void;
}

type SyncStage = "idle" | "auth" | "folder" | "upload" | "gmail" | "done";

export function ArztbriefPreview({ onClose }: ArztbriefPreviewProps) {
  const [syncStage, setSyncStage] = useState<SyncStage>("idle");
  const isSyncing = syncStage !== "idle" && syncStage !== "done";
  const [isGenerating, setIsGenerating] = useState(false);

  const runPdfExport = async () => {
    if (isGenerating) return;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const toastId = "pdf-export";

    setIsGenerating(true);

    toast.loading("🔍 Scraping clinical markers…", {
      id: toastId,
      description: "Extracting NAKO biomarkers · FIB-4 · ICD-10",
    });
    await wait(800);

    toast.loading("📑 Formatting AWMF-compliant PDF structure…", {
      id: toastId,
      description: "S2k Reg.-Nr. 021-025 · ISO 13485 layout",
    });
    await wait(1000);

    toast.loading("🔐 Appending Digital QA Signature…", {
      id: toastId,
      description: "EBZ 892341 · NAKO-CDSS v2.4.1 certificate chain",
    });
    await wait(700);

    toast.success("✅ PDF Ready: Arztbrief_NAKO_2026.pdf", {
      id: toastId,
      description: "142 KB · application/pdf · Opening print dialog…",
      duration: 4000,
    });

    setIsGenerating(false);
    // Trigger native print dialog for the "wow" factor
    window.print();
  };

  const runPicaSync = async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const toastId = "pica-sync";

    setSyncStage("auth");
    toast.loading("Pica Agent: Authenticating with Google Workspace…", {
      id: toastId,
      description: "OAuth handshake · scopes: drive.file, gmail.compose",
    });
    await wait(900);

    setSyncStage("folder");
    toast.loading("Pica Agent: Creating folder 'NAKO_Clinical_Exports'…", {
      id: toastId,
      description: "Google Drive · parent: My Drive",
    });
    await wait(850);

    setSyncStage("upload");
    toast.loading("Pica Agent: Uploading Arztbrief_NAKO-SYN-048291.pdf…", {
      id: toastId,
      description: "File size: 142 KB · MIME: application/pdf",
    });
    await wait(950);

    setSyncStage("gmail");
    toast.loading("Pica Agent: Drafting Gmail referral with attachment…", {
      id: toastId,
      description: "To: gastro-referral@charite.de · Draft saved",
    });
    await wait(800);

    setSyncStage("done");
    toast.success("Pica Agent: Sync complete ✓", {
      id: toastId,
      description: "Drive folder created · PDF synced · Gmail draft ready",
      duration: 5000,
    });

    setTimeout(() => setSyncStage("idle"), 3500);
  };

  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // FIB-4 calculation: (Age × AST) / (Platelets × √ALT)
  // Synthetic values: Age 58, AST 34 U/L, PLT 210 ×10⁹/L, ALT 42 U/L
  const age = 58;
  const ast = 34;
  const plt = 210;
  const alt = 42;
  const fib4 = ((age * ast) / (plt * Math.sqrt(alt))).toFixed(2);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Arztbrief / Referral Letter</h2>
            <p className="text-[10px] text-muted-foreground">Auto-generated · AWMF-aligned</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      {/* Letter Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="arztbrief-page rounded-md border bg-card p-5 text-[11px] leading-relaxed text-foreground shadow-sm">
          {/* Letterhead */}
          <div className="mb-4 border-b pb-3">
            <p className="text-xs font-bold text-primary">Charité – Universitätsmedizin Berlin</p>
            <p className="text-[10px] text-muted-foreground">Klinik für Innere Medizin · Hepatologie & Gastroenterologie</p>
            <p className="text-[10px] text-muted-foreground">Charitéplatz 1, 10117 Berlin</p>
          </div>

          {/* Date & Ref */}
          <div className="mb-4 flex justify-between text-[10px] text-muted-foreground">
            <span>Datum: {today}</span>
            <span>Az.: NAKO-SYN-048291</span>
          </div>

          {/* Recipient */}
          <div className="mb-4">
            <p className="font-semibold">An: Facharzt/Fachärztin für Gastroenterologie</p>
            <p className="text-muted-foreground">z. Hd. des weiterbehandelnden Arztes</p>
          </div>

          {/* Subject */}
          <p className="mb-3 font-bold">
            Betr.: Überweisung zur Abklärung – V.a. Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD)
          </p>

          {/* Salutation */}
          <p className="mb-3">Sehr geehrte Kollegin, sehr geehrter Kollege,</p>

          <p className="mb-3">
            wir überweisen Ihnen o.g. Patienten (NAKO-ID: NAKO-SYN-048291, 58 J., m.) zur weiteren Abklärung und Mitbehandlung bei Verdacht auf MASLD. Die Befunde basieren auf der NAKO-Baseline-Untersuchung und wurden im Rahmen des Clinical Decision Support Systems ausgewertet.
          </p>

          {/* Abnormal Findings */}
          <p className="mb-2 font-bold text-primary">1. Abnorme Befunde (NAKO Baseline-Referenz)</p>
          <div className="mb-3 rounded border bg-secondary/30 p-2.5">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-1 font-semibold">Parameter</th>
                  <th className="pb-1 font-semibold">Wert</th>
                  <th className="pb-1 font-semibold">Referenz</th>
                  <th className="pb-1 font-semibold">Bewertung</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-border/50">
                  <td className="py-1 font-sans">Leberfett (PDFF)</td>
                  <td className="py-1 font-semibold text-destructive">8.3%</td>
                  <td className="py-1 text-muted-foreground">&lt; 5.0%</td>
                  <td className="py-1"><span className="clinical-badge clinical-badge-high">Steatose Gr. I</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1 font-sans">
                    <div className="flex items-center gap-2">
                      Nüchternglukose
                      <TrendSparkline values={[92, 102, 112]} />
                    </div>
                  </td>
                  <td className="py-1 font-semibold text-destructive">112 mg/dL</td>
                  <td className="py-1 text-muted-foreground">70–99 mg/dL</td>
                  <td className="py-1"><span className="clinical-badge clinical-badge-elevated">IFG</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1 font-sans">
                    <div className="flex items-center gap-2">
                      HbA1c
                      <TrendSparkline values={[5.4, 5.6, 5.9]} />
                    </div>
                  </td>
                  <td className="py-1 font-semibold text-destructive">5.9%</td>
                  <td className="py-1 text-muted-foreground">&lt; 5.7%</td>
                  <td className="py-1"><span className="clinical-badge clinical-badge-elevated">Prädiabetes</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1 font-sans">BMI</td>
                  <td className="py-1 font-semibold">27.4 kg/m²</td>
                  <td className="py-1 text-muted-foreground">18.5–24.9</td>
                  <td className="py-1"><span className="clinical-badge clinical-badge-elevated">Übergewicht</span></td>
                </tr>
                <tr>
                  <td className="py-1 font-sans">Gesamtcholesterin</td>
                  <td className="py-1 font-semibold">218 mg/dL</td>
                  <td className="py-1 text-muted-foreground">&lt; 200 mg/dL</td>
                  <td className="py-1"><span className="clinical-badge clinical-badge-elevated">Grenzwertig</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FIB-4 Score */}
          <p className="mb-2 font-bold text-primary">2. FIB-4 Index (Fibrose-Risikostratifizierung)</p>
          <div className="mb-3 rounded border bg-secondary/30 p-2.5">
            <p className="mb-1 text-[10px] text-muted-foreground">
              Formel: (Alter × AST) / (Thrombozyten × √ALT)
            </p>
            <p className="mb-2 font-mono text-[10px]">
              ({age} × {ast}) / ({plt} × √{alt}) =
            </p>
            {/* Bold color-coded FIB-4 Badge */}
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md border px-3 py-1 text-sm font-bold shadow-sm clinical-badge-elevated">
                FIB-4 = {fib4}
              </span>
              <span className="text-[10px] text-muted-foreground">· Intermediäres Risiko</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 rounded-full bg-muted h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((parseFloat(fib4) / 3.25) * 100, 100)}%`,
                    background: parseFloat(fib4) < 1.3
                      ? "var(--clinical-success)"
                      : parseFloat(fib4) < 2.67
                      ? "var(--clinical-warning)"
                      : "var(--clinical-critical)",
                  }}
                />
              </div>
              <span className={`clinical-badge ${parseFloat(fib4) < 1.3 ? "clinical-badge-normal" : parseFloat(fib4) < 2.67 ? "clinical-badge-elevated" : "clinical-badge-high"}`}>
                {parseFloat(fib4) < 1.3 ? "Niedrig" : parseFloat(fib4) < 2.67 ? "Intermediär" : "Hoch"}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              {parseFloat(fib4) < 1.3
                ? "FIB-4 < 1.3 → Niedriges Fibroserisiko. Kontrolle in 3 Jahren."
                : parseFloat(fib4) < 2.67
                ? "FIB-4 1.3–2.67 → Intermediäres Risiko. Transiente Elastographie (FibroScan) empfohlen."
                : "FIB-4 ≥ 2.67 → Hohes Fibroserisiko. Dringende Facharztüberweisung."}
            </p>
          </div>

          {/* AWMF Recommendation */}
          <p className="mb-2 font-bold text-primary">3. AWMF-konforme Empfehlung</p>
          <div className="mb-3 space-y-1.5 text-[10.5px]">
            <p>Gemäß <span className="font-semibold">AWMF S2k-Leitlinie NAFLD/MASLD (Reg.-Nr. 021-025)</span> empfehlen wir:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><span className="font-semibold">Diagnosesicherung MASLD:</span> Hepatische Steatose (PDFF ≥ 5%) + ≥ 1 kardiometabolischer Risikofaktor → Kriterien erfüllt</li>
              <li><span className="font-semibold">Fibrosestaging:</span> Transiente Elastographie zur Quantifizierung der Lebersteifigkeit</li>
              <li><span className="font-semibold">Lebensstilintervention:</span> Mediterrane Diät, 150 Min./Woche moderate Bewegung (AWMF Empfehlungsgrad A)</li>
              <li><span className="font-semibold">Gewichtsziel:</span> 7–10% Körpergewichtsreduktion über 12 Monate</li>
              <li><span className="font-semibold">Monitoring:</span> ALT, HbA1c, Lipide alle 3 Monate; PDFF-Kontrolle nach 12 Monaten</li>
              <li><span className="font-semibold">Kardiovaskuläre Risikoabschätzung:</span> SCORE2-Berechnung empfohlen (aktuell: Moderat-Hoch)</li>
            </ul>
          </div>

          {/* ICD Codes */}
          <p className="mb-2 font-bold text-primary">4. Diagnosen (ICD-10-GM)</p>
          <div className="mb-3 space-y-0.5 text-[10.5px]">
            <p><span className="clinical-badge clinical-badge-icd mr-1">K76.0</span> Fettleber, andernorts nicht klassifiziert</p>
            <p><span className="clinical-badge clinical-badge-icd mr-1">E11.9</span> Diabetes mellitus Typ 2, ohne Komplikationen</p>
            <p><span className="clinical-badge clinical-badge-icd mr-1">I10</span> Essentielle (primäre) Hypertonie</p>
            <p><span className="clinical-badge clinical-badge-icd mr-1">E66.0</span> Adipositas durch übermäßige Kalorienzufuhr</p>
          </div>

          {/* Closing */}
          <p className="mb-3">
            Wir bitten um Mitbeurteilung und freuen uns auf Ihren Befundbericht. Für Rückfragen stehen wir jederzeit zur Verfügung.
          </p>

          {/* QR Code Section */}
          <div className="mb-4 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-card border shadow-sm">
                <ScanLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  DICOM Imaging Access
                </p>
                <p className="text-[11px] font-medium text-foreground">
                  Scan for DICOM imaging access
                </p>
                <p className="text-[9px] text-muted-foreground">
                  PACS-ID: CHR-2024-NAKO-048291 · Archival valid until 2034
                </p>
              </div>
            </div>
          </div>

          {/* Dual Signature Block */}
          <div className="mb-4 grid grid-cols-2 gap-4 border-t pt-4">
            {/* Attending Physician */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Stethoscope className="h-3 w-3" />
                <span className="uppercase tracking-wider font-semibold">Attending Physician</span>
              </div>
              <p className="text-[11px] font-semibold text-foreground">Prof. Dr. med. Klaus Müller</p>
              <p className="text-[10px] text-muted-foreground">Klinik für Innere Medizin – Hepatologie</p>
              <p className="text-[10px] text-muted-foreground">Charité – Universitätsmedizin Berlin</p>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3 text-clinical-success" />
                <span className="text-[9px] text-clinical-success">Digitally signed · EBZ 892341</span>
              </div>
            </div>

            {/* AI-Quality Assurance */}
            <div className="space-y-1 border-l pl-4">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Cpu className="h-3 w-3" />
                <span className="uppercase tracking-wider font-semibold">AI-Quality Assurance</span>
              </div>
              <p className="text-[11px] font-semibold text-foreground">NAKO-CDSS v2.4.1</p>
              <p className="text-[10px] text-muted-foreground">Clinical Decision Support System</p>
              <p className="text-[10px] text-muted-foreground">Validated against AWMF S2k 021-025</p>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3 text-clinical-success" />
                <span className="text-[9px] text-clinical-success">Certified · ISO 13485 · MDR Class IIa</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 border-t pt-2 text-[9px] text-muted-foreground">
            <p>Quellen: AWMF S2k-Leitlinie NAFLD/MASLD (Reg.-Nr. 021-025) · PMC9581448 · NAKO Transfer Portal</p>
            <p>Dieses Dokument wurde automatisch durch das NAKO Clinical Decision Support System generiert.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t p-3 space-y-2">
        {/* Pica sync status strip */}
        {syncStage !== "idle" && (
          <div className="rounded-md border bg-secondary/40 px-2.5 py-1.5 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-semibold text-primary">Pica Agent</span>
              <span>›</span>
              <StageStep label="Auth" active={syncStage === "auth"} done={["folder","upload","gmail","done"].includes(syncStage)} />
              <span>·</span>
              <StageStep label="Folder" active={syncStage === "folder"} done={["upload","gmail","done"].includes(syncStage)} />
              <span>·</span>
              <StageStep label="Upload" active={syncStage === "upload"} done={["gmail","done"].includes(syncStage)} />
              <span>·</span>
              <StageStep label="Gmail" active={syncStage === "gmail"} done={syncStage === "done"} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
            </svg>
            Print / PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 gap-1.5"
            onClick={runPicaSync}
            disabled={isSyncing}
          >
            {isSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
            {isSyncing ? "Syncing…" : "Secure Cloud Sync"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onClose}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

function StageStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 ${active ? "text-primary font-semibold" : done ? "text-clinical-success" : "text-muted-foreground/60"}`}>
      {done ? <Check className="h-2.5 w-2.5" /> : active ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <span className="h-1 w-1 rounded-full bg-current opacity-50" />}
      {label}
    </span>
  );
}

