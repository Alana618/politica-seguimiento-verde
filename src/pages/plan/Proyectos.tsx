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
import { Plus, Building2, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  programa_id: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto: number;
  programa?: { nombre: string };
}

interface Programa {
  id: string;
  nombre: string;
}

const Proyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    programa_id: '',
    estado: 'planificacion',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: 0
  });

  useEffect(() => {
    fetchProyectos();
    fetchProgramas();
  }, []);

  const fetchProyectos = async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select(`
          *,
          programa:programas(nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProyectos(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramas = async () => {
    try {
      const { data, error } = await supabase
        .from('programas')
        .select('id, nombre')
        .order('nombre');

      if (error) throw error;
      setProgramas(data || []);
    } catch (error) {
      console.error('Error fetching programas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProyecto) {
        const { error } = await supabase
          .from('proyectos')
          .update(formData)
          .eq('id', editingProyecto.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Proyecto actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from('proyectos')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Proyecto creado correctamente",
        });
      }

      resetForm();
      fetchProyectos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (proyecto: Proyecto) => {
    setEditingProyecto(proyecto);
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      programa_id: proyecto.programa_id,
      estado: proyecto.estado,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      presupuesto: proyecto.presupuesto
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      const { error } = await supabase
        .from('proyectos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente",
      });
      
      fetchProyectos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      programa_id: '',
      estado: 'planificacion',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto: 0
    });
    setEditingProyecto(null);
    setIsDialogOpen(false);
  };

  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrograma = !selectedPrograma || proyecto.programa_id === selectedPrograma;
    return matchesSearch && matchesPrograma;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'planificacion': return 'secondary';
      case 'en_ejecucion': return 'default';
      case 'finalizado': return 'outline';
      case 'suspendido': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
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
              <h1 className="text-3xl font-bold">Proyectos</h1>
              <p className="text-muted-foreground">
                Gestión de proyectos del plan de desarrollo
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProyecto(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
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
                  <Label htmlFor="programa_id">Programa</Label>
                  <Select
                    value={formData.programa_id}
                    onValueChange={(value) => setFormData({...formData, programa_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar programa" />
                    </SelectTrigger>
                    <SelectContent>
                      {programas.map((programa) => (
                        <SelectItem key={programa.id} value={programa.id}>
                          {programa.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => setFormData({...formData, estado: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planificacion">Planificación</SelectItem>
                      <SelectItem value="en_ejecucion">En Ejecución</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                    <Input
                      id="fecha_inicio"
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fecha_fin">Fecha Fin</Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    type="number"
                    value={formData.presupuesto}
                    onChange={(e) => setFormData({...formData, presupuesto: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProyecto ? 'Actualizar' : 'Crear'}
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
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPrograma} onValueChange={setSelectedPrograma}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por programa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los programas</SelectItem>
              {programas.map((programa) => (
                <SelectItem key={programa.id} value={programa.id}>
                  {programa.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <Card key={proyecto.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{proyecto.nombre}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(proyecto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(proyecto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant={getEstadoBadgeVariant(proyecto.estado)}>
                  {proyecto.estado.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {proyecto.descripcion}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Programa:</span>
                    <span>{proyecto.programa?.nombre || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Presupuesto:</span>
                    <span>${proyecto.presupuesto.toLocaleString()}</span>
                  </div>
                  
                  {proyecto.fecha_inicio && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span>{new Date(proyecto.fecha_inicio).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {proyecto.fecha_fin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fin:</span>
                      <span>{new Date(proyecto.fecha_fin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProyectos.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No hay proyectos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comienza creando tu primer proyecto.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Proyectos;