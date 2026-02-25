import axios from 'axios';
import { ProcessRequest, ProcessResponse } from './types';

const API_BASE = 'http://localhost:8000';

export async function processRequest(payload: ProcessRequest): Promise<ProcessResponse> {
  const res = await axios.post<ProcessResponse>(`${API_BASE}/process`, payload);
  return res.data;
}
