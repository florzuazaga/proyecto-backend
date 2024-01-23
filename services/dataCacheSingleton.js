//dataCacheSingleton.js

class DataCache {
    constructor() {
      if (!DataCache.instance) {
        this._cache = new Map();
        DataCache.instance = this;
      }
  
      return DataCache.instance;
    }
  
    set(key, value, expirationTime = 3600 * 1000) {
      // Expiración por defecto: 1 hora (3600 segundos * 1000 milisegundos)
      const expiration = Date.now() + expirationTime;
      this._cache.set(key, { value, expiration });
    }
  
    get(key) {
      const cachedItem = this._cache.get(key);
  
      if (cachedItem && cachedItem.expiration > Date.now()) {
        return cachedItem.value;
      } else {
        this._cache.delete(key); // Eliminar el elemento si ha expirado
        return null;
      }
    }
  }
  
  const dataCache = new DataCache();
  module.exports = dataCache;
  
  