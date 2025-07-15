import { AsyncStorageFarmerRepository } from '../../domain/repository/farmer/AsyncStorageFarmerRepository';
import { ApiFarmerRepository } from '../../data/repositories/ApiFarmerRepository';
import { SaveFarmerData } from '../../domain/UseCases/farmer/SaveFarmerData';
import { ValidateFarmerData } from '../../domain/UseCases/farmer/ValidateFarmerData';
import { GetFarmerData } from '../../domain/UseCases/farmer/GetFarmerData';
import { ApiUserRepository } from '../../data/repositories/ApiUserRepository';
import { StorageService } from '../../infrastructure/storage/StorageService';
import { SocialAuthService } from '../../data/repositories/SocialAuthService';
import { VerifyEmailUseCase } from '../../domain/UseCases/user/VerifyEmailUseCase'; 
import { RegisterUserUseCase } from '../../domain/UseCases/user/RegisterUserUseCase';
import { SocialRegisterUseCase } from '../../domain/UseCases/user/SocialRegisterUseCase'; 
import { ValidationService } from '../../services/ValidationService';
import { ApiWeatherRepository } from '../../data/repositories/ApiWeatherRepository';
import { ApiNewsRepository } from '../../data/repositories/ApiNewsRepository';
import { AsyncStorageNewsRepository } from '../../data/repositories/AsyncStorageNewsRepository';
import { AsyncStorageWeatherRepository } from '../../data/repositories/AsyncStorageWeatherRepository';
import { LocalDashboardRepository } from '../../domain/repository/dataLayer/LocalDashboardRepository';
import { GetWeatherUseCase } from '../../domain/UseCases/homeUseCase/GetWeatherUseCase';
import { GetDashboardDataUseCase } from '../../domain/UseCases/homeUseCase/GetDashboardDataUseCase';
import { GetNewsUseCase } from '../../domain/UseCases/homeUseCase/GetNewsUseCase';
import { LoginUserUseCase } from '../../domain/UseCases/user/LoginUseCase';
import { SocialLoginUseCase } from '../../domain/UseCases/user/LoginUseCase';
import { ApiClient } from '../api/ApiClient';
import { LanguageRepositoryImpl } from '../../domain/repository/language/LanguageRepositoryImpl';
import { GetAvailableLanguagesUseCase } from '../../domain/UseCases/language/GetAvailableLanguagesUseCase';
import { SelectLanguageUseCase } from '../../domain/UseCases/language/SelectLanguageUseCase';
import { GetSelectedLanguageUseCase } from '../../domain/UseCases/language/GetSelectedLanguageUseCase';
import { LanguageSelectionPresenter } from '../../viewModel/LanguageSelectionPresenter';
import { ForgotPasswordUseCase } from '../../domain/UseCases/user/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../domain/UseCases/user/ResetPasswordUseCase'; // New import


// container.js
class Container {
  constructor() {
    this.dependencies = new Map();
    this.isInitialized = false;
    this.initializationPromise = null;
    this.initializationAttempts = 0;
    this.maxInitializationAttempts = 3;
  }

  async initialize() {
    if (this.isInitialized) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        this.initializationAttempts++;
        console.log(`Container: Initialization attempt ${this.initializationAttempts}`);

        // Initialize StorageService first
        const storageService = new StorageService();
        await storageService.initialize();
        this.dependencies.set('storageService', storageService);

        // Register other dependencies
        await this.register();

        this.isInitialized = true;
        console.log('Container: Initialized successfully');
        return true;
      } catch (error) {
        console.error('Container: Initialization failed:', error);

        if (this.initializationAttempts < this.maxInitializationAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.initialize();
        }

        throw new Error('Failed to initialize container after multiple attempts');
      }
    })();

    return this.initializationPromise;
  

}
  async register() {
    try {
      // Register independent dependencies
      console.log('Container: Registering API clients');
      const weatherApiClient = new ApiClient('http://api.weatherapi.com/v1');
      const newsApiClient = new ApiClient('https://newsapi.org/v2');
      const appApiClient = new ApiClient('https://zao-backend-api.onrender.com');
      this.dependencies.set('weatherApiClient', weatherApiClient);
      this.dependencies.set('newsApiClient', newsApiClient);
      this.dependencies.set('appApiClient', appApiClient);

      console.log('Container: Registering storage service');
      const storageService = new StorageService();
      this.dependencies.set('storageService', storageService);

      console.log('Container: Registering validation service');
      const validationService = new ValidationService();
      this.dependencies.set('validationService', validationService);

      console.log('Container: Registering repositories');
      const asyncStorageFarmerRepository = new AsyncStorageFarmerRepository();
      const apiFarmerRepository = new ApiFarmerRepository(appApiClient);
      const userRepository = new ApiUserRepository(appApiClient);
      const socialAuthService = new SocialAuthService(appApiClient);
      const weatherRepository = new ApiWeatherRepository(weatherApiClient);
      const asyncStorageWeatherRepository = new AsyncStorageWeatherRepository();
      const newsRepository = new ApiNewsRepository(newsApiClient);
      const asyncStorageNewsRepository = new AsyncStorageNewsRepository();
      const dashboardRepository = new LocalDashboardRepository();
      const languageRepository = new LanguageRepositoryImpl();
      this.dependencies.set('asyncStorageFarmerRepository', asyncStorageFarmerRepository);
      this.dependencies.set('apiFarmerRepository', apiFarmerRepository);
      this.dependencies.set('userRepository', userRepository);
      this.dependencies.set('socialAuthService', socialAuthService);
      this.dependencies.set('weatherRepository', weatherRepository);
      this.dependencies.set('asyncStorageWeatherRepository', asyncStorageWeatherRepository);
      this.dependencies.set('newsRepository', newsRepository);
      this.dependencies.set('asyncStorageNewsRepository', asyncStorageNewsRepository);
      this.dependencies.set('dashboardRepository', dashboardRepository);
      this.dependencies.set('languageRepository', languageRepository);

      console.log('Container: Registering use cases');
      console.log('Container: Registering saveFarmerData');
      this.dependencies.set('saveFarmerData', new SaveFarmerData(apiFarmerRepository, asyncStorageFarmerRepository));
      console.log('Container: Registering validateFarmerData');
      this.dependencies.set('validateFarmerData', new ValidateFarmerData());
      console.log('Container: Registering getFarmerData');
      this.dependencies.set('getFarmerData', new GetFarmerData(apiFarmerRepository, asyncStorageFarmerRepository));
      console.log('Container: Registering registerUserUseCase');
      this.dependencies.set('registerUserUseCase', new RegisterUserUseCase(userRepository, validationService, storageService));
      console.log('Container: Registering socialRegisterUseCase');
      this.dependencies.set('socialRegisterUseCase', new SocialRegisterUseCase(socialAuthService, storageService));
      console.log('Container: Registering loginUserUseCase');
      this.dependencies.set('loginUserUseCase', new LoginUserUseCase(userRepository, validationService, storageService));
      console.log('Container: Registering socialLoginUseCase');
      this.dependencies.set('socialLoginUseCase', new SocialLoginUseCase(socialAuthService, storageService));
      console.log('Container: Registering verifyEmailUseCase');
      this.dependencies.set('verifyEmailUseCase', new VerifyEmailUseCase(userRepository, storageService));
      console.log('Container: Registering getWeatherUseCase');
      this.dependencies.set('getWeatherUseCase', new GetWeatherUseCase(weatherRepository, asyncStorageWeatherRepository));
      console.log('Container: Registering getNewsUseCase');
      this.dependencies.set('resetPasswordUseCase', new ResetPasswordUseCase(userRepository, storageService)); // New
      console.log('Container: Registering getWeatherUseCase');
      this.dependencies.set('getNewsUseCase', new GetNewsUseCase(newsRepository, asyncStorageNewsRepository));
      console.log('Container: Registering getDashboardDataUseCase');
      this.dependencies.set('getDashboardDataUseCase', new GetDashboardDataUseCase(dashboardRepository, asyncStorageFarmerRepository));
      console.log('Container: Registering getAvailableLanguagesUseCase');
      this.dependencies.set('getAvailableLanguagesUseCase', new GetAvailableLanguagesUseCase(languageRepository));
      console.log('Container: Registering selectLanguageUseCase');
      this.dependencies.set('selectLanguageUseCase', new SelectLanguageUseCase(languageRepository));
      console.log('Container: Registering getSelectedLanguageUseCase');
      this.dependencies.set('getSelectedLanguageUseCase', new GetSelectedLanguageUseCase(languageRepository));
      console.log('Container: Registering languageSelectionPresenter');
      this.dependencies.set('languageSelectionPresenter', new LanguageSelectionPresenter(
        this.dependencies.get('getAvailableLanguagesUseCase'),
        this.dependencies.get('selectLanguageUseCase'),
        this.dependencies.get('getSelectedLanguageUseCase')
      ));

      console.log('Container: Register complete');
    } catch (error) {
      console.error('Container: Register failed:', error);
      throw error;
    }
  }

  get(key) {
    if (!this.isInitialized) {
      console.error(`Container: Attempted to get ${key} before initialization`);
      throw new Error('Container not initialized. Call initialize() first.');
    }
    if (!this.dependencies.has(key)) {
      console.error(`Container: Dependency ${key} not found`);
      throw new Error(`Dependency ${key} not found`);
    }
    return this.dependencies.get(key);
  }
}

const containerInstance = new Container();
export default containerInstance;