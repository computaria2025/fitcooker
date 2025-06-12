export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string | null
          created_at: string | null
          id: number
          nota: number
          receita_id: number
          usuario_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string | null
          id?: number
          nota: number
          receita_id: number
          usuario_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string | null
          id?: number
          nota?: number
          receita_id?: number
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
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativa: boolean | null
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativa?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      informacao_nutricional: {
        Row: {
          calorias_totais: number
          carboidratos_totais: number
          gorduras_totais: number
          id: number
          proteinas_totais: number
          receita_id: number
        }
        Insert: {
          calorias_totais: number
          carboidratos_totais: number
          gorduras_totais: number
          id?: number
          proteinas_totais: number
          receita_id: number
        }
        Update: {
          calorias_totais?: number
          carboidratos_totais?: number
          gorduras_totais?: number
          id?: number
          proteinas_totais?: number
          receita_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "informacao_nutricional_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: true
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredientes: {
        Row: {
          calorias: number | null
          carboidratos: number | null
          created_at: string | null
          gorduras: number | null
          id: number
          nome: string
          proteina: number | null
          unidade_padrao: string
        }
        Insert: {
          calorias?: number | null
          carboidratos?: number | null
          created_at?: string | null
          gorduras?: number | null
          id?: number
          nome: string
          proteina?: number | null
          unidade_padrao?: string
        }
        Update: {
          calorias?: number | null
          carboidratos?: number | null
          created_at?: string | null
          gorduras?: number | null
          id?: number
          nome?: string
          proteina?: number | null
          unidade_padrao?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          data_cadastro: string | null
          email: string
          id: string
          is_chef: boolean | null
          nome: string
          preferencias: string[] | null
          receitas_count: number | null
          seguidores_count: number | null
          seguindo_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          data_cadastro?: string | null
          email: string
          id: string
          is_chef?: boolean | null
          nome: string
          preferencias?: string[] | null
          receitas_count?: number | null
          seguidores_count?: number | null
          seguindo_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          data_cadastro?: string | null
          email?: string
          id?: string
          is_chef?: boolean | null
          nome?: string
          preferencias?: string[] | null
          receitas_count?: number | null
          seguidores_count?: number | null
          seguindo_count?: number | null
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
          ordem: number
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
      receita_passos: {
        Row: {
          descricao: string
          id: number
          ordem: number
          receita_id: number
        }
        Insert: {
          descricao: string
          id?: number
          ordem: number
          receita_id: number
        }
        Update: {
          descricao?: string
          id?: number
          ordem?: number
          receita_id?: number
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
          avaliacoes_count: number | null
          created_at: string | null
          descricao: string
          dificuldade: string
          id: number
          imagem_url: string | null
          nota_media: number | null
          porcoes: number
          status: string | null
          tempo_preparo: number
          titulo: string
          updated_at: string | null
          usuario_id: string
          video_url: string | null
          visualizacoes: number | null
        }
        Insert: {
          avaliacoes_count?: number | null
          created_at?: string | null
          descricao: string
          dificuldade: string
          id?: number
          imagem_url?: string | null
          nota_media?: number | null
          porcoes: number
          status?: string | null
          tempo_preparo: number
          titulo: string
          updated_at?: string | null
          usuario_id: string
          video_url?: string | null
          visualizacoes?: number | null
        }
        Update: {
          avaliacoes_count?: number | null
          created_at?: string | null
          descricao?: string
          dificuldade?: string
          id?: number
          imagem_url?: string | null
          nota_media?: number | null
          porcoes?: number
          status?: string | null
          tempo_preparo?: number
          titulo?: string
          updated_at?: string | null
          usuario_id?: string
          video_url?: string | null
          visualizacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "receitas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas_salvas: {
        Row: {
          created_at: string | null
          id: number
          receita_id: number
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          receita_id: number
          usuario_id: string
        }
        Update: {
          created_at?: string | null
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
            referencedColumns: ["id"]
          },
        ]
      }
      seguidores: {
        Row: {
          created_at: string | null
          id: number
          seguido_id: string
          seguidor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          seguido_id: string
          seguidor_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          seguido_id?: string
          seguidor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguidores_seguido_id_fkey"
            columns: ["seguido_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguidores_seguidor_id_fkey"
            columns: ["seguidor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
