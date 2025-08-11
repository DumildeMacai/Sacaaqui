/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['pt-BR', 'en-US'], // Defina os idiomas suportados
    defaultLocale: 'pt-BR', // Defina o idioma padrão
  },
  // ... outras configurações
};

module.exports = nextConfig;
