// File: components/Navbar/index.tsx
// File: components/Navbar/index.tsx

import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import type { User } from "firebase/auth";

import LoginRegisterPopup from "@/components/LoginRegisterPopup";
import ButtonElement from "@/components/buttonelement";
import MegaMenu from "./MegaMenu";
import SearchBar from "./SearchBar";
import AuthSection from "./AuthSelection";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (cur) => setUser(cur));
    return () => unsub();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!user) return;
    const getUsername = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUsername(snap.data().username);
    };
    getUsername();
  }, [user]);

  return (
    <div className="relative w-full">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black text-white px-4 md:px-30 py-3 shadow-md relative z-50 gap-3 sm:gap-0">
        {/* Logo & Menu */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link to="/">
            <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded text-xl">
              Cinemati
            </div>
          </Link>
          <div className="md:px-4">
            <ButtonElement
              iconName="menu"
              buttonTitle=""
              onClick={() => setMenuOpen((p) => !p)}
            />
          </div>
        </div>

        {/* SearchBar (centered on larger screens, full width on mobile) */}
        <div className="w-full sm:w-auto sm:flex-1  max-w-full">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Auth buttons */}
        <div className="w-full sm:w-auto flex md:justify-end ">
          <AuthSection
            user={user}
            username={username}
            onOpenLogin={() => setShowLogin(true)}
          />
        </div>
      </nav>

      {/* Login popup */}
      {showLogin && <LoginRegisterPopup onClose={() => setShowLogin(false)} />}

      {/* MegaMenu */}
      <MegaMenu menuOpen={menuOpen} menuRef={menuRef} />
    </div>
  );
};

export default Navbar;
