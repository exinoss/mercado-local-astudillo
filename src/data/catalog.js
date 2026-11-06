export const categories = ['Todas', 'Salud', 'Tecnología', 'Comida', 'Ferretería', 'Hogar'];
  const shopExamples = [
    { id: 'tecno', name: 'Tecno San Lorenzo', category: 'Tecnología', image: 'comercio/tecno.png', rating: 4.8, group: 'best', description: 'Equipos y accesorios para tu día a día.', delivery: 'Retiro y entrega a domicilio' },
    { id: 'frutos', name: 'Frutos de mi Tierra', category: 'Comida', image: 'comercio/alimentos.png', rating: 4.9, group: 'best', description: 'Alimentos y canastas para compartir en casa.', delivery: 'Retiro y entrega a domicilio' },
    { id: 'ferreteria', name: 'Ferretería El Progreso', category: 'Ferretería', image: 'comercio/ferreteria.png', rating: 4.7, group: 'best', description: 'Herramientas para tus proyectos del hogar.', delivery: 'Retiro en el local' },
    { id: 'hogar', name: 'Hogar y Estilo', category: 'Hogar', image: 'comercio/hogar.png', rating: 4.6, group: 'best', description: 'Ideas y artículos para disfrutar tu hogar.', delivery: 'Retiro y entrega a domicilio' },
    { id: 'bienestar', name: 'Bienestar Cerca', category: 'Salud', image: 'comercio/belleza.png', group: 'new', description: 'Un nuevo emprendimiento de cuidado personal.', delivery: 'Atención en el local' },
    { id: 'taller', name: 'Taller Digital', category: 'Tecnología', image: 'comercio/tecno.png', group: 'new', description: 'Un nuevo negocio de revisión y cuidado de equipos.', delivery: 'Atención en el local' }
  ];
  export const offers = [
    { id: 'telefono', name: 'Teléfono 5G de 128 GB', category: 'Tecnología', shop: 'tecno', price: 399, old: 449, image: 'contexto/telefono.webp', kind: 'Producto', description: 'Teléfono 5G con 128 GB de almacenamiento para tus aplicaciones, fotos y archivos.' },
    { id: 'freidora', name: 'Freidora de aire 5.5 L', category: 'Hogar', shop: 'hogar', price: 89, old: 99, image: 'contexto/freidora.webp', kind: 'Producto', description: 'Una opción para preparar alimentos en casa.' },
    { id: 'taladro', name: 'Taladro inalámbrico 20 V', category: 'Ferretería', shop: 'ferreteria', price: 79, old: 95, image: 'contexto/taladro.webp', kind: 'Producto', description: 'Taladro inalámbrico de 20 V para proyectos y reparaciones del hogar.' },
    { id: 'canasta', name: 'Canasta de alimentos', category: 'Comida', shop: 'frutos', price: 12, old: 14, image: 'contexto/canasta.webp', kind: 'Producto', description: 'Una selección de alimentos para compartir en casa.' },
    { id: 'bienestar', name: 'Orientación de bienestar', category: 'Salud', shop: 'bienestar', price: 15, icon: 'health', kind: 'Servicio', description: 'Orientación de bienestar con atención en el local y precio fijo por consulta.' },
    { id: 'revision', name: 'Revisión de equipo', category: 'Tecnología', shop: 'taller', price: 20, icon: 'tools', kind: 'Servicio', description: 'Revisión de un equipo y orientación sobre su mantenimiento.' }
  ];
  offers.push(
    { id: 'audifonos', name: 'Audífonos inalámbricos', category: 'Tecnología', shop: 'tecno', price: 35, old: 45, image: 'contexto/audifonos.webp', kind: 'Producto', description: 'Audífonos inalámbricos para acompañar tu día.' },
    { id: 'escritorio', name: 'Escritorio para tu hogar', category: 'Hogar', shop: 'hogar', price: 120, image: 'products/escritorio.jpg', kind: 'Producto', description: 'Un espacio de trabajo para tu hogar.' }
  );

export const categoryIcons = { Todas: "all", Salud: "health", Tecnología: "tech", Comida: "food", Ferretería: "tools", Hogar: "home" };

const shopImages = { tecno:'tecnologia', frutos:'comida', ferreteria:'ferreteria', hogar:'hogar', bienestar:'salud', taller:'taller' };
const slugs = { tecno:'tecno-san-lorenzo', frutos:'frutos-de-mi-tierra', ferreteria:'ferreteria-el-progreso', hogar:'hogar-y-estilo', bienestar:'bienestar-cerca', taller:'taller-digital' };
export const shops = shopExamples.map(shop => ({
  ...shop,
  slug: slugs[shop.id],
  image: 'mercado/' + shopImages[shop.id] + '.webp',
  startedAt: shop.id === 'bienestar' ? '2026-08-01' : shop.id === 'taller' ? '2026-09-20' : '2022-01-01',
  deliveryFees: { centro: 1.5, urbana: 2.5 },
}));
export const heroSlides = [
  { offerId:'freidora', title:'Más cocina, menos gasto.', theme:'Promociones', label:'Promoción', description:'Freidora de aire 5.5 L de Hogar y Estilo. Consulta sus detalles y compra en un comercio de tu ciudad.', alt:'Freidora negra sobre una encimera de cocina, imagen ilustrativa', action:'Ver esta promoción', showPreviousPrice:true },
  { offerId:'telefono', title:'Tecnología que llega a tu barrio.', theme:'Nuevos productos', label:'Novedad del catálogo', description:'Teléfono 5G de 128 GB de Tecno San Lorenzo. Descubre el producto y las opciones de retiro o entrega.', alt:'Teléfono 5G sobre el mostrador de una tienda, imagen ilustrativa', action:'Conocer el producto' },
  { offerId:'revision', title:'Conoce a quienes están empezando.', theme:'Negocios nuevos', label:'Nuevo comercio', description:'Taller Digital se suma a la plaza con revisión de equipos. Dale una oportunidad a un emprendimiento local.', alt:'Espacio de reparación de equipos, imagen ilustrativa', action:'Explorar Taller Digital', linkToShop:true }
];

