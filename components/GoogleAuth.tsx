'use client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function GoogleAuth() {
 const [user,setUser]=useState<User|null>(null);
 const [busy,setBusy]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  if(!supabase){setBusy(false);return;}
  let active=true;
  const client=supabase;
  const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{
   if(active)setUser(session?.user??null);
  });
  async function init(){
   const params=new URLSearchParams(window.location.search);
   const authError=params.get('error_description')||params.get('error');
   if(authError){if(active)setError('Google devolvió un error: '+authError);}
   else if(params.has('code')){
    // Also handle callbacks sent to the site root by an incorrect redirect allowlist.
    const {error:exchangeError}=await client.auth.exchangeCodeForSession(params.get('code')!);
    if(exchangeError&&active)setError('No se pudo completar la sesión: '+exchangeError.message);
   }
   const {data,error:sessionError}=await client.auth.getSession();
   if(active){
    setUser(data.session?.user??null);
    if(sessionError)setError('No se pudo verificar la sesión: '+sessionError.message);
    else if(params.has('code')&&!data.session&&!authError)setError('No se recibió una sesión después de volver de Google.');
    setBusy(false);
   }
   if(params.has('code')||authError){
    window.history.replaceState({},'',window.location.pathname);
   }
  }
  void init();
  return ()=>{active=false;subscription.unsubscribe();};
 },[]);
 async function login(){
  if(!supabase)return;
  setBusy(true);setError('');
  const {error:loginError}=await supabase.auth.signInWithOAuth({
   provider:'google',
   options:{redirectTo:window.location.origin+'/auth/callback'}
  });
  if(loginError){setError('No se pudo abrir Google: '+loginError.message);setBusy(false);}
 }
 async function logout(){
  if(!supabase)return;
  const {error:logoutError}=await supabase.auth.signOut();
  if(logoutError)setError('No se pudo cerrar sesión: '+logoutError.message);
 }
 if(!supabase)return <section className="card"><h2>Mi cuenta</h2><p role="alert">Faltan las variables públicas de Supabase en Vercel.</p></section>;
 return <section className="card"><h2>Mi cuenta</h2>{busy?<p>Verificando sesión...</p>:user?<><p>Sesión iniciada como {user.email}</p><button className="secondary" onClick={logout}>Cerrar sesión</button></>:<><p>Iniciá sesión con tu cuenta de Google.</p><button onClick={login}>Continuar con Google</button></>}{error&&<p role="alert">{error}</p>}<p className="muted">El diario y los ejercicios todavía no se guardan.</p></section>;
}
