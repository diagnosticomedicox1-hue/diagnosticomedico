import { DiagnosticoRequest, DiagnosticoResponse, ConsultasResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async saveDiagnostico(data: DiagnosticoRequest): Promise<DiagnosticoResponse> {
    return this.makeRequest<DiagnosticoResponse>('/diagnostico', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConsultas(): Promise<ConsultasResponse> {
    return this.makeRequest<ConsultasResponse>('/consultas');
  }

  async getConsultasByLocation(lat: number, lng: number, radius: number = 5): Promise<ConsultasResponse> {
    // Por ahora retornamos todas las consultas, pero en el futuro se puede implementar
    // filtrado por proximidad geográfica
    return this.getConsultas();
  }
}

export const apiService = new ApiService();
export default apiService;

