import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, FileText, Search, Edit, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Politica {
  id: string;
  nombre: string;
  descripcion?: string;
  numero_politica: number;
  ponderacion_total?: number;
  created_at: string;
  updated_at: string;
}

const Politicas = () => {
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolitica, setEditingPolitica] = useState<Politica | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    numero_politica: 1
  });

  useEffect(() => {
    fetchPoliticas();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const { data, error } = await supabase
        .from('politicas')
        .select('*')
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
      descripcion: politica.descripcion || '',
      numero_politica: politica.numero_politica
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
      numero_politica: 1
    });
    setEditingPolitica(null);
    setIsDialogOpen(false);
  };

  const filteredPoliticas = politicas.filter(politica => {
    const matchesSearch = politica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (politica.descripcion && politica.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

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
                  <Label htmlFor="numero_politica">Número de Política</Label>
                  <Input
                    id="numero_politica"
                    type="number"
                    value={formData.numero_politica}
                    onChange={(e) => setFormData({...formData, numero_politica: parseInt(e.target.value) || 1})}
                    required
                    min="1"
                  />
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar políticas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                <Badge variant="secondary">
                  Política #{politica.numero_politica}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {politica.descripcion}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ponderación:</span>
                    <span>{politica.ponderacion_total || 0}%</span>
                  </div>
                </div>

                {(politica.ponderacion_total || 0) > 0 && (
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