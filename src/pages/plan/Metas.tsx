import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Target, Search, Edit, Trash2, ArrowLeft, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Meta {
  id: string;
  nombre: string;
  descripcion: string;
  proyecto_id: string;
  valor_meta: number;
  valor_actual: number;
  unidad_medida: string;
  fecha_limite: string;
  proyecto?: { nombre: string };
}

interface Proyecto {
  id: string;
  nombre: string;
}

const Metas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProyecto, setSelectedProyecto] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proyecto_id: '',
    valor_meta: 0,
    valor_actual: 0,
    unidad_medida: '',
    fecha_limite: ''
  });

  useEffect(() => {
    fetchMetas();
    fetchProyectos();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select(`
          *,
          proyecto:proyectos(nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetas(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las metas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProyectos = async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('id, nombre')
        .order('nombre');

      if (error) throw error;
      setProyectos(data || []);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMeta) {
        const { error } = await supabase
          .from('metas')
          .update(formData)
          .eq('id', editingMeta.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Meta actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('metas')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Meta creada correctamente",
        });
      }

      resetForm();
      fetchMetas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la meta",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta);
    setFormData({
      nombre: meta.nombre,
      descripcion: meta.descripcion,
      proyecto_id: meta.proyecto_id,
      valor_meta: meta.valor_meta,
      valor_actual: meta.valor_actual,
      unidad_medida: meta.unidad_medida,
      fecha_limite: meta.fecha_limite
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta meta?')) return;

    try {
      const { error } = await supabase
        .from('metas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Meta eliminada correctamente",
      });
      
      fetchMetas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la meta",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      proyecto_id: '',
      valor_meta: 0,
      valor_actual: 0,
      unidad_medida: '',
      fecha_limite: ''
    });
    setEditingMeta(null);
    setIsDialogOpen(false);
  };

  const filteredMetas = metas.filter(meta => {
    const matchesSearch = meta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProyecto = !selectedProyecto || meta.proyecto_id === selectedProyecto;
    return matchesSearch && matchesProyecto;
  });

  const calculateProgress = (valorActual: number, valorMeta: number) => {
    if (valorMeta === 0) return 0;
    return Math.min((valorActual / valorMeta) * 100, 100);
  };

  const getProgressBadgeVariant = (progress: number) => {
    if (progress >= 100) return 'default';
    if (progress >= 75) return 'secondary';
    if (progress >= 50) return 'outline';
    return 'destructive';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando metas...</p>
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
          <div className="flex items-center space-x-4">
            <Link to="/plan">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Metas</h1>
              <p className="text-muted-foreground">
                Gestión de metas e indicadores del plan
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMeta(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMeta ? 'Editar Meta' : 'Nueva Meta'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="proyecto_id">Proyecto</Label>
                  <Select
                    value={formData.proyecto_id}
                    onValueChange={(value) => setFormData({...formData, proyecto_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {proyectos.map((proyecto) => (
                        <SelectItem key={proyecto.id} value={proyecto.id}>
                          {proyecto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valor_meta">Valor Meta</Label>
                    <Input
                      id="valor_meta"
                      type="number"
                      value={formData.valor_meta}
                      onChange={(e) => setFormData({...formData, valor_meta: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valor_actual">Valor Actual</Label>
                    <Input
                      id="valor_actual"
                      type="number"
                      value={formData.valor_actual}
                      onChange={(e) => setFormData({...formData, valor_actual: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                  <Input
                    id="unidad_medida"
                    value={formData.unidad_medida}
                    onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})}
                    placeholder="ej: personas, kilómetros, porcentaje"
                  />
                </div>

                <div>
                  <Label htmlFor="fecha_limite">Fecha Límite</Label>
                  <Input
                    id="fecha_limite"
                    type="date"
                    value={formData.fecha_limite}
                    onChange={(e) => setFormData({...formData, fecha_limite: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingMeta ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar metas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedProyecto} onValueChange={setSelectedProyecto}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los proyectos</SelectItem>
              {proyectos.map((proyecto) => (
                <SelectItem key={proyecto.id} value={proyecto.id}>
                  {proyecto.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetas.map((meta) => {
            const progress = calculateProgress(meta.valor_actual, meta.valor_meta);
            return (
              <Card key={meta.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{meta.nombre}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(meta)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(meta.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant={getProgressBadgeVariant(progress)}>
                    {progress.toFixed(1)}% completado
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {meta.descripcion}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{meta.valor_actual} / {meta.valor_meta} {meta.unidad_medida}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Proyecto:</span>
                        <span>{meta.proyecto?.nombre || 'N/A'}</span>
                      </div>
                      
                      {meta.fecha_limite && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha Límite:</span>
                          <span>{new Date(meta.fecha_limite).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMetas.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No hay metas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comienza creando tu primera meta.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Metas;