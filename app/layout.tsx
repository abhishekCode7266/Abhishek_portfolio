import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { PortfolioProvider } from '@/app/context/PortfolioContext';
import { ThemeProvider } from '@/app/context/ThemeContext';

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
                  var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && sysDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#f4f7fa] text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 antialiased transition-colors duration-200">
        <ThemeProvider>
          <PortfolioProvider>
            {children}
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

