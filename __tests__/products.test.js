//products.test.js
const supertest = require('supertest');
const app = require('../app'); 
const chai = require('chai');
const expect = chai.expect;

describe('Sessions Router', () => {
    let userCookie; // Variable global para almacenar la cookie del usuario registrado
  
    it('should register a new user', (done) => {
      const newUser = {
        username: 'testuser',
        password: 'testpassword',
        
      };
  
      supertest(app)
        .post('/api/register')
        .send(newUser)
        .expect(201)
        .expect('Set-Cookie', /coderCookie/) // Verifica que la cookie tenga el nombre "coderCookie"
        .end((err, res) => {
          // Almacena la cookie para usarla en el siguiente test
          userCookie = res.headers['set-cookie'];
          done();
        });
    });
  
    it('should log in with the registered user', (done) => {
      const loginCredentials = {
        username: 'testuser',
        password: 'testpassword',
      };
  
      supertest(app)
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Set-Cookie', /coderCookie/) 
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
  
          // Extraer el valor de la cookie
          const cookieValue = res.headers['set-cookie'].find(cookie => cookie.includes('coderCookie'));
  
          // Verificar que el valor de la cookie esté definido
          expect(cookieValue).to.exist;
  
          // Almacena la cookie para su uso posterior
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
        .set('Cookie', userCookie) // Utiliza la cookie correcta
        .expect(200)
        .expect((res) => {
          // Verifica que la respuesta contiene el usuario esperado
          expect(res.body).to.have.property('username', '/* Nombre de usuario esperado */');
        })
        .end(done);
    });
  
    it('should log out the user', (done) => {
      supertest(app)
        .get('/api/logout')
        .set('Cookie', userCookie)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  });

