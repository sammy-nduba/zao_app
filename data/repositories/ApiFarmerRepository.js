
import { FarmerRepository } from '../../domain/repository/farmer/FarmerRepository';
import { Farmer } from '../../domain/entities/Farmer';



export class ApiFarmerRepository extends FarmerRepository {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  async saveFarmer(farmer) {
    try {
      const response = await this.apiClient.post('/api/farmer/add/all', farmer);
      return new Farmer(response);
    } catch (error) {
      throw new Error(`Failed to save farmer data: ${error.message}`);
    }
  }

  async getFarmer(farmerType) {
    try {
      const response = await this.apiClient.get(`/farmers/${farmerType}`);
      return response ? new Farmer(response) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve farmer data: ${error.message}`);
    }
  }
}