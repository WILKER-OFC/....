const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Por favor, añade un correo electrónico'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, añade un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor, añade una contraseña'],
    minlength: 6,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  apiKey: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
