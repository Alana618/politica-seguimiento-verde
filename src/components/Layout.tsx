import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Target,
  Building2,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Plan de Desarrollo',
      icon: Building2,
      subItems: [
        { title: 'Ejes', href: '/plan/ejes' },
        { title: 'Sectores', href: '/plan/sectores' },
        { title: 'Programas', href: '/plan/programas' },
        { title: 'Proyectos', href: '/plan/proyectos' },
        { title: 'Metas', href: '/plan/metas' },
      ]
    },
    {
      title: 'Políticas Públicas',
      href: '/politicas',
      icon: FileText,
    },
    {
      title: 'Catálogos',
      icon: Settings,
      subItems: [
        { title: 'Secretarías', href: '/catalogos/secretarias' },
        { title: 'Gerencias', href: '/catalogos/gerencias' },
      ]
    },
    {
      title: 'Seguimiento',
      href: '/seguimiento',
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-card border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">
                  Sistema de Políticas Públicas
                </h1>
                <p className="text-sm text-white/80">
                  Seguimiento y Gestión
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.subItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/10 hover:text-white"
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.title}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border border-border shadow-lg">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "flex items-center px-4 py-2 hover:bg-muted cursor-pointer",
                                location.pathname === subItem.href && "bg-muted"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link to={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-white hover:bg-white/10 hover:text-white",
                          location.pathname === item.href && "bg-white/20"
                        )}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;