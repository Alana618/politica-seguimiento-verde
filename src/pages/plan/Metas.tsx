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
import { Plus, Target, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Meta {
  id: string;
  secretaria_id: string;
  gerencia_id: string;
  linea_base?: number;
  meta_cuatrienio?: number;
  indicador_meta: string;
  tipo_indicador: string;
  producto_indicador?: string;
  indicador_producto?: string;
  numero_meta: string;
  nombre_meta: string;
  unidad_medida: string;
  created_at: string;
  updated_at: string;
}

interface Secretaria {
  id: string;
  nombre: string;
}

interface Gerencia {
  id: string;
  nombre: string;
}

const Metas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [gerencias, setGerencias] = useState<Gerencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecretaria, setSelectedSecretaria] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    secretaria_id: '',
    gerencia_id: '',
    linea_base: 0,
    meta_cuatrienio: 0,
    indicador_meta: '',
    tipo_indicador: 'resultado',
    producto_indicador: '',
    indicador_producto: '',
    numero_meta: '',
    nombre_meta: '',
    unidad_medida: ''
  });

  useEffect(() => {
    fetchMetas();
    fetchSecretarias();
    fetchGerencias();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
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

  const fetchGerencias = async () => {
    try {
      const { data, error } = await supabase
        .from('gerencias')
        .select('id, nombre')
        .order('nombre');

      if (error) throw error;
      setGerencias(data || []);
    } catch (error) {
      console.error('Error fetching gerencias:', error);
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
      secretaria_id: meta.secretaria_id,
      gerencia_id: meta.gerencia_id,
      linea_base: meta.linea_base || 0,
      meta_cuatrienio: meta.meta_cuatrienio || 0,
      indicador_meta: meta.indicador_meta,
      tipo_indicador: meta.tipo_indicador,
      producto_indicador: meta.producto_indicador || '',
      indicador_producto: meta.indicador_producto || '',
      numero_meta: meta.numero_meta,
      nombre_meta: meta.nombre_meta,
      unidad_medida: meta.unidad_medida
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
      secretaria_id: '',
      gerencia_id: '',
      linea_base: 0,
      meta_cuatrienio: 0,
      indicador_meta: '',
      tipo_indicador: 'resultado',
      producto_indicador: '',
      indicador_producto: '',
      numero_meta: '',
      nombre_meta: '',
      unidad_medida: ''
    });
    setEditingMeta(null);
    setIsDialogOpen(false);
  };

  const filteredMetas = metas.filter(meta => {
    const matchesSearch = meta.nombre_meta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meta.indicador_meta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSecretaria = !selectedSecretaria || meta.secretaria_id === selectedSecretaria;
    return matchesSearch && matchesSecretaria;
  });

  const calculateProgress = (linea_base: number, meta_cuatrienio: number) => {
    if (meta_cuatrienio === 0) return 0;
    return Math.min((linea_base / meta_cuatrienio) * 100, 100);
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMeta ? 'Editar Meta' : 'Nueva Meta'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre_meta">Nombre de la Meta</Label>
                  <Input
                    id="nombre_meta"
                    value={formData.nombre_meta}
                    onChange={(e) => setFormData({...formData, nombre_meta: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="numero_meta">Número de Meta</Label>
                  <Input
                    id="numero_meta"
                    value={formData.numero_meta}
                    onChange={(e) => setFormData({...formData, numero_meta: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="indicador_meta">Indicador</Label>
                  <Textarea
                    id="indicador_meta"
                    value={formData.indicador_meta}
                    onChange={(e) => setFormData({...formData, indicador_meta: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo_indicador">Tipo de Indicador</Label>
                  <Select
                    value={formData.tipo_indicador}
                    onValueChange={(value) => setFormData({...formData, tipo_indicador: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resultado">Resultado</SelectItem>
                      <SelectItem value="producto">Producto</SelectItem>
                      <SelectItem value="gestion">Gestión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linea_base">Línea Base</Label>
                    <Input
                      id="linea_base"
                      type="number"
                      value={formData.linea_base}
                      onChange={(e) => setFormData({...formData, linea_base: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_cuatrienio">Meta Cuatrienio</Label>
                    <Input
                      id="meta_cuatrienio"
                      type="number"
                      value={formData.meta_cuatrienio}
                      onChange={(e) => setFormData({...formData, meta_cuatrienio: parseFloat(e.target.value) || 0})}
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
                    required
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

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar metas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetas.map((meta) => {
            const progress = calculateProgress(meta.linea_base || 0, meta.meta_cuatrienio || 0);
            return (
              <Card key={meta.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{meta.nombre_meta}</CardTitle>
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
                  <Badge variant="secondary">
                    Meta #{meta.numero_meta}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {meta.indicador_meta}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="capitalize">{meta.tipo_indicador}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meta:</span>
                      <span>{meta.meta_cuatrienio} {meta.unidad_medida}</span>
                    </div>
                  </div>

                  {(meta.meta_cuatrienio || 0) > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
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