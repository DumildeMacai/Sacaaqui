
'use client';

import '../globals.css';
import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

// Este layout agora é responsável por fornecer o contexto de internacionalização.
export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
