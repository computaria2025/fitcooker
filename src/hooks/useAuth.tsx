
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkEmailExists = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();
    
    return { exists: !!data, error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('Attempting sign up for:', email);
    
    // Check if email already exists
    const { exists } = await checkEmailExists(email);
    if (exists) {
      return { error: { message: 'Este email já está cadastrado' } };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      if (error.message === 'User already registered') {
        return { error: { message: 'Este email já está cadastrado' } };
      }
    } else {
      console.log('Sign up successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Sign out successful');
    }
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    console.log('Attempting password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error);
    } else {
      console.log('Password reset email sent');
    }
    
    return { error };
  };

  const checkProfileComplete = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('bio, nome')
      .eq('id', userId)
      .single();
    
    if (error) return false;
    
    return !!(data?.bio && data?.bio.trim() !== '' && data?.nome && data?.nome.trim() !== '');
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkEmailExists,
    checkProfileComplete
  };
};
