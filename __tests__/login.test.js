// login.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose'); 
const authRoutes = require('../routes/authRoutes');
const { User } = require('../dao/models/userSchema');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Authentication Endpoints', () => {
  test('should fail to register with existing username', async () => {
    // Registra un usuario primero
    await request(app)
      .post('/auth/register')
      .send({
        nombre: 'John',
        apellido: 'Doe',
        email: 'john.doe@example.com',
        contraseña: 'password123',
        username: 'john_doe',
      });

    // Intenta registrar otro usuario con el mismo username
    const duplicateRegisterResponse = await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Jane',
        apellido: 'Doe',
        email: 'jane.doe@example.com',
        contraseña: 'password456',
        username: 'john_doe', // Mismo username que el usuario registrado anteriormente
      });

    expect(duplicateRegisterResponse.statusCode).toBe(400);
    expect(duplicateRegisterResponse.body).toHaveProperty('message', 'El nombre de usuario ya está en uso');
  });

  test('should fail to log in with incorrect credentials', async () => {
    // Registra un usuario primero
    await request(app)
      .post('/auth/register')
      .send({
        nombre: 'John',
        apellido: 'Doe',
        email: 'john.doe@example.com',
        contraseña: 'password123',
        username: 'john_doe',
      });

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




