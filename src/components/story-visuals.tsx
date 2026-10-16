import type { CSSProperties } from "react";

/** Textos curtos que aparecem dentro das cenas (vêm de Story.visual nas mensagens). */
export type VisualText = {
  docFile: string;
  docTitle: string;
  docChecks: string[];
  docNote: string;
  protoSearch: string;
  codeTest: string;
  storeApp: string;
  storeSub: string;
  storeGet: string;
  storeOpen: string;
  storeRating: string;
  storeAppleTop: string;
  storeGoogleTop: string;
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* ---------- 01 · Descoberta: um briefing sendo preenchido ---------- */
function DocScene({ v }: { v: VisualText }) {
  return (
    <div className="sv sv-doc" aria-hidden="true">
      <div className="sv-paper sv-paper--back" />
      <div className="sv-paper">
        <div className="sv-doc-head">
          <span className="sv-doc-icon">PDF</span>
          <span className="sv-doc-file">{v.docFile}</span>
        </div>
        <p className="sv-doc-title sv-type" style={d(200)}>{v.docTitle}</p>
        {[92, 78, 85, 60].map((w, i) => (
          <i key={i} className="sv-ln sv-grow" style={{ ...d(500 + i * 160), width: `${w}%` }} />
        ))}
        <div className="sv-mark" style={d(1300)}>
          <i className="sv-ln" style={{ width: "70%" }} />
        </div>
        <ul className="sv-checks">
          {v.docChecks.map((c, i) => (
            <li key={c} style={d(1700 + i * 350)}>
              <span className="sv-box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
              {c}
            </li>
          ))}
        </ul>
        {[88, 70].map((w, i) => (
          <i key={i} className="sv-ln sv-grow" style={{ ...d(2900 + i * 160), width: `${w}%` }} />
        ))}
      </div>
      <div className="sv-sticky" style={d(2300)}>{v.docNote}</div>
      <div className="sv-lens">
        <svg viewBox="0 0 64 64"><circle cx="26" cy="26" r="18" /><path d="M39 39l16 16" /></svg>
      </div>
    </div>
  );
}

/* ---------- 02 · Protótipo: wireframe completo que se monta e é navegado ---------- */
function ProtoScene({ v }: { v: VisualText }) {
  return (
    <div className="sv sv-proto" aria-hidden="true">
      <div className="phone sv-phone">
        <div className="screen sv-wire">
          <div className="sv-w sv-w-bar" style={d(100)}><b /><i /><span className="sv-avatar" /></div>
          <div className="sv-w sv-w-search" style={d(250)}><span>⌕</span>{v.protoSearch}</div>
          <div className="sv-w sv-w-hero" style={d(400)}>
            <svg viewBox="0 0 100 50" preserveAspectRatio="none"><path d="M0 0L100 50M100 0L0 50" /></svg>
          </div>
          <div className="sv-w sv-w-chips" style={d(600)}>{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>
          <div className="sv-w-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`sv-w sv-w-card ${i === 1 ? "is-target" : ""}`} style={d(800 + i * 140)}>
                <div className="sv-w-img"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0L100 60M100 0L0 60" /></svg></div>
                <i style={{ width: "80%" }} />
                <i style={{ width: "50%" }} />
              </div>
            ))}
          </div>
          <div className="sv-w sv-w-tabs" style={d(1500)}>{[0, 1, 2, 3].map((i) => <i key={i} className={i === 0 ? "on" : ""} />)}</div>
          <div className="sv-cursor"><span /></div>
          <div className="sv-w-sheet">
            <div className="sv-w-img"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0L100 60M100 0L0 60" /></svg></div>
            <i style={{ width: "70%" }} />
            <i style={{ width: "90%" }} />
            <i style={{ width: "60%" }} />
            <b>CTA</b>
          </div>
        </div>
      </div>
      <div className="sv-flow">
        <span>01</span><i /><span>02</span><i /><span>03</span>
      </div>
    </div>
  );
}

/* ---------- 03 · Código: MacBook com o editor cheio ---------- */
type Tok = [string, string];
const CODE: Tok[][] = [
  [["k", "import"], ["p", " { useQuery } "], ["k", "from"], ["s", " \"@tanstack/react-query\""], ["p", ";"]],
  [["k", "import"], ["p", " { z } "], ["k", "from"], ["s", " \"zod\""], ["p", ";"]],
  [],
  [["k", "const"], ["v", " Order"], ["p", " = z."], ["f", "object"], ["p", "({"]],
  [["p", "  id: z."], ["f", "string"], ["p", "(),"]],
  [["p", "  status: z."], ["f", "enum"], ["p", "(["], ["s", "\"paid\""], ["p", ", "], ["s", "\"shipped\""], ["p", "]),"]],
  [["p", "  total: z."], ["f", "number"], ["p", "()."], ["f", "positive"], ["p", "(),"]],
  [["p", "});"]],
  [],
  [["k", "export function"], ["f", " useOrders"], ["p", "(userId: "], ["t", "string"], ["p", ") {"]],
  [["k", "  return"], ["f", " useQuery"], ["p", "({"]],
  [["p", "    queryKey: ["], ["s", "\"orders\""], ["p", ", userId],"]],
  [["p", "    queryFn: "], ["k", "async"], ["p", " () => {"]],
  [["k", "      const"], ["p", " res = "], ["k", "await"], ["f", " api"], ["p", "."], ["f", "get"], ["p", "("], ["s", "`/orders/${userId}`"], ["p", ");"]],
  [["k", "      return"], ["p", " Order."], ["f", "array"], ["p", "()."], ["f", "parse"], ["p", "(res.data);"]],
  [["p", "    },"]],
  [["p", "    staleTime: "], ["n", "30_000"], ["p", ","]],
  [["p", "  });"]],
  [["p", "}"]],
  [],
  [["c", "// lista longa sem travar em aparelho simples"]],
  [["k", "export const"], ["v", " OrderList"], ["p", " = "], ["f", "memo"], ["p", "(Orders);"]],
];
const FILES = ["app/", "  (tabs)/", "  orders.tsx", "components/", "  order-card.tsx", "hooks/", "  use-orders.ts", "lib/", "  api.ts", "package.json"];

function CodeScene({ v }: { v: VisualText }) {
  return (
    <div className="sv sv-code" aria-hidden="true">
      <div className="sv-mac">
        <div className="sv-mac-lid">
          <div className="sv-mac-screen">
            <div className="sv-ed-bar"><i /><i /><i /><span>use-orders.ts — app</span></div>
            <div className="sv-ed">
              <ul className="sv-ed-tree">
                {FILES.map((f, i) => (
                  <li key={i} className={f.trim() === "use-orders.ts" ? "on" : ""} style={{ paddingLeft: f.startsWith("  ") ? 14 : 4 }}>
                    {f.trim()}
                  </li>
                ))}
              </ul>
              <div className="sv-ed-main">
                <div className="sv-ed-tabs"><span className="on">use-orders.ts</span><span>orders.tsx</span><span>api.ts</span></div>
                <ol className="sv-ed-code">
                  {CODE.map((line, i) => (
                    <li key={i} style={d(120 + i * 110)}>
                      <span className="sv-ed-n">{i + 1}</span>
                      <span className="sv-ed-l">
                        {line.map(([c, t], j) => <span key={j} className={`tk-${c}`}>{t}</span>)}
                        {i === CODE.length - 1 && <span className="sv-caret" />}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="sv-ed-term">
                  <p style={d(2700)}><span className="tk-c">$</span> npm test</p>
                  <p style={d(3300)}><span className="tk-ok">✓</span> {v.codeTest}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sv-mac-base"><i /></div>
      </div>
    </div>
  );
}

/* ---------- 04 · Loja: página do app na loja e os selos das duas lojas ---------- */
const AppleLogo = () => (
  <svg viewBox="0 0 24 24" className="sv-logo">
    <path fill="currentColor" d="M16.37 12.73c-.03-2.6 2.13-3.86 2.22-3.92-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.95-3.94.95-.82 0-2.07-.93-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.15-.47 7.81 1.3 10.37.87 1.25 1.9 2.65 3.25 2.6 1.31-.05 1.8-.84 3.38-.84 1.57 0 2.02.84 3.4.81 1.4-.02 2.29-1.27 3.15-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.15zM13.79 5.1c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.66.77-1.25 2.01-1.09 3.19 1.15.09 2.33-.58 3.05-1.46z" />
  </svg>
);
const PlayLogo = () => (
  <svg viewBox="0 0 24 24" className="sv-logo">
    <path fill="#00c3ff" d="M3.6 2.3 13.5 12l-9.9 9.7c-.37-.2-.6-.6-.6-1.1V3.4c0-.5.23-.9.6-1.1z" />
    <path fill="#00e676" d="M3.6 2.3c.36-.2.82-.2 1.27.06l11.5 6.6-2.87 3.04z" />
    <path fill="#ff3d57" d="M13.5 12l2.87 3.04-11.5 6.6c-.45.26-.9.26-1.27.06z" />
    <path fill="#ffc400" d="M16.37 8.96l3.3 1.9c.9.52.9 1.76 0 2.28l-3.3 1.9L13.5 12z" />
  </svg>
);

function StoreScene({ v }: { v: VisualText }) {
  return (
    <div className="sv sv-store" aria-hidden="true">
      <div className="phone sv-phone">
        <div className="screen sv-listing">
          <div className="sv-ls-top"><span className="sv-back">‹</span></div>
          <div className="sv-ls-head">
            <div className="sv-ls-icon"><span>G.</span></div>
            <div className="sv-ls-meta">
              <b>{v.storeApp}</b>
              <span>{v.storeSub}</span>
              <div className="sv-get">
                <span className="sv-get-a">{v.storeGet}</span>
                <span className="sv-get-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /></svg></span>
                <span className="sv-get-b">{v.storeOpen}</span>
              </div>
            </div>
          </div>
          <div className="sv-ls-stats">
            <div><b>4,9</b><span className="sv-stars">★★★★★</span><small>{v.storeRating}</small></div>
            <div><b>4+</b><small>&nbsp;</small></div>
            <div><b>#1</b><small>&nbsp;</small></div>
          </div>
          <div className="sv-ls-shots">
            {[0, 1, 2].map((i) => (
              <div key={i} className="sv-ls-shot" style={d(500 + i * 180)}>
                <i /><i /><b /><b /><i />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sv-badges">
        <div className="sv-badge" style={d(900)}>
          <AppleLogo />
          <span><small>{v.storeAppleTop}</small>App Store</span>
        </div>
        <div className="sv-badge" style={d(1150)}>
          <PlayLogo />
          <span><small>{v.storeGoogleTop}</small>Google Play</span>
        </div>
      </div>
    </div>
  );
}

/** Uma cena por etapa; a `key` no pai reinicia a animação a cada troca. */
export function StoryVisual({ step, v }: { step: number; v: VisualText }) {
  if (step === 0) return <DocScene v={v} />;
  if (step === 1) return <ProtoScene v={v} />;
  if (step === 2) return <CodeScene v={v} />;
  return <StoreScene v={v} />;
}
