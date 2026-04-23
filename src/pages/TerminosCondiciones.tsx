import { ArrowLeft, FileText, Clock, Truck, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigationStore';

export function TerminosCondiciones() {
  const { goToHome } = useNavigationStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/80 text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="ghost"
            onClick={goToHome}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Conoce las condiciones de servicio de Livo para comprar con total 
            seguridad y confianza en toda Colombia.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-[#1e3a8a] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Términos de Servicio</h2>
            </div>
            
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                Bienvenido a Livo. Al utilizar nuestros servicios y comprar productos 
                en nuestra plataforma, aceptas los siguientes términos y condiciones. 
                Estos términos aplican para todos los clientes en Colombia.
              </p>
              <p>
                Livo opera como plataforma de intermediación conectando clientes 
                con proveedores certificados, garantizando calidad y servicio en 
                cada transacción.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Servicios</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Truck className="w-6 h-6 text-[#1e3a8a] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Envíos Nacionales</h3>
                  <p className="text-gray-600">
                    Realizamos envíos a todo el territorio colombiano mediante 
                    transportadoras confiables. Tiempos de entrega: 3-7 días hábiles 
                    según la ciudad.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="w-6 h-6 text-[#1e3a8a] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pago Contra Entrega</h3>
                  <p className="text-gray-600">
                    Ofrecemos la opción de pago contra entrega en efectivo para 
                    mayor seguridad y confianza. También aceptamos pagos electrónicos 
                    con tarjeta de crédito/débito.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-6 h-6 text-[#1e3a8a] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Soporte al Cliente</h3>
                  <p className="text-gray-600">
                    Atención personalizada 24/7 a través de WhatsApp, email y 
                    teléfono para resolver dudas, gestionar pedidos y procesar 
                    garantías.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsabilidades del Cliente</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#1e3a8a] mr-2">•</span>
                  <span>Proporcionar información verídica y completa al realizar el pedido</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e3a8a] mr-2">•</span>
                  <span>Estar presente en la dirección de entrega al momento del envío</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e3a8a] mr-2">•</span>
                  <span>Inspeccionar el producto al recibirlo y reportar daños inmediatamente</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e3a8a] mr-2">•</span>
                  <span>Seguir las instrucciones de uso y cuidado de los productos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e3a8a] mr-2">•</span>
                  <span>Respetar los tiempos y procesos de garantía y devolución</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Delivery Terms */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Clock className="w-8 h-8 text-[#1e3a8a] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Tiempos y Condiciones de Entrega</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Tiempos de Entrega</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• Bogotá, Medellín, Cali: 3-4 días hábiles</li>
                  <li>• Otras ciudades principales: 4-5 días hábiles</li>
                  <li>• Zonas rurales y apartadas: 5-7 días hábiles</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Condiciones de Envío</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• Envío gratis en pedidos mayores a $200.000 COP</li>
                  <li>• Costo de envío $15.000 COP en pedidos menores</li>
                  <li>• Seguro incluido contra pérdida o daño durante transporte</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Returns and Cancellations */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Devoluciones y Cancelaciones</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Cancelación de Pedido</h3>
                <p className="text-gray-600 mb-3">
                  Puedes cancelar tu pedido antes de que sea despachado:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• 100% de reembolso si cancelas antes del despacho</li>
                  <li>• 50% de reembolso si cancelas durante transporte</li>
                  <li>• No hay reembolso después de la entrega</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Devolución de Producto</h3>
                <p className="text-gray-600 mb-3">
                  Devoluciones aceptadas por:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Defectos de fábrica (reemplazo completo)</li>
                  <li>• Producto dañado durante transporte</li>
                  <li>• Error en el producto enviado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aspectos Legales</h2>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ley de Protección al Consumidor</h3>
                <p>
                  Livo cumple con todas las normativas colombianas de protección 
                  al consumidor, garantizando tus derechos como cliente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Jurisdicción</h3>
                <p>
                  Cualquier disputa será resuelta bajo las leyes de Colombia, 
                  con jurisdicción en los tribunales de Bogotá D.C.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Modificaciones</h3>
                <p>
                  Livo se reserva el derecho de modificar estos términos en cualquier 
                  momento. Los cambios entrarán en vigor desde su publicación.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-[#1e3a8a]/5 to-[#1e3a8a]/10 rounded-2xl p-8 border border-[#1e3a8a]/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Tienes Preguntas?</h2>
            <p className="text-gray-600 mb-6">
              Si tienes dudas sobre estos términos y condiciones, nuestro equipo 
              de atención al cliente está disponible para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                Contactar por WhatsApp
              </Button>
              <Button variant="outline">
                Ver Política de Garantías
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
