# Proyecto Backend

Mi Proyecto es una aplicación de ecomerce basico, con carrito y formulario para poder registrarse, con posibilidad de acceder con usuario y contraseña. 
Permite a los usuarios ver el carrito de compras, registrarse y iniciar una sesion .

## Estructura del Proyecto

Explicación detallada de la estructura del proyecto:

- **Config:**
  - `databaseconfig.js`: Configuración de la base de datos.
  - `jwtstrategy.js`: Estrategia de autenticación JWT.
  - `login.js`: Configuración de inicio de sesión.
  - `passport.js`: Configuración de Passport.


- **Controladores:**
  - `adminControllers.js`: Controladores relacionados con la administración.
  - `authControllers.js`: Controladores relacionados con la autenticación.
  - `cartsControllers.js`:  Controladores relacionados con carritos.
  - `productsControllers.js`:  Controladores relacionados con productos.
  

- **DAO/Models:**
  - `cartSchema.js`: Esquema del carrito.
  - `message.js`: Modelo de mensajes.
  - `messageSchema.js`: Esquema de mensajes.
  - `productsSchema.js`:Esquema de productos.
  - `userSchema.js`:Esquema de usuario.
  

- **DB:**
  - `auth.js`: Lógica de autenticación.
  - `db.js`: Archivo relacionado con la base de datos.
  - `mongo.js`:  Configuración de MongoDB.
 

- **Files:**
  - `carrito.json`: Archivo relacionado con carritos.
  - `productos.json`: Archivo relacionado con productos.
 

- **Managers:**
  - `CartManager.js`: Gestor del carrito.
  - `ProductManager.js`: Gestor de productos.
  - `SocketManager.js`: Gestor de sockets.


- **Middleware:**
  - `adminMiddlewares.js`:  Middleware relacionado con la administración.


- **node_modules:**
  - `node_modules/` (esta carpeta no se sigue en GitHub, ya que se especifica en el archivo .gitignore para excluirlo de la reposición).


- **Public:**
  - `realtimeproducts.html`: Archivo HTML público.
  - `style.css`:  Archivo de estilo CSS público.


- **Queries:**
  - `userQueries.js`:Archivo de consultas relacionadas con usuarios.


- **Routes:**
  - `adminRoutes.js`: Rutas relacionadas con la administración.
  - `authRoutes.js`: Rutas relacionadas con la autenticación.
  - `cartRoutes.js`:  Rutas relacionadas con carritos.
  - `productsRoutes.js`:Rutas relacionadas con productos.
  - `registerRoutes.js`:Rutas relacionadas con el registro de usuarios.
  - `routes.js`: Archivo de configuración de rutas.
  - `userRoutes.js`: Rutas relacionadas con usuarios.
  - `userAuthenticationRoutes.js`: rutas específicas relacionadas con la autenticación de usuarios en la aplicación.


- **Sessions:**  (esta carpeta no se sigue en GitHub ya que contiene información sensible).


- **Sessions Directory:**( archivos relacionados con el almacenamiento de sesiones).


- **Views:**
  . layouts/
        - `main.handlebars`: Plantilla principal compartida entre las páginas.
  Plantillas individuales de las páginas.
  - `about.handlebars`
  - `cart.handlebars`
  - `chat.handlebars`
  - `home.handlebars`
  - `index.handlebars`
  - `login.handlebars`
  - `realTimeProducts.handlebars`
  - `register.handlebars`

- **Vistas:**
 - `login.html`:  Otra vista específica.


- **Archivos de Configuración:**
 - `.env`:  Archivo para configurar variables de entorno.
 - `.gitignore`:  Archivo para especificar qué archivos y carpetas deben ser ignorados por Git.


- **Archivos Principales:**
 - `app.js`: Archivo principal de la aplicación.
 - `appRoutes.js`: Archivo de configuración de rutas de la aplicación.
 - `package-lock.json`,`package.json`: Archivos de configuración de Node.js y sus dependencias.
 - `server.js`:  Archivo principal para iniciar el servidor.


## Instrucciones de Instalación

A continuación, se detallan los pasos necesarios para instalar y configurar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

Primero, clona el repositorio en tu máquina local utilizando el siguiente comando:

```bash
git clone https://url-del-repositorio.git
cd nombre-del-proyecto

### 2.Instalar Dependencias

Segundo, Ejecuta el siguiente comando para instalar las dependencias del proyecto: 

```bash
npm install

Lista de dependencias:
    "axios": "^1.6.2",
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "connect-ensure-login": "^0.1.1",
    "connect-mongodb-session": "^3.1.1",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-handlebars": "^7.1.2",
    "express-session": "^1.17.3",
    "handlebars": "^4.7.8",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.3.0",
    "mongoose": "^8.0.3",
    "mongoose-paginate-v2": "^1.8.0",
    "multer": "^1.4.5-lts.1",
    "passport": "^0.7.0",
    "passport-github": "^1.1.0",
    "passport-github2": "^0.1.12",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "session": "^0.1.0",
    "session-file-store": "^1.5.0",
    "socket.io": "^4.7.2",
    "ws": "^8.14.2"

### 3.Configurar Variables de Entorno
Crea un archivo llamado .env en el directorio raíz del proyecto y configura las variables de entorno necesarias.
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/nombre-de-la-base-de-datos
SESSION_SECRET=secreto-de-sesión
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
JWT_SECRET=your-jwt-secret

### 4.Ejecutar la Aplicación
Inicia la aplicación con el siguiente comando:
```bash
npm start
La aplicación estará disponible en http://localhost:3000 o en el puerto que hayas especificado en tu archivo .env en la variable PORT.

Notas Adicionales:
Asegúrate de tener una instancia de MongoDB en ejecución y la URI configurada en tu archivo .env.
Personaliza las variables de entorno según las necesidades de tu aplicación.
Revisa la documentación de cada dependencia para obtener información detallada sobre su configuración y uso.

## Iniciar y Probar la Aplicación

Una vez que hayas instalado y configurado el proyecto, puedes iniciar y probar la aplicación siguiendo estos pasos:

### 1. Iniciar la Aplicación

Ejecuta el siguiente comando para iniciar la aplicación:

```bash
npm start
La aplicación se ejecutará en http://localhost:3000 o en el puerto que hayas especificado en tu archivo .env en la variable PORT.

### 2. Acceder a la Aplicación
Abre tu navegador web y visita la siguiente URL:

http://localhost:3000

Aquí deberías ver la página principal de tu aplicación.

### 3. Probar Funcionalidades
Explora las diferentes funcionalidades de la aplicación. Algunas rutas o características clave pueden incluir:

Inicio de Sesión y Registro: Visita las rutas relacionadas con la autenticación para probar la funcionalidad de inicio de sesión y registro.

Carritos y Productos: Si tu aplicación incluye funcionalidades de carritos y productos, asegúrate de probar la interacción con estos elementos.

Otras Características Específicas: Dependiendo de la naturaleza de tu aplicación, prueba otras características específicas.

### 4. Detener la Aplicación
Cuando hayas terminado de probar la aplicación, puedes detenerla presionando Ctrl + C en la terminal donde está ejecutándose.

Notas Adicionales:
Si encuentras problemas durante la instalación o ejecución, revisa las secciones anteriores del README.md y asegúrate de haber configurado todas las variables de entorno necesarias.
Si hay pasos adicionales para probar funciones específicas, agrégales detalles en esta sección.

