


export class Farmer {
  constructor({
    farmerType = '',
    location = '',
    selectedCrops = [],
    farmSize = '0-5 acres (Small Scale)',
    cropAge = '',
    lastManure = '',
    fertilizer = '',
    cropPhase = 'Vegetative, Fruit/seed development',
  }) {
    this.farmerType = farmerType;
    this.location = location;
    this.selectedCrops = selectedCrops;
    this.farmSize = farmSize;
    this.cropAge = cropAge;
    this.lastManure = lastManure;
    this.fertilizer = fertilizer;
    this.cropPhase = cropPhase;
  }
}