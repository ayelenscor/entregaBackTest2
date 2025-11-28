# API Endpoints

## Estructura del Proyecto

El proyecto está organizado siguiendo buenas prácticas de desarrollo:

- **ProductManager.js**: Clase para gestión de productos
- **CartManager.js**: Clase para gestión de carritos
- **routes/products.router.js**: Router de productos
- **routes/carts.router.js**: Router de carritos
- **routes/views.router.js**: Router de vistas
- **index.js**: Archivo principal que implementa WebSocket y configura el servidor

## Productos

### GET /api/products
Obtiene todos los productos.
- **Query params**: `?limit=n` (opcional) - Limita la cantidad de productos retornados

### GET /api/products/:pid
Obtiene un producto por su ID.

### POST /api/products
Crea un nuevo producto.
- **Body**: 
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "code": "string (requerido, único)",
  "price": "number (requerido, > 0)",
  "stock": "number (requerido, >= 0)",
  "category": "string (requerido)",
  "status": "boolean (opcional, default: true)",
  "thumbnails": "array (opcional, default: [])"
}
```

### PUT /api/products/:pid
Actualiza un producto existente.
- **Body**: Campos a actualizar (parcial)

### DELETE /api/products/:pid
Elimina un producto por su ID.

## Carritos

### POST /api/carts
Crea un nuevo carrito vacío.

### GET /api/carts/:cid
Obtiene un carrito por su ID.

### POST /api/carts/:cid/product/:pid
Agrega un producto al carrito. Si el producto ya existe, incrementa la cantidad.

## Vistas

### GET /
Vista principal con listado de productos estático.

### GET /realtimeproducts
Vista con productos en tiempo real usando WebSockets.
