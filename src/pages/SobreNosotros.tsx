import { useMemo } from 'react';
import { ArrowLeft, Users, Target, Award, Rocket, Heart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigationStore';
import { motion } from 'framer-motion';

const VALUES = [
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: "Calidad Premium",
    description: "Seleccionamos minuciosamente cada producto para asegurar que supere tus expectativas de durabilidad y diseño."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Confianza Total",
    description: "Nuestra garantía de 30 días y sistema de pago contra entrega protegen tu inversión en cada compra."
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-600" />,
    title: "Innovación Constante",
    description: "Buscamos soluciones inteligentes que simplifiquen tu día a día y mejoren tu bienestar."
  }
];

export function SobreNosotros() {
  const { goToHome } = useNavigationStore();

  // Datos estructurados para Google (Organization Schema)
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Livo Colombia",
    "url": "https://holalivo.netlify.app/",
    "logo": "https://holalivo.netlify.app/logo.png",
    "description": "Expertos en soluciones inteligentes para el hogar en Colombia. Calidad, diseño y confort garantizados.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bogotá",
      "addressCountry": "CO"
    },
    "sameAs": [
      "https://facebook.com/livo",
      "https://instagram.com/livo"
    ]
  }), []);

  return (
    <div className="min-h-screen bg-white">      

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              variant="ghost" 
              onClick={goToHome}
              className="mb-8 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Button>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Sobre Livo</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Transformamos hogares con productos de calidad, diseño y confort. 
              Tu bienestar es nuestra inspiración.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="text-blue-600" /> Nuestra Historia
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                <strong>Livo</strong> nació en Colombia con un propósito claro: democratizar el acceso a <strong>productos inteligentes y de alta calidad para el hogar</strong>. Entendemos que tu casa es tu refugio, y por eso nos esforzamos en ofrecer soluciones que combinan tecnología avanzada con la simplicidad que tu vida requiere en el día a día.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Desde nuestros inicios en el mercado de <strong>E-commerce en Colombia</strong>, hemos servido a miles de colombianos, llevando bienestar directamente a su puerta con la confianza de nuestro sistema de <strong>pago contra entrega</strong> y envíos nacionales garantizados.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-video overflow-hidden shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" 
                alt="Diseño de interiores moderno con productos Livo en Colombia" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-center">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-blue-100">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-gray-600">Mejorar la calidad de vida de las familias mediante productos innovadores que aporten confort y funcionalidad real.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-blue-100">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
              <p className="text-gray-600">Ser la marca referente en soluciones para el hogar en la región, reconocida por nuestra excelencia y compromiso con el cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Lo que nos define</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {VALUES.map((value, index) => (
              <div key={index} className="text-center p-6 space-y-4">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}