export type Mode = 'encrypt' | 'decrypt';
export type Algorithm = 'playfair' | 'two_columnar' | 'sha512';

export interface ProcessRequest {
  mode: Mode;
  algorithm: Algorithm;
  text: string;
  key?: string;
}

export interface ProcessResponse {
  success: boolean;
  algorithm?: string;
  mode?: string;
  input?: string;
  output?: string;
  message?: string;
  error?: string;
}
