//cart.js
// Archivo JavaScript para manejar interacciones del usuario y realizar solicitudes al servidor
// Defini un objeto purchaseData inicial vacío
let purchaseData = {
    products: [],
    totalPrice: 0,
    user: "usuario_id",
    date: "2024-01-24"
  };
  purchaseData.date = new Date().toISOString().split('T')[0];

  
  // Función para agregar un producto al carrito
  function addToCart(productId, quantity, price) {
    const productIndex = purchaseData.products.findIndex(product => product.productId === productId);
  
    if (productIndex !== -1) {
      // El producto ya está en el carrito, actualiza la cantidad
      purchaseData.products[productIndex].quantity += quantity;
    } else {
      // Agrega un nuevo producto al carrito
      purchaseData.products.push({ productId, quantity });
    }
  
    // Actualiza el precio total
    purchaseData.totalPrice += quantity * price;
  
    // Muestra la información actualizada en la consola (puedes omitir esto en la implementación real)
    console.log(purchaseData);
  }
  
  // Ejemplo de uso al agregar un producto al carrito
  const productIdToAdd = 1;
  const quantityToAdd = 2;
  const pricePerUnit = 25.99;
  
  addToCart(productIdToAdd, quantityToAdd, pricePerUnit);
  
  // Luego, cuando el usuario esté listo para realizar la compra, enviarías el purchaseData actualizado al servidor.
  