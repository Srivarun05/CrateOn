import express from "express";
const { getAuthImages } = require('../controllers/themeController');

const router = express.Router();

router.get('/auth-images', getAuthImages);

export default router;