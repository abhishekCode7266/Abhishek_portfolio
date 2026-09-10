import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ProfileProvider } from '@/app/context/ProfileContext';

export const metadata: Metadata = {
  title: 'Abhishek Singh Yadav | Portfolio',
  description: 'Personal portfolio of Abhishek Singh Yadav, Computer Science student and Software Developer.',
  openGraph: {
    title: 'Abhishek Singh Yadav | Portfolio',
    description: 'Personal portfolio of Abhishek Singh Yadav, Computer Science student and Software Developer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek Singh Yadav | Portfolio',
    description: 'Personal portfolio of Abhishek Singh Yadav, Computer Science student and Software Developer.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#f4f7fa] text-slate-900">
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
