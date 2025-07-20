-- Crear tabla de secretarías
CREATE TABLE public.secretarias (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de gerencias (dependen de secretarías)
CREATE TABLE public.gerencias (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    secretaria_id UUID NOT NULL REFERENCES public.secretarias(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de ejes estratégicos
CREATE TABLE public.ejes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de sectores (asociados a ejes)
CREATE TABLE public.sectores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    eje_id UUID NOT NULL REFERENCES public.ejes(id) ON DELETE CASCADE,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de programas (asociados a sectores)
CREATE TABLE public.programas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    sector_id UUID NOT NULL REFERENCES public.sectores(id) ON DELETE CASCADE,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de metas
CREATE TABLE public.metas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_meta TEXT NOT NULL,
    nombre_meta TEXT NOT NULL,
    secretaria_id UUID NOT NULL REFERENCES public.secretarias(id),
    gerencia_id UUID NOT NULL REFERENCES public.gerencias(id),
    indicador_meta TEXT NOT NULL,
    tipo_indicador TEXT NOT NULL,
    unidad_medida TEXT NOT NULL,
    linea_base DECIMAL,
    meta_cuatrienio DECIMAL,
    producto_indicador TEXT,
    indicador_producto TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de proyectos
CREATE TABLE public.proyectos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    codigo_bpin TEXT,
    programa_id UUID NOT NULL REFERENCES public.programas(id) ON DELETE CASCADE,
    secretaria_id UUID NOT NULL REFERENCES public.secretarias(id),
    año_inicio INTEGER NOT NULL,
    año_fin INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de relación proyectos-metas (muchos a muchos)
CREATE TABLE public.proyecto_metas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    proyecto_id UUID NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
    meta_id UUID NOT NULL REFERENCES public.metas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(proyecto_id, meta_id)
);

-- Crear tabla de productos (asociados a proyectos)
CREATE TABLE public.productos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    proyecto_id UUID NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de indicadores de producto
CREATE TABLE public.indicadores_producto (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    unidad_medida TEXT,
    meta DECIMAL,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de presupuestos por vigencia
CREATE TABLE public.presupuestos_vigencia (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    proyecto_id UUID NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
    año INTEGER NOT NULL,
    monto DECIMAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(proyecto_id, año)
);

-- Crear tabla de políticas públicas
CREATE TABLE public.politicas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    numero_politica INTEGER NOT NULL CHECK (numero_politica >= 1 AND numero_politica <= 18),
    ponderacion_total DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(numero_politica)
);

-- Crear tabla de objetivos de políticas
CREATE TABLE public.objetivos_politica (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    politica_id UUID NOT NULL REFERENCES public.politicas(id) ON DELETE CASCADE,
    ponderacion DECIMAL DEFAULT 0,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de ejes de políticas
CREATE TABLE public.ejes_politica (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    objetivo_id UUID NOT NULL REFERENCES public.objetivos_politica(id) ON DELETE CASCADE,
    ponderacion DECIMAL DEFAULT 0,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de líneas estratégicas
CREATE TABLE public.lineas_estrategicas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    eje_politica_id UUID NOT NULL REFERENCES public.ejes_politica(id) ON DELETE CASCADE,
    ponderacion DECIMAL DEFAULT 0,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de acciones estratégicas
CREATE TABLE public.acciones_estrategicas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    linea_estrategica_id UUID NOT NULL REFERENCES public.lineas_estrategicas(id) ON DELETE CASCADE,
    ponderacion DECIMAL NOT NULL DEFAULT 0,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de relación políticas-metas
CREATE TABLE public.politica_metas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    politica_id UUID NOT NULL REFERENCES public.politicas(id) ON DELETE CASCADE,
    meta_id UUID NOT NULL REFERENCES public.metas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(politica_id, meta_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gerencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicadores_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presupuestos_vigencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objetivos_politica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejes_politica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineas_estrategicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acciones_estrategicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politica_metas ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS permisivas para todas las tablas (acceso público de lectura y escritura)
CREATE POLICY "Enable read access for all users" ON public.secretarias FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.secretarias FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.secretarias FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.secretarias FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.gerencias FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.gerencias FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.gerencias FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.gerencias FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.ejes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.ejes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.ejes FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.ejes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.sectores FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.sectores FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.sectores FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.sectores FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.programas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.programas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.programas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.programas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.metas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.metas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.metas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.metas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.proyectos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.proyectos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.proyectos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.proyectos FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.proyecto_metas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.proyecto_metas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.proyecto_metas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.proyecto_metas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.productos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.productos FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.indicadores_producto FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.indicadores_producto FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.indicadores_producto FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.indicadores_producto FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.presupuestos_vigencia FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.presupuestos_vigencia FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.presupuestos_vigencia FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.presupuestos_vigencia FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.politicas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.politicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.politicas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.politicas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.objetivos_politica FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.objetivos_politica FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.objetivos_politica FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.objetivos_politica FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.ejes_politica FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.ejes_politica FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.ejes_politica FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.ejes_politica FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.lineas_estrategicas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.lineas_estrategicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.lineas_estrategicas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.lineas_estrategicas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.acciones_estrategicas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.acciones_estrategicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.acciones_estrategicas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.acciones_estrategicas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.politica_metas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.politica_metas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.politica_metas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.politica_metas FOR DELETE USING (true);

-- Crear función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar timestamps automáticamente
CREATE TRIGGER update_secretarias_updated_at BEFORE UPDATE ON public.secretarias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gerencias_updated_at BEFORE UPDATE ON public.gerencias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ejes_updated_at BEFORE UPDATE ON public.ejes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sectores_updated_at BEFORE UPDATE ON public.sectores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_programas_updated_at BEFORE UPDATE ON public.programas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON public.metas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proyectos_updated_at BEFORE UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_indicadores_producto_updated_at BEFORE UPDATE ON public.indicadores_producto FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_presupuestos_vigencia_updated_at BEFORE UPDATE ON public.presupuestos_vigencia FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_politicas_updated_at BEFORE UPDATE ON public.politicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_objetivos_politica_updated_at BEFORE UPDATE ON public.objetivos_politica FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ejes_politica_updated_at BEFORE UPDATE ON public.ejes_politica FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lineas_estrategicas_updated_at BEFORE UPDATE ON public.lineas_estrategicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_acciones_estrategicas_updated_at BEFORE UPDATE ON public.acciones_estrategicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Crear funciones para actualizar ponderaciones automáticamente
CREATE OR REPLACE FUNCTION public.update_politica_ponderacion()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar ponderación del objetivo padre
    UPDATE public.objetivos_politica 
    SET ponderacion = (
        SELECT COALESCE(SUM(ep.ponderacion), 0)
        FROM public.ejes_politica ep
        WHERE ep.objetivo_id = NEW.objetivo_id
    )
    WHERE id = NEW.objetivo_id;
    
    -- Actualizar ponderación de la política padre
    UPDATE public.politicas 
    SET ponderacion_total = (
        SELECT COALESCE(SUM(op.ponderacion), 0)
        FROM public.objetivos_politica op
        WHERE op.politica_id = (
            SELECT politica_id FROM public.objetivos_politica WHERE id = NEW.objetivo_id
        )
    )
    WHERE id = (
        SELECT politica_id FROM public.objetivos_politica WHERE id = NEW.objetivo_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_eje_ponderacion()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar ponderación del eje padre
    UPDATE public.ejes_politica 
    SET ponderacion = (
        SELECT COALESCE(SUM(le.ponderacion), 0)
        FROM public.lineas_estrategicas le
        WHERE le.eje_politica_id = NEW.eje_politica_id
    )
    WHERE id = NEW.eje_politica_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_linea_ponderacion()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar ponderación de la línea estratégica padre
    UPDATE public.lineas_estrategicas 
    SET ponderacion = (
        SELECT COALESCE(SUM(ae.ponderacion), 0)
        FROM public.acciones_estrategicas ae
        WHERE ae.linea_estrategica_id = NEW.linea_estrategica_id
    )
    WHERE id = NEW.linea_estrategica_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar ponderaciones automáticamente
CREATE TRIGGER update_ponderacion_on_eje_change
    AFTER INSERT OR UPDATE OR DELETE ON public.ejes_politica
    FOR EACH ROW EXECUTE FUNCTION public.update_politica_ponderacion();

CREATE TRIGGER update_ponderacion_on_linea_change
    AFTER INSERT OR UPDATE OR DELETE ON public.lineas_estrategicas
    FOR EACH ROW EXECUTE FUNCTION public.update_eje_ponderacion();

CREATE TRIGGER update_ponderacion_on_accion_change
    AFTER INSERT OR UPDATE OR DELETE ON public.acciones_estrategicas
    FOR EACH ROW EXECUTE FUNCTION public.update_linea_ponderacion();

-- Crear índices para mejorar performance
CREATE INDEX idx_gerencias_secretaria_id ON public.gerencias(secretaria_id);
CREATE INDEX idx_sectores_eje_id ON public.sectores(eje_id);
CREATE INDEX idx_programas_sector_id ON public.programas(sector_id);
CREATE INDEX idx_proyectos_programa_id ON public.proyectos(programa_id);
CREATE INDEX idx_proyectos_secretaria_id ON public.proyectos(secretaria_id);
CREATE INDEX idx_metas_secretaria_id ON public.metas(secretaria_id);
CREATE INDEX idx_metas_gerencia_id ON public.metas(gerencia_id);
CREATE INDEX idx_productos_proyecto_id ON public.productos(proyecto_id);
CREATE INDEX idx_indicadores_producto_id ON public.indicadores_producto(producto_id);
CREATE INDEX idx_presupuestos_proyecto_id ON public.presupuestos_vigencia(proyecto_id);
CREATE INDEX idx_objetivos_politica_id ON public.objetivos_politica(politica_id);
CREATE INDEX idx_ejes_objetivo_id ON public.ejes_politica(objetivo_id);
CREATE INDEX idx_lineas_eje_id ON public.lineas_estrategicas(eje_politica_id);
CREATE INDEX idx_acciones_linea_id ON public.acciones_estrategicas(linea_estrategica_id);