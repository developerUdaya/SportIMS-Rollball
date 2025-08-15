import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom auth helpers using users table
export const signUp = async (email: string, password: string, name: string) => {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { data: null, error: new Error('User already exists') };
    }

    // Create new user in users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password, // In production, hash this password
        name,
        role: email === 'admin@rollball.com' ? 'admin' : 'team_manager'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('SignUp error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // In production, hash and compare
      .single();

    if (error || !data) {
      return { data: null, error: error || new Error('Invalid credentials') };
    }

    // Store user session in localStorage
    localStorage.setItem('currentUser', JSON.stringify(data));
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem('currentUser');
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};