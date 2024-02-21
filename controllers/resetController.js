// resetController.js
const User = require('../dao/models/userSchema');

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/password-reset-expired'); // Redirige a la vista correspondiente
    }

    // Restablece la contraseña y reinicia los campos relacionados con la recuperación
    user.contraseña = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/password-reset-success'); // Redirige a la vista de éxito
  } catch (error) {
    console.error('Error en el restablecimiento de contraseña:', error);
    res.redirect('/password-reset-error'); // Redirige a la vista de error
  }
};

module.exports = { resetPassword };
