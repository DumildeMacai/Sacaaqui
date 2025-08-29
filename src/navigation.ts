
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en-US', 'pt-BR'] as const;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames: {},
  });
