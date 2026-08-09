"use client";

import { useState, useRef, useEffect } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Bonjour ! Je suis l'assistant de BDF Production. Une question sur nos parfums, nos flyers ou nos prestations audiovisuelles ?";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [history, pending]);

  function handleOpen() {
    setOpen(true);
    if (!opened) {
      setOpened(true);
      setHistory([{ role: "assistant", content: GREETING }]);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    const nextHistory: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);
    setPending(true);
    try {
      // L'API ne conserve qu'une fenêtre récente (voir /api/chat) : n'envoyer que les
      // derniers messages pour ne pas se heurter à la limite au fil d'une longue conversation.
      const recentHistory = nextHistory.slice(-20);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentHistory }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const block = (data.content || []).find((c: { type: string }) => c.type === "text");
      const reply = block ? block.text : "Désolé, je n'ai pas pu formuler de réponse.";
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
    } catch {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "Je ne suis pas joignable pour le moment. Écrivez-nous directement à contact@bdfproduction.fr.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 26, right: 26, zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, fontFamily: "inherit" }}>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", width: 360, maxWidth: "calc(100vw - 48px)", height: 480, maxHeight: "70vh", background: "#14141c", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", color: "#f4f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Assistant BDF Production</div>
                <div style={{ fontSize: 11.5, color: "rgba(244,244,246,0.6)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  En ligne
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le chat" style={{ background: "none", border: "none", color: "rgba(244,244,246,0.6)", cursor: "pointer", fontSize: 16 }}>
              ✕
            </button>
          </div>
          <div ref={messagesRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: "85%",
                  padding: "11px 14px",
                  borderRadius: 14,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "linear-gradient(135deg,#7c3aed,#5b21b6)" : "rgba(255,255,255,0.05)",
                  color: "#f4f4f6",
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.role === "user" ? 14 : 4,
                }}
              >
                {m.content}
              </div>
            ))}
            {pending && (
              <div style={{ alignSelf: "flex-start", padding: "13px 16px", borderRadius: 14, background: "rgba(255,255,255,0.05)", display: "flex", gap: 4 }}>
                <span>…</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              maxLength={2000}
              placeholder="Posez votre question…"
              aria-label="Votre message"
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "11px 14px", color: "#f4f4f6", fontSize: 13.5, outline: "none" }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={pending}
              aria-label="Envoyer"
              style={{ width: 40, height: 40, borderRadius: 12, border: "none", cursor: pending ? "not-allowed" : "pointer", flexShrink: 0, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", opacity: pending ? 0.5 : 1 }}
            >
              ↑
            </button>
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(244,244,246,0.45)", textAlign: "center", padding: "0 14px 14px" }}>
            Réponses automatiques — pour une commande, utilisez les formulaires du site.
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="Ouvrir l'assistant"
        style={{ width: 58, height: 58, borderRadius: 18, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", fontSize: 26, boxShadow: "0 10px 26px rgba(124,58,237,0.4)" }}
      >
        💬
      </button>
    </div>
  );
}
