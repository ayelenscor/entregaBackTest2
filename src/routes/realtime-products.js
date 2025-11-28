const socket = io();

function renderProducts(products) {
  const list = document.getElementById('productsList');
  if (!list) return;
  list.innerHTML = '';
  if (!products || products.length === 0) {
    list.innerHTML = '<li>No hay productos</li>';
    return;
  }
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `${p.title} - $${p.price} <button class="deleteBtn" data-id="${p.id}">Eliminar</button>`;
    list.appendChild(li);
  });
}

socket.on('products', (products) => {
  renderProducts(products);
});

const form = document.getElementById('createProductForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      title: data.get('title'),
      description: data.get('description'),
      code: data.get('code'),
      price: Number(data.get('price')),
      stock: Number(data.get('stock')),
      category: data.get('category'),
      thumbnails: data.get('thumbnails') ? String(data.get('thumbnails')).split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        await Swal.fire({ title: 'Error creando producto', text: err.error || res.statusText, icon: 'error' });
        return;
      }
      form.reset();
      await Swal.fire({ title: 'Producto creado', text: 'Se creó correctamente', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      await Swal.fire({ title: 'Error', text: 'Error creando producto', icon: 'error' });
    }
  });
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest && e.target.closest('.deleteBtn');
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;
  const confirmResult = await Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (!confirmResult.isConfirmed) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      await Swal.fire({ title: 'Error eliminando', text: err.error || res.statusText, icon: 'error' });
      return;
    }
    await Swal.fire({ title: 'Eliminado', text: 'El producto fue eliminado correctamente', icon: 'success', timer: 1200, showConfirmButton: false });
  } catch (err) {
    console.error(err);
    await Swal.fire({ title: 'Error', text: 'Error eliminando producto', icon: 'error' });
  }
});

fetch('/api/products')
  .then(r => r.json())
  .then(renderProducts)
  .catch(() => {});
