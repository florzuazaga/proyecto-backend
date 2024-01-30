const fetch = require('node-fetch');
const fs = require('fs');  // Agrega la importación de fs para leer el archivo JSON

const cartId = 123;
const purchaseData = JSON.parse(fs.readFileSync('purchaseData.json', 'utf-8'));  // Lee el archivo JSON

fetch(`http://tu-servidor/purchase/${cartId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(purchaseData),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

