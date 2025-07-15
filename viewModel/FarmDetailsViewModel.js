import { Farmer } from '../domain/entities/Farmer';
import container from '../infrastructure/di/Container';

export class FarmDetailsViewModel {
  constructor() {
    this.saveFarmerData = container.get('saveFarmerData');
    this.validateFarmerData = container.get('validateFarmerData');
    this.getFarmerData = container.get('getFarmerData');
    this.state = {
      farmerType: 'new',
      formData: new Farmer({}),
      isLoading: false,
      error: null,
      isOffline: false,
    };
  }

  setFarmerType(farmerType) {
    this.state.farmerType = farmerType;
    if (farmerType === 'new') {
      this.state.formData = new Farmer({
        ...this.state.formData,
        cropAge: '',
        lastManure: '',
        fertilizer: '',
      });
    }
  }

  updateFormData(field, value) {
    this.state.formData = new Farmer({
      ...this.state.formData,
      [field]: value,
    });
  }

  async loadFarmerData(farmerType, userId) {
    if (!userId) {
      this.state.error = 'User ID is required';
      return;
    }
    this.state.isLoading = true;
    this.state.error = null;
    try {
      const farmer = await this.getFarmerData.execute(farmerType, userId);
      if (farmer) {
        this.state.formData = farmer;
      }
    } catch (error) {
      this.state.error = error.message;
      this.state.isOffline = error.message.includes('offline');
    } finally {
      this.state.isLoading = false;
    }
  }

  async submitForm(userId) {
    if (!userId) {
      this.state.error = 'User ID is required';
      return false;
    }
    this.state.isLoading = true;
    this.state.error = null;
    try {
      await this.validateFarmerData.execute(this.state.formData);
      await this.saveFarmerData.execute(this.state.formData, userId);
      return true;
    } catch (error) {
      this.state.error = error.message;
      this.state.isOffline = error.message.includes('502') || error.message.includes('timed out');
      return false;
    } finally {
      this.state.isLoading = false;
    }
  }

  getState() {
    return { ...this.state };
  }
}