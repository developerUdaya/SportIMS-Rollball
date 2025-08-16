import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet as Rollball, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'team_manager'] },
    { path: '/players', label: 'Players', roles: ['team_manager'] },
    { path: '/team-registration', label: 'District Profile', roles: ['team_manager'] },
    { path: '/events', label: 'Events', roles: ['admin'] },
    { path: '/teams', label: 'Teams', roles: ['admin'] },
    { path: '/groups', label: 'Pools', roles: ['admin'] },
    { path: '/matches', label: 'Matches', roles: ['admin'] },
    { path: '/knockout', label: 'Knockout', roles: ['admin'] },
    { path: '/results', label: 'Results', roles: ['admin'] }
  ];

  const visibleNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img
              src="https://scontent.fcjb3-5.fna.fbcdn.net/v/t39.30808-1/341442169_3389581364655901_1869603287897950737_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=110&ccb=1-7&_nc_sid=1d2534&_nc_ohc=6ZtuvplBwJgQ7kNvwFisoSE&_nc_oc=AdlVokWCDfjDavetZF-oJCZsvhrNzKdjskNW2Y36Lmfp3JNjayA4zlHrdCytcIpg1whmfTDuL9lQ19C2ZOdNLSkb&_nc_zt=24&_nc_ht=scontent.fcjb3-5.fna&_nc_gid=8U4g7xrGwlpdKVkw4H7ywA&oh=00_AfWlnNws4zsePnNIcoY1p29ddfKz313rmpeOrlulfopulQ&oe=68A5CA79"
              alt="Rollball Logo"
              className="h-20 w-20 rounded-lg bg-blue-600 p-1 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Rollball Tournament</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 mx-4 mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-fit"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;