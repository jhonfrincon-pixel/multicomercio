import { Star, Quote, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  date: string;
  rating: number;
  product: string;
  comment: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María García",
    location: "Bogotá, D.C.",
    date: "15 de abril, 2024",
    rating: 5,
    product: "Corrector de Postura",
    comment: "Excelente producto, llegó en 3 días y la calidad es increíble. El pago contra entrega me dio mucha confianza. Definitivamente volveré a comprar.",
    avatar: "MG"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    location: "Medellín, Antioquia",
    date: "10 de abril, 2024",
    rating: 5,
    product: "Lámpara Inteligente",
    comment: "La comunicación con el vendedor fue excelente y el producto funciona perfectamente. Me encantó el servicio de envío a todo el país.",
    avatar: "CR"
  },
  {
    id: 3,
    name: "Ana Martínez",
    location: "Cali, Valle del Cauca",
    date: "8 de abril, 2024",
    rating: 5,
    product: "Organizador de Cocina",
    comment: "Increíble la atención al cliente y la rapidez del envío. El producto superó mis expectativas. 100% recomendado.",
    avatar: "AM"
  },
  {
    id: 4,
    name: "Luis Fernando Torres",
    location: "Barranquilla, Atlántico",
    date: "5 de abril, 2024",
    rating: 5,
    product: "Set de Herramientas",
    comment: "Muy contento con mi compra. El pago contra entrega es un gran plus para nosotros los colombianos. Producto de alta calidad.",
    avatar: "LT"
  },
  {
    id: 5,
    name: "Sofía Castillo",
    location: "Bucaramanga, Santander",
    date: "2 de abril, 2024",
    rating: 5,
    product: "Cargador Portátil",
    comment: "Excelente experiencia de compra. El producto llegó antes de lo esperado y en perfectas condiciones. Muy recomendados.",
    avatar: "SC"
  },
  {
    id: 6,
    name: "Diego Herrera",
    location: "Pereira, Risaralda",
    date: "30 de marzo, 2024",
    rating: 5,
    product: "Auriculares Bluetooth",
    comment: "La calidad del producto es excepcional y el servicio al cliente fue muy amable. Sin duda una tienda confiable y profesional.",
    avatar: "DH"
  }
];

export function SocialProof() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-blue-400 text-blue-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
            Lo que dicen{' '}
            <span className="text-blue-600">
              nuestros clientes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Más de 10,000 colombianos ya confían en Livo. Descubre por qué nuestros clientes 
            nos califican con 5 estrellas en todas las plataformas.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-heading">10,000+</div>
            <div className="text-gray-600 font-sans">Clientes Felices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-heading">4.9/5</div>
            <div className="text-gray-600 font-sans">Calificación</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-heading">98%</div>
            <div className="text-gray-600 font-sans">Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-heading">32</div>
            <div className="text-gray-600 font-sans">Ciudades</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold font-heading">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 font-heading">{testimonial.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 font-sans">
                  <Calendar className="w-3 h-3" />
                  {testimonial.date.split(',')[0]}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-600 ml-2 font-sans">({testimonial.rating}.0)</span>
              </div>

              {/* Product */}
              <div className="text-sm text-blue-600 font-medium mb-3 font-sans">
                {testimonial.product}
              </div>

              {/* Comment */}
              <div className="relative">
                <Quote className="w-5 h-5 text-blue-200 absolute -top-2 -left-1" />
                <p className="text-gray-700 leading-relaxed pl-4 font-sans">
                  {testimonial.comment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-blue-400 text-blue-400" />
              <span className="font-semibold text-blue-900 font-heading">4.9/5</span>
            </div>
            <div className="text-gray-600 font-sans">•</div>
            <div className="text-blue-900 font-medium font-sans">Más de 10,000 reseñas verificadas</div>
            <div className="text-gray-600 font-sans">•</div>
            <div className="text-blue-900 font-medium font-sans">Clientes en toda Colombia</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
