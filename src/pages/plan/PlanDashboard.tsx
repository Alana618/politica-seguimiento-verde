import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlanCard from "@/components/plan/PlanCard";
import StatsCard from "@/components/ui/stats-card";
import { Plus, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const PlanDashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Plan de Desarrollo
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gestiona la estructura jerárquica del plan de desarrollo municipal
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Ejes Estratégicos"
              value="0"
              description="Ejes principales"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <StatsCard
              title="Sectores"
              value="0"
              description="Sectores asociados"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatsCard
              title="Programas"
              value="0"
              description="Programas activos"
              icon={<Plus className="h-4 w-4" />}
            />
            <StatsCard
              title="Proyectos"
              value="0"
              description="Proyectos en ejecución"
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>

          {/* Hierarchy Visualization */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Jerarquía del Plan de Desarrollo
              </CardTitle>
              <CardDescription>
                Estructura organizacional del plan de desarrollo municipal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <PlanCard
                  title="Ejes Estratégicos"
                  description="Grandes líneas de acción"
                  count={0}
                  color="bg-blue-500"
                  link="/plan/ejes"
                />
                <PlanCard
                  title="Sectores"
                  description="Sectores temáticos"
                  count={0}
                  color="bg-green-500"
                  link="/plan/sectores"
                />
                <PlanCard
                  title="Programas"
                  description="Programas específicos"
                  count={0}
                  color="bg-yellow-500"
                  link="/plan/programas"
                />
                <PlanCard
                  title="Proyectos"
                  description="Proyectos de inversión"
                  count={0}
                  color="bg-purple-500"
                  link="/plan/proyectos"
                />
                <PlanCard
                  title="Metas"
                  description="Metas cuatrienio"
                  count={0}
                  color="bg-red-500"
                  link="/plan/metas"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Comienza a estructurar tu plan de desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild size="lg" className="h-20 flex-col">
                  <Link to="/plan/ejes">
                    <Plus className="h-6 w-6 mb-2" />
                    Crear Eje Estratégico
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-20 flex-col">
                  <Link to="/catalogos/secretarias">
                    <FileText className="h-6 w-6 mb-2" />
                    Gestionar Catálogos
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-20 flex-col">
                  <Link to="/seguimiento">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Ver Seguimiento
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PlanDashboard;