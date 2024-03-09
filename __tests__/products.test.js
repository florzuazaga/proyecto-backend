//products.test.js
const supertest = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');

describe('Products Router', () => {
  let userCookie; // Variable global para almacenar la cookie del usuario registrado

  // Antes de todas las pruebas, registra un nuevo usuario y realiza el inicio de sesión
  before((done) => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    supertest(app)
      .post('/api/register')
      .send(newUser)
      .expect(201)
      .expect('Set-Cookie', /coderCookie/)
      .end((err, res) => {
        userCookie = res.headers['set-cookie'];
        done();
      });
  });

  it('should get current user based on the cookie', (done) => {
    if (!userCookie) {
      done(new Error('No se ha almacenado la cookie del usuario.'));
      return;
    }

    supertest(app)
      .get('/api/current')
      .set('Cookie', userCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('username', 'testuser');
      })
      .end(done);
  });

  it('should log out the user', (done) => {
    supertest(app)
      .get('/api/logout')
      .set('Cookie', userCookie)
      .expect(200)
      .end(done);
  });

  

  // Prueba para crear un nuevo producto con imagen
  it('should create a new product with image', (done) => {
    const imagePath = path.join(__dirname, 'path', 'to', 'productImage.jpg');

    supertest(app)
      .post('/api/products')
      .set('Cookie', userCookie)
      .field('productName', 'Product Name')
      .field('description', 'Product Description')
      .field('price', '10.99')
      .attach('productImage', imagePath)
      .expect(200)
      .end(done);
  });
});


