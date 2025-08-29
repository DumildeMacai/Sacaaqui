
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Macai - ATM Locator',
  description: 'Encontre caixas eletrônicos com dinheiro perto de você.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
