export interface UserPreferences {
  id: string;
  preferred_language: 'en' | 'hi';
  favorite_cities: string[];
  default_city?: string | null;
  occupation?: string | null;
  age_bracket?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Supabase Database schema definition.
 * 
 * COMPLIANCE NOTE (Rule 19):
 * Sensitive health information (healthHistory flags, customHealthNote, exact age, GPS coordinates)
 * is strictly isolated to the user's local browser and is NEVER stored in the database.
 * Only non-sensitive preferences (language, saved cities, default city, occupation, age bracket)
 * are stored for signed-in users. Users under 18 have zero data stored.
 */
export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          preferred_language: 'en' | 'hi';
          favorite_cities: string[];
          default_city: string | null;
          occupation: string | null;
          age_bracket: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          preferred_language?: 'en' | 'hi';
          favorite_cities?: string[];
          default_city?: string | null;
          occupation?: string | null;
          age_bracket?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          preferred_language?: 'en' | 'hi';
          favorite_cities?: string[];
          default_city?: string | null;
          occupation?: string | null;
          age_bracket?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
