// ticketController.js

const generateTicket = (req, res) => {
    try {
      // Obtén la información de la compra desde el cuerpo de la solicitud
      const purchaseData = req.body;
  
      // Valida la presencia de datos esenciales en la solicitud
      if (!purchaseData || !purchaseData.products || !purchaseData.totalPrice || !purchaseData.user || !purchaseData.date) {
        return res.status(400).json({ error: 'Datos de compra incompletos' });
      }
  
      // Simplemente devolvemos la información de la compra como un ticket (en este caso, como ejemplo)
      const ticket = {
        products: purchaseData.products,
        totalPrice: purchaseData.totalPrice,
        user: purchaseData.user,
        date: purchaseData.date,
        ticketId: generateTicketId(), // Puedes generar un ID para el ticket
      };
  
      // Puedes enviar el ticket como respuesta
      res.json(ticket);
    } catch (error) {
      console.error('Error al generar el ticket:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  // Función auxiliar para generar un ID de ticket 
  const generateTicketId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  module.exports = {
    generateTicket,
  };
  
