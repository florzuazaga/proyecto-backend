/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints relacionados con la gestión de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Devuelve la lista de todos los productos
 *       500:
 *         description: Error del servidor
 */
app.get('/api/products', (req, res) => {
    // Implementación de la lógica para obtener todos los productos
  });
  
  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Eliminar un producto por ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del producto a eliminar
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Producto eliminado exitosamente
   *       404:
   *         description: Producto no encontrado
   *       500:
   *         description: Error del servidor
   */
  app.delete('/api/products/:id', (req, res) => {
    // Implementación de la lógica para eliminar un producto por ID
  });
  
  