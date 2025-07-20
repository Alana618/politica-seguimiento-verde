export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      acciones_estrategicas: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          linea_estrategica_id: string
          nombre: string
          orden: number | null
          ponderacion: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          linea_estrategica_id: string
          nombre: string
          orden?: number | null
          ponderacion?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          linea_estrategica_id?: string
          nombre?: string
          orden?: number | null
          ponderacion?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acciones_estrategicas_linea_estrategica_id_fkey"
            columns: ["linea_estrategica_id"]
            isOneToOne: false
            referencedRelation: "lineas_estrategicas"
            referencedColumns: ["id"]
          },
        ]
      }
      ejes: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ejes_politica: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          objetivo_id: string
          orden: number | null
          ponderacion: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          objetivo_id: string
          orden?: number | null
          ponderacion?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          objetivo_id?: string
          orden?: number | null
          ponderacion?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ejes_politica_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos_politica"
            referencedColumns: ["id"]
          },
        ]
      }
      gerencias: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          secretaria_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          secretaria_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          secretaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gerencias_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores_producto: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          meta: number | null
          nombre: string
          producto_id: string
          unidad_medida: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          meta?: number | null
          nombre: string
          producto_id: string
          unidad_medida?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          meta?: number | null
          nombre?: string
          producto_id?: string
          unidad_medida?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicadores_producto_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      lineas_estrategicas: {
        Row: {
          created_at: string
          descripcion: string | null
          eje_politica_id: string
          id: string
          nombre: string
          orden: number | null
          ponderacion: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          eje_politica_id: string
          id?: string
          nombre: string
          orden?: number | null
          ponderacion?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          eje_politica_id?: string
          id?: string
          nombre?: string
          orden?: number | null
          ponderacion?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineas_estrategicas_eje_politica_id_fkey"
            columns: ["eje_politica_id"]
            isOneToOne: false
            referencedRelation: "ejes_politica"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          created_at: string
          gerencia_id: string
          id: string
          indicador_meta: string
          indicador_producto: string | null
          linea_base: number | null
          meta_cuatrienio: number | null
          nombre_meta: string
          numero_meta: string
          producto_indicador: string | null
          secretaria_id: string
          tipo_indicador: string
          unidad_medida: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gerencia_id: string
          id?: string
          indicador_meta: string
          indicador_producto?: string | null
          linea_base?: number | null
          meta_cuatrienio?: number | null
          nombre_meta: string
          numero_meta: string
          producto_indicador?: string | null
          secretaria_id: string
          tipo_indicador: string
          unidad_medida: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gerencia_id?: string
          id?: string
          indicador_meta?: string
          indicador_producto?: string | null
          linea_base?: number | null
          meta_cuatrienio?: number | null
          nombre_meta?: string
          numero_meta?: string
          producto_indicador?: string | null
          secretaria_id?: string
          tipo_indicador?: string
          unidad_medida?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_gerencia_id_fkey"
            columns: ["gerencia_id"]
            isOneToOne: false
            referencedRelation: "gerencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metas_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivos_politica: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number | null
          politica_id: string
          ponderacion: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number | null
          politica_id: string
          ponderacion?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          politica_id?: string
          ponderacion?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_politica_politica_id_fkey"
            columns: ["politica_id"]
            isOneToOne: false
            referencedRelation: "politicas"
            referencedColumns: ["id"]
          },
        ]
      }
      politica_metas: {
        Row: {
          created_at: string
          id: string
          meta_id: string
          politica_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_id: string
          politica_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_id?: string
          politica_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "politica_metas_meta_id_fkey"
            columns: ["meta_id"]
            isOneToOne: false
            referencedRelation: "metas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "politica_metas_politica_id_fkey"
            columns: ["politica_id"]
            isOneToOne: false
            referencedRelation: "politicas"
            referencedColumns: ["id"]
          },
        ]
      }
      politicas: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          numero_politica: number
          ponderacion_total: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          numero_politica: number
          ponderacion_total?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          numero_politica?: number
          ponderacion_total?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      presupuestos_vigencia: {
        Row: {
          año: number
          created_at: string
          id: string
          monto: number
          proyecto_id: string
          updated_at: string
        }
        Insert: {
          año: number
          created_at?: string
          id?: string
          monto?: number
          proyecto_id: string
          updated_at?: string
        }
        Update: {
          año?: number
          created_at?: string
          id?: string
          monto?: number
          proyecto_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "presupuestos_vigencia_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          proyecto_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          proyecto_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          proyecto_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      programas: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number | null
          sector_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number | null
          sector_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          sector_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programas_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectores"
            referencedColumns: ["id"]
          },
        ]
      }
      proyecto_metas: {
        Row: {
          created_at: string
          id: string
          meta_id: string
          proyecto_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_id: string
          proyecto_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_id?: string
          proyecto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_metas_meta_id_fkey"
            columns: ["meta_id"]
            isOneToOne: false
            referencedRelation: "metas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyecto_metas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      proyectos: {
        Row: {
          año_fin: number
          año_inicio: number
          codigo_bpin: string | null
          created_at: string
          id: string
          nombre: string
          objetivo: string
          programa_id: string
          secretaria_id: string
          updated_at: string
        }
        Insert: {
          año_fin: number
          año_inicio: number
          codigo_bpin?: string | null
          created_at?: string
          id?: string
          nombre: string
          objetivo: string
          programa_id: string
          secretaria_id: string
          updated_at?: string
        }
        Update: {
          año_fin?: number
          año_inicio?: number
          codigo_bpin?: string | null
          created_at?: string
          id?: string
          nombre?: string
          objetivo?: string
          programa_id?: string
          secretaria_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyectos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyectos_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      secretarias: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      sectores: {
        Row: {
          created_at: string
          descripcion: string | null
          eje_id: string
          id: string
          nombre: string
          orden: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          eje_id: string
          id?: string
          nombre: string
          orden?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          eje_id?: string
          id?: string
          nombre?: string
          orden?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectores_eje_id_fkey"
            columns: ["eje_id"]
            isOneToOne: false
            referencedRelation: "ejes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
