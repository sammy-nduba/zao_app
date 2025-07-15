

export class ValidateFarmerData {
    execute(farmer) {
      const missingFields = [];
      if (!farmer.selectedCrops.length) missingFields.push('crops');
      if (!farmer.farmSize) missingFields.push('farm size');
      if (!farmer.location) missingFields.push('location');
      if (!farmer.cropPhase) missingFields.push('crop phase');
      
      if (farmer.farmerType === 'new') {
        if (!farmer.lastManure) missingFields.push('last manure date');
      } else {
        if (!farmer.cropAge) missingFields.push('crop age');
        if (!farmer.lastManure) missingFields.push('last manure date');
        if (!farmer.fertilizer) missingFields.push('fertilizer');
      }
  
      if (missingFields.length) {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }
      return true;
    }
  }