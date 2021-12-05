export interface ApiResponse {
  ok: boolean;
  status: number;
  data: any[];
  message: string;
  error?: string;
  userMessage?: string;
}
