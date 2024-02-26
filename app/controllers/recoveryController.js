// recoveryController.js
const User = require('../models/userSchema');  
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { emailSender } = require('./ticket_controller'); 



  const generateRecoveryToken = () => {
    // Genera un token único utilizando jsonwebtoken
    const token = jwt.sign({ data: 'recoveryTokenData' }, secretKey, { expiresIn: '1h' });
    return token;
  };
  
  const sendRecoveryEmail = async (user, token) => {
    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailSender.email,
        pass: emailSender.password,
      },
    });
  
    // Construye el enlace de recuperación
    const recoveryLink = `http://tuaplicacion.com/recovery/${token}`;
  
    // Contenido del correo electrónico
    const mailOptions = {
      from: emailSender.email,
      to: user.email,
      subject: 'Recuperación de Contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${recoveryLink}`,
    };
  
    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);
  };
  


const requestRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = generateRecoveryToken();
      user.recoveryToken = token;
      user.recoveryTokenExpiration = Date.now() + 3600000;  // 1 hora de duración
      await user.save();

      sendRecoveryEmail(user, token);
      res.status(200).json({ message: 'Correo de recuperación enviado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    res.status(500).json({ message: 'Error al solicitar recuperación.' });
  }
};

module.exports = {
  generateRecoveryToken,
  sendRecoveryEmail,
  requestRecovery,
};
