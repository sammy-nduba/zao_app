import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export class StorageService {
  constructor() {
    this.namespace = 'zao_app';
    this.maxRetries = 3;
    this.isReady = false;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.isReady) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        // First test AsyncStorage
        const testKey = this._getNamespacedKey('test_init');
        await AsyncStorage.setItem(testKey, 'test_value');
        await AsyncStorage.removeItem(testKey);

        // Then test SecureStore if available
        const secureStoreAvailable = await SecureStore.isAvailableAsync();
        if (secureStoreAvailable) {
          const secureTestKey = this._getSecureKey('test_init');
          await SecureStore.setItemAsync(secureTestKey, 'test_value', {
            keychainAccessible: SecureStore.WHEN_UNLOCKED
          });
          await SecureStore.deleteItemAsync(secureTestKey);
        }

        this.isReady = true;
        console.log('StorageService: Initialized successfully');
        return true;
      } catch (error) {
        console.error('StorageService: Initialization failed:', error);
        this.initializationPromise = null; // Reset promise to allow retries
        throw new Error('Storage service unavailable');
      }
    })();

    return this.initializationPromise;
  }

  _getNamespacedKey(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key provided');
    }
    // Use only alphanumeric and underscores for maximum compatibility
    return `${this.namespace}_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  _getSecureKey(key) {
    // SecureStore has stricter requirements - remove all special chars
    const cleanKey = `${this.namespace}_${key}`
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace all non-alphanumeric
      .substring(0, 50); // SecureStore has key length limits
    
    if (!cleanKey) {
      throw new Error('Empty SecureStore key after sanitization');
    }
    return cleanKey;
  }

  // Alias for compatibility
  async setItem(key, value) {
    return this.storeItem(key, value);
  }

  async storeItem(key, value) {
    if (!this.isReady) await this.initialize();
    try {
      const namespacedKey = this._getNamespacedKey(key);
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(namespacedKey, stringValue);
    } catch (error) {
      console.error(`StorageService: Failed to store ${key}:`, error);
      throw error;
    }
  }

  async getItem(key, retries = this.maxRetries) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = this._getNamespacedKey(key);
    try {
      const stringValue = await AsyncStorage.getItem(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`StorageService: Failed to get ${namespacedKey}:`, error);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.getItem(key, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async removeItem(key) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = this._getNamespacedKey(key);
    try {
      await AsyncStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`StorageService: Failed to remove ${namespacedKey}:`, error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async clear() {
    if (!this.isReady) await this.initialize();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.namespace));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('StorageService: Failed to clear storage:', error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }

async healthCheck() {
  try {
    const testKey = this._getNamespacedKey('health_check');
    await AsyncStorage.setItem(testKey, 'test_value');
    await AsyncStorage.removeItem(testKey);
    
    if (await SecureStore.isAvailableAsync()) {
      const secureTestKey = this._getSecureKey('health_check');
      await SecureStore.setItemAsync(secureTestKey, 'test_value');
      await SecureStore.deleteItemAsync(secureTestKey);
    }
    
    return true;
  } catch (error) {
    console.error('StorageService health check failed:', error);
    return false;
  }
}
}