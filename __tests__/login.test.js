// login.test.js
// login.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose'); 
const winston = require('winston');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: 'info' }),  // Nivel de prioridad para consola
    new winston.transports.File({ filename: 'error.log', level: 'error' }),  // Archivo para errores
    new winston.transports.File({ filename: 'combined.log' })  // Archivo para mensajes informativos
  ],
});

const registerUser = async () => {
  return await request(app)
    .post('/auth/register')
    .send({
      nombre: 'John',
      apellido: 'Doe',
      email: 'john.doe@example.com',
      contraseña: 'password123',
      username: 'john_doe',
    });
};

describe('Authentication Endpoints', () => {
  test('should fail to register with existing username', async () => {
    // Registra un usuario primero
    await registerUser();

    // Intenta registrar otro usuario con el mismo username
    const duplicateRegisterResponse = await registerUser();

    expect(duplicateRegisterResponse.statusCode).toBe(400);
    expect(duplicateRegisterResponse.body).toHaveProperty('error', 'El nombre de usuario ya está en uso');
  });

  test('should fail to log in with incorrect credentials', async () => {
    // Registra un usuario primero
    await registerUser();

    // Intenta iniciar sesión con credenciales incorrectas
    const incorrectLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        username: 'john_doe',
        contraseña: 'wrong_password',
      });

    expect(incorrectLoginResponse.statusCode).toBe(401);
    expect(incorrectLoginResponse.body).toHaveProperty('message', 'Contraseña incorrecta');
  });

  // Cerrar correctamente la conexión de la base de datos después de las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });
});




