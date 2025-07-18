import { AsyncStorageFarmerRepository } from '../../domain/repository/farmer/AsyncStorageFarmerRepository';
import { ApiFarmerRepository } from '../../data/repositories/ApiFarmerRepository';
import { StorageService } from '../../infrastructure/storage/StorageService';
import { ValidateFarmerData } from '../../domain/UseCases/farmer/ValidateFarmerData';
import { GetFarmerData } from '../../domain/UseCases/farmer/GetFarmerData';
import { SaveFarmerData } from '../../domain/UseCases/farmer/SaveFarmerData';
import { ApiUserRepository } from '../../data/repositories/ApiUserRepository';
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
import { ResetPasswordUseCase } from '../../domain/UseCases/user/ResetPasswordUseCase';

class Container {
  constructor() {
    this.dependencies = new Map();
    this.isInitialized = false;
    this.initializationPromise = null;
    this.initializationAttempts = 0;
    this.maxInitializationAttempts = 3;
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('Container: Already initialized, skipping');
      return true;
    }
    if (this.initializationPromise) {
      console.log('Container: Returning existing initialization promise');
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        this.initializationAttempts++;
        console.log(`Container: Initialization attempt ${this.initializationAttempts}`);

        // 1. Initialize Core Services
        console.log('Container: Initializing StorageService');
        const storageService = new StorageService();
        await storageService.initialize();
        console.log('Container: StorageService initialized');

        console.log('Container: Initializing ValidationService');
        const validationService = new ValidationService();

        // 2. Initialize API Clients
        console.log('Container: Initializing ApiClients');
        const appApiClient = new ApiClient('https://zao-backend-api.onrender.com');
        const weatherApiClient = new ApiClient('http://api.weatherapi.com/v1');
        const newsApiClient = new ApiClient('https://newsapi.org/v2');

        // 3. Initialize Repositories
        console.log('Container: Initializing Repositories');
        const repositories = {
          user: new ApiUserRepository(appApiClient),
          socialAuth: new SocialAuthService(appApiClient),
          farmer: new ApiFarmerRepository(appApiClient),
          asyncFarmer: new AsyncStorageFarmerRepository(),
          weather: new ApiWeatherRepository(weatherApiClient),
          asyncWeather: new AsyncStorageWeatherRepository(),
          news: new ApiNewsRepository(newsApiClient),
          asyncNews: new AsyncStorageNewsRepository(),
          dashboard: new LocalDashboardRepository(),
          language: new LanguageRepositoryImpl(),
        };

        // 4. Register Core Dependencies
        console.log('Container: Registering core dependencies');
        this.dependencies.set('storageService', storageService);
        this.dependencies.set('validationService', validationService);
        this.dependencies.set('appApiClient', appApiClient);
        this.dependencies.set('weatherApiClient', weatherApiClient);
        this.dependencies.set('newsApiClient', newsApiClient);

        // 5. Register Repositories
        console.log('Container: Registering repositories');
        Object.entries(repositories).forEach(([key, repo]) => {
          this.dependencies.set(`${key}Repository`, repo);
          console.log(`Container: Registered ${key}Repository`);
        });

        // 6. Register Use Cases
        console.log('Container: Registering use cases');
        this.registerUseCases();

        this.isInitialized = true;
        console.log('Container: Initialized successfully with dependencies:', 
          Array.from(this.dependencies.keys()));
        return true;
      } catch (error) {
        console.error('Container: Initialization failed:', error);
        if (this.initializationAttempts < this.maxInitializationAttempts) {
          console.log('Container: Retrying initialization');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.initialize();
        }
        throw new Error(`Failed to initialize container after ${this.maxInitializationAttempts} attempts: ${error.message}`);
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  registerUseCases() {
    console.log('Container: Starting registerUseCases');
    const {
      userRepository,
      socialAuthRepository,
      farmerRepository,
      asyncFarmerRepository,
      weatherRepository,
      asyncWeatherRepository,
      newsRepository,
      asyncNewsRepository,
      dashboardRepository,
      languageRepository,
      storageService,
      validationService,
    } = this.getAllDependencies();

    // User Use Cases
    console.log('Container: Registering user use cases');
    this.registerUserUseCases(userRepository, socialAuthRepository, storageService, validationService);

    // Farmer Use Cases
    console.log('Container: Registering validateFarmerData');
    this.dependencies.set('validateFarmerData', new ValidateFarmerData());
    console.log('Container: Registering getFarmerData');
    this.dependencies.set('getFarmerData', new GetFarmerData(farmerRepository, asyncFarmerRepository));
    console.log('Container: Registering saveFarmerData');
    this.dependencies.set('saveFarmerData', new SaveFarmerData(farmerRepository, asyncFarmerRepository));

    // Home/Data Use Cases
    console.log('Container: Registering getWeatherUseCase');
    this.dependencies.set('getWeatherUseCase', new GetWeatherUseCase(weatherRepository, asyncWeatherRepository));
    console.log('Container: Registering getNewsUseCase');
    this.dependencies.set('getNewsUseCase', new GetNewsUseCase(newsRepository, asyncNewsRepository));
    console.log('Container: Registering getDashboardDataUseCase');
    this.dependencies.set('getDashboardDataUseCase', new GetDashboardDataUseCase(dashboardRepository, asyncFarmerRepository));

    // Language Use Cases
    console.log('Container: Registering language use cases');
    this.registerLanguageUseCases(languageRepository);

    console.log('Container: All use cases registered');
  }

  registerUserUseCases(userRepo, socialAuthRepo, storageService, validationService) {
    console.log('Container: Registering user use cases');
    const userUseCases = {
      registerUserUseCase: new RegisterUserUseCase(userRepo, storageService),
      verifyEmailUseCase: new VerifyEmailUseCase(userRepo, storageService),
      loginUserUseCase: new LoginUserUseCase(userRepo, validationService, storageService),
      socialRegisterUseCase: new SocialRegisterUseCase(socialAuthRepo, storageService),
      socialLoginUseCase: new SocialLoginUseCase(socialAuthRepo, storageService),
      resetPasswordUseCase: new ResetPasswordUseCase(userRepo, storageService),
      forgotPasswordUseCase: new ForgotPasswordUseCase(userRepo),
    };

    Object.entries(userUseCases).forEach(([key, useCase]) => {
      this.dependencies.set(key, useCase);
      console.log(`Container: Registered ${key}`);
    });
  }

  registerLanguageUseCases(languageRepo) {
    console.log('Container: Registering language use cases');
    const getLanguages = new GetAvailableLanguagesUseCase(languageRepo);
    const selectLanguage = new SelectLanguageUseCase(languageRepo);
    const getSelectedLanguage = new GetSelectedLanguageUseCase(languageRepo);

    this.dependencies.set('getAvailableLanguagesUseCase', getLanguages);
    this.dependencies.set('selectLanguageUseCase', selectLanguage);
    this.dependencies.set('getSelectedLanguageUseCase', getSelectedLanguage);
    console.log('Container: Registering languageSelectionPresenter');
    this.dependencies.set('languageSelectionPresenter', 
      new LanguageSelectionPresenter(getLanguages, selectLanguage, getSelectedLanguage));
    console.log('Container: Registered language use cases');
  }

  getAllDependencies() {
    console.log('Container: Getting all dependencies');
    return {
      userRepository: this.dependencies.get('userRepository'),
      socialAuthRepository: this.dependencies.get('socialAuthRepository'),
      farmerRepository: this.dependencies.get('farmerRepository'),
      asyncFarmerRepository: this.dependencies.get('asyncFarmerRepository'),
      weatherRepository: this.dependencies.get('weatherRepository'),
      asyncWeatherRepository: this.dependencies.get('asyncWeatherRepository'),
      newsRepository: this.dependencies.get('newsRepository'),
      asyncNewsRepository: this.dependencies.get('asyncNewsRepository'),
      dashboardRepository: this.dependencies.get('dashboardRepository'),
      languageRepository: this.dependencies.get('languageRepository'),
      storageService: this.dependencies.get('storageService'),
      validationService: this.dependencies.get('validationService'),
    };
  }

  get(key) {
    if (!this.isInitialized) {
      console.error('Container: Attempted to get dependency before initialization:', key);
      throw new Error('Container not initialized. Call initialize() first.');
    }
    if (!this.dependencies.has(key)) {
      console.error('Container: Dependency not found:', key, 'Available:', Array.from(this.dependencies.keys()));
      throw new Error(`Dependency ${key} not found. Available: ${Array.from(this.dependencies.keys()).join(', ')}`);
    }
    console.log('Container: Getting dependency:', key);
    return this.dependencies.get(key);
  }
}

// Singleton instance
const containerInstance = new Container();
export default containerInstance;