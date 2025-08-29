
// This layout is intentionally left simple. 
// The main layout with providers is in [locale]/layout.tsx
// as required by next-intl.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
