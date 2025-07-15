import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export class StorageService {
  constructor() {
    this.namespace = 'zao_app'; // Simplified namespace
    this.maxRetries = 3;
    this.isReady = false;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.isReady) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        // Validate AsyncStorage
        const testKey = this._getNamespacedKey('test_init');
        await AsyncStorage.setItem(testKey, 'test_value');
        await AsyncStorage.removeItem(testKey);

        // Validate SecureStore if available
        const secureStoreAvailable = await SecureStore.isAvailableAsync();
        if (secureStoreAvailable) {
          const secureTestKey = this._getSecureKey('test_init');
          await SecureStore.setItemAsync(secureTestKey, 'test_value');
          await SecureStore.deleteItemAsync(secureTestKey);
        }

        this.isReady = true;
        console.log('StorageService: Initialized successfully');
        return true;
      } catch (error) {
        console.error('StorageService: Initialization failed:', error);
        throw new Error('Storage service unavailable');
      }
    })();

    return this.initializationPromise;
  }

  _getNamespacedKey(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key provided');
    }
    return `${this.namespace}_${key}`.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  _getSecureKey(key) {
    const cleanKey = this._getNamespacedKey(key)
      .replace(/\./g, '_') // Replace dots with underscores
      .substring(0, 50); // SecureStore has key length limits
    
    if (!cleanKey.match(/^[a-zA-Z0-9_-]+$/)) {
      throw new Error('Invalid SecureStore key format');
    }
    return cleanKey;
  }

  /**
   * Stores an item in persistent storage
   * @param {string} key - The storage key
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  async storeItem(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(`${this.namespace}:${key}`, stringValue);
    } catch (error) {
      console.error(`StorageService: Failed to store ${key}:`, error);
      throw error;
    }
  }

  async storeItemDebounced(key, value) {
    if (!this.isReady) await this.initialize();
    clearTimeout(this.debounceTimer);
    return new Promise((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        try {
          await this.storeItem(key, value);
          resolve();
        } catch (error) {
          console.error(`StorageService: Debounced store failed for ${key}:`, error);
          throw error;
        }
      }, 300);
    });
  }

  async storeRegistrationStatus(value) {
    if (!this.isReady) await this.initialize();
    const key = 'Registration';
    try {
      console.log('StorageService: Storing registration status:', value);
      await this.storeItem(key, value);
    } catch (error) {
      console.error('StorageService: Failed to store registration status:', error);
      throw new Error(`Failed to store registration status: ${error.message}`);
    }
  }

  async getItem(key, retries = this.maxRetries) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Getting ${namespacedKey}`);
      const stringValue = await AsyncStorage.getItem(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`StorageService: Failed to get ${namespacedKey}:`, error);
      if (retries > 0) {
        console.log(`StorageService: Retrying get ${namespacedKey}, ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this.getItem(key, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async getSecureItem(key) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Getting secure item ${namespacedKey}`);
      const stringValue = await SecureStore.getItemAsync(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`StorageService: Failed to get secure item ${namespacedKey}:`, error);
      throw new Error(`Secure storage error: ${error.message}`);
    }
  }

  async removeItem(key) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Removing ${namespacedKey}`);
      await AsyncStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`StorageService: Failed to remove ${namespacedKey}:`, error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async clear() {
    if (!this.isReady) await this.initialize();
    try {
      console.log('StorageService: Clearing storage');
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(this.namespace));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error(`StorageService: Failed to clear storage:`, error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }
}