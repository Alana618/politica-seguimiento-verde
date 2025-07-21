import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Target, FileText, Building2, TrendingUp, Activity, Calendar, Users } from 'lucide-react';

interface SeguimientoData {
  proyectos: any[];
  metas: any[];
  politicas: any[];
  ejes: any[];
  secretarias: any[];
}

const Seguimiento = () => {
  const [data, setData] = useState<SeguimientoData>({
    proyectos: [],
    metas: [],
    politicas: [],
    ejes: [],
    secretarias: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const { toast } = useToast();

  useEffect(() => {
    fetchSeguimientoData();
  }, []);

  const fetchSeguimientoData = async () => {
    try {
      // Fetch all data in parallel
      const [proyectosRes, metasRes, politicasRes, ejesRes, secretariasRes] = await Promise.all([
        supabase.from('proyectos').select(`
          *,
          programa:programas(nombre, sector:sectores(nombre))
        `),
        supabase.from('metas').select(`
          *,
          proyecto:proyectos(nombre)
        `),
        supabase.from('politicas').select(`
          *,
          secretaria:secretarias(nombre)
        `),
        supabase.from('ejes').select('*'),
        supabase.from('secretarias').select('*')
      ]);

      if (proyectosRes.error) throw proyectosRes.error;
      if (metasRes.error) throw metasRes.error;
      if (politicasRes.error) throw politicasRes.error;
      if (ejesRes.error) throw ejesRes.error;
      if (secretariasRes.error) throw secretariasRes.error;

      setData({
        proyectos: proyectosRes.data || [],
        metas: metasRes.data || [],
        politicas: politicasRes.data || [],
        ejes: ejesRes.data || [],
        secretarias: secretariasRes.data || []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de seguimiento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMetaProgress = (valorActual: number, valorMeta: number) => {
    if (valorMeta === 0) return 0;
    return Math.min((valorActual / valorMeta) * 100, 100);
  };

  const getProyectosStats = () => {
    const total = data.proyectos.length;
    const enEjecucion = data.proyectos.filter(p => p.estado === 'en_ejecucion').length;
    const finalizados = data.proyectos.filter(p => p.estado === 'finalizado').length;
    const planificacion = data.proyectos.filter(p => p.estado === 'planificacion').length;
    
    return { total, enEjecucion, finalizados, planificacion };
  };

  const getMetasStats = () => {
    const total = data.metas.length;
    const completadas = data.metas.filter(m => calculateMetaProgress(m.valor_actual, m.valor_meta) >= 100).length;
    const enProgreso = data.metas.filter(m => {
      const progress = calculateMetaProgress(m.valor_actual, m.valor_meta);
      return progress > 0 && progress < 100;
    }).length;
    const sinIniciar = total - completadas - enProgreso;
    
    return { total, completadas, enProgreso, sinIniciar };
  };

  const getPoliticasStats = () => {
    const total = data.politicas.length;
    const implementacion = data.politicas.filter(p => p.estado === 'implementacion').length;
    const formulacion = data.politicas.filter(p => p.estado === 'formulacion').length;
    const evaluacion = data.politicas.filter(p => p.estado === 'evaluacion').length;
    
    return { total, implementacion, formulacion, evaluacion };
  };

  const proyectosStats = getProyectosStats();
  const metasStats = getMetasStats();
  const politicasStats = getPoliticasStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando datos de seguimiento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Seguimiento</h1>
            <p className="text-muted-foreground">
              Panel de control y seguimiento integral
            </p>
          </div>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los períodos</SelectItem>
              <SelectItem value="actual">Período actual</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
              <SelectItem value="trimestre">Este trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proyectosStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {proyectosStats.enEjecucion} en ejecución
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Metas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metasStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {metasStats.completadas} completadas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Políticas Públicas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{politicasStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {politicasStats.implementacion} en implementación
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secretarías</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.secretarias.length}</div>
              <p className="text-xs text-muted-foreground">
                Entidades responsables
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proyectos por Estado */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                Estado de Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">En Ejecución</span>
                  <Badge variant="default">{proyectosStats.enEjecucion}</Badge>
                </div>
                <Progress 
                  value={proyectosStats.total > 0 ? (proyectosStats.enEjecucion / proyectosStats.total) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Finalizados</span>
                  <Badge variant="outline">{proyectosStats.finalizados}</Badge>
                </div>
                <Progress 
                  value={proyectosStats.total > 0 ? (proyectosStats.finalizados / proyectosStats.total) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">En Planificación</span>
                  <Badge variant="secondary">{proyectosStats.planificacion}</Badge>
                </div>
                <Progress 
                  value={proyectosStats.total > 0 ? (proyectosStats.planificacion / proyectosStats.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Avance de Metas */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Avance de Metas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completadas</span>
                  <Badge variant="default">{metasStats.completadas}</Badge>
                </div>
                <Progress 
                  value={metasStats.total > 0 ? (metasStats.completadas / metasStats.total) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">En Progreso</span>
                  <Badge variant="outline">{metasStats.enProgreso}</Badge>
                </div>
                <Progress 
                  value={metasStats.total > 0 ? (metasStats.enProgreso / metasStats.total) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sin Iniciar</span>
                  <Badge variant="secondary">{metasStats.sinIniciar}</Badge>
                </div>
                <Progress 
                  value={metasStats.total > 0 ? (metasStats.sinIniciar / metasStats.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.proyectos.slice(0, 5).map((proyecto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{proyecto.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {proyecto.programa?.nombre || 'Sin programa'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {proyecto.estado?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
              
              {data.proyectos.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No hay actividad reciente
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Seguimiento;