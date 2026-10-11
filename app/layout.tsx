import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Mi Espacio 2.0', description: 'Prototipo psicoeducativo privado', manifest: '/manifest.webmanifest' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="es"><body>{children}</body></html> }
