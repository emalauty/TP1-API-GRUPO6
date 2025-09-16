# GamerTech E‑Commerce Frontend

Este repositorio contiene la implementación del front‑end de **GamerTech**, una aplicación de comercio electrónico para hardware y accesorios de gaming.  Fue desarrollada como primera entrega del Trabajo Práctico para la materia de Desarrollo Web y cumple los requisitos de mostrar un catálogo ordenado alfabéticamente, permitir filtrar por categorías, ver el detalle de los productos, gestionar un carrito y realizar operaciones básicas de autenticación【648625826471941†L34-L53】.

## Funcionalidades principales

- **Catálogo filtrable y ordenado**: la página de inicio (`Home`) carga la lista completa de productos a través de un servicio asíncrono.  Muestra los productos ordenados alfabéticamente (A→Z) por defecto y permite reordenar por nombre o precio.  Un buscador filtra por nombre o descripción y una barra de categorías permite seleccionar la categoría deseada【648625826471941†L34-L53】.
- **Detalle de producto**: al seleccionar un artículo se accede a su vista ampliada con imagen grande, descripción detallada, precio y stock.  Si el producto no tiene stock, el botón de agregar al carrito se desactiva y se muestra un aviso “Sin stock”【648625826471941†L45-L53】.
- **Carrito de compras**: los usuarios pueden agregar productos al carrito desde el listado o el detalle.  El carrito muestra cada ítem con su cantidad, precio unitario y subtotal; permite incrementarla o reducirla (sin superar el stock) y eliminar artículos.  Se calcula automáticamente el total general【648625826471941†L55-L65】.
- **Autenticación**: incluye formularios de registro y login que interactúan con una API simulada mediante `fetch`.  El registro solicita datos básicos y crea un nuevo usuario; el login valida credenciales contra un servidor JSON.  Estos componentes sirven como base para implementar rutas protegidas en etapas posteriores.
- **Gestión global con Context API**: el estado del carrito se maneja a través de un `CartContext` con `useReducer`, de manera que cualquier componente pueda acceder y actualizar el carrito sin prop‑drilling.  Las operaciones disponibles incluyen añadir, quitar, actualizar cantidades y vaciar el carrito.
- **Navegación con React Router**: se utilizan rutas declarativas (`/`, `/products`, `/products/:id`, `/cart`, `/login`, `/register`).  Los hooks `useParams` y `useNavigate` permiten leer parámetros de URL y redirigir programáticamente.
- **Carga asíncrona**: los productos y las categorías se obtienen desde `asynmock.js`, un servicio que devuelve listas simuladas.  Se usan `async/await` y promesas para interactuar con la API y manejar estados de carga, errores o vacíos.
- **UI/UX**: diseño responsive con estilos modulares y variables CSS.  Se emplean componentes reutilizables (`ProductCard`, `ProductSearch`, `CartItem`) y skeletons mientras se cargan los datos para mejorar la percepción de rendimiento.

## Estructura del proyecto

```
TP1-API-GRUPO6-main/
├─ src/
│  ├─ components/
│  │  ├─ layout/       → Header, Footer y barra de navegación
│  │  ├─ home/         → Página principal con hero, categorías y catálogo
│  │  ├─ products/     → Componentes para listar, buscar y detallar productos
│  │  ├─ cart/         → Componentes del carrito y flujo de checkout
│  │  └─ auth/         → Formularios de login y registro
│  ├─ context/         → CartContext: estado global del carrito
│  ├─ asynmock.js      → Mock de API con productos, categorías y stock
│  ├─ App.jsx          → Configuración de rutas y proveedores de contexto
│  ├─ index.css        → Variables de estilo y reset global
│  └─ main.jsx         → Punto de entrada de la aplicación
└─ public/
   └─ vite.svg         → Ícono de Vite utilizado por Vite

```

## Instalación y ejecución

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/<usuario>/TP1-API-GRUPO6.git
   cd TP1-API-GRUPO6
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Arrancar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación se ejecuta por defecto en `http://localhost:5173` y soporta recarga en caliente.

4. **Servidor JSON para autenticación (opcional)**

   Para que los formularios de *login* y *registro* funcionen, debes disponer de un servidor JSON que exponga un endpoint en `http://localhost:3000/users`.  Puedes levantarlo con [json-server](https://github.com/typicode/json-server):

   ```bash
   npm install -g json-server
   json-server --watch db.json --port 3000
   ```

   El archivo `db.json` debe contener un array `users` donde se persistirán los usuarios registrados.

## Uso de la aplicación

1. Navega a la **home** para ver el catálogo.  Utiliza el buscador y las categorías para filtrar los productos.  Haz clic en cualquier tarjeta o selecciona “Ver detalle” para ver la información ampliada.
2. En la **vista de detalle**, revisa la descripción, el stock y el precio.  Ajusta la cantidad y pulsa *Agregar al carrito* (si hay stock) para añadirlo.
3. En la **página del carrito**, revisa los ítems añadidos, actualiza cantidades o elimínalos.  El total se recalcula automáticamente.  Desde aquí puedes continuar al checkout (pendiente de implementar en etapas posteriores【648625826471941†L55-L65】).
4. Accede a **Registro** para crear un usuario y a **Login** para autenticarte.  Tras autenticarse, se podrá implementar la protección de rutas y operaciones restringidas a usuarios logueados.

## Buenas prácticas y decisiones técnicas

- Se emplea **Context API** con `useReducer` para mantener el estado del carrito y hacerlo accesible desde cualquier componente sin necesidad de pasar props anidados.
- Las operaciones a la API se hacen mediante funciones asíncronas y se gestionan los estados de carga con `useEffect` y `useState`.
- Para la navegación se utiliza **React Router v6**.  El `Hook` `useParams` facilita obtener valores dinámicos de la URL (p. ej., el `id` de un producto) y `useNavigate` permite redirigir programáticamente.
- Los componentes se dividen según su responsabilidad, lo que permite reutilizarlos y mantener un código legible.  La estructura de carpetas sigue una separación por dominios (layout, productos, carrito, autenticación) para facilitar la escalabilidad.
- Los estilos se gestionan con CSS modular y variables definidas en `index.css`, lo que garantiza coherencia visual y facilidad de ajuste.

## Próximos pasos

- Persistir el contenido del carrito en `localStorage` para mantener la sesión entre recargas.
- Implementar rutas protegidas basadas en autenticación, utilizando un `AuthContext` similar al contexto del carrito.
- Añadir las funcionalidades de administración de productos (crear, editar, eliminar) y un flujo de checkout real que descuente stock en la API.
- Mejorar la experiencia móvil y añadir un modo oscuro.

---

**© GamerTech** – Este proyecto es una práctica académica que ilustra el uso de React, Vite, Context API, React Router y llamadas asíncronas para construir una aplicación de comercio electrónico moderna.
