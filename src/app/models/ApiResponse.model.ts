export interface ApiResponse {
  ok: boolean;
  status: number;
  data: Object | Array<any>;
  message: string;
  error?: string;
  userMessage?: string;
}
