const faker = require('faker');

function generateMockProducts(count) {
  const mockProducts = [];

  for (let i = 0; i < count; i++) {
    const product = {
      _id: faker.random.uuid(),
      name: faker.commerce.productName(),
      price: faker.random.number({ min: 5, max: 100, precision: 0.01 }),
      description: faker.lorem.sentence(),
    };
    mockProducts.push(product);
  }

  return mockProducts;
}

module.exports = { generateMockProducts };
