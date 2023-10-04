class ProductManager {
  constructor() {
    this.products = [];
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

  addProduct(title, description, image, price, thumbnail, code, stock) {
    if (this.hasProductWithCode(code)) {
      console.log(`El código ${code} ya existe`);
      return;
    }
    const newProducto = {
      title,
      description,
      image,
      price,
      thumbnail,
      code,
      stock,
    };
    if (!Object.values(newProducto).includes(undefined)) {
      ProductManager.id++;
      this.products.push({ ...newProducto, id: ProductManager.id });
    } else {
      console.log("Se necesitan todos los datos");
    }
  }
}

const productmanager = new ProductManager();

console.log(productmanager.getProducts());

productmanager.addProduct("product1", "description1", "imagen1", 12, "url", "code1", 500);
productmanager.addProduct("product2","description2",'imagen2',13,"url","code2",600);

console.log(productmanager.getProducts());

productmanager.addProduct("product3","description3",'imagen3',13,"url","code2",700);

productmanager.getProductsById(2);
      
