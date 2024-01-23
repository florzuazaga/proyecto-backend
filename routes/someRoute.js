// someRoute.js
const express = require('express');
const dataCache = require('../utils/dataCacheSingleton');

const router = express.Router();

router.get('/someEndpoint', (req, res) => {
    // Acceder a la caché de datos
    dataCache.set('clave', 'valor');
    const valor = dataCache.get('clave');
  
    res.json({ mensaje: 'Valor desde la caché', valor });
  
    // Operaciones asíncronas y almacenar resultados en la caché
    realizarOperacionAsincrona()
      .then(resultado => {
        dataCache.set('resultadoAsincrono', resultado);
      })
      .catch(error => {
        console.error('Error en operación asíncrona:', error);
        res.status(500).json({ mensaje: 'Error en operación asíncrona' });
      });
  });
  router.post('/someEndpoint', (req, res) => {
    const { clave, nuevoValor } = req.body;
  
    // Validar datos de entrada
    if (!clave || !nuevoValor) {
      return res.status(400).json({ mensaje: 'Datos de entrada incompletos' });
    }
  
    // Acceder a la caché de datos
    dataCache.set(clave, nuevoValor);
    const valor = dataCache.get(clave);
  
    res.json({ mensaje: 'Valor desde la caché', valor });
  });
    

// Ejemplo de función asíncrona
async function realizarOperacionAsincrona() {
  // Simulación de operación asíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Resultado asíncrono');
    }, 1000);
  });
}

module.exports = router;
