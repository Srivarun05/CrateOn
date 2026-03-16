const Theme = require('../models/Theme');

exports.getAuthImages = async (req, res) => {
  try {
    const theme = await Theme.findOne(); 
    
    if (!theme) {
      return res.status(200).json({ success: true, data: null });
    }
    
    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error("Theme Fetch Error:", error);
    res.status(500).json({ success: false, message: 'Server Error fetching theme' });
  }
};
