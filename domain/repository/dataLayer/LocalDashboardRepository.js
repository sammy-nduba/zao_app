import { DashboardRepository } from "../DashboardRepository";
import { CropData } from '../../../models/crop-instights/CropData'
import {Alert } from '../../../models/crop-instights/Alert'


export class LocalDashboardRepository extends DashboardRepository {
    async getCropData() {
      return new CropData(
        'Hass Avocado',
        'Flush Phase',
        0,
        [
          { type: 'soil_test', title: 'Conduct Soil Test', completed: true },
          { type: 'agronomist', title: 'Book Agronomist', completed: false },
          { type: 'visit', title: 'Visit Nearby Farmer', completed: false }
        ]
      );
    }
    
    async getAlerts() {
      return [
        new Alert(
          1,
          'weather',
          'Hailstorm falling in the next one week',
          'Use Protective Netting – Install hail nets over vulnerable crops',
          'high'
        )
      ];
    }
  }
  