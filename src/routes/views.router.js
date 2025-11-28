import express from 'express';
import path from 'path';
import ProductManager from '../../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager(path.resolve('./data/products.json'));

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default router;
