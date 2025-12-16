"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BookOpen, Globe, User, BookMarked, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-[#0f0f0f] border-r border-[#2a2a2a] flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:z-0`}
      >
        <Link href="/" className="flex items-center gap-2 mb-8 lg:mb-8">
          <div className="w-8 h-8 bg-[#C4F042] rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl text-white tracking-wide">Feynmind</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 flex flex-col gap-1">
          <NavLink
            href="/dashboard"
            icon={<Zap />}
            label="Dashboard"
            active={isActive("/dashboard") || isActive("/")}
            onClick={onClose}
          />
          <NavLink
            href="/my-decks"
            icon={<BookOpen />}
            label="My decks"
            active={isActive("/my-decks")}
            onClick={onClose}
          />
          <NavLink
            href="/public-decks"
            icon={<Globe />}
            label="Public decks"
            active={isActive("/public-decks")}
            onClick={onClose}
          />
          <NavLink
            href="/profile"
            icon={<User />}
            label="Profile"
            active={isActive("/profile")}
            onClick={onClose}
          />
        </nav>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#2a2a2a] rounded-full h-12">
            <BookMarked className="w-4 h-4 mr-2" />
            Learn
          </Button>
          <Link href="/create-deck" className="block">
            <Button className="w-full bg-transparent hover:bg-[#1a1a1a] text-[#C4F042] border border-[#2a2a2a] rounded-full h-12">
              <Plus className="w-4 h-4 mr-2" />
              Add Deck
            </Button>
          </Link>
        </div>

        {/* Deck List Section */}
        <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#8a8a8a]">My decks</h3>
            <Link href="/create-deck">
              <Plus className="w-4 h-4 text-[#8a8a8a] cursor-pointer hover:text-[#C4F042] transition-colors" />
            </Link>
          </div>
          <p className="text-xs text-[#5a5a5a]">
            No decks yet. Click + to create one!
          </p>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
          active
            ? "bg-[#1a1a1a] text-[#C4F042] border border-[#C4F042]"
            : "text-[#8a8a8a] hover:text-white hover:bg-[#1a1a1a]"
        }`}
      >
        <span className="w-5 h-5">{icon}</span>
        <span className="text-md font-medium tracking-wide">{label}</span>
      </button>
    </Link>
  );
}
