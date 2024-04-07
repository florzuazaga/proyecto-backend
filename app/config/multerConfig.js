// Importar los módulos necesarios
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/userSchema');

// Configurar Multer para almacenar las imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Obtener el nombre de la carpeta desde los datos proporcionados por el usuario
    const folderName = req.body.folderName; // Debes tener un campo en el formulario para especificar la carpeta
    const folderPath = path.join(__dirname, `../uploads/${folderName}`);
    // Crear la carpeta si no existe
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

// Configurar las opciones de Multer
const upload = multer({ storage: storage });

// Endpoint para cargar documentos del usuario
router.post('/users/:uid/documents', upload.array('images'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Procesar y almacenar las imágenes cargadas en el modelo de usuario
    req.files.forEach(file => {
      if (file.fieldname === 'identification') {
        user.identificationImage = file.filename;
      } else if (file.fieldname === 'address_proof') {
        user.addressProofImage = file.filename;
      } else if (file.fieldname === 'account_statement') {
        user.accountStatementImage = file.filename;
      }
    });

    // Verificar si todos los documentos están cargados
    if (user.identificationImage && user.addressProofImage && user.accountStatementImage) {
      // Cambiar el rol del usuario a 'premium'
      user.isPremium = true;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    res.status(200).json({ message: 'Documentos cargados exitosamente' });
  } catch (error) {
    console.error('Error al cargar documentos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
