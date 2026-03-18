"use client";

import { signOut } from "next-auth/react";

interface SidebarProps {
  userName: string;
  userEmail: string;
  activeSection: "orders" | "referrals" | "credits" | "account";
}

export default function Sidebar({ userName, userEmail, activeSection }: SidebarProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    {
      id: "orders" as const,
      label: "My Orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: "referrals" as const,
      label: "Referrals",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "credits" as const,
      label: "Credits",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-60 bg-[#FAFAFA] border-r border-[#E5E5E5]">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#E5E5E5]">
          <h1
            className="text-2xl font-bold text-[#E07A5F]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pawcasso
          </h1>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[#E5E5E5]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#F4A261] flex items-center justify-center mb-3">
            <span className="text-white font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-sm font-medium text-[#2B2D42] truncate">
            {userName}
          </div>
          <div className="text-xs text-[#4A4A4A] truncate">
            {userEmail}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-[#E07A5F] text-white"
                      : "text-[#4A4A4A] hover:bg-white hover:text-[#2B2D42]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E5E5]">
          <a
            href="/order"
            className="block w-full bg-[#E07A5F] text-white text-center px-4 py-3 rounded-full text-sm font-semibold hover:bg-[#E07A5F]/90 transition-colors mb-3"
          >
            Create Portrait
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
