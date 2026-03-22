const User = require('../models/User');
const sendEmail = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /auth/register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'El usuario ya existe' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      email,
      password,
      verificationToken
    });

    const verificationUrl = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;

    const message = `Has solicitado registrarte en Api Gohan. Por favor, verifica tu correo haciendo clic en: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verificaci贸n de Correo - Api Gohan',
        message
      });

      res.status(201).json({
        success: true,
        data: 'Usuario registrado. Por favor, revisa tu correo para verificar tu cuenta.'
      });
    } catch (err) {
      console.error(err);
      user.verificationToken = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, error: 'El correo no pudo ser enviado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verificar correo electr贸nico
// @route   GET /auth/verify/:token
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Token de verificaci贸n inv谩lido' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      data: 'Correo verificado exitosamente. Ya puedes iniciar sesi贸n.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Iniciar sesi贸n
// @route   POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Por favor, proporcione un correo y contrase帽a' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Credenciales inv谩lidas' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, error: 'Por favor, verifique su correo antes de iniciar sesi贸n' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        apiKey: user.apiKey
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Olvid茅 mi contrase帽a
// @route   POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'No existe un usuario con ese correo' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
    const message = `Has solicitado restablecer tu contrase帽a. Por favor, ve al siguiente enlace: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecer Contrase帽a - Api Gohan',
        message
      });

      res.status(200).json({ success: true, data: 'Correo de restablecimiento enviado' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, error: 'El correo no pudo ser enviado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Restablecer contrase帽a
// @route   POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Token inv谩lido o expirado' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      data: 'Contrase帽a restablecida exitosamente',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
