import { promises as fs } from "fs";
import path from "path";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = productData;

        // Validaciones
        if (!title || !description || !code || !price || stock == null || !category) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new Error("El precio debe ser un número mayor a 0");
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new Error("El stock debe ser un número mayor o igual a 0");
        }

        if (products.some(p => p.code === code)) {
            throw new Error("Ya existe un producto con ese código");
        }

        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        const { code, price, stock } = updates;

        // Validar código duplicado si se está cambiando
        if (code && code !== products[index].code) {
            if (products.some(p => p.code === code)) {
                throw new Error("Ya existe un producto con ese código");
            }
        }

        // Validaciones de tipos
        if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
            throw new Error("El precio debe ser un número mayor a 0");
        }

        if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
            throw new Error("El stock debe ser un número mayor o igual a 0");
        }

        // Actualizar solo los campos proporcionados
        products[index] = {
            ...products[index],
            ...Object.fromEntries(
                Object.entries(updates).filter(([_, v]) => v !== undefined)
            )
        };

        await this.saveProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);
        
        if (products.length === initialLength) {
            throw new Error("Producto no encontrado");
        }

        await this.saveProducts(products);
        return true;
    }

    async saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

export default ProductManager;
