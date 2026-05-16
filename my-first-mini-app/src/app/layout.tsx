import { auth } from '@/auth';
import ClientProviders from '@/providers';
import type { Metadata } from 'next';
import { Poppins, Quicksand, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  weight: ['700'],
});

export const metadata: Metadata = {
  title: 'NOMA — Discover Experiences',
  description: 'Marketplace descentralizado de experiências no World App.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${poppins.variable} ${quicksand.variable}`}>
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
