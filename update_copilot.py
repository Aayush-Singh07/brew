import re

with open('src/pages/AiAnalystCopilot.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    'import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";',
    'import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";\nimport { Link } from "react-router-dom";'
)

# 2. Update state checking variables
vars_to_add = """  const isFreePlan = userProfile?.plan === "free";
  const isProPlan = userProfile?.plan === "pro";
  const messagesUsed = userProfile?.aiMessageCount || 0;
  
  let limitReached = false;
  if (isFreePlan && messagesUsed >= 5) limitReached = true;
  if (isProPlan && messagesUsed >= 50) limitReached = true;"""

content = re.sub(
    r'  const isFreePlan = userProfile\?\.plan === "free";',
    vars_to_add,
    content
)
if vars_to_add not in content:
    # If the regex didn't work (since we removed isFreePlan previously), insert it before return (
    content = content.replace(
        '  return (',
        vars_to_add + '\n\n  return ('
    )

# 3. Update handleSend
old_handle_send = """  const handleSend = async () => {
    if (!input.trim() || loading || !userProfile || !auth.currentUser) return;
    
    // Check Feature Gate
    if (userProfile.plan === "free") return;"""

new_handle_send = """  const handleSend = async () => {
    if (!input.trim() || loading || !userProfile || !auth.currentUser) return;
    
    // Check Limits
    if (limitReached) return;"""

content = content.replace(old_handle_send, new_handle_send)

# 4. Add increment to handleSend
increment_code = """      // 4. Add AI response to Firestore
      await addDoc(messagesRef, {
        role: "assistant",
        content: aiText,
        timestamp: serverTimestamp()
      });

      // 5. Update user message count
      await updateDoc(doc(db, "users", userId), {
        aiMessageCount: increment(1)
      });"""
content = content.replace(
"""      // 4. Add AI response to Firestore
      await addDoc(messagesRef, {
        role: "assistant",
        content: aiText,
        timestamp: serverTimestamp()
      });""", increment_code)


# 5. Disable input when limit reached and show banner
input_area_old = """          <div className="p-space-md border-t border-outline-variant bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about margins, peak hours, or product performance..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md text-on-surface placeholder:text-on-surface-variant shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  input.trim() && !loading
                    ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm' 
                    : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px] translate-x-[1px]">send</span>
                )}
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[11px] text-on-surface-variant font-body-sm">
                Brewlytics AI can make mistakes. Verify critical business numbers.
              </p>
            </div>
          </div>"""

input_area_new = """          <div className="p-space-md border-t border-outline-variant bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto relative flex items-center mb-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={limitReached}
                placeholder={limitReached ? "Message limit reached. Please upgrade." : "Ask about margins, peak hours, or product performance..."}
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md text-on-surface placeholder:text-on-surface-variant shadow-inner disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim() || limitReached}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  input.trim() && !loading && !limitReached
                    ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm' 
                    : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px] translate-x-[1px]">send</span>
                )}
              </button>
            </div>
            
            <div className="text-center mt-2 flex justify-center items-center gap-4 text-[11px] text-on-surface-variant font-body-sm">
              <p>Brewlytics AI can make mistakes. Verify critical business numbers.</p>
              {(isFreePlan || isProPlan) && (
                 <span className={`px-2 py-1 rounded-md ${limitReached ? 'bg-red-100 text-red-700' : 'bg-surface-container'}`}>
                   {isFreePlan ? 'Free Plan:' : 'Pro Plan:'} {messagesUsed} / {isFreePlan ? '5' : '50'} messages used.
                   {limitReached && <Link to="/settings" className="ml-1 underline font-bold">Upgrade</Link>}
                 </span>
              )}
            </div>
          </div>"""

content = content.replace(input_area_old, input_area_new)

with open('src/pages/AiAnalystCopilot.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AiAnalystCopilot.tsx with limits")
