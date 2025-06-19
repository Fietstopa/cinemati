// File: components/Navbar/AuthSection.tsx

import React from "react";
import { Link } from "react-router-dom";
import ButtonElement from "@/components/buttonelement";
import { logout } from "@/firebase/login";
import type { User } from "firebase/auth";

type Props = {
  user: User | null;
  username: string;
  onOpenLogin: () => void;
};

const AuthSection: React.FC<Props> = ({ user, username, onOpenLogin }) => {
  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      {user ? (
        <>
          <Link to="/watchlists">
            <ButtonElement iconName="bookmark" buttonTitle="Watchlist" />
          </Link>
          <ButtonElement
            iconName="account_circle"
            buttonTitle={username}
            onClick={logout}
          />
          <ButtonElement
            iconName="logout"
            buttonTitle="Log Out"
            onClick={logout}
          />
        </>
      ) : (
        <>
          <ButtonElement
            iconName="bookmark"
            buttonTitle="Watchlist"
            onClick={onOpenLogin}
          />
          <ButtonElement
            iconName="login"
            buttonTitle="Sign In"
            onClick={onOpenLogin}
          />
        </>
      )}
    </div>
  );
};

export default AuthSection;
