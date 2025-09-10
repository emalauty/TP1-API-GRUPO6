// Mock de productos gaming
const products = [
  {
    id: 1,
    name: "RTX 4090 Gaming X Trio",
    category: "Tarjetas Gráficas",
    description: "La GPU más potente para gaming extremo. Ray tracing de última generación con DLSS 3.0",
    price: 1299900,
    stock: 5,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Corsair K95 RGB Platinum",
    category: "Teclados",
    description: "Teclado mecánico gaming con switches Cherry MX Speed e iluminación RGB personalizable",
    price: 189900,
    stock: 12,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Logitech G Pro X Superlight",
    category: "Mouse",
    description: "Mouse gaming inalámbrico ultra liviano diseñado para esports profesionales",
    price: 149900,
    stock: 0,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "SteelSeries Arctis Pro Wireless",
    category: "Auriculares",
    description: "Auriculares gaming inalámbricos con audio Hi-Res y doble transmisión 2.4G",
    price: 329900,
    stock: 8,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "AMD Ryzen 9 7950X",
    category: "Procesadores",
    description: "Procesador de 16 núcleos y 32 hilos, perfecto para gaming y creación de contenido",
    price: 699900,
    stock: 3,
    image: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-9-7900x.jpg"
  },
  {
    id: 6,
    name: "ASUS ROG Strix B650-E",
    category: "Motherboards",
    description: "Motherboard gaming con soporte DDR5, PCIe 5.0 y conectividad WiFi 6E",
    price: 449900,
    stock: 6,
    image: "https://www.venex.com.ar/products_images/1671812959_mother-3.png"
  },
  {
    id: 7,
    name: "G.Skill Trident Z5 RGB 32GB",
    category: "Memoria RAM",
    description: "Kit de memoria DDR5-6000 32GB (2x16GB) con iluminación RGB sincronizada",
    price: 299900,
    stock: 10,
    image: "https://statics.qloud.com.ar/hypergaming-01-2020/117_25-12-2023-08-12-08-f5-6000j4040f16gx2-tz5rs4.jpg"
  },
  {
    id: 8,
    name: "Samsung 980 PRO 2TB",
    category: "Almacenamiento",
    description: "SSD NVMe M.2 de alta velocidad con tecnología V-NAND 3-bit MLC",
    price: 249900,
    stock: 15,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop"
  }
];

// Categorías disponibles
const categories = [
  "Tarjetas Gráficas",
  "Teclados", 
  "Mouse",
  "Auriculares",
  "Procesadores",
  "Motherboards",
  "Memoria RAM",
  "Almacenamiento"
];

// Simulación de API con promesas
export const productService = {
  // Obtener todos los productos
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products);
      }, 1000); // Simula delay de red
    });
  },

  // Obtener un producto por ID
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find(p => p.id === parseInt(id));
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Producto no encontrado'));
        }
      }, 500);
    });
  },

  // Obtener productos por categoría
  getProductsByCategory: (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = products.filter(p => p.category === category);
        resolve(filteredProducts);
      }, 800);
    });
  },

  // Obtener todas las categorías
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 300);
    });
  },

  // Simular actualización de stock después del checkout
  updateProductStock: (productId, newStock) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          products[productIndex].stock = newStock;
          resolve(products[productIndex]);
        } else {
          reject(new Error('Producto no encontrado para actualizar stock'));
        }
      }, 500);
    });
  }
};