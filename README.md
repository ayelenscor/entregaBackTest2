# 🛒 E-Commerce Backend

Backend de e-commerce con Node.js, Express, MongoDB, Mongoose y Socket.IO.

## 🏗️ Estructura

```
src/
├── config/
│   └── database.js
├── managers/
│   ├── ProductManager.js
│   └── CartManager.js
├── models/
│   ├── product.model.js
│   └── cart.model.js
└── routes/
    ├── products.router.js
    ├── carts.router.js
    └── views.router.js
public/
├── css/
│   └── styles.css
views/
├── home.handlebars
├── realTimeProducts.handlebars
└── layouts/
    └── main.handlebars
```

## 🔧 Stack Tecnológico

- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM y esquemas
- **Socket.IO** - Actualizaciones en tiempo real
- **Express-Handlebars** - Motor de plantillas
- **dotenv** - Variables de entorno

## 📦 Schemas

**Product:**
- title, description, code (único), price, status, stock, category, thumbnails, timestamps

**Cart:**
- products: [{ product (ObjectId), quantity }]
- timestamps

## 🔌 Endpoints

**Productos:** GET/POST/PUT/DELETE `/api/products` y `/api/products/:pid`

**Carritos:** GET/POST/PUT/DELETE `/api/carts` y `/api/carts/:cid/product/:pid`

**Vistas:** GET `/` (catálogo) y GET `/realtimeproducts` (tiempo real)
