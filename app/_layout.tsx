import React, { useEffect } from 'react';
import {Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router'
import { getUserData } from '../services/userService'
import { User } from '@supabase/supabase-js';

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('session', session?.user?.id);
      if(session){
        setAuth(session?.user);
        updatedUserData(session?.user,session?.user?.email);
        router.replace('/home');
      }else{
        router.replace('/welcome');
      }
    });
  }, []);
const updatedUserData = async (user: User,email: any) => {
 let res=await getUserData(user?.id);
if(res.success){
  setUserData({...res.data,email});
}

}
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default _layout;
