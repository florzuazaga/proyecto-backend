class ProductManager{
    constructor(){
        this.products=[]
    }
    static id = 0;
    
    getProducts=()=>{
        return this.products
    }
    aparece(id){
      return this.products.find((producto)=> producto.id === id)
    }
    getProductsById(id){
      !this.aparece(id) ? console.log("not found"): console.log(this.aparece(id));
      
    }
    addProduct=(title,description,image,price,thumbnail,code,stock)=>{
      ProductManager.id++
      this.products.push({title,description,image,price,thumbnail,code,stock, id:ProductManager.id});
    }
}
const productmanager= new ProductManager();

console.log(productmanager.getProducts());

productmanager.addProduct("product1","description1",'imagen1',12,"url","code1",500);
productmanager.addProduct("product2","description2",'imagen2',13,"url","code2",600);

console.log(productmanager.getProducts());
productmanager.getProductsById(2)





