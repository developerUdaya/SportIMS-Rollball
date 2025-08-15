import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { signIn, signUp, signOut, getCurrentUser } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user from localStorage
    const getInitialUser = () => {
      try {
        const userData = getCurrentUser();
        
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            teamId: userData.team_id
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('User initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await signIn(email, password);
      if (error || !data) {
        console.error('Login error:', error);
        return false;
      }
      
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        teamId: data.team_id
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    teamName: string;
    coachName: string;
    district: string;
    mobile: string;
  }): Promise<boolean> => {
    try {
      // Create the user account
      const { data, error } = await signUp(
        userData.email,
        userData.password,
        userData.coachName // Use coach name as the user name
      );

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      // If user creation successful, also create the team
      if (data) {
        // Import supabase client to create team
        const { supabase } = await import('../lib/supabase');
        
        const { error: teamError } = await supabase
          .from('teams')
          .insert({
            team_name: userData.teamName,
            coach_name: userData.coachName,
            district: userData.district,
            mobile: userData.mobile,
            email: userData.email
          });

        if (teamError) {
          console.error('Team creation error:', teamError);
          // Note: User was created but team creation failed
          // In production, you might want to handle this differently
        }
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};