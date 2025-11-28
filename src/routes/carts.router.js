import express from 'express';
import path from 'path';
import CartManager from '../../CartManager.js';
import ProductManager from '../../ProductManager.js';

const router = express.Router();
const cartManager = new CartManager(path.resolve('./data/carts.json'));
const productManager = new ProductManager(path.resolve('./data/products.json'));

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    
    const productExists = await productManager.getProductById(productId);
    if (!productExists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const cart = await cartManager.addProductToCart(cartId, productId);
    res.json(cart);
  } catch (error) {
    const status = error.message === 'Carrito no encontrado' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

export default router;
