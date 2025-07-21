import { useState, useEffect } from 'react';
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
import { Plus, FileText, Search, Edit, Trash2, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Politica {
  id: string;
  nombre: string;
  descripcion: string;
  objetivo_general: string;
  secretaria_responsable_id: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  ponderacion_total: number;
  secretaria?: { nombre: string };
}

interface Secretaria {
  id: string;
  nombre: string;
}

const Politicas = () => {
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecretaria, setSelectedSecretaria] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolitica, setEditingPolitica] = useState<Politica | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    objetivo_general: '',
    secretaria_responsable_id: '',
    estado: 'formulacion',
    fecha_inicio: '',
    fecha_fin: ''
  });

  useEffect(() => {
    fetchPoliticas();
    fetchSecretarias();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const { data, error } = await supabase
        .from('politicas')
        .select(`
          *,
          secretaria:secretarias(nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPoliticas(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las políticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSecretarias = async () => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .select('id, nombre')
        .order('nombre');

      if (error) throw error;
      setSecretarias(data || []);
    } catch (error) {
      console.error('Error fetching secretarias:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPolitica) {
        const { error } = await supabase
          .from('politicas')
          .update(formData)
          .eq('id', editingPolitica.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Política actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('politicas')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Política creada correctamente",
        });
      }

      resetForm();
      fetchPoliticas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la política",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (politica: Politica) => {
    setEditingPolitica(politica);
    setFormData({
      nombre: politica.nombre,
      descripcion: politica.descripcion,
      objetivo_general: politica.objetivo_general,
      secretaria_responsable_id: politica.secretaria_responsable_id,
      estado: politica.estado,
      fecha_inicio: politica.fecha_inicio,
      fecha_fin: politica.fecha_fin
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta política?')) return;

    try {
      const { error } = await supabase
        .from('politicas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Política eliminada correctamente",
      });
      
      fetchPoliticas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la política",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      objetivo_general: '',
      secretaria_responsable_id: '',
      estado: 'formulacion',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setEditingPolitica(null);
    setIsDialogOpen(false);
  };

  const filteredPoliticas = politicas.filter(politica => {
    const matchesSearch = politica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politica.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSecretaria = !selectedSecretaria || politica.secretaria_responsable_id === selectedSecretaria;
    return matchesSearch && matchesSecretaria;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'formulacion': return 'secondary';
      case 'aprobacion': return 'outline';
      case 'implementacion': return 'default';
      case 'evaluacion': return 'outline';
      case 'finalizada': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando políticas...</p>
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
            <h1 className="text-3xl font-bold">Políticas Públicas</h1>
            <p className="text-muted-foreground">
              Gestión y seguimiento de políticas públicas
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPolitica(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Política
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPolitica ? 'Editar Política' : 'Nueva Política'}
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
                  <Label htmlFor="objetivo_general">Objetivo General</Label>
                  <Textarea
                    id="objetivo_general"
                    value={formData.objetivo_general}
                    onChange={(e) => setFormData({...formData, objetivo_general: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="secretaria_responsable_id">Secretaría Responsable</Label>
                  <Select
                    value={formData.secretaria_responsable_id}
                    onValueChange={(value) => setFormData({...formData, secretaria_responsable_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar secretaría" />
                    </SelectTrigger>
                    <SelectContent>
                      {secretarias.map((secretaria) => (
                        <SelectItem key={secretaria.id} value={secretaria.id}>
                          {secretaria.nombre}
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
                      <SelectItem value="formulacion">Formulación</SelectItem>
                      <SelectItem value="aprobacion">Aprobación</SelectItem>
                      <SelectItem value="implementacion">Implementación</SelectItem>
                      <SelectItem value="evaluacion">Evaluación</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
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
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingPolitica ? 'Actualizar' : 'Crear'}
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
              placeholder="Buscar políticas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSecretaria} onValueChange={setSelectedSecretaria}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por secretaría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las secretarías</SelectItem>
              {secretarias.map((secretaria) => (
                <SelectItem key={secretaria.id} value={secretaria.id}>
                  {secretaria.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoliticas.map((politica) => (
            <Card key={politica.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{politica.nombre}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(politica)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(politica.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant={getEstadoBadgeVariant(politica.estado)}>
                  {politica.estado.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {politica.descripcion}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secretaría:</span>
                    <span>{politica.secretaria?.nombre || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ponderación:</span>
                    <span>{politica.ponderacion_total}%</span>
                  </div>
                  
                  {politica.fecha_inicio && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span>{new Date(politica.fecha_inicio).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {politica.fecha_fin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fin:</span>
                      <span>{new Date(politica.fecha_fin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {politica.ponderacion_total > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avance</span>
                      <span>{politica.ponderacion_total}%</span>
                    </div>
                    <Progress value={politica.ponderacion_total} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPoliticas.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No hay políticas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comienza creando tu primera política pública.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Politicas;