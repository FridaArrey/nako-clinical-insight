import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { label: string; source: string }[];
}

const SOP_DATA: Record<string, ChatMessage> = {
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
  metabolic: {
    id: "sop-metabolic",
    role: "ai",
    content: `**Standard Operating Procedure — Metabolic Markers Panel**

**Objective:** Comprehensive metabolic risk stratification based on NAKO Level-2 laboratory protocol.

**Specimen Requirements:**
- Fasting venous blood (≥ 8h), EDTA and serum tubes
- Processing within 2h, aliquoting per NAKO Biobank SOP

**Analytes & Reference Ranges:**
| Marker | Method | Reference |
|--------|--------|-----------|
| HbA1c | HPLC (Tosoh G11) | < 5.7% (normal) |
| Fasting Glucose | Hexokinase | 70–99 mg/dL |
| Total Cholesterol | Enzymatic | < 200 mg/dL |
| LDL-C | Friedewald calc. | < 130 mg/dL |
| ALT/GPT | IFCC, 37°C | ♂ < 50 U/L, ♀ < 35 U/L |

**Clinical Decision Rule:** If fasting glucose ≥ 126 mg/dL OR HbA1c ≥ 6.5% → flag for diabetes screening per AWMF NVL Typ-2-Diabetes.`,
    citations: [
      { label: "AWMF NVL Diabetes", source: "AWMF Reg.-Nr. nvl-001" },
      { label: "NAKO Transfer Portal", source: "nako.de/transfer" },
      { label: "PMC9581448", source: "doi:10.1007/s10654-022-00890-x" },
    ],
  },
  mri: {
    id: "sop-mri",
    role: "ai",
    content: `**Standard Operating Procedure — MRI Incidental Findings**

**Objective:** Standardized management of incidental findings from NAKO 3T whole-body MRI protocol.

**Acquisition Protocol:**
- Scanner: Siemens MAGNETOM Skyra/Prisma 3T
- Sequences: T1w VIBE Dixon (liver fat), CINE SSFP (cardiac), T2w FLAIR (neuro)
- Duration: ~60 min total examination

**Incidental Finding Classification (per NAKO MRI Committee):**
| Category | Action | Timeline |
|----------|--------|----------|
| IF-1 (No action) | Document only | — |
| IF-2 (Routine) | Letter to participant + GP | ≤ 4 weeks |
| IF-3 (Urgent) | Direct physician contact | ≤ 48h |

**Liver Fat Quantification:** Proton density fat fraction (PDFF) via Dixon method.
- Normal: < 5.0%
- Steatosis Grade I: 5–17%
- Steatosis Grade II: 17–22%

**Clinical Decision Rule:** IF-3 findings → immediate notification via NAKO study physician; referral to specialist per AWMF guidelines.`,
    citations: [
      { label: "AWMF S2k NAFLD", source: "AWMF Reg.-Nr. 021-025" },
      { label: "NAKO MRI Protocol", source: "nako.de/mri-protocol" },
    ],
  },
};

interface ClinicalChatProps {
  selectedModule: string | null;
}

export function ClinicalChat({ selectedModule }: ClinicalChatProps) {
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
    if (selectedModule && SOP_DATA[selectedModule]) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `Generate SOP summary for module: ${selectedModule === "anthropometry" ? "Anthropometry & BP" : selectedModule === "metabolic" ? "Metabolic Markers" : "MRI Incidental Findings"}`,
      };
      const aiMsg = { ...SOP_DATA[selectedModule], id: `ai-${Date.now()}` };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    }
  }, [selectedModule]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: input };
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content: `Based on the NAKO cohort data and current AWMF guidelines, your query "${input}" would require cross-referencing with the baseline examination data (n=205,000). Please select a specific study module for detailed protocol guidance.`,
      citations: [{ label: "NAKO Transfer Portal", source: "nako.de/transfer" }],
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
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
              <span className="text-xs text-muted-foreground">Evidence-Based · AWMF-aligned</span>
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
                    if (line.startsWith("- ")) {
                      return <p key={i} className="pl-3 text-foreground">{line}</p>;
                    }
                    return line ? <p key={i} className="text-foreground">{line}</p> : <div key={i} className="h-1" />;
                  })}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 border-t pt-2">
                      {msg.citations.map((c, i) => (
                        <span key={i} className="citation-link cursor-pointer" title={c.source}>
                          [{i + 1}] {c.label}
                        </span>
                      ))}
                    </div>
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
