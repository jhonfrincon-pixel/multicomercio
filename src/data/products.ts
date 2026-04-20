import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Sillón Relax Premium',
    category: 'Muebles',
    price: 899.99,
    originalPrice: 1199.99,
    shortDescription: 'Sillón reclinable de cuero sintético con masaje integrado y función de calor.',
    description: 'Transforma tu sala de estar con el Sillón Relax Premium, diseñado para ofrecer el máximo confort. Este elegante sillón reclinable cuenta con tapizado de cuero sintético de alta calidad, sistema de masaje con 8 puntos de presión, función de calor lumbar regulable y reposapiés extensible. Su diseño ergonómico se adapta perfectamente a la curvatura natural de tu cuerpo, proporcionando soporte óptimo para largas horas de descanso.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'
    ],
    features: [
      'Cuero sintético premium resistente a manchas',
      'Sistema de masaje con 8 puntos de presión',
      'Función de calor lumbar regulable',
      'Reposapiés extensible hidráulico',
      'Mecanismo reclinable de 160 grados',
      'Bolsillo lateral para controles y revistas'
    ],
    benefits: [
      {
        title: 'Confort Superior',
        description: 'Diseño ergonómico que se adapta a tu cuerpo para horas de descanso sin fatiga.',
        icon: 'sofa'
      },
      {
        title: 'Bienestar Integral',
        description: 'Masaje terapéutico y calor lumbar que alivian tensiones musculares.',
        icon: 'heart'
      },
      {
        title: 'Durabilidad Garantizada',
        description: 'Materiales de primera calidad que resisten el uso diario por años.',
        icon: 'shield'
      },
      {
        title: 'Fácil Mantenimiento',
        description: 'Cuero sintético que se limpia fácilmente con un paño húmedo.',
        icon: 'sparkles'
      }
    ],
    specifications: {
      'Dimensiones': '90 x 95 x 105 cm',
      'Peso': '42 kg',
      'Capacidad': '150 kg máximo',
      'Material': 'Cuero sintético PU',
      'Color': 'Chocolate / Negro / Gris',
      'Garantía': '3 años'
    },
    reviews: [
      {
        id: 'r1',
        author: 'María González',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
        date: '2024-03-15',
        title: '¡El mejor sillón que he tenido!',
        content: 'Desde que lo compré, mi sala de estar se ha transformado. El masaje es increíble después de un largo día de trabajo. Muy recomendado.',
        verified: true
      },
      {
        id: 'r2',
        author: 'Carlos Rodríguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        rating: 5,
        date: '2024-02-28',
        title: 'Excelente relación calidad-precio',
        content: 'Buscaba un sillón reclinable y este superó mis expectativas. El material se siente premium y el mecanismo es muy suave.',
        verified: true
      },
      {
        id: 'r3',
        author: 'Ana Martínez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        rating: 4,
        date: '2024-01-20',
        title: 'Muy cómodo',
        content: 'Llegó en perfectas condiciones y fue fácil de armar. El único detalle es que el masaje hace un poco de ruido, pero nada molesto.',
        verified: true
      }
    ],
    rating: 4.7,
    reviewCount: 128,
    inStock: 12,
    tags: ['sillón', 'muebles', 'relax', 'masaje', 'sala'],
    badge: 'Más Vendido'
  },
  {
    id: '2',
    name: 'Lámpara de Pie Arco Moderna',
    category: 'Iluminación',
    price: 349.99,
    originalPrice: 449.99,
    shortDescription: 'Lámpara de pie con diseño de arco ajustable, perfecta para iluminar espacios amplios con estilo.',
    description: 'La Lámpara de Pie Arco Moderna es una pieza statement que elevará la estética de cualquier habitación. Su diseño icónico con base de mármol y brazo de arco ajustable permite dirigir la luz exactamente donde la necesitas. Ideal para salas de estar, lecturas o como luz ambiental. Incluye portalámparas compatible con bombillas LED E27 de hasta 60W.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
      'https://images.unsplash.com/photo-1540932296774-3ed6d23f9b58?w=800&q=80'
    ],
    features: [
      'Base de mármol natural para máxima estabilidad',
      'Brazo de arco ajustable 360°',
      'Portalámparas E27 compatible con LED',
      'Cable de 2.5 metros con interruptor de pie',
      'Pantalla de tela en color blanco o negro',
      'Altura ajustable de 180 a 210 cm'
    ],
    benefits: [
      {
        title: 'Diseño Icónico',
        description: 'Añade un toque de sofisticación mid-century modern a tu espacio.',
        icon: 'palette'
      },
      {
        title: 'Iluminación Versátil',
        description: 'Dirige la luz exactamente donde la necesitas gracias al arco ajustable.',
        icon: 'lightbulb'
      },
      {
        title: 'Calidad Premium',
        description: 'Base de mármol genuino y acabados metálicos de alta resistencia.',
        icon: 'gem'
      },
      {
        title: 'Fácil Instalación',
        description: 'Montaje sencillo en menos de 15 minutos con instrucciones incluidas.',
        icon: 'wrench'
      }
    ],
    specifications: {
      'Altura': '180-210 cm ajustable',
      'Alcance del arco': '110 cm',
      'Base': 'Mármol natural 30x30 cm',
      'Peso': '18 kg',
      'Potencia máxima': '60W LED',
      'Garantía': '2 años'
    },
    reviews: [
      {
        id: 'r4',
        author: 'Laura Sánchez',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        rating: 5,
        date: '2024-03-10',
        title: 'Pieza de arte funcional',
        content: 'Esta lámpara transformó completamente mi sala. La base de mármol es pesada y estable, y la luz es perfecta para leer.',
        verified: true
      },
      {
        id: 'r5',
        author: 'Pedro Gómez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        rating: 5,
        date: '2024-02-15',
        title: 'Excelente calidad',
        content: 'El diseño es espectacular y la calidad de los materiales se nota. Llegó muy bien empacada y el armado fue sencillo.',
        verified: true
      }
    ],
    rating: 4.8,
    reviewCount: 86,
    inStock: 3,
    tags: ['lámpara', 'iluminación', 'diseño', 'arco', 'decoración'],
    badge: 'Oferta Especial'
  },
  {
    id: '3',
    name: 'Set de Ollas Profesional 12 Piezas',
    category: 'Cocina',
    price: 279.99,
    originalPrice: 399.99,
    shortDescription: 'Set completo de ollas y sartenes con revestimiento antiadherente de titanio.',
    description: 'Eleva tu experiencia culinaria con el Set de Ollas Profesional 12 Piezas. Fabricadas con aluminio forjado de alta resistencia y revestimiento antiadherente de titanio libre de PFOA, estas ollas distribuyen el calor uniformemente para cocinar perfectamente cada vez. El set incluye ollas de diferentes tamaños, sartenes, cacerola y utensilios profesionales. Compatible con todas las superficies de cocción incluyendo inducción.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c5?w=800&q=80',
      'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
    ],
    features: [
      'Revestimiento antiadherente de titanio libre de PFOA',
      'Aluminio forjado de alta conductividad térmica',
      'Mangos ergonómicos de silicona resistentes al calor',
      'Tapas de vidrio templado con válvula de escape',
      'Compatible con inducción, gas, eléctrico y vitrocerámica',
      'Apto para lavavajillas y horno hasta 230°C'
    ],
    benefits: [
      {
        title: 'Cocción Saludable',
        description: 'Revestimiento libre de químicos nocivos para cocinar con mínima grasa.',
        icon: 'leaf'
      },
      {
        title: 'Durabilidad Extrema',
        description: 'Titanio reforzado que resiste arañazos y uso intensivo diario.',
        icon: 'hammer'
      },
      {
        title: 'Versatilidad Total',
        description: 'Desde salteados hasta cocciones lentas, todo en un solo set.',
        icon: 'utensils'
      },
      {
        title: 'Fácil Limpieza',
        description: 'Antiadherente superior que facilita la limpieza, apto para lavavajillas.',
        icon: 'droplets'
      }
    ],
    specifications: {
      'Piezas incluidas': '12 (ollas, sartenes, cacerola, utensilios)',
      'Material': 'Aluminio forjado con titanio',
      'Compatibilidad': 'Todas las superficies incluyendo inducción',
      'Temperatura máxima': '230°C',
      'Garantía': '5 años'
    },
    reviews: [
      {
        id: 'r6',
        author: 'Chef Roberto',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        rating: 5,
        date: '2024-03-20',
        title: 'Calidad de restaurante en casa',
        content: 'Como chef profesional, puedo decir que estas ollas son excepcionales. La distribución del calor es perfecta.',
        verified: true
      },
      {
        id: 'r7',
        author: 'Carmen Díaz',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        rating: 5,
        date: '2024-02-28',
        title: '¡Increíble relación calidad-precio!',
        content: 'Reemplacé todas mis ollas viejas con este set y no podría estar más feliz. Nada se pega y son muy fáciles de limpiar.',
        verified: true
      },
      {
        id: 'r8',
        author: 'Luis Hernández',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        rating: 4,
        date: '2024-01-15',
        title: 'Muy buen set',
        content: 'Excelente calidad general. Los mangos son cómodos y el antiadherente funciona perfectamente.',
        verified: true
      }
    ],
    rating: 4.6,
    reviewCount: 203,
    inStock: 15,
    tags: ['cocina', 'ollas', 'sartenes', 'utensilios', 'antiadherente'],
    badge: '-30%'
  },
  {
    id: '4',
    name: 'Espejo Decorativo Dorado',
    category: 'Decoración',
    price: 189.99,
    shortDescription: 'Espejo redondo con marco dorado de metal, perfecto para dar amplitud y elegancia a cualquier espacio.',
    description: 'El Espejo Decorativo Dorado es la pieza perfecta para transformar cualquier habitación. Su diseño circular con marco de metal dorado cepillado añade un toque de glamour y sofisticación. El espejo de alta definición ofrece una reflexión nítida y real, ideal para recámaras, baños, entradas o salas de estar. Incluye sistema de montaje versátil para colgar horizontal o verticalmente.',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80'
    ],
    features: [
      'Espejo de cristal de alta definición',
      'Marco de metal dorado cepillado',
      'Acabado resistente a la oxidación',
      'Sistema de montaje incluido',
      'Diseño versátil para cualquier ambiente',
      'Borde fino de 2 cm para look moderno'
    ],
    benefits: [
      {
        title: 'Amplía Visualmente',
        description: 'Crea la ilusión de espacio y luz en habitaciones pequeñas.',
        icon: 'maximize'
      },
      {
        title: 'Elegancia Atemporal',
        description: 'El dorado cepillado complementa cualquier estilo decorativo.',
        icon: 'crown'
      },
      {
        title: 'Reflexión Perfecta',
        description: 'Cristal de alta calidad sin distorsiones ni imperfecciones.',
        icon: 'eye'
      },
      {
        title: 'Fácil Instalación',
        description: 'Sistema de montaje seguro con todos los accesorios incluidos.',
        icon: 'screwdriver'
      }
    ],
    specifications: {
      'Diámetro': '80 cm',
      'Grosor': '2.5 cm',
      'Peso': '6.5 kg',
      'Material marco': 'Metal dorado cepillado',
      'Material espejo': 'Cristal de alta definición',
      'Garantía': '2 años'
    },
    reviews: [
      {
        id: 'r9',
        author: 'Sofía Ramírez',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
        rating: 5,
        date: '2024-03-18',
        title: 'Hermoso espejo',
        content: 'Quedó perfecto en mi recámara. El marco dorado es elegante sin ser ostentoso. Muy buena calidad.',
        verified: true
      },
      {
        id: 'r10',
        author: 'Diego Torres',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80',
        rating: 5,
        date: '2024-02-22',
        title: 'Excelente compra',
        content: 'El empaque fue muy seguro y el espejo llegó en perfectas condiciones. El dorado es exactamente como en las fotos.',
        verified: true
      }
    ],
    rating: 4.9,
    reviewCount: 67,
    inStock: 4,
    tags: ['espejo', 'decoración', 'dorado', 'pared', 'elegante']
  },
  {
    id: '5',
    name: 'Aspiradora Robot Inteligente X5',
    category: 'Electrodomésticos',
    price: 449.99,
    originalPrice: 599.99,
    shortDescription: 'Aspiradora robot con mapeo inteligente, control por app y succión de 3000Pa.',
    description: 'Olvídate de la limpieza diaria con la Aspiradora Robot Inteligente X5. Equipada con tecnología de mapeo láser LDS que crea un mapa preciso de tu hogar, navega eficientemente por todas las habitaciones evitando obstáculos. Su potente succión de 3000Pa elimina polvo, pelo de mascotas y escombros de cualquier superficie. Control total desde la app: programa horarios, define zonas restringidas y monitorea la limpieza en tiempo real. Compatible con Alexa y Google Assistant.',
    images: [
      'https://images.unsplash.com/photo-1589894404892-7310b9b39dc9?w=800&q=80',
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
    ],
    features: [
      'Mapeo láser LDS de alta precisión',
      'Succión potente de 3000Pa con 4 niveles',
      'Control total por app móvil (iOS/Android)',
      'Compatible con Alexa y Google Assistant',
      'Batería de 5200mAh para 180 minutos de limpieza',
      'Estación de carga automática y reanudación'
    ],
    benefits: [
      {
        title: 'Limpieza Automática',
        description: 'Programa horarios y deja que el robot haga el trabajo por ti.',
        icon: 'clock'
      },
      {
        title: 'Mapeo Inteligente',
        description: 'Navegación eficiente que cubre todo el espacio sin repetir zonas.',
        icon: 'map'
      },
      {
        title: 'Control Total',
        description: 'Administra la limpieza desde cualquier lugar con la app.',
        icon: 'smartphone'
      },
      {
        title: 'Ideal Mascotas',
        description: 'Succión potente que elimina pelo y alérgenos eficazmente.',
        icon: 'paw'
      }
    ],
    specifications: {
      'Succión': '3000Pa',
      'Batería': '5200mAh Li-ion',
      'Autonomía': 'Hasta 180 minutos',
      'Capacidad de polvo': '600ml',
      'Nivel de ruido': '65 dB',
      'Garantía': '2 años'
    },
    reviews: [
      {
        id: 'r11',
        author: 'Fernanda López',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
        rating: 5,
        date: '2024-03-25',
        title: '¡Game changer!',
        content: 'Tengo dos perros y esta aspiradora ha sido salvadora. El mapeo es increíblemente preciso y la app funciona perfecto.',
        verified: true
      },
      {
        id: 'r12',
        author: 'Miguel Ángel',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80',
        rating: 5,
        date: '2024-03-01',
        title: 'La mejor inversión',
        content: 'Llego a casa y el piso está limpio todos los días. La configuración fue sencilla y el soporte técnico excelente.',
        verified: true
      },
      {
        id: 'r13',
        author: 'Patricia Ruiz',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80',
        rating: 4,
        date: '2024-02-10',
        title: 'Muy buena aspiradora',
        content: 'Limpia muy bien y el mapeo es preciso. A veces se atora con cables delgados, pero en general excelente.',
        verified: true
      }
    ],
    rating: 4.5,
    reviewCount: 312,
    inStock: 2,
    tags: ['aspiradora', 'robot', 'inteligente', 'limpieza', 'automático'],
    badge: 'Tecnología'
  },
  {
    id: '6',
    name: 'Jarrón Cerámica Artesanal',
    category: 'Decoración',
    price: 79.99,
    shortDescription: 'Jarrón de cerámica hecho a mano con acabado mate, perfecto para flores secas o como pieza decorativa.',
    description: 'Añade un toque de artesanía y calidez a tu hogar con este Jarrón de Cerámica Artesanal. Cada pieza es única, moldeada y pintada a mano por artesanos locales. Su acabado mate en tonos tierra crea una estética orgánica y contemporánea que complementa cualquier estilo decorativo. Perfecto para arreglos florales, ramas secas o como escultura decorativa sobre mesas, repisas o chimeneas.',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80',
      'https://images.unsplash.com/photo-1612196808214-b7e239e5bbae?w=800&q=80',
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80'
    ],
    features: [
      'Cerámica de alta temperatura cocida a 1200°C',
      'Acabado mate artesanal único en cada pieza',
      'Diseño orgánico con formas fluidas',
      'Resistente al agua para flores frescas',
      'Base protectora para superficies delicadas',
      'Incluye tarjeta de certificado de artesanía'
    ],
    benefits: [
      {
        title: 'Pieza Única',
        description: 'Cada jarrón es ligeramente diferente, haciéndolo verdaderamente especial.',
        icon: 'fingerprint'
      },
      {
        title: 'Apoya Artesanos',
        description: 'Tu compra apoya directamente a comunidades de artesanos locales.',
        icon: 'users'
      },
      {
        title: 'Versátil',
        description: 'Ideal para flores, ramas o como escultura decorativa independiente.',
        icon: 'flower'
      },
      {
        title: 'Duradero',
        description: 'Cerámica cocida a alta temperatura que resistirá por generaciones.',
        icon: 'hourglass'
      }
    ],
    specifications: {
      'Altura': '28 cm',
      'Diámetro': '18 cm',
      'Peso': '1.8 kg',
      'Material': 'Cerámica de alta temperatura',
      'Acabado': 'Mate orgánico',
      'Garantía': '1 año'
    },
    reviews: [
      {
        id: 'r14',
        author: 'Elena Vargas',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80',
        rating: 5,
        date: '2024-03-22',
        title: 'Pieza de arte',
        content: 'Es más hermoso en persona. Se nota la calidad del trabajo artesanal y el acabado mate es perfecto.',
        verified: true
      },
      {
        id: 'r15',
        author: 'Jorge Mendoza',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
        rating: 5,
        date: '2024-02-18',
        title: 'Excelente regalo',
        content: 'Lo compré como regalo de aniversario y fue un éxito total. La certificación de artesanía es un lindo detalle.',
        verified: true
      }
    ],
    rating: 4.8,
    reviewCount: 45,
    inStock: 20,
    tags: ['jarrón', 'cerámica', 'artesanal', 'decoración', 'único']
  }
];

export const categories = [
  { id: 'all', name: 'Todos', icon: 'grid' },
  { id: 'Muebles', name: 'Muebles', icon: 'sofa' },
  { id: 'Iluminación', name: 'Iluminación', icon: 'lightbulb' },
  { id: 'Cocina', name: 'Cocina', icon: 'utensils' },
  { id: 'Decoración', name: 'Decoración', icon: 'palette' },
  { id: 'Electrodomésticos', name: 'Electrodomésticos', icon: 'zap' }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.badge).slice(0, 4);
};
