import { ArrowLeft, CheckCircle, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function PoliticaCalidad() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="ghost" // Changed to button as it's not a direct Link to a route, but an action
            onClick={() => navigate('/')}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Política de Calidad
          </h1>
          <p className="text-xl text-green-100 max-w-3xl">
            En Livo, no vendemos todo, solo lo mejor. Cada producto pasa por nuestro 
            riguroso proceso de selección para garantizar tu satisfacción.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Commitment */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Nuestro Compromiso</h2>
            </div>
            
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                En Livo entendemos que comprar online en Colombia requiere máxima confianza. 
                Por eso, cada producto en nuestro catálogo ha sido cuidadosamente seleccionado 
                y probado para cumplir con los más altos estándares de calidad.
              </p>
              <p>
                No somos un marketplace cualquiera. Somos curadores de productos que 
                realmente mejoran tu vida, con la garantía de que recibirás exactamente 
                lo que esperas.
              </p>
            </div>
          </div>

          {/* Quality Process */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Proceso de Selección</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Investigación de Mercado</h3>
                  <p className="text-gray-600">
                    Analizamos las necesidades reales de los consumidores colombianos 
                    para seleccionar productos que resuelvan problemas genuinos.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Verificación de Proveedores</h3>
                  <p className="text-gray-600">
                    Trabajamos solo con fabricantes y distribuidores certificados que 
                    cumplen con estándares internacionales de calidad.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Pruebas de Calidad</h3>
                  <p className="text-gray-600">
                    Cada producto es evaluado por nuestro equipo para garantizar durabilidad, 
                    funcionalidad y seguridad antes de llegar a ti.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4. Feedback de Clientes</h3>
                  <p className="text-gray-600">
                    Monitoreamos constantemente las reseñas y comentarios para mantener 
                    solo productos con alta satisfacción garantizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Standards */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Estándares de Calidad</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Materiales Premium</h3>
                <p className="text-gray-600">
                  Seleccionamos productos fabricados con materiales de alta calidad 
                  que garantizan durabilidad y rendimiento superior.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Certificaciones Internacionales</h3>
                <p className="text-gray-600">
                  Priorizamos productos con certificaciones que validan su seguridad 
                  y cumplimiento de normativas técnicas.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Innovación y Tecnología</h3>
                <p className="text-gray-600">
                  Ofrecemos productos con tecnología actualizada que representen 
                  verdaderas mejoras sobre las opciones tradicionales.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Relación Calidad-Precio</h3>
                <p className="text-gray-600">
                  Cada producto debe ofrecer excelente valor, justificando cada 
                    peso invertido con beneficios reales y duraderos.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Tienes Dudas sobre Nuestra Calidad?</h2>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de atención al cliente está disponible para resolver cualquier 
              pregunta sobre nuestros estándares de calidad y procesos de selección.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                Contactar por WhatsApp
              </Button>
              <Button variant="outline">
                Ver Garantías
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
