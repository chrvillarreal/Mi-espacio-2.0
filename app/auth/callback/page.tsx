'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
export default function Callback() {
 const router = useRouter();
 useEffect(() => {
  async function finish() {
   if (!supabase) return;
   const url = new URL(window.location.href);
   const code = url.searchParams.get('code');
   if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) { router.replace('/?auth_error=1'); return; }
   }
   router.replace('/');
  }
  void finish();
 }, [router]);
 return <main><p>Completando inicio de sesión...</p></main>;
}
