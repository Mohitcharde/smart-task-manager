import './globals.css';

export const metadata = {
  title: 'Smart Task Manager',
  description: 'Simple task manager with roles and dependencies'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
