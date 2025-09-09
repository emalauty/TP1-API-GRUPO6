const mockProducts = [
  {
    id: 1,
    name: "Teclado Mecánico RGB Razer",
    price: 199.99,
    image: "https://placehold.co/300x200",
    category: "Periféricos",
    description: "Teclado mecánico gaming con switches Cherry MX y retroiluminación RGB",
    stock: 15
  },
  {
    id: 2,
    name: "Mouse Logitech G Pro X",
    price: 149.99,
    image: "https://placehold.co/300x200",
    category: "Periféricos",
    description: "Mouse gaming inalámbrico con sensor HERO 25K",
    stock: 20
  },
  {
    id: 3,
    name: "Auriculares HyperX Cloud Alpha",
    price: 129.99,
    image: "https://placehold.co/300x200",
    category: "Audio",
    description: "Auriculares gaming con sonido envolvente 7.1",
    stock: 8
  },
  {
    id: 4,
    name: "RTX 4070 Ti Gaming OC",
    price: 799.99,
    image: "https://placehold.co/300x200",
    category: "Componentes",
    description: "Tarjeta gráfica NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X",
    stock: 5
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getProducts: async () => {
    await delay(800);
    return mockProducts;
  },

  getProductById: async (id) => {
    await delay(500);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
};