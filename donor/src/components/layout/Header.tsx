import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar, setTheme } from "../../store/slices/uiSlice";
import { Input } from "../ui/input";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {title && (
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Center - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search donations..."
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() =>
              dispatch(setTheme(theme === "dark" ? "light" : "dark"))
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <Link
            to="/profile"
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700 hidden sm:block">
              {user?.name?.split(" ")[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