// Entradas ilustrativas de la propuesta elegida (D73).
shops.push(...[
  {
    "id": "sabores-del-puerto",
    "slug": "sabores-del-puerto",
    "name": "Sabores del Puerto",
    "category": "Comida",
    "image": "mercado/comida.webp",
    "description": "Frutas y alimentos para llevar a tu mesa.",
    "startedAt": "2026-10-01",
    "address": "Zona urbana de San Lorenzo",
    "hours": "Lunes a sábado, 08:00–18:00",
    "contact": "",
    "delivery": "Retiro y entrega a domicilio",
    "deliveryModes": [
      "retiro",
      "entrega"
    ],
    "deliveryFees": {
      "centro": 1.5,
      "urbana": 2.5
    }
  },
  {
    "id": "manos-de-san-lorenzo",
    "slug": "manos-de-san-lorenzo",
    "name": "Manos de San Lorenzo",
    "category": "Hogar",
    "image": "mercado/hogar.webp",
    "description": "Detalles y artículos para los espacios de tu hogar.",
    "startedAt": "2026-10-01",
    "address": "Zona urbana de San Lorenzo",
    "hours": "Lunes a sábado, 08:00–18:00",
    "contact": "",
    "delivery": "Retiro y entrega a domicilio",
    "deliveryModes": [
      "retiro",
      "entrega"
    ],
    "deliveryFees": {
      "centro": 1.5,
      "urbana": 2.5
    }
  },
  {
    "id": "albanileria-local",
    "slug": "albanileria-local",
    "name": "Albañilería local",
    "category": "Hogar",
    "image": "",
    "description": "Atención de albañilería para tu hogar.",
    "startedAt": "2022-01-01",
    "address": "Zona urbana de San Lorenzo",
    "hours": "Consulta disponibilidad antes de contratar",
    "contact": "",
    "delivery": "Servicio a domicilio",
    "deliveryModes": [
      "retiro"
    ],
    "deliveryFees": {
      "centro": 1.5,
      "urbana": 2.5
    },
    "trade": "Albañilería",
    "icon": "tools"
  },
  {
    "id": "plomeria-local",
    "slug": "plomeria-local",
    "name": "Plomería local",
    "category": "Hogar",
    "image": "",
    "description": "Atención de plomería para tu hogar.",
    "startedAt": "2022-01-01",
    "address": "Zona urbana de San Lorenzo",
    "hours": "Consulta disponibilidad antes de contratar",
    "contact": "",
    "delivery": "Servicio a domicilio",
    "deliveryModes": [
      "retiro"
    ],
    "deliveryFees": {
      "centro": 1.5,
      "urbana": 2.5
    },
    "trade": "Plomería",
    "icon": "water"
  },
  {
    "id": "electricidad-local",
    "slug": "electricidad-local",
    "name": "Electricidad local",
    "category": "Hogar",
    "image": "",
    "description": "Atención de electricidad para tu hogar.",
    "startedAt": "2022-01-01",
    "address": "Zona urbana de San Lorenzo",
    "hours": "Consulta disponibilidad antes de contratar",
    "contact": "",
    "delivery": "Servicio a domicilio",
    "deliveryModes": [
      "retiro"
    ],
    "deliveryFees": {
      "centro": 1.5,
      "urbana": 2.5
    },
    "trade": "Electricidad",
    "icon": "bolt"
  }
]);
offers.push(...[
  {
    "id": "cesta-temporada",
    "shop": "sabores-del-puerto",
    "name": "Cesta de temporada",
    "category": "Comida",
    "price": 10,
    "image": "contexto/canasta.webp",
    "kind": "Producto",
    "description": "Una selección de alimentos de temporada. Consulta el contenido en la tienda.",
    "available": true
  },
  {
    "id": "detalle-hogar",
    "shop": "manos-de-san-lorenzo",
    "name": "Escritorio compacto",
    "category": "Hogar",
    "price": 110,
    "image": "products/escritorio.jpg",
    "kind": "Producto",
    "description": "Un escritorio para tu espacio de trabajo en casa.",
    "available": true
  },
  {
    "id": "visita-albanil",
    "shop": "albanileria-local",
    "name": "Visita de albañilería",
    "price": 12,
    "icon": "tools",
    "trade": "Albañilería",
    "kind": "Servicio",
    "category": "Hogar",
    "available": true,
    "description": "Precio fijo por la visita de revisión. Materiales y trabajos adicionales se acuerdan por separado con el proveedor."
  },
  {
    "id": "visita-plomero",
    "shop": "plomeria-local",
    "name": "Revisión de una fuga",
    "price": 15,
    "icon": "water",
    "trade": "Plomería",
    "kind": "Servicio",
    "category": "Hogar",
    "available": true,
    "description": "Precio fijo por la visita de revisión. Materiales y trabajos adicionales se acuerdan por separado con el proveedor."
  },
  {
    "id": "visita-electricista",
    "shop": "electricidad-local",
    "name": "Revisión de un punto eléctrico",
    "price": 18,
    "icon": "bolt",
    "trade": "Electricidad",
    "kind": "Servicio",
    "category": "Hogar",
    "available": true,
    "description": "Precio fijo por la visita de revisión. Materiales y trabajos adicionales se acuerdan por separado con el proveedor."
  }
]);
