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
    <div className="relative">
      <nav className="flex items-center justify-between bg-black text-white px-30 py-2 shadow-md relative z-50">
        <div className="flex items-center gap-2">
          <Link to="/">
            <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded text-xl">
              Cinemati
            </div>
          </Link>
          <ButtonElement
            iconName="menu"
            buttonTitle="Menu"
            onClick={() => setMenuOpen((p) => !p)}
          />
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <AuthSection
          user={user}
          username={username}
          onOpenLogin={() => setShowLogin(true)}
        />
      </nav>

      {showLogin && <LoginRegisterPopup onClose={() => setShowLogin(false)} />}

      <MegaMenu menuOpen={menuOpen} menuRef={menuRef} />
    </div>
  );
};

export default Navbar;
