import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building2, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';

interface Gerencia {
  id: string;
  nombre: string;
  descripcion?: string;
  secretaria_id: string;
  created_at: string;
  updated_at: string;
  secretaria?: { nombre: string };
}

interface Secretaria {
  id: string;
  nombre: string;
}

const Gerencias = () => {
  const [gerencias, setGerencias] = useState<Gerencia[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecretaria, setSelectedSecretaria] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGerencia, setEditingGerencia] = useState<Gerencia | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    secretaria_id: ''
  });

  useEffect(() => {
    fetchGerencias();
    fetchSecretarias();
  }, []);

  const fetchGerencias = async () => {
    try {
      const { data, error } = await supabase
        .from('gerencias')
        .select(`
          *,
          secretaria:secretarias(nombre)
        `)
        .order('nombre');

      if (error) throw error;
      setGerencias(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las gerencias",
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
      if (editingGerencia) {
        const { error } = await supabase
          .from('gerencias')
          .update(formData)
          .eq('id', editingGerencia.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Gerencia actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('gerencias')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Gerencia creada correctamente",
        });
      }

      resetForm();
      fetchGerencias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la gerencia",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (gerencia: Gerencia) => {
    setEditingGerencia(gerencia);
    setFormData({
      nombre: gerencia.nombre,
      descripcion: gerencia.descripcion || '',
      secretaria_id: gerencia.secretaria_id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta gerencia?')) return;

    try {
      const { error } = await supabase
        .from('gerencias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Gerencia eliminada correctamente",
      });
      
      fetchGerencias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la gerencia",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      secretaria_id: ''
    });
    setEditingGerencia(null);
    setIsDialogOpen(false);
  };

  const filteredGerencias = gerencias.filter(gerencia => {
    const matchesSearch = gerencia.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSecretaria = !selectedSecretaria || gerencia.secretaria_id === selectedSecretaria;
    return matchesSearch && matchesSecretaria;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando gerencias...</p>
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
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Catálogo de Gerencias</h1>
              <p className="text-muted-foreground">
                Gestión de gerencias por secretaría
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGerencia(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Gerencia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingGerencia ? 'Editar Gerencia' : 'Nueva Gerencia'}
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
                  <Label htmlFor="secretaria_id">Secretaría</Label>
                  <Select
                    value={formData.secretaria_id}
                    onValueChange={(value) => setFormData({...formData, secretaria_id: value})}
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
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingGerencia ? 'Actualizar' : 'Crear'}
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
              placeholder="Buscar gerencias..."
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

        {/* Gerencias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGerencias.map((gerencia) => (
            <Card key={gerencia.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-primary" />
                    {gerencia.nombre}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(gerencia)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(gerencia.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {gerencia.descripcion && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {gerencia.descripcion}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secretaría:</span>
                    <span>{gerencia.secretaria?.nombre || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGerencias.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No hay gerencias</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comienza creando tu primera gerencia.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gerencias;