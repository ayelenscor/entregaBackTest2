import { promises as fs } from "fs";
import path from "path";

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado");
        }

        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(p => p.id === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await this.saveCarts(carts);
        return cart;
    }

    async saveCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}

export default CartManager;
