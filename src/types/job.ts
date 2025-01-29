export interface Job {
  Title: string;
  Company: string;
  Location: string | null;
  Date: string | null;
  Description: string | null;
  URL: string | null;
  source?: string;
}