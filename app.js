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
      for(let i = 0; i < this.products.length; i++){
        if(this.products [i].code === code){
          console.log(`el code ${code} esta dos veces`);
          break;
        }
      }
      const newProducto ={
        title,
        description,
        image,
        price,
        thumbnail,
        code,
        stock,
      }
      if(!Object.values(newProducto).includes(undefined)){
         ProductManager.id++
         this.products.push({...newProducto, id:ProductManager.id});
      }else{
        console.log("se necesitan todos los datos")
      }
    }
}
const productmanager= new ProductManager();

console.log(productmanager.getProducts());

productmanager.addProduct("product1","description1",'imagen1',12,"url","code1",500);

productmanager.addProduct("product2","description2",'imagen2',13,"url","code2",600);

console.log(productmanager.getProducts());

productmanager.addProduct("product3","description3",'imagen3',13,"url","code2",700);

productmanager.getProductsById(2);





