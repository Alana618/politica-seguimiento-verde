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

interface Programa {
  id: string;
  nombre: string;
  descripcion: string | null;
  sector_id: string;
  orden: number | null;
  sectores: { nombre: string; ejes: { nombre: string } | null } | null;
}

interface Sector {
  id: string;
  nombre: string;
  ejes: { nombre: string } | null;
}

const Programas = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<Programa | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    sector_id: "",
    orden: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgramas();
    fetchSectores();
  }, []);

  const fetchProgramas = async () => {
    try {
      const { data, error } = await supabase
        .from('programas')
        .select(`
          *,
          sectores (
            nombre,
            ejes (nombre)
          )
        `)
        .order('orden', { ascending: true });

      if (error) throw error;
      setProgramas(data || []);
    } catch (error) {
      console.error('Error fetching programas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los programas",
        variant: "destructive"
      });
    }
  };

  const fetchSectores = async () => {
    try {
      const { data, error } = await supabase
        .from('sectores')
        .select(`
          id, 
          nombre,
          ejes (nombre)
        `)
        .order('orden', { ascending: true });

      if (error) throw error;
      setSectores(data || []);
    } catch (error) {
      console.error('Error fetching sectores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        sector_id: formData.sector_id,
        orden: formData.orden ? parseInt(formData.orden) : null
      };

      if (editingPrograma) {
        const { error } = await supabase
          .from('programas')
          .update(dataToSend)
          .eq('id', editingPrograma.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Programa actualizado correctamente"
        });
      } else {
        const { error } = await supabase
          .from('programas')
          .insert([dataToSend]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Programa creado correctamente"
        });
      }

      setFormData({ nombre: "", descripcion: "", sector_id: "", orden: "" });
      setShowForm(false);
      setEditingPrograma(null);
      fetchProgramas();
    } catch (error) {
      console.error('Error saving programa:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el programa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (programa: Programa) => {
    setEditingPrograma(programa);
    setFormData({
      nombre: programa.nombre,
      descripcion: programa.descripcion || "",
      sector_id: programa.sector_id,
      orden: programa.orden?.toString() || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este programa?")) return;

    try {
      const { error } = await supabase
        .from('programas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Programa eliminado correctamente"
      });
      fetchProgramas();
    } catch (error) {
      console.error('Error deleting programa:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el programa",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", sector_id: "", orden: "" });
    setShowForm(false);
    setEditingPrograma(null);
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
                <h1 className="text-3xl font-bold">Programas</h1>
                <p className="text-muted-foreground">Gestiona los programas asociados a los sectores</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Programa
            </Button>
          </div>

          {/* Alert if no sectores */}
          {sectores.length === 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    No hay sectores creados. 
                    <Link to="/plan/sectores" className="font-medium underline ml-1">
                      Crear sectores primero
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
                <CardTitle>{editingPrograma ? "Editar" : "Crear"} Programa</CardTitle>
                <CardDescription>
                  Complete la información del programa
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
                        placeholder="Nombre del programa"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector_id">Sector *</Label>
                      <Select
                        value={formData.sector_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, sector_id: value }))}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Seleccionar sector" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-md">
                          {sectores.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.nombre} - {sector.ejes?.nombre}
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
                      placeholder="Descripción del programa"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading || sectores.length === 0}>
                      {loading ? "Guardando..." : (editingPrograma ? "Actualizar" : "Crear")}
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
              <CardTitle>Programas Registrados</CardTitle>
              <CardDescription>
                {programas.length} programas registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {programas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay programas registrados</p>
                  {sectores.length > 0 && (
                    <Button onClick={() => setShowForm(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primer programa
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {programas.map((programa) => (
                    <div key={programa.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{programa.nombre}</h3>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            {programa.sectores?.nombre}
                          </span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {programa.sectores?.ejes?.nombre}
                          </span>
                          {programa.orden && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Orden: {programa.orden}
                            </span>
                          )}
                        </div>
                        {programa.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{programa.descripcion}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(programa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(programa.id)}
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

export default Programas;