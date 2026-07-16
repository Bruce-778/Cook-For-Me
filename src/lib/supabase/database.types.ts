export type Database = {
  public: {
    Tables: {
      recipes: {
        Row: { id: string; slug: string; status: "draft" | "review" | "published" };
        Insert: { id?: string; slug: string; status?: "draft" | "review" | "published" };
        Update: { slug?: string; status?: "draft" | "review" | "published" };
        Relationships: [];
      };
      recipe_likes: {
        Row: { recipe_id: string; user_id: string; created_at: string };
        Insert: { recipe_id: string; user_id: string; created_at?: string };
        Update: { recipe_id?: string; user_id?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      recipe_like_counts: {
        Args: Record<PropertyKey, never>;
        Returns: Array<{ recipe_id: string; total_likes: number; weekly_likes: number; last_liked_at: string | null }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
