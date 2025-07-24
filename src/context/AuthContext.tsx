import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, Team } from '../types';
import { mockTeams } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if (email === 'admin@Rollball.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Admin',
        email: 'admin@Rollball.com',
        role: 'admin'
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // Check for team managers (mock data)
    const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
    const teams = storedTeams.length > 0 ? storedTeams : mockTeams;
    const team = teams.find((t: any) => t.email === email);
    if (team) {
      // For demo purposes, accept any password or use default
      if (password !== team.password && password !== 'team123') {
        return false;
      }
      const teamUser: User = {
        id: team.id,
        name: team.teamName,
        email: team.email,
        role: 'team_manager',
        teamId: team.id
      };
      setUser(teamUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(teamUser));
      return true;
    }
    
    return false;
  };

  const register = async (userData: Omit<Team, 'id' | 'createdAt'>): Promise<boolean> => {
    // Mock registration - in real app, this would be an API call
    const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
    const teams = storedTeams.length > 0 ? storedTeams : mockTeams;
    const newTeam: Team = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};