import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Eje {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number | null;
  created_at: string;
}

const Ejes = () => {
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEje, setEditingEje] = useState<Eje | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    orden: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEjes();
  }, []);

  const fetchEjes = async () => {
    try {
      const { data, error } = await supabase
        .from('ejes')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      setEjes(data || []);
    } catch (error) {
      console.error('Error fetching ejes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los ejes estratégicos",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        orden: formData.orden ? parseInt(formData.orden) : null
      };

      if (editingEje) {
        const { error } = await supabase
          .from('ejes')
          .update(dataToSend)
          .eq('id', editingEje.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Eje estratégico actualizado correctamente"
        });
      } else {
        const { error } = await supabase
          .from('ejes')
          .insert([dataToSend]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Eje estratégico creado correctamente"
        });
      }

      setFormData({ nombre: "", descripcion: "", orden: "" });
      setShowForm(false);
      setEditingEje(null);
      fetchEjes();
    } catch (error) {
      console.error('Error saving eje:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el eje estratégico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eje: Eje) => {
    setEditingEje(eje);
    setFormData({
      nombre: eje.nombre,
      descripcion: eje.descripcion || "",
      orden: eje.orden?.toString() || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este eje estratégico?")) return;

    try {
      const { error } = await supabase
        .from('ejes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Eje estratégico eliminado correctamente"
      });
      fetchEjes();
    } catch (error) {
      console.error('Error deleting eje:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el eje estratégico",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", orden: "" });
    setShowForm(false);
    setEditingEje(null);
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
                <h1 className="text-3xl font-bold">Ejes Estratégicos</h1>
                <p className="text-muted-foreground">Gestiona los ejes estratégicos del plan de desarrollo</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Eje
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{editingEje ? "Editar" : "Crear"} Eje Estratégico</CardTitle>
                <CardDescription>
                  Complete la información del eje estratégico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Nombre del eje estratégico"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orden">Orden</Label>
                      <Input
                        id="orden"
                        type="number"
                        value={formData.orden}
                        onChange={(e) => setFormData(prev => ({ ...prev, orden: e.target.value }))}
                        placeholder="Orden de visualización"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder="Descripción del eje estratégico"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Guardando..." : (editingEje ? "Actualizar" : "Crear")}
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
              <CardTitle>Ejes Estratégicos Registrados</CardTitle>
              <CardDescription>
                {ejes.length} ejes estratégicos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ejes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay ejes estratégicos registrados</p>
                  <Button onClick={() => setShowForm(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primer eje
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ejes.map((eje) => (
                    <div key={eje.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{eje.nombre}</h3>
                          {eje.orden && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Orden: {eje.orden}
                            </span>
                          )}
                        </div>
                        {eje.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{eje.descripcion}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(eje)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(eje.id)}
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

export default Ejes;