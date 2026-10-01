import os

content = """import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignUpLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create Cafe Doc
        const cafeRef = doc(db, "cafes", user.uid); // using uid as cafeId for simplicity
        await setDoc(cafeRef, {
          ownerUid: user.uid,
          name: cafeName,
          createdAt: serverTimestamp()
        });
        
        // Create User Doc
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: fullName,
          cafeId: user.uid,
          plan: "free",
          createdAt: serverTimestamp()
        });

        navigate("/onboarding");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] antialiased text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant relative">
      
      {/* Back button overlay */}
      <Link className="absolute top-6 left-6 z-[100] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest/80 backdrop-blur hover:bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant hover:text-on-surface transition-all duration-150 text-body-sm font-title-md shadow-sm active:scale-99" to="/">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Home</span>
      </Link>

      {/* Left Video Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E1DBF8] relative items-center justify-center overflow-hidden">
         {/* Video Placeholder */}
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            {/* The user will upload a video here. Using a placeholder path for now */}
            <source src="/auth-video-placeholder.mp4" type="video/mp4" />
          </video>
          {/* Fallback content for when video is not yet added */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
             <div className="w-24 h-24 mb-4 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-primary-container border border-white/40">
                 <span className="material-symbols-outlined text-[40px]">videocam</span>
             </div>
             <p className="font-title-md text-primary-container text-lg max-w-sm">
                Video Placeholder
             </p>
          </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px] flex flex-col">
          
          <div className="mb-8 text-center flex justify-center">
            <Link className="inline-block transition-transform hover:scale-102 duration-150" to="/">
              <img alt="Brewlytics Logo" className="h-10 w-auto object-contain" src="/logo.png"/>
            </Link>
          </div>

          <div className="w-full bg-white border border-outline-variant/50 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200">
            
            <div className="w-full p-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg flex items-center mb-6">
              <button onClick={() => setIsLogin(true)} aria-selected={isLogin} className={`flex-1 py-2.5 text-center text-body-sm font-body-sm font-semibold rounded-md transition-all duration-150 ${isLogin ? 'bg-[#6C4AB6] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface bg-[#EBE9F5]'}`} type="button">
                Log In
              </button>
              <button onClick={() => setIsLogin(false)} aria-selected={!isLogin} className={`flex-1 py-2.5 text-center text-body-sm font-body-sm font-semibold rounded-md transition-all duration-150 ${!isLogin ? 'bg-[#6C4AB6] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface bg-[#EBE9F5]'}`} type="button">
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 bg-red-100 p-2 rounded text-sm">{error}</div>}
              
              {!isLogin && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface font-semibold mb-1.5" htmlFor="full-name">Full Name</label>
                    <input required className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-white text-on-surface placeholder:text-outline text-body-sm focus:border-[#6C4AB6] focus:ring-1 focus:ring-[#6C4AB6] transition-colors outline-none" id="full-name" placeholder="e.g. Jordan Miller" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface font-semibold mb-1.5" htmlFor="cafe-name">Café or Business Name</label>
                    <input required className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-white text-on-surface placeholder:text-outline text-body-sm focus:border-[#6C4AB6] focus:ring-1 focus:ring-[#6C4AB6] transition-colors outline-none" id="cafe-name" placeholder="e.g. Blue Sparrow Coffee" type="text" value={cafeName} onChange={e => setCafeName(e.target.value)} />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface font-semibold mb-1.5" htmlFor="email">Email</label>
                <input required className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-white text-on-surface placeholder:text-outline text-body-sm focus:border-[#6C4AB6] focus:ring-1 focus:ring-[#6C4AB6] transition-colors outline-none" id="email" placeholder="e.g., jordan@bluesparrow.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface font-semibold mb-1.5" htmlFor="password">Password</label>
                <div className="relative">
                  <input required className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-white text-on-surface placeholder:text-outline text-body-sm focus:border-[#6C4AB6] focus:ring-1 focus:ring-[#6C4AB6] transition-colors outline-none" id="password" placeholder="Create a secure password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              
              <div className="pt-2">
                <button disabled={loading} className="w-full h-12 bg-[#6C4AB6] hover:bg-[#5a3d99] text-white font-title-md text-body-md rounded-lg shadow-sm hover:shadow transition-all duration-150 active:scale-99 flex items-center justify-center disabled:opacity-50" type="submit">
                  {isLogin ? "Login" : "Create Account"}
                </button>
              </div>

              {isLogin && (
                <div className="text-center mt-3">
                  <a className="text-label-sm font-label-sm text-[#6C4AB6] hover:underline cursor-pointer font-medium">Forgot Password?</a>
                </div>
              )}
              
              <p className="text-center text-[12px] font-medium text-on-surface-variant mt-5">
                No credit card required. Cancel anytime. 2-minute setup
              </p>
            </form>
          </div>
          
          <footer className="mt-8 text-center space-y-2 text-[12px] text-on-surface-variant font-medium">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a className="hover:text-on-surface transition-colors cursor-pointer">Terms of Service</a>
              <span className="text-outline-variant/60">•</span>
              <a className="hover:text-on-surface transition-colors cursor-pointer">Privacy Policy</a>
              <span className="text-outline-variant/60">•</span>
              <a className="hover:text-on-surface transition-colors cursor-pointer">Need help? Contact support</a>
            </div>
            <p className="text-outline-variant">© 2025 Brewlytics Intelligence Inc. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
"""

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("SignUpLogin.tsx rewritten to match split-screen design.")
