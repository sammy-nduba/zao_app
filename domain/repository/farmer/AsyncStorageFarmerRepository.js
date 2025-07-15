import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerRepository } from '../../../domain/repository/farmer/FarmerRepository';
import { Farmer } from '../../../domain/entities/Farmer';

export class AsyncStorageFarmerRepository extends FarmerRepository {
  async saveFarmer(farmer, userId) {
    if (!userId) throw new Error('User ID is required for saving farmer data');
    const key = farmer.farmerType === 'new' 
      ? `@ZaoAPP:NewFarmerForm:${userId}` 
      : `@ZaoAPP:ExperiencedFarmerForm:${userId}`;
    try {
      console.log('AsyncStorageFarmerRepository.saveFarmer:', { key, farmer });
      await AsyncStorage.setItem(key, JSON.stringify(farmer));
      return farmer;
    } catch (error) {
      console.error('AsyncStorageFarmerRepository.saveFarmer error:', error.message);
      throw new Error('Failed to save farmer data');
    }
  }

  async getFarmer(farmerType, userId) {
    if (!userId) throw new Error('User ID is required for retrieving farmer data');
    const key = farmerType === 'new' 
      ? `@ZaoAPP:NewFarmerForm:${userId}` 
      : `@ZaoAPP:ExperiencedFarmerForm:${userId}`;
    try {
      console.log('AsyncStorageFarmerRepository.getFarmer:', { key, farmerType });
      const data = await AsyncStorage.getItem(key);
      const farmer = data ? JSON.parse(data) : null;
      console.log('AsyncStorageFarmerRepository.getFarmer result:', farmer);
      return farmer ? new Farmer(farmer) : null;
    } catch (error) {
      console.error('AsyncStorageFarmerRepository.getFarmer error:', error.message);
      throw new Error('Failed to retrieve farmer data');
    }
  }
}