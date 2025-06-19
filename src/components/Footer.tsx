import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-yellow-50 pt-20 px-6 md:px-10 py-12 mt-auto border-t border-yellow-400/10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* === Column 1: About === */}
        <div>
          <h4 className="text-yellow-400 font-bold text-lg mb-3">About</h4>
          <p className="text-sm text-yellow-100/80 leading-relaxed">
            MovieStream is your personalized gateway to cinematic adventures.
            Curated picks, trending trailers, and unique vibes – just for you.
          </p>
        </div>

        {/* === Column 2: Navigation === */}
        <div>
          <h4 className="text-yellow-400 font-bold text-lg mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/trending"
                className="hover:text-yellow-300 transition-colors"
              >
                Trending
              </Link>
            </li>
            <li>
              <Link
                to="/saved"
                className="hover:text-yellow-300 transition-colors"
              >
                Saved Movies
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-yellow-300 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* === Column 3: Connect === */}
        <div>
          <h4 className="text-yellow-400 font-bold text-lg mb-3">Connect</h4>
          <ul className="flex gap-4 items-center">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="mailto:info@moviestream.com"
                className="hover:text-yellow-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </li>
          </ul>
          <p className="text-sm text-yellow-100/70 mt-4">
            Made with <Heart className="inline w-4 h-4 text-pink-400 mx-1" /> by
            movie lovers.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-yellow-100/50 mt-10">
        © {new Date().getFullYear()} Cinemati. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
