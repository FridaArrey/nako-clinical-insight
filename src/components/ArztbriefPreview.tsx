import { Button } from "@/components/ui/button";
import { TrendSparkline } from "./TrendSparkline";

interface ArztbriefPreviewProps {
  onClose: () => void;
}

export function ArztbriefPreview({ onClose }: ArztbriefPreviewProps) {
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

          <p className="mb-1">Mit kollegialen Grüßen,</p>
          <p className="font-semibold">Dr. med. [Generiert durch CDSS]</p>
          <p className="text-[10px] text-muted-foreground">Klinik für Innere Medizin – Hepatologie</p>
          <p className="text-[10px] text-muted-foreground">Charité – Universitätsmedizin Berlin</p>

          {/* Footer */}
          <div className="mt-4 border-t pt-2 text-[9px] text-muted-foreground">
            <p>Quellen: AWMF S2k-Leitlinie NAFLD/MASLD (Reg.-Nr. 021-025) · PMC9581448 · NAKO Transfer Portal</p>
            <p>Dieses Dokument wurde automatisch durch das NAKO Clinical Decision Support System generiert.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t p-3 flex gap-2">
        <Button size="sm" className="flex-1 gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
          </svg>
          Print / PDF
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onClose}>
          Back to Biobank
        </Button>
      </div>
    </div>
  );
}
