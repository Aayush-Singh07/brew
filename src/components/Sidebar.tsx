import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  count?: string;
  disabledInDemo?: boolean;
}

export default function Sidebar({ userProfile }: { userProfile: any }) {
  const location = useLocation();
  const [cafeName, setCafeName] = useState<string>("Loading...");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.cafeId) {
      getDoc(doc(db, "cafes", userProfile.cafeId)).then(snap => {
        if (snap.exists()) {
          setCafeName(snap.data().name);
        } else {
          setCafeName("My Café");
        }
      });
    }
  }, [userProfile]);

  const isDemoMode = !!userProfile?.isDemoMode;

  const navLinks: NavItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "AI Analyst", path: "/ai", icon: "psychology", badge: "NEW" },
    { name: "Insights", path: "/insights", icon: "insights", count: "3" },
    { name: "Upload Data", path: "/upload", icon: "upload_file" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];


    return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 rounded-md bg-surface-container-lowest border border-outline-variant text-on-surface shadow-sm hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col justify-between z-50 select-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div>
        <div className="px-space-md pt-5 pb-4 border-b border-outline-variant/30 flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-102 duration-150">
            <img alt="Brewlytics Logo" className="h-10 w-auto object-contain" src="/logo.png"/>
          </Link>
        </div>
        <nav className="p-space-md space-y-1">
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.path);
            const isDisabled = isDemoMode && link.disabledInDemo;

            if (isDisabled) {
              return (
                <div key={link.name} title="Available in Live mode" className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-md text-body-md opacity-40 cursor-not-allowed select-none">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">{link.icon}</span>
                  <span className="flex-1">{link.name}</span>
                  <span className="text-[10px] font-semibold text-on-surface-variant border border-outline-variant rounded px-1">Live only</span>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-md text-body-md group transition-all duration-150 ${
                  isActive
                    ? "bg-surface-container-low text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.name}</span>
                {link.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-fixed text-primary tracking-wide">
                    {link.badge}
                  </span>
                )}
                {link.count && !link.badge && (
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold text-[11px] flex items-center justify-center">
                    {link.count}
                  </span>
                )}
                {isActive && !link.badge && !link.count && (
                  <span className="w-1.5 h-4 bg-primary-container rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-sm flex items-center justify-center ring-1 ring-primary/20 flex-shrink-0">
              {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "..."}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-title-md text-label-md text-on-surface font-semibold leading-tight truncate">
                {userProfile ? (userProfile.isDemoMode ? "Demo User" : userProfile.fullName) : "Loading..."}
              </p>
              <p className="text-[11px] text-on-surface-variant leading-tight truncate">
                {userProfile?.isDemoMode ? "Demo Cafe" : cafeName} • {userProfile ? userProfile.plan.toUpperCase() : ""}
              </p>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors flex items-center justify-center" title="Log out">
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
