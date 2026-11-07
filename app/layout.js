import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const font = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font' });

export const metadata = {
  title: 'Krishna Nangre – Director & Motion Designer',
  description: 'Selected films and motion work by Krishna Nangre.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.variable}>{children}</body>
    </html>
  );
}
