new_content = """import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JqliywcMqUhww8r6Z2Wv_NugALnKfvZitcpOa6RKutqA" });

export default function AiAnalystCopilot() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then(userDoc => {
          if (userDoc.exists()) setUserProfile(userDoc.data());
        });
        
        const q = query(collection(db, `chats/${user.uid}/messages`), orderBy("timestamp", "asc"));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const msgs: any[] = [];
          snapshot.forEach((d) => {
            msgs.push({ id: d.id, ...d.data() });
          });
          setMessages(msgs);
        });

        return () => {
          unsubscribeMessages();
        };
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !userProfile || !auth.currentUser) return;
    
    // Check Feature Gate
    if (userProfile.plan === "free") return;

    setLoading(true);
    const text = input;
    setInput("");

    const userId = auth.currentUser.uid;
    const messagesRef = collection(db, `chats/${userId}/messages`);

    try {
      // 1. Add user message to Firestore
      await addDoc(messagesRef, {
        role: "user",
        content: text,
        timestamp: serverTimestamp()
      });

      // 2. Fetch metrics for context
      const metricsDoc = await getDoc(doc(db, "metrics", userId));
      const metricsData = metricsDoc.data();
      const contextText = metricsData 
        ? `Cafe metrics context: Total Revenue is $${metricsData.totalRevenue}, Orders: ${metricsData.totalOrders}. Top products include ${metricsData.topProducts?.map((p:any) => p.name).join(', ')}.`
        : "No metrics available for this cafe yet.";

      const prompt = `You are Brewlytics AI Copilot, a data analyst assistant for cafe owners. 
Keep your answer short and professional. 
Context: ${contextText}
User question: ${text}`;

      // 3. Query Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const aiText = response.text || "I'm sorry, I couldn't generate a response.";

      // 4. Add AI response to Firestore
      await addDoc(messagesRef, {
        role: "assistant",
        content: aiText,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("Error asking analyst:", error);
    }
    setLoading(false);
  };

  const isFreePlan = userProfile?.plan === "free";

  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      <div className="flex h-screen w-full overflow-hidden">
        {/* SIDEBAR */}
        <aside className="fixed top-0 left-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col justify-between z-30 select-none">
          <div>
            <div className="px-space-md pt-5 pb-4 border-b border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img alt="Brewlytics Logo" className="h-32 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAfw9dNTYTjTl7-9iOdyelfUSopcRTB1c7asfuSK04_sppBpzYoTL6hwVSZUm2ETsK72-pioQNbqoOY5lHeKgno-_dee6G8s5XUF3tGNqC0VpraIi1ecksPd99iRn4V5wZDi9KTdiaxolPnGyzR_Wdk6H0Y_UHjvXEVkv8iih5G-wqZg7Gw60SyM6E-QKPD0hGuyBfcR-HOp3JtRifpBSRYWln8T1EOgm91I2XeVJqVLTTUtqvyVAgk8CpDY_vwoj51Q"/>
              </div>
            </div>
            <nav className="p-space-md space-y-1">
              <Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low hover:text-primary transition-all duration-150 group" to="/dashboard">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">dashboard</span>
                <span className="flex-1">Dashboard</span>
              </Link>
              <Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg bg-surface-container-low text-primary font-title-md text-body-md font-semibold group transition-all duration-150" to="/ai">
                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                <span className="flex-1">AI Analyst</span>
                <span className="w-1.5 h-4 bg-primary-container rounded-full"></span>
              </Link>
              <Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low hover:text-primary transition-all duration-150 group" to="/insights">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">insights</span>
                <span className="flex-1">Insights</span>
                <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold text-[11px] flex items-center justify-center">3</span>
              </Link>
              <Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low hover:text-primary transition-all duration-150 group" to="/upload">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">upload_file</span>
                <span className="flex-1">CSV Upload</span>
              </Link>
              <Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low hover:text-primary transition-all duration-150 group" to="/settings">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">settings</span>
                <span className="flex-1">Settings</span>
              </Link>
            </nav>
          </div>
          <div className="p-space-md border-t border-outline-variant/30 space-y-3 bg-surface-container-lowest">
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center ring-1 ring-primary/20">
                  {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "..."}
                </div>
                <div className="text-left">
                  <p className="font-title-md text-label-md text-on-surface font-semibold leading-tight">{userProfile ? userProfile.fullName : "Loading..."}</p>
                  <p className="text-[11px] text-on-surface-variant leading-tight">{userProfile ? userProfile.plan.toUpperCase() + " PLAN" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="ml-60 flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* FEATURE GATE OVERLAY */}
          {isFreePlan && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-outline-variant max-w-md text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4">lock</span>
                <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
                <p className="text-on-surface-variant mb-6">Upgrade to Pro or Business to access the AI Analyst Copilot and get deep insights into your café's data.</p>
                <button onClick={() => navigate("/settings")} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}

          <header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant px-space-xl py-space-md flex items-center justify-between">
            <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              AI Business Analyst Copilot
            </h1>
          </header>

          <main className="flex-1 overflow-y-auto p-space-lg flex flex-col">
            <div className="flex-1 space-y-6 flex flex-col">
              
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-6xl text-primary/40 mb-4">auto_awesome</span>
                  <h3 className="text-xl font-bold mb-2">How can I help you analyze your café today?</h3>
                  <p className="max-w-md mx-auto">Ask about sales trends, popular products, or margin analysis. I use your real-time POS data.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                      {msg.role !== 'user' && (
                         <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-sm">
                           <span className="material-symbols-outlined text-sm">coffee</span>
                         </div>
                      )}
                      <div className={`max-w-3xl rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-container-lowest border border-outline-variant rounded-tl-sm text-on-surface'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-bold text-xs shadow-sm">
                          {userProfile ? userProfile.fullName.substring(0,2).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start items-start gap-3">
                       <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-sm">
                         <span className="material-symbols-outlined text-sm animate-pulse">coffee</span>
                       </div>
                       <div className="max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-4 text-on-surface">
                          <p className="animate-pulse">Thinking...</p>
                       </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </main>

          {/* INPUT BAR */}
          <div className="p-space-md border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center gap-2 border border-outline-variant rounded-xl p-2 focus-within:border-primary">
              <input 
                type="text" 
                disabled={isFreePlan}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleSend() }}
                className="flex-1 bg-transparent border-0 text-on-surface placeholder:text-outline px-2 focus:outline-none disabled:opacity-50" 
                placeholder="Ask anything about sales, margins, or recipes..." 
              />
              <button 
                disabled={loading || isFreePlan} 
                onClick={handleSend} 
                className="w-10 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"""

with open('src/pages/AiAnalystCopilot.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Rewrote AiAnalystCopilot.tsx with Feature Gate, Client-side Gemini, and Firestore bindings!")
