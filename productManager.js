const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
    this.initializeId();
  }
  static id = 0;

  getProducts = () => {
    return this.products;
  };

  aparece(id) {
    return this.products.find((producto) => producto.id === id);
  }

  getProductsById(id) {
    const product = this.aparece(id);
    if (!product) {
      console.log("Producto no encontrado");
    } else {
      console.log(product);
    }
  }

  findProductsByCode(code) {
    const foundProducts = this.products.filter((producto) => producto.code === code);
    return foundProducts;
  }

  hasProductWithCode(code) {
    return this.products.some((producto) => producto.code === code);
  }
  initializeId() {
    
    const maxId = this.products.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);

    ProductManager.id = maxId + 1;
  }

  addProduct(product) {
    const { code } = product;

    if (this.hasProductWithCode(code)) {
      console.log(`El código ${code} ya existe`);
      return;
    }

    
     product.id = ProductManager.id++;

     this.products.push(product);
     this.saveProducts(); 
     console.log(`Producto con ID ${product.id} agregado`);
  }

  updateProduct(updateData) {
    const { id, ...updatedFields } = updateData;
    const productIndex = this.products.findIndex((producto) => producto.id === id);

    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    const product = this.products[productIndex];
    
    Object.assign(product, updatedFields);

    this.saveProducts(); 
    console.log(`Producto con ID ${id} actualizado`);
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((producto) => producto.id === id);
    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    this.products.splice(productIndex, 1);
    console.log(`Producto con ID ${id} eliminado`);
    this.saveProducts(); 
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al cargar el archivo de productos: ${error.message}`);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      console.log('Productos guardados en el archivo.');
    } catch (error) {
      console.error(`Error al guardar los productos en el archivo: ${error.message}`);
    }
  }

  getProductByIdFromFile(id) {
    const products = this.loadProducts();
    const product = products.find((producto) => producto.id === id);
    return product;
  }

  deleteProductByIdFromFile(id) {
    const products = this.loadProducts();
    const productIndex = products.findIndex((producto) => producto.id === id);
    
    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    products.splice(productIndex, 1);
    this.saveProducts(); 
    console.log(`Producto con ID ${id} eliminado del archivo`);
  }
}

const productmanager = new ProductManager('productos.json'); 

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

      
