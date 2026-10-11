'use client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
export default function GoogleAuth() {
 const [user, setUser] = useState<User|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{
  if (!supabase) return;
  void supabase.auth.getUser().then(({data})=>setUser(data.user));
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));
  return ()=>subscription.unsubscribe();
 },[]);
 async function login() {
  if (!supabase) return;
  setBusy(true);setError('');
  const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/auth/callback'}});
  if(error){setError('No se pudo iniciar sesión. Revisá la configuración de Google.');setBusy(false);}
 }
 async function logout(){if(supabase) await supabase.auth.signOut();}
 if(!supabase) return <p className="muted">Acceso con Google pendiente de configurar en Vercel y Supabase.</p>;
 return <section className="card"><h2>Mi cuenta</h2>{user?<><p>Sesión iniciada como {user.email}</p><button className="secondary" onClick={logout}>Cerrar sesión</button></>:<><p>Iniciá sesión con tu cuenta de Google.</p><button onClick={login} disabled={busy}>{busy?'Conectando...':'Continuar con Google'}</button></>}{error&&<p role="alert">{error}</p>}<p className="muted">Inicio de sesión en preparación. El diario y los ejercicios todavía no se guardan.</p></section>;
}
