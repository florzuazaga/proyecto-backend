// middleware.js

class DataCache {
  constructor() {
    if (!DataCache.instance) {
      this._cache = new Map();
      DataCache.instance = this;
    }

    return DataCache.instance;
  }

  set(key, value, expirationTime = 3600 * 1000) {
    const expiration = Date.now() + expirationTime;
    this._cache.set(key, { value, expiration });
  }

  get(key) {
    const cachedItem = this._cache.get(key);

    if (cachedItem && cachedItem.expiration > Date.now()) {
      return cachedItem.value;
    } else {
      this._cache.delete(key);
      return null;
    }
  }
}

const dataCache = new DataCache();

const validatePurchaseData = (req, res, next) => {
  if (req.path.includes('/purchase/')) {
    const { products, totalPrice, user, date } = req.body;

    if (!Array.isArray(products) || !totalPrice || !user || !date) {
      return res.status(400).json({ status: 'error', error: 'Datos de compra incompletos o en formato incorrecto' });
    }
  }

  next();
};

module.exports = {
  dataCache,
  validatePurchaseData,
};

  