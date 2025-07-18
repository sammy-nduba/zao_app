import { FarmerRepository } from '../../domain/repository/farmer/FarmerRepository';
import { Farmer } from '../../domain/entities/Farmer';

export class ApiFarmerRepository extends FarmerRepository {
  constructor(apiClient) {
    console.log('ApiFarmerRepository: Initializing');
    super();
    this.apiClient = apiClient;
  }

  async saveFarmer(farmer) {
    try {
      if (!farmer?.id) {
        console.error('ApiFarmerRepository: Invalid farmer id:', farmer?.id);
        throw new Error('Farmer ID is required');
      }
      console.log('ApiFarmerRepository: Saving farmer for user:', farmer.id);
      const response = await this.apiClient.post(`/api/farmer/farm/info/${farmer.id}`, farmer);
      return new Farmer(response);
    } catch (error) {
      console.error('ApiFarmerRepository: Failed to save farmer:', error);
      throw new Error(`Failed to save farmer data: ${error.message}`);
    }
  }

  async getFarmer(userId) {
    try {
      if (!userId) {
        console.error('ApiFarmerRepository: Invalid userId:', userId);
        throw new Error('User ID is required');
      }
      console.log('ApiFarmerRepository: Fetching farmer for user:', userId);
      const response = await this.apiClient.get(`/api/farmer/farm/info/${userId}`);
      return response ? new Farmer(response) : null;
    } catch (error) {
      console.error('ApiFarmerRepository: Failed to retrieve farmer:', error);
      if (error.response?.status === 404 || error.response?.data?.message === 'FarmInfo is not defined') {
        console.log('ApiFarmerRepository: No farmer data found for user:', userId);
        return null;
      }
      throw new Error(`Failed to retrieve farmer data: ${error.message}`);
    }
  }
}