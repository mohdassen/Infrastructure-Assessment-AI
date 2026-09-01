import './globals.css';

export const metadata = {
  title: 'Infrastructure Assessment AI',
  description: 'Evidence-first infrastructure assessment platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
