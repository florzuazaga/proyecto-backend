//ticketRoutes.js
const express = require('express');
const dataCache = require('../services/dataCacheSingleton');
const router = express.Router();
const Ticket = require('../dao/models/ticketModel');

// Endpoint para generar el ticket
router.post('/generate-ticket', async (req, res) => {
  try {
    // Aquí procesas la información de la compra y generas el ticket
    const { products, totalPrice, user, date } = req.body;

    // Puedes almacenar el ticket en la base de datos si es necesario
    const newTicket = await Ticket.create({
      products,
      totalPrice,
      user,
      date,
    });

    // Devuelve el ticket al cliente
    res.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error('Error al generar el ticket:', error);
    res.status(500).json({ success: false, error: 'Error al generar el ticket' });
  }
});

// Ruta para obtener todos los tickets
router.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
});

// Endpoint para manejar la caché y operaciones asíncronas
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


