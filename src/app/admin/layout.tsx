import React from 'react';

// Este layout base aplica-se a todas as rotas dentro de /admin,
// incluindo a página de login. Não deve conter elementos visuais
// do painel de admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
