const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  loginBgImage: { 
    type: String, 
    default: '' 
  },
  loginLibraryImage: { 
    type: String, 
    default: '' 
  },
  registerBgImage: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);