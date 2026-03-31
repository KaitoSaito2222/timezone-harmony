'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Clock, LogOut, BookMarked, Menu, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const t = useTranslations('common');
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // SSR では常に未認証として描画し Radix UI の ID カウンターを安定させる。
  // ハイドレーション後に実際の認証状態へ切り替わる。
  const effectiveIsAuthenticated = mounted && isAuthenticated;

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsOpen(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-base sm:text-xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            {effectiveIsAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {t('home')}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/presets" className="flex items-center gap-2">
                    <BookMarked className="h-4 w-4" />
                    {t('presets')}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user?.displayName ?? undefined, user?.email ?? undefined)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.displayName || t('user')}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/presets" className="cursor-pointer">
                        <BookMarked className="mr-2 h-4 w-4" />
                        {t('myPresets')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">{t('login')}</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 md:hidden">
            {/* LocaleSwitcher is always rendered here to keep Radix UI's ID counter stable */}
            <LocaleSwitcher />
            {effectiveIsAuthenticated ? (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t('openMenu')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-70 sm:w-80" aria-describedby={undefined}>
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        {t('appName')}
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user?.displayName ?? undefined, user?.email ?? undefined)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.displayName || t('user')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" className="w-full justify-start" asChild onClick={handleNavClick}>
                        <Link href="/">
                          <Home className="mr-3 h-4 w-4" />
                          {t('home')}
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild onClick={handleNavClick}>
                        <Link href="/presets">
                          <BookMarked className="mr-3 h-4 w-4" />
                          {t('myPresets')}
                        </Link>
                      </Button>
                    </div>

                    <div className="border-t pt-4 mt-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-sm text-muted-foreground">{t('theme')}</span>
                        <ThemeToggle />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        {t('logout')}
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <ThemeToggle />
                <Button asChild>
                  <Link href="/login">{t('login')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
