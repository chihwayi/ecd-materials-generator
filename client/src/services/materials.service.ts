import api from './api';

interface Material {
  id?: string;
  title: string;
  description: string;
  type: 'worksheet' | 'activity' | 'assessment' | 'story';
  subject: 'math' | 'language' | 'science' | 'art' | 'cultural';
  language: 'en' | 'sn' | 'nd';
  ageGroup: string;
  status: 'draft' | 'published';
  elements: any[];
  createdBy?: { name: string };
  createdAt?: string;
}

export const materialsService = {
  // Get all materials for current user
  async getAllMaterials(page: number = 1, limit: number = 20, filters: any = {}) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    const response = await api.get(`/materials?${params}`);
    return response.data;
  },

  // Get single material by ID
  async getMaterialById(id: string): Promise<Material> {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  // Create new material
  async createMaterial(materialData: Partial<Material>): Promise<Material> {
    const response = await api.post('/materials', materialData);
    return response.data;
  },

  // Update existing material
  async updateMaterial(id: string, materialData: Partial<Material>): Promise<Material> {
    const response = await api.put(`/materials/${id}`, materialData);
    return response.data;
  },

  // Delete material
  async deleteMaterial(id: string) {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },

  // Publish material
  async publishMaterial(id: string) {
    const response = await api.patch(`/materials/${id}/publish`);
    return response.data;
  },

  // Get cultural content library
  async getCulturalContent(language: string = 'sn', category: string = '', type: string = '') {
    const params = new URLSearchParams({ language, category, type });
    const response = await api.get(`/materials/cultural/library?${params}`);
    return response.data;
  },

  // Get material templates
  async getTemplates(type: string = '', subject: string = '', language: string = '') {
    const params = new URLSearchParams({ type, subject, language });
    const response = await api.get(`/materials/templates/list?${params}`);
    return response.data;
  },

  // Admin functions
  async getPendingMaterials() {
    const response = await api.get('/materials/admin/pending');
    return response.data;
  },

  async approveMaterial(id: string) {
    const response = await api.patch(`/materials/${id}/approve`);
    return response.data;
  },

  async rejectMaterial(id: string, reason: string) {
    const response = await api.patch(`/materials/${id}/reject`, { reason });
    return response.data;
  }
};

export default materialsService;