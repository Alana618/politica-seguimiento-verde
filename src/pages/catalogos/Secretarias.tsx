import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Users, Search, Edit, Trash2, ArrowLeft, Building } from 'lucide-react';

interface Secretaria {
  id: string;
  nombre: string;
  descripcion: string;
  responsable: string;
  telefono: string;
  email: string;
  direccion: string;
}

const Secretarias = () => {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSecretaria, setEditingSecretaria] = useState<Secretaria | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    responsable: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    fetchSecretarias();
  }, []);

  const fetchSecretarias = async () => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setSecretarias(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las secretarías",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSecretaria) {
        const { error } = await supabase
          .from('secretarias')
          .update(formData)
          .eq('id', editingSecretaria.id);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Secretaría actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('secretarias')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Secretaría creada correctamente",
        });
      }

      resetForm();
      fetchSecretarias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la secretaría",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (secretaria: Secretaria) => {
    setEditingSecretaria(secretaria);
    setFormData({
      nombre: secretaria.nombre,
      descripcion: secretaria.descripcion || '',
      responsable: secretaria.responsable || '',
      telefono: secretaria.telefono || '',
      email: secretaria.email || '',
      direccion: secretaria.direccion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta secretaría?')) return;

    try {
      const { error } = await supabase
        .from('secretarias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Secretaría eliminada correctamente",
      });
      
      fetchSecretarias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la secretaría",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      responsable: '',
      telefono: '',
      email: '',
      direccion: ''
    });
    setEditingSecretaria(null);
    setIsDialogOpen(false);
  };

  const filteredSecretarias = secretarias.filter(secretaria =>
    secretaria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (secretaria.responsable && secretaria.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando secretarías...</p>
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
              <h1 className="text-3xl font-bold">Catálogo de Secretarías</h1>
              <p className="text-muted-foreground">
                Gestión de entidades responsables
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSecretaria(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Secretaría
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSecretaria ? 'Editar Secretaría' : 'Nueva Secretaría'}
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
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData({...formData, responsable: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingSecretaria ? 'Actualizar' : 'Crear'}
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
            placeholder="Buscar secretarías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Secretarias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSecretarias.map((secretaria) => (
            <Card key={secretaria.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="w-5 h-5 mr-2 text-primary" />
                    {secretaria.nombre}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(secretaria)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(secretaria.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {secretaria.descripcion && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {secretaria.descripcion}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  {secretaria.responsable && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Responsable:</span>
                      <span>{secretaria.responsable}</span>
                    </div>
                  )}
                  
                  {secretaria.telefono && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span>{secretaria.telefono}</span>
                    </div>
                  )}
                  
                  {secretaria.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate">{secretaria.email}</span>
                    </div>
                  )}
                  
                  {secretaria.direccion && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dirección:</span>
                      <span className="text-right">{secretaria.direccion}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSecretarias.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No hay secretarías</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comienza creando tu primera secretaría.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Secretarias;