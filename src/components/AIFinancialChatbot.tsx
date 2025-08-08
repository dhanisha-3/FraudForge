import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  MessageSquare, Mic, MicOff, Image as ImageIcon, Paperclip, Globe2,
  Download, Trash2, Settings as SettingsIcon, Bot, Send, PauseCircle, PlayCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

// Simple Gemini fetch wrapper (text & vision). Replace with official client if preferred.
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
async function geminiGenerate(content: any[]) {
  if (!GEMINI_API_KEY) {
    return "AI model key missing. Set VITE_GEMINI_API_KEY in your .env to enable full responses.";
  }
  const model = "gemini-1.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: content }] }),
  });
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "";
  return text;
}

interface ChatItem {
  id: string;
  role: "user" | "assistant";
  text?: string;
  imageUrl?: string;
  fileName?: string;
  timestamp: number;
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
];

const AIFinancialChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [items, setItems] = useState<ChatItem[]>([]);
  const [lang, setLang] = useState("en");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Seed helper context
    if (items.length === 0) {
      setItems([{
        id: "seed", role: "assistant", timestamp: Date.now(),
        text: "Hi! I’m your AI Financial Guardian. I can help before, during, and after fraud: risk checks, UPI/QR validation, card/URL scans, creating FIR-ready PDFs, and more. Ask me anything."
      }]);
    }
  }, []);

  // Simple self-learning: persist chat locally and restore
  useEffect(() => {
    const saved = localStorage.getItem('fg_chat');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('fg_chat', JSON.stringify(items));
  }, [items]);

  // Detect simple graph commands like: graph:1,2,3,4
  const asGraphData = (text?: string) => {
    if (!text) return null;
    const m = text.match(/^graph:\s*([0-9,\s]+)$/i);
    if (!m) return null;
    const parts = m[1].split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    return parts.map((v, i) => ({ name: `${i+1}`, value: v }));
  };


  // STT via Web Speech API (browser support varies)
  const startSTT = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return alert("Speech Recognition not supported in this browser.");
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput((prev) => prev ? prev + " " + text : text);
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    rec.start();
    setRecording(true);
  };

  const stopSTT = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SR) {
      try { new SR().stop(); } catch {}
    }
    setRecording(false);
  };

  const ttsSpeak = (text: string) => {
    if (!ttsEnabled) return;
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    synth.speak(utter);
  };

  const onSend = async () => {
    if (!input.trim() && !imagePreview) return;
    const message: ChatItem = { id: crypto.randomUUID(), role: "user", text: input.trim(), imageUrl: imagePreview || undefined, timestamp: Date.now() };
    setItems((prev) => [...prev, message]);
    setInput("");
    setImagePreview(null);

    const parts: any[] = [];
    if (message.text) parts.push({ text: message.text });
    if (message.imageUrl) parts.push({ inline_data: { mime_type: "image/png", data: message.imageUrl.split(",")[1] || "" } });

    setIsTyping(true);
    let replyText = "";
    try {
      replyText = await geminiGenerate(parts);
    } finally {
      setIsTyping(false);
    }
    const assistant: ChatItem = { id: crypto.randomUUID(), role: "assistant", text: replyText || "(No response)", timestamp: Date.now() };
    setItems((prev) => [...prev, assistant]);


    ttsSpeak(assistant.text || "");
  };

  const onPickFile = () => fileInputRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      const item: ChatItem = { id: crypto.randomUUID(), role: "user", text: `Attached file: ${file.name} (${Math.round(file.size/1024)} KB)`, fileName: file.name, timestamp: Date.now() };
      setItems((prev) => [...prev, item]);
    }
    e.currentTarget.value = "";
  };

  const clearChat = () => setItems([]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("FraudGuard AI - Chat Transcript", 14, 18);
    doc.setFontSize(10);
    let y = 28;
    items.forEach((m) => {
      const role = m.role === "user" ? "You" : "AI";
      const lines = doc.splitTextToSize(`${role}: ${m.text || "[media]"}`, 180);
      lines.forEach((l: string) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(l, 14, y);
        y += 6;
      });
    });
    doc.save(`fraudguard_chat_${Date.now()}.pdf`);
  };

  const quickTips = [
    "Before: Verify QR/UPI details and merchant names.",
    "During: Stop immediately if urged to ‘act now’.",
    "After: Block card, file FIR PDF, and report to bank.",
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[60]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <Button onClick={() => setOpen(!open)} className="rounded-full h-14 w-14 p-0 shadow-lg">
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-6 w-[360px] max-h-[70vh] bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">AI Financial Assistant</span>
                <Badge variant="outline">Gemini</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><Globe2 className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((l) => (
                      <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                        {l.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" onClick={() => setTtsEnabled((s) => !s)}>
                  {ttsEnabled ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadPDF}><Download className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={clearChat}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Tips */}
            <div className="px-4 py-2 text-xs text-muted-foreground space-x-2 whitespace-nowrap overflow-x-auto">
              {quickTips.map((t, i) => (
                <Badge key={i} variant="secondary" className="mr-2">{t}</Badge>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map((m) => {
                const graphData = asGraphData(m.text);
                return (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.imageUrl && (
                        <img src={m.imageUrl} alt="upload" className="mb-2 rounded" />
                      )}
                      {graphData ? (
                        <div className="w-64 h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        m.text
                      )}
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="px-4 py-2 text-xs text-muted-foreground">AI is typing…</div>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-border/50 space-y-2">
              {imagePreview && (
                <div className="px-2"><img src={imagePreview} alt="preview" className="max-h-28 rounded" /></div>
              )}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={onPickFile}><Paperclip className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onPickFile}><ImageIcon className="w-4 h-4" /></Button>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf,.csv,.txt" onChange={onFile} />
                <Input placeholder="Ask about fraud prevention, UPI, QR, cards…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSend()} />
                <Button onClick={onSend}><Send className="w-4 h-4" /></Button>
                <Button variant={recording ? "destructive" : "outline"} onClick={() => (recording ? stopSTT() : startSTT())}>
                  {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFinancialChatbot;

