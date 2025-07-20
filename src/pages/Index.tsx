import Layout from '@/components/Layout';
import StatsCard from '@/components/ui/stats-card';
import HierarchyCard from '@/components/dashboard/HierarchyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  FileText, 
  Building2, 
  Users, 
  TrendingUp,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react';
import heroImage from '@/assets/hero-policies.jpg';

const Index = () => {
  const planHierarchy = [
    {
      id: 'ejes',
      name: 'Ejes Estratégicos',
      count: 4,
      color: 'bg-primary',
      description: 'Direcciones principales del desarrollo'
    },
    {
      id: 'sectores',
      name: 'Sectores',
      count: 12,
      color: 'bg-secondary',
      description: 'Áreas temáticas de intervención'
    },
    {
      id: 'programas',
      name: 'Programas',
      count: 28,
      color: 'bg-accent',
      description: 'Estrategias de implementación'
    },
    {
      id: 'proyectos',
      name: 'Proyectos',
      count: 85,
      color: 'bg-purple-primary',
      description: 'Iniciativas específicas'
    },
    {
      id: 'metas',
      name: 'Metas',
      count: 156,
      color: 'bg-green-dark',
      description: 'Objetivos cuantificables'
    }
  ];

  const recentPolicies = [
    { name: 'Política de Educación Inclusiva', progress: 85, status: 'En progreso' },
    { name: 'Política de Salud Pública', progress: 92, status: 'Avanzado' },
    { name: 'Política de Desarrollo Urbano', progress: 67, status: 'En desarrollo' },
    { name: 'Política de Medio Ambiente', progress: 78, status: 'En progreso' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-primary">
          <img 
            src={heroImage} 
            alt="Sistema de Políticas Públicas"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/90 to-primary/80 flex items-center">
            <div className="max-w-4xl mx-auto px-8 text-white">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Sistema de Seguimiento a Políticas Públicas
              </h1>
              <p className="text-xl mb-8 text-white/90 animate-slide-in">
                Gestión integral del plan de desarrollo y seguimiento de 18 políticas públicas 
                con estructura jerárquica completa y sistema de ponderaciones.
              </p>
              <div className="flex space-x-4 animate-scale-in">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Comenzar Gestión
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Políticas
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Políticas Públicas"
            value="18"
            description="Total de políticas en seguimiento"
            icon={<FileText className="w-5 h-5 text-primary" />}
            variant="primary"
          />
          <StatsCard
            title="Proyectos Activos"
            value="85"
            description="En diferentes etapas de ejecución"
            icon={<Building2 className="w-5 h-5 text-secondary" />}
            trend={{ value: 12, label: "este mes", isPositive: true }}
          />
          <StatsCard
            title="Secretarías"
            value="15"
            description="Entidades responsables"
            icon={<Users className="w-5 h-5 text-accent" />}
          />
          <StatsCard
            title="Avance Promedio"
            value="78%"
            description="Progreso general del plan"
            icon={<TrendingUp className="w-5 h-5 text-green-dark" />}
            trend={{ value: 5, label: "mejora", isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Development Hierarchy */}
          <div className="lg:col-span-2">
            <HierarchyCard
              title="Estructura del Plan de Desarrollo"
              levels={planHierarchy}
              className="h-fit"
            />
          </div>

          {/* Recent Policies Progress */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  Progreso de Políticas
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPolicies.map((policy, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium truncate">{policy.name}</h4>
                    <span className="text-xs text-muted-foreground">{policy.progress}%</span>
                  </div>
                  <Progress value={policy.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{policy.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Building2 className="w-6 h-6" />
                <span className="text-sm">Nuevo Proyecto</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Target className="w-6 h-6" />
                <span className="text-sm">Crear Meta</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Revisar Política</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;