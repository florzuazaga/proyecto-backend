const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
    this.initializeId();
  }

  static id = 0;

  // ...

  initializeId() {
    // Encuentra el máximo ID actual entre los productos existentes
    const maxId = this.products.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);

    // Inicializa el ID estático a un valor mayor que el máximo encontrado
    ProductManager.id = maxId + 1;
  }

  addProduct(product) {
    const { code } = product;

    if (this.hasProductWithCode(code)) {
      console.log(`El código ${code} ya existe`);
      return;
    }

    // Asignar automáticamente un ID usando el ID estático
    product.id = ProductManager.id++;

    this.products.push(product);
    this.saveProducts(); // Guardar productos en el archivo después de agregar uno nuevo.
    console.log(`Producto con ID ${product.id} agregado`);
  }

  // ...

  // Resto del código (getProductById, updateProduct, deleteProduct, etc.)

  // ...
}

const productmanager = new ProductManager('productos.json'); // Especifica el nombre del archivo para almacenar los productos.

console.log(productmanager.getProducts());

productmanager.addProduct({
  title: "product1",
  description: "description1",
  image: "imagen1",
  price: 12,
  thumbnail: "url",
  code: "code1",
  stock: 500
});
productmanager.addProduct({
  title: "product2",
  description: "description2",
  image: "imagen2",
  price: 13,
  thumbnail: "url",
  code: "code2",
  stock: 600
});

console.log(productmanager.getProducts());

productmanager.addProduct({
  title: "product3",
  description: "description3",
  image: "imagen3",
  price: 13,
  thumbnail: "url",
  code: "code3",
  stock: 700
});

productmanager.getProductsById(2);

productmanager.updateProduct(1, 'price', 20);

productmanager.deleteProductByIdFromFile(3);

console.log(productmanager.getProducts());

const productId = 2; // Reemplaza con el ID deseado
const productById = productmanager.getProductByIdFromFile(productId);

if (productById) {
  console.log(productById);
} else {
  console.log(`Producto con ID ${productId} no encontrado`);
}


      
