import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RiskScoreGauge } from "@/components/RiskScoreGauge";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { label: string; source: string }[];
  riskScore?: { label: string; level: string; score: number };
  showProtocolButton?: boolean;
  showArztbriefButton?: boolean;
}

const CONTEXT_AWARE_SOP: Record<string, ChatMessage> = {
  metabolic: {
    id: "sop-metabolic",
    role: "ai",
    content: `**Context-Aware Analysis — Metabolic Markers × Patient Biobank**

**⚠ Abnormal Findings (NAKO Baseline Reference):**
- **Fasting Glucose: 112 mg/dL** — above normal range (70–99 mg/dL), consistent with impaired fasting glucose (IFG)
- **HbA1c: 5.9%** — prediabetic range (5.7–6.4%), per ADA/AWMF criteria
- **BMI: 27.4 kg/m²** — overweight (WHO Class: Pre-Obese)
- **Liver Fat (PDFF): 8.3%** — elevated (normal < 5.0%), Grade I hepatic steatosis
- **Total Cholesterol: 218 mg/dL** — borderline high (desirable < 200 mg/dL)

**Proposed AWMF-Aligned Clinical Pathway — MASLD:**

1. **Confirm MASLD diagnosis** per AWMF S2k-Leitlinie (Reg.-Nr. 021-025):
   - Hepatic steatosis (PDFF ≥ 5%) + ≥ 1 cardiometabolic risk factor → MASLD confirmed
   - Patient meets criteria: PDFF 8.3% + IFG + elevated BMI

2. **Risk stratification** using FIB-4 index:
   - Calculate: (Age × AST) / (Platelets × √ALT)
   - If FIB-4 < 1.3 → low risk, repeat in 3 years
   - If FIB-4 ≥ 1.3 → transient elastography (FibroScan) referral

3. **Therapeutic pathway:**
   - **Lifestyle:** Mediterranean diet, 150 min/week moderate exercise (AWMF Grade A)
   - **Weight target:** 7–10% body weight reduction over 12 months
   - **Pharmacologic:** Consider Pioglitazone or GLP-1 RA if diabetes confirmed
   - **Monitoring:** ALT, HbA1c, lipids q3 months; repeat PDFF at 12 months

4. **Cardiovascular risk assessment:**
   - SCORE2 calculation recommended given clustering of metabolic risk factors
   - Current profile indicates Moderate-High cardiovascular risk`,
    citations: [
      { label: "AWMF S2k NAFLD/MASLD", source: "AWMF Reg.-Nr. 021-025" },
      { label: "AWMF NVL Diabetes", source: "AWMF Reg.-Nr. nvl-001" },
      { label: "NAKO Transfer Portal", source: "nako.de/transfer" },
      { label: "PMC9581448", source: "doi:10.1007/s10654-022-00890-x" },
    ],
    riskScore: { label: "Cardiovascular Risk", level: "Moderate-High", score: 68 },
  },
  mri: {
    id: "sop-mri",
    role: "ai",
    content: `**Context-Aware Analysis — MRI Incidental Findings × Patient Biobank**

**⚠ Abnormal Findings (NAKO Baseline Reference):**
- **Liver Fat (PDFF): 8.3%** — Steatosis Grade I (normal < 5.0%) detected on Dixon MRI
- **BMI: 27.4 kg/m²** — overweight, correlated with hepatic fat accumulation
- **Fasting Glucose: 112 mg/dL** — IFG, reinforcing metabolic-associated etiology

**MRI-Specific Assessment:**

1. **Liver (Dixon T1w VIBE):**
   - PDFF 8.3% → Grade I steatosis confirmed
   - Classification: IF-2 (Routine) per NAKO MRI Committee
   - Action: Letter to participant + GP within 4 weeks

2. **Correlation with MASLD pathway:**
   - MRI-PDFF is the gold standard for hepatic fat quantification
   - Patient's imaging confirms biochemical markers (elevated ALT, glucose)
   - Recommend: Paired elastography for fibrosis staging (MRE or FibroScan)

3. **Proposed AWMF-Aligned Clinical Pathway — MASLD (MRI-confirmed):**
   - Hepatic steatosis confirmed by quantitative MRI (PDFF ≥ 5%)
   - Initiate MASLD workup per AWMF S2k-Leitlinie (021-025)
   - FIB-4 → if elevated → liver stiffness measurement
   - Lifestyle intervention + metabolic risk factor management

4. **Additional MRI findings to monitor:**
   - Cardiac CINE SSFP: assess for LV hypertrophy given BP 134 mmHg
   - Neuro T2w FLAIR: baseline for longitudinal comparison

**Cardiovascular Risk Integration:**
   - Combined metabolic + imaging profile → Moderate-High risk category
   - SCORE2 formal calculation recommended`,
    citations: [
      { label: "AWMF S2k NAFLD/MASLD", source: "AWMF Reg.-Nr. 021-025" },
      { label: "NAKO MRI Protocol", source: "nako.de/mri-protocol" },
      { label: "NAKO Transfer Portal", source: "nako.de/transfer" },
      { label: "PMC9581448", source: "doi:10.1007/s10654-022-00890-x" },
    ],
    riskScore: { label: "Cardiovascular Risk", level: "Moderate-High", score: 68 },
  },
  anthropometry: {
    id: "sop-anthro",
    role: "ai",
    content: `**Standard Operating Procedure — Anthropometry & Blood Pressure**

**Objective:** Standardized measurement of body composition and cardiovascular parameters per NAKO Level-1 examination protocol.

**Procedure:**
1. **Body Height** — Stadiometer (Seca 274), measured to 0.1 cm, Frankfurt plane position
2. **Body Weight** — Bioimpedance scale (Seca mBCA 515), fasting state, light clothing
3. **Waist Circumference** — Midpoint between iliac crest and lowest rib, end-expiration
4. **Blood Pressure** — Automated oscillometric (Omron HEM-907), 3 seated readings after 5 min rest, 1 min intervals

**Quality Metrics:** Inter-rater reliability κ ≥ 0.90; repeat measurements within 2% tolerance.

**Clinical Decision Rule:** If systolic BP ≥ 140 mmHg or diastolic ≥ 90 mmHg on ≥ 2 readings → flag for hypertension workup per AWMF S3-Leitlinie Hypertonie.`,
    citations: [
      { label: "AWMF S3-Leitlinie", source: "AWMF Reg.-Nr. 046-001" },
      { label: "NAKO Transfer Portal", source: "nako.de/transfer" },
    ],
  },
};

interface ClinicalChatProps {
  selectedModule: string | null;
  onSelectModule?: (id: string) => void;
  onScrollToBiobank?: () => void;
  onGenerateArztbrief?: () => void;
}

const KEYWORD_MODULE_MAP: { keywords: string[]; module: string; label: string; summary: string; guideline: string }[] = [
  {
    keywords: ["cardiovascular", "heart", "cardiac", "blood pressure", "hypertension", "chd", "coronary"],
    module: "anthropometry",
    label: "Anthropometry & BP",
    summary: `**NAKO Baseline Findings — Cardiovascular Profile**

Based on the NAKO cohort (n=205,000, PMC9581448), the patient's cardiovascular markers show:
- **Systolic BP: 134 mmHg** — Stage 1 hypertension (≥130 mmHg, ACC/AHA)
- **BMI: 27.4 kg/m²** — overweight, associated with increased CV risk
- **Heart Rate: 72 bpm** — within normal range

**AWMF Guideline Reference:**
- **S3-Leitlinie Nationale VersorgungsLeitlinie Chronische KHK** (AWMF Reg.-Nr. nvl-004)
- Risk stratification via SCORE2 recommended for patients with clustering metabolic risk factors
- Target BP < 130/80 mmHg per ESC/DGK guidelines for high-risk patients`,
    guideline: "AWMF S3-Leitlinie NVL Chronische KHK (Reg.-Nr. nvl-004)",
  },
  {
    keywords: ["metabolic", "diabetes", "glucose", "hba1c", "insulin", "metabolic risk", "prediabetes"],
    module: "metabolic",
    label: "Metabolic Markers",
    summary: `**NAKO Baseline Findings — Metabolic Risk Profile**

Based on the NAKO cohort (n=205,000, PMC9581448), the patient's metabolic markers show:
- **Fasting Glucose: 112 mg/dL** — impaired fasting glucose (IFG), above normal (70–99 mg/dL)
- **HbA1c: 5.9%** — prediabetic range (5.7–6.4%)
- **BMI: 27.4 kg/m²** — overweight, compounding insulin resistance risk
- **Liver Fat (PDFF): 8.3%** — elevated, suggesting MASLD

**AWMF Guideline Reference:**
- **NVL Typ-2-Diabetes** (AWMF Reg.-Nr. nvl-001)
- Lifestyle intervention recommended as first-line for prediabetes
- Annual HbA1c monitoring; OGTT if IFG persists`,
    guideline: "AWMF NVL Typ-2-Diabetes (Reg.-Nr. nvl-001)",
  },
  {
    keywords: ["mri", "imaging", "liver", "steatosis", "fatty liver", "masld", "nafld", "incidental"],
    module: "mri",
    label: "MRI Incidental Findings",
    summary: `**NAKO Baseline Findings — MRI Imaging Profile**

Based on the NAKO cohort MRI protocol (n=30,000 subset, PMC9581448):
- **Liver Fat (PDFF): 8.3%** — Grade I steatosis (normal < 5.0%)
- **Classification: IF-2** (Routine finding) per NAKO MRI Committee
- **Correlated with metabolic markers:** IFG + elevated BMI reinforce MASLD etiology

**AWMF Guideline Reference:**
- **S2k-Leitlinie NAFLD/MASLD** (AWMF Reg.-Nr. 021-025)
- MRI-PDFF is the gold standard for hepatic fat quantification
- FIB-4 index calculation recommended for fibrosis risk stratification`,
    guideline: "AWMF S2k-Leitlinie NAFLD/MASLD (Reg.-Nr. 021-025)",
  },
];

