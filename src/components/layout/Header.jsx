import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Dropdown } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
      {/* Left items: Mobile menu toggle and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden shrink-0"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>
        <span className="text-sm font-semibold text-slate-600 hidden sm:block">
          Signed in as: <span className="font-bold text-slate-900">{user?.name}</span>
        </span>
      </div>

      {/* Right items: theme and user actions */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme Mode */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
          aria-label="Toggle theme mode"
        >
          {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* User Account Settings Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <Avatar
                src={user?.business?.logo ? (user.business.logo.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${user.business.logo}` : user.business.logo) : ''}
                name={user?.name}
                size="sm"
              />
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-none">{user?.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-0.5">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          }
          items={[
            {
              label: 'Shop Settings',
              icon: <Settings className="h-4 w-4" />,
              onClick: () => navigate('/settings/business')
            },
            {
              label: 'Sign Out',
              icon: <LogOut className="h-4 w-4" />,
              danger: true,
              onClick: logout
            }
          ]}
        />
      </div>
    </header>
  );
};

export default Header;
