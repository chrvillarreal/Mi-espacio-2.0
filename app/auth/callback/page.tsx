'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function Callback() {
 const [message,setMessage]=useState('Completando inicio de sesión...');
 useEffect(()=>{
  let active=true;
  async function finish(){
   if(!supabase){setMessage('Falta configurar Supabase en Vercel.');return;}
   const url=new URL(window.location.href);
   const providerError=url.searchParams.get('error_description')||url.searchParams.get('error');
   if(providerError){setMessage('Google no completó el acceso: '+providerError);return;}
   const code=url.searchParams.get('code');
   if(code){
    const {error}=await supabase.auth.exchangeCodeForSession(code);
    if(error){setMessage('No se pudo completar la sesión: '+error.message);return;}
   }
   const {data,error}=await supabase.auth.getSession();
   if(!active)return;
   if(error){setMessage('Error al verificar la sesión: '+error.message);return;}
   if(!data.session){setMessage('No se recibió una sesión. Verificá la URL de retorno autorizada en Supabase.');return;}
   window.location.replace('/');
  }
  void finish();
  return ()=>{active=false;};
 },[]);
 return <main style={{maxWidth:640,margin:'4rem auto',padding:'1.5rem'}}><h1>Mi Espacio 2.0</h1><p role="status">{message}</p><a href="/">Volver al inicio</a></main>;
}