function matchKeywordModule(input: string): typeof KEYWORD_MODULE_MAP[number] | null {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_MODULE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry;
  }
  return null;
}

export function ClinicalChat({ selectedModule, onSelectModule, onScrollToBiobank, onGenerateArztbrief }: ClinicalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Welcome to the NAKO Clinical Decision Support system. Select a study module from the left panel to generate an evidence-based Standard Operating Procedure summary.\n\nI can provide protocol details, reference ranges, and clinical decision rules based on current AWMF guidelines.",
      citations: [{ label: "NAKO Transfer Portal", source: "nako.de/transfer" }],
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedModule && CONTEXT_AWARE_SOP[selectedModule]) {
      const moduleLabel =
        selectedModule === "anthropometry" ? "Anthropometry & BP" :
        selectedModule === "metabolic" ? "Metabolic Markers" :
        "MRI Incidental Findings";
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `Generate SOP summary for module: ${moduleLabel}`,
      };
      const aiMsg = { ...CONTEXT_AWARE_SOP[selectedModule], id: `ai-${Date.now()}` };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    }
  }, [selectedModule]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: input };
    const match = matchKeywordModule(input);

    if (match) {
      // Auto-select the relevant module
      onSelectModule?.(match.module);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: match.summary,
        citations: [
          { label: "PMC9581448", source: "doi:10.1007/s10654-022-00890-x" },
          { label: match.guideline, source: "awmf.org" },
          { label: "NAKO Transfer Portal", source: "nako.de/transfer" },
        ],
        riskScore: match.module === "anthropometry"
          ? { label: "Cardiovascular Risk", level: "Moderate-High", score: 68 }
          : undefined,
        showProtocolButton: true,
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } else {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: `Based on the NAKO cohort data and current AWMF guidelines, your query "${input}" would require cross-referencing with the baseline examination data (n=205,000). Please select a specific study module or try keywords like "cardiovascular", "metabolic risk", or "liver imaging" for targeted analysis.`,
        citations: [{ label: "NAKO Transfer Portal", source: "nako.de/transfer" }],
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    }
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI-Assisted Protocol Generator</h2>
            <div className="flex items-center gap-1.5">
              <div className="pulse-dot" />
              <span className="text-xs text-muted-foreground">Evidence-Based · AWMF-aligned · Context-Aware</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={cn("max-w-[90%] px-3.5 py-2.5 text-sm leading-relaxed", msg.role === "ai" ? "chat-bubble-ai" : "chat-bubble-user")}>
              {msg.role === "ai" ? (
                <div className="space-y-1.5">
                  {msg.content.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.startsWith("| ")) {
                      return <p key={i} className="font-mono text-xs text-muted-foreground">{line}</p>;
                    }
                    if (line.match(/^\d+\./)) {
                      return <p key={i} className="pl-2 text-foreground">{line}</p>;
                    }
                    if (line.startsWith("- ") || line.startsWith("   - ")) {
                      return <p key={i} className="pl-3 text-foreground">{line}</p>;
                    }
                    return line ? <p key={i} className="text-foreground">{line}</p> : <div key={i} className="h-1" />;
                  })}
                  {msg.riskScore && (
                    <RiskScoreGauge
                      label={msg.riskScore.label}
                      level={msg.riskScore.level}
                      score={msg.riskScore.score}
                    />
                  )}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 border-t pt-2">
                      {msg.citations.map((c, i) => (
                        <span key={i} className="citation-link cursor-pointer" title={c.source}>
                          [{i + 1}] {c.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.showProtocolButton && onScrollToBiobank && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={onScrollToBiobank}
                    >
                      <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      View Protocol Details
                    </Button>
                  )}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about NAKO protocols, AWMF guidelines..."
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button size="sm" onClick={handleSend}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
