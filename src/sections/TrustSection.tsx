import { Shield, Truck, Clock, Users, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrustSection() {
  const trustItems = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Envíos a toda Colombia",
      description: "Cubrimos todo el territorio nacional con transportadoras confiables",
      highlight: "3-7 días hábiles"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Pago Contra Entrega",
      description: "Paga solo cuando recibas tu producto en la puerta de tu casa",
      highlight: "100% Seguro"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Garantía de Calidad",
      description: "Todos nuestros productos pasan por un riguroso control de calidad",
      highlight: "30 días de garantía"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Miles de Clientes Satisfechos",
      description: "Más de 10,000 colombianos confían en Livo para sus compras",
      highlight: "4.9/5 estrellas"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Atención 24/7",
      description: "Soporte continuo por WhatsApp para resolver tus dudas",
      highlight: "Respuesta inmediata"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Protección de Datos",
      description: "Cumplimos con la Ley 1581 de Protección de Datos Personales",
      highlight: "100% Legal"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
            ¿Por qué confiar en{' '}
            <span className="text-blue-600">
              Livo
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            No solo vendemos productos, construimos confianza. Cada compra está respaldada 
            por nuestro compromiso con la calidad y tu satisfacción.
          </p>
        </motion.div>

        {/* Trust Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed font-sans">
                  {item.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium font-sans">
                  {item.highlight}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2 font-heading">10,000+</div>
              <div className="text-blue-100 font-sans">Clientes Felices</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2 font-heading">4.9/5</div>
              <div className="text-blue-100 font-sans">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2 font-heading">98%</div>
              <div className="text-blue-100 font-sans">Satisfacción Garantizada</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2 font-heading">24/7</div>
              <div className="text-blue-100 font-sans">Soporte Continuo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
