import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function DemoToggle({ isDemoMode }: { isDemoMode: boolean }) {
  const toggleDemoMode = async () => {
    if (!auth?.currentUser) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isDemoMode: !isDemoMode
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={toggleDemoMode}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
        isDemoMode 
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300' 
          : 'bg-primary-container text-on-primary hover:bg-primary-fixed border border-primary/20'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {isDemoMode ? 'public' : 'science'}
      </span>
      {isDemoMode ? "Switch to Live" : "Switch to Demo"}
    </button>
  );
}
