export interface UserPreferences {
  id: string;
  preferred_language: 'en' | 'hi';
  favorite_cities: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Supabase Database schema definition.
 * 
 * COMPLIANCE NOTE (Rule 19):
 * Sensitive health information (age, healthHistory, customHealthNote, GPS coordinates)
 * is strictly isolated to the user's local browser and is NEVER stored in the database.
 */
export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: UserPreferences;
        Insert: {
          id: string;
          preferred_language?: 'en' | 'hi';
          favorite_cities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          preferred_language?: 'en' | 'hi';
          favorite_cities?: string[];
          updated_at?: string;
        };
      };
    };
  };
}
