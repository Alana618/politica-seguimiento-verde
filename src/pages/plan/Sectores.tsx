import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Sector {
  id: string;
  nombre: string;
  descripcion: string | null;
  eje_id: string;
  orden: number | null;
  ejes: { nombre: string } | null;
}

interface Eje {
  id: string;
  nombre: string;
}

const Sectores = () => {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    eje_id: "",
    orden: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSectores();
    fetchEjes();
  }, []);

  const fetchSectores = async () => {
    try {
      const { data, error } = await supabase
        .from('sectores')
        .select(`
          *,
          ejes (nombre)
        `)
        .order('orden', { ascending: true });

      if (error) throw error;
      setSectores(data || []);
    } catch (error) {
      console.error('Error fetching sectores:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los sectores",
        variant: "destructive"
      });
    }
  };

  const fetchEjes = async () => {
    try {
      const { data, error } = await supabase
        .from('ejes')
        .select('id, nombre')
        .order('orden', { ascending: true });

      if (error) throw error;
      setEjes(data || []);
    } catch (error) {
      console.error('Error fetching ejes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        eje_id: formData.eje_id,
        orden: formData.orden ? parseInt(formData.orden) : null
      };

      if (editingSector) {
        const { error } = await supabase
          .from('sectores')
          .update(dataToSend)
          .eq('id', editingSector.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Sector actualizado correctamente"
        });
      } else {
        const { error } = await supabase
          .from('sectores')
          .insert([dataToSend]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Sector creado correctamente"
        });
      }

      setFormData({ nombre: "", descripcion: "", eje_id: "", orden: "" });
      setShowForm(false);
      setEditingSector(null);
      fetchSectores();
    } catch (error) {
      console.error('Error saving sector:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el sector",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      nombre: sector.nombre,
      descripcion: sector.descripcion || "",
      eje_id: sector.eje_id,
      orden: sector.orden?.toString() || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este sector?")) return;

    try {
      const { error } = await supabase
        .from('sectores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Sector eliminado correctamente"
      });
      fetchSectores();
    } catch (error) {
      console.error('Error deleting sector:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sector",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", eje_id: "", orden: "" });
    setShowForm(false);
    setEditingSector(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/plan">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Plan
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Sectores</h1>
                <p className="text-muted-foreground">Gestiona los sectores asociados a los ejes estratégicos</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Sector
            </Button>
          </div>

          {/* Alert if no ejes */}
          {ejes.length === 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    No hay ejes estratégicos creados. 
                    <Link to="/plan/ejes" className="font-medium underline ml-1">
                      Crear ejes estratégicos primero
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          {showForm && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{editingSector ? "Editar" : "Crear"} Sector</CardTitle>
                <CardDescription>
                  Complete la información del sector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Nombre del sector"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eje_id">Eje Estratégico *</Label>
                      <Select
                        value={formData.eje_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, eje_id: value }))}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Seleccionar eje estratégico" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-md">
                          {ejes.map((eje) => (
                            <SelectItem key={eje.id} value={eje.id}>
                              {eje.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orden">Orden</Label>
                      <Input
                        id="orden"
                        type="number"
                        value={formData.orden}
                        onChange={(e) => setFormData(prev => ({ ...prev, orden: e.target.value }))}
                        placeholder="Orden"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder="Descripción del sector"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading || ejes.length === 0}>
                      {loading ? "Guardando..." : (editingSector ? "Actualizar" : "Crear")}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* List */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sectores Registrados</CardTitle>
              <CardDescription>
                {sectores.length} sectores registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sectores.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay sectores registrados</p>
                  {ejes.length > 0 && (
                    <Button onClick={() => setShowForm(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primer sector
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sectores.map((sector) => (
                    <div key={sector.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{sector.nombre}</h3>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {sector.ejes?.nombre}
                          </span>
                          {sector.orden && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Orden: {sector.orden}
                            </span>
                          )}
                        </div>
                        {sector.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{sector.descripcion}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sector)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sector.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Sectores;