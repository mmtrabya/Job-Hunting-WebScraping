export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          company: string;
          location: string | null;
          description: string | null;
          url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title: string;
          company: string;
          location?: string | null;
          description?: string | null;
          url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_title?: string;
          company?: string;
          location?: string | null;
          description?: string | null;
          url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}