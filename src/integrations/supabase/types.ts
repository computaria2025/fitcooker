export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string | null
          created_at: string
          id: number
          nota: number
          receita_id: number
          updated_at: string
          usuario_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          id?: number
          nota: number
          receita_id: number
          updated_at?: string
          usuario_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string
          id?: number
          nota?: number
          receita_id?: number
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      ingredientes: {
        Row: {
          calorias_por_100g: number
          carboidratos_por_100g: number
          created_at: string
          criado_por: string | null
          fibras_por_100g: number
          gorduras_por_100g: number
          id: number
          nome: string
          proteinas_por_100g: number
          sodio_por_100g: number
          unidade_padrao: string
        }
        Insert: {
          calorias_por_100g?: number
          carboidratos_por_100g?: number
          created_at?: string
          criado_por?: string | null
          fibras_por_100g?: number
          gorduras_por_100g?: number
          id?: number
          nome: string
          proteinas_por_100g?: number
          sodio_por_100g?: number
          unidade_padrao?: string
        }
        Update: {
          calorias_por_100g?: number
          carboidratos_por_100g?: number
          created_at?: string
          criado_por?: string | null
          fibras_por_100g?: number
          gorduras_por_100g?: number
          id?: number
          nome?: string
          proteinas_por_100g?: number
          sodio_por_100g?: number
          unidade_padrao?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredientes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          altura: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          data_nascimento: string | null
          id: string
          nivel_atividade: string | null
          nome: string
          objetivo: string | null
          peso: number | null
          restricoes_alimentares: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          altura?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          data_nascimento?: string | null
          id?: string
          nivel_atividade?: string | null
          nome: string
          objetivo?: string | null
          peso?: number | null
          restricoes_alimentares?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          altura?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          data_nascimento?: string | null
          id?: string
          nivel_atividade?: string | null
          nome?: string
          objetivo?: string | null
          peso?: number | null
          restricoes_alimentares?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      receita_categorias: {
        Row: {
          categoria_id: number
          id: number
          receita_id: number
        }
        Insert: {
          categoria_id: number
          id?: number
          receita_id: number
        }
        Update: {
          categoria_id?: number
          id?: number
          receita_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "receita_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receita_categorias_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      receita_ingredientes: {
        Row: {
          id: number
          ingrediente_id: number
          ordem: number
          quantidade: number
          receita_id: number
          unidade: string
        }
        Insert: {
          id?: number
          ingrediente_id: number
          ordem?: number
          quantidade: number
          receita_id: number
          unidade: string
        }
        Update: {
          id?: number
          ingrediente_id?: number
          ordem?: number
          quantidade?: number
          receita_id?: number
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "receita_ingredientes_ingrediente_id_fkey"
            columns: ["ingrediente_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receita_ingredientes_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      receita_media: {
        Row: {
          created_at: string
          id: number
          is_main: boolean
          ordem: number | null
          receita_id: number
          tipo: Database["public"]["Enums"]["MediaType"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_main?: boolean
          ordem?: number | null
          receita_id: number
          tipo: Database["public"]["Enums"]["MediaType"]
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          is_main?: boolean
          ordem?: number | null
          receita_id?: number
          tipo?: Database["public"]["Enums"]["MediaType"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "receita_media_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      receita_passos: {
        Row: {
          descricao: string
          id: number
          imagem_url: string | null
          numero_passo: number
          receita_id: number
          tempo_estimado: number | null
          titulo: string | null
        }
        Insert: {
          descricao: string
          id?: number
          imagem_url?: string | null
          numero_passo: number
          receita_id: number
          tempo_estimado?: number | null
          titulo?: string | null
        }
        Update: {
          descricao?: string
          id?: number
          imagem_url?: string | null
          numero_passo?: number
          receita_id?: number
          tempo_estimado?: number | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receita_passos_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas: {
        Row: {
          avaliacoes_count: number
          calorias_total: number
          carboidratos_total: number
          created_at: string
          descricao: string | null
          dificuldade: string
          fibras_total: number
          gorduras_total: number
          id: number
          imagem_url: string | null
          nota_media: number
          porcoes: number
          proteinas_total: number
          sodio_total: number
          status: string
          tempo_preparo: number
          titulo: string
          updated_at: string
          usuario_id: string
          video_url: string | null
        }
        Insert: {
          avaliacoes_count?: number
          calorias_total?: number
          carboidratos_total?: number
          created_at?: string
          descricao?: string | null
          dificuldade: string
          fibras_total?: number
          gorduras_total?: number
          id?: number
          imagem_url?: string | null
          nota_media?: number
          porcoes: number
          proteinas_total?: number
          sodio_total?: number
          status?: string
          tempo_preparo: number
          titulo: string
          updated_at?: string
          usuario_id: string
          video_url?: string | null
        }
        Update: {
          avaliacoes_count?: number
          calorias_total?: number
          carboidratos_total?: number
          created_at?: string
          descricao?: string | null
          dificuldade?: string
          fibras_total?: number
          gorduras_total?: number
          id?: number
          imagem_url?: string | null
          nota_media?: number
          porcoes?: number
          proteinas_total?: number
          sodio_total?: number
          status?: string
          tempo_preparo?: number
          titulo?: string
          updated_at?: string
          usuario_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receitas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      receitas_salvas: {
        Row: {
          created_at: string
          id: number
          receita_id: number
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          receita_id: number
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: number
          receita_id?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receitas_salvas_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_salvas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seguidores: {
        Row: {
          created_at: string
          id: number
          seguido_id: string
          seguidor_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          seguido_id: string
          seguidor_id: string
        }
        Update: {
          created_at?: string
          id?: number
          seguido_id?: string
          seguidor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_recipe_transaction: {
        Args: {
          p_calorias_total: number
          p_carboidratos_total: number
          p_categorias: number[]
          p_descricao: string
          p_dificuldade: string
          p_fibras_total: number
          p_gorduras_total: number
          p_imagem_url: string
          p_ingredientes: Json
          p_passos: Json
          p_porcoes: number
          p_proteinas_total: number
          p_sodio_total: number
          p_tempo_preparo: number
          p_titulo: string
          p_usuario_id: string
          p_video_url: string
        }
        Returns: number
      }
      create_recipe_transaction_antiga: {
        Args: {
          p_calorias_total: number
          p_carboidratos_total: number
          p_categorias: number[]
          p_descricao: string
          p_dificuldade: string
          p_gorduras_total: number
          p_imagem_url?: string
          p_ingredientes: Json
          p_passos: Json
          p_porcoes: number
          p_proteinas_total: number
          p_tempo_preparo: number
          p_titulo: string
          p_usuario_id: string
          p_video_url?: string
        }
        Returns: number
      }
    }
    Enums: {
      MediaType: "image" | "video" | "audio"
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
    Enums: {
      MediaType: ["image", "video", "audio"],
    },
  },
} as const
