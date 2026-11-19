export const categories = ['Todas', 'Salud', 'Tecnología', 'Comida', 'Ferretería', 'Hogar', 'Moda'];
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

export const categoryIcons = { Todas: "all", Salud: "health", Tecnología: "tech", Comida: "food", Ferretería: "tools", Hogar: "home", Moda: "fashion" };

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

shops.push({
  id: 'tecnomovil',
  slug: 'tecnomovil',
  name: 'Tecnomovil',
  homeFeatured: 2,
  category: 'Tecnología',
  image: 'tecnomovil/tienda-20261119.jpeg',
  description: 'Cables USB y cargadores para celulares.',
  address: 'Dirección pendiente de confirmar',
  hours: 'Horario pendiente de confirmar',
  contact: '',
  delivery: 'Retiro en el local',
  deliveryModes: ['retiro'],
  deliveryFees: {},
});
offers.push(
  { id: 'tecnomovil-cable-usb-v8', shop: 'tecnomovil', name: 'Cable USB V8', category: 'Tecnología', price: 3.5, image: 'tecnomovil/cable-usb-v8.webp', kind: 'Producto', description: 'Cable USB con conector micro USB (V8).' },
  { id: 'tecnomovil-cable-usb-tipo-c', shop: 'tecnomovil', name: 'Cable USB tipo C', category: 'Tecnología', price: 5, image: 'tecnomovil/cable-usb-tipo-c.jpeg', kind: 'Producto', description: 'Cable USB tipo C para dispositivos compatibles.' },
  { id: 'tecnomovil-cargador-18w', shop: 'tecnomovil', name: 'Cargador de 18W', category: 'Tecnología', price: 10, image: 'tecnomovil/cargador-18w.png', kind: 'Producto', description: 'Cargador de 18W para dispositivos compatibles.' },
  { id: 'tecnomovil-cargador-vehicular', shop: 'tecnomovil', name: 'Cargador Vehicular', category: 'Tecnología', price: 7, image: 'tecnomovil/cargador-vehicular.webp', kind: 'Producto', description: 'Cargador para vehículo.' },
);

shops.push({
  id: 'variedades-aristi',
  slug: 'variedades-aristi',
  name: 'Variedades Aristi',
  homeFeatured: 3,
  category: 'Hogar',
  image: 'aristi/tienda-20261119.jpeg',
  description: 'Blusas, ventiladores, lavadoras y televisores para tu día a día.',
  address: 'Dirección pendiente de confirmar',
  hours: 'Horario pendiente de confirmar',
  contact: '',
  delivery: 'Retiro en el local',
  deliveryModes: ['retiro'],
  deliveryFees: {},
});
offers.push(
  { id: 'aristi-blusa', shop: 'variedades-aristi', name: 'Blusa', category: 'Moda', price: 12, image: 'aristi/blusa-sin-fondo.png', imageFit: 'contain', kind: 'Producto', description: 'Blusa. Consulta las tallas y la disponibilidad con la tienda.' },
  { id: 'aristi-ventilador', shop: 'variedades-aristi', name: 'Ventilador', category: 'Hogar', price: 25, image: 'aristi/ventilador.avif', imageFit: 'contain', kind: 'Producto', description: 'Ventilador. Consulta las características con la tienda.' },
  { id: 'aristi-lavadora', shop: 'variedades-aristi', name: 'Lavadora', category: 'Hogar', price: 180, image: 'aristi/lavadora.jpg', imageFit: 'contain', kind: 'Producto', description: 'Lavadora. Consulta las características con la tienda.' },
  { id: 'aristi-televisor', shop: 'variedades-aristi', name: 'Televisor', category: 'Tecnología', price: 150, image: 'aristi/televisor.jpeg', imageFit: 'contain', kind: 'Producto', description: 'Televisor. Consulta las características con la tienda.' },
);
// D117: comercio real. homeFeatured indica su posición entre los comercios destacados (1 = primero).
// Servicios sin precio fijo: price null con priceNote/priceHint. Contacto, dirección y horario pendientes.
shops.push({
  id: 'flylife',
  slug: 'flylife',
  name: 'Fly Life',
  homeFeatured: 1,
  category: 'Tecnología',
  image: 'flylife/logo.png',
  imageFit: 'contain',
  imageBackground: 'dark',
  description: 'Internet WiFi, transferencias, depósitos y pago de servicios en San Lorenzo.',
  address: 'Dirección pendiente de confirmar',
  hours: 'Horario pendiente de confirmar',
  contact: '',
  delivery: 'Atención en el local',
  deliveryModes: ['retiro'],
  deliveryFees: {},
});
offers.push(
  { id: 'flylife-wifi', shop: 'flylife', name: 'Servicio de internet WiFi', trade: 'Internet WiFi', category: 'Tecnología', kind: 'Servicio', price: null, priceNote: 'Según el plan', priceHint: 'Cotiza tu plan con Fly Life', image: 'flylife/wifi.png', imageFit: 'contain', icon: 'tech', description: 'Internet WiFi para tu hogar o negocio. El valor depende del plan que elijas: cotízalo con Fly Life.', activities: ['Planes de internet WiFi', 'Cotización según el plan'] },
  { id: 'flylife-transferencias', shop: 'flylife', name: 'Transferencias y depósitos', trade: 'Transferencias y depósitos', category: 'Tecnología', kind: 'Servicio', price: null, priceNote: 'Varía según el monto', priceHint: 'El valor depende de la cantidad', image: 'flylife/transferencias.jpg', icon: 'tech', description: 'Realiza transferencias y depósitos en Fly Life. El valor varía según la cantidad.', activities: ['Transferencias', 'Depósitos'] },
  { id: 'flylife-energia', shop: 'flylife', name: 'Pago de energía eléctrica', trade: 'Pago de servicios', category: 'Tecnología', kind: 'Servicio', price: null, priceNote: 'Según tu planilla', priceHint: 'El valor depende de lo que adeudes', image: 'flylife/pago-energia-cnel.jpg', imageFit: 'contain', icon: 'bolt', description: 'Paga tu planilla de energía eléctrica de CNEL EP en Fly Life. El valor depende de la deuda de cada cliente.', activities: ['Pago de planillas de energía eléctrica (CNEL EP)'] },
);
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
