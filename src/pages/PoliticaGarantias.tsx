import { ArrowLeft, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigationStore';

export function PoliticaGarantias() {
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
            Política de Garantías
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Tu tranquilidad es nuestra prioridad. Ofrecemos 30 días de garantía 
            total en todos nuestros productos para que compres con total confianza.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Guarantee */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-[#1e3a8a] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Garantía de Satisfacción 30 Días</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-[#1e3a8a] mr-2" />
                <h3 className="font-semibold text-blue-800">¿Qué cubre nuestra garantía?</h3>
              </div>
              <ul className="space-y-2 text-blue-700">
                <li>• Defectos de fábrica y mal funcionamiento</li>
                <li>• Productos que no corresponden a la descripción</li>
                <li>• Daños durante el transporte (reportados al recibir)</li>
                <li>• Problemas de calidad en materiales y acabados</li>
              </ul>
            </div>

            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                En Livo estamos tan seguros de la calidad de nuestros productos que 
                ofrecemos una garantía completa de 30 días. Si recibes un producto con 
                defectos o no cumple con lo prometido, lo reemplazamos inmediatamente 
                sin costo alguno.
              </p>
              <p>
                Esta garantía aplica para todos los productos vendidos en Colombia, 
                sin importar el método de pago o ciudad de entrega.
              </p>
            </div>
          </div>

          {/* Process */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6 text-[#1e3a8a]">
              <Clock className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Proceso de Reclamación</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contacta Inmediatamente</h3>
                  <p className="text-gray-600">
                    Notifícanos dentro de las primeras 24 horas de recibir el producto 
                    si encuentras algún problema. Puedes hacerlo por WhatsApp o email.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Proporciona Evidencia</h3>
                  <p className="text-gray-600">
                    Envía fotos o videos del problema, junto con tu número de pedido. 
                    Esto nos ayuda a procesar tu caso más rápidamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Evaluación Rápida</h3>
                  <p className="text-gray-600">
                    Nuestro equipo evaluará tu caso en máximo 48 horas y te dará 
                    una respuesta clara sobre la solución.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Solución Inmediata</h3>
                  <p className="text-gray-600">
                    Si procede, enviaremos un producto de reemplazo sin costo o 
                    procesaremos un reembolso completo según tu preferencia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Not Covered */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Exclusiones de la Garantía</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-orange-800 mb-3">La garantía NO cubre:</h3>
              <ul className="space-y-2 text-orange-700">
                <li>• Daños causados por mal uso o negligencia</li>
                <li>• Desgaste normal por uso prolongado</li>
                <li>• Modificaciones o reparaciones no autorizadas</li>
                <li>• Problemas reportados después de 30 días</li>
                <li>• Daños por accidentes o caídas</li>
                <li>• Incumplimiento de las instrucciones de uso</li>
              </ul>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios Adicionales</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Reemplazo Express</h3>
                <p className="text-gray-600">
                  Para defectos confirmados, enviamos el reemplazo antes de 
                  recibir el producto defectuoso, sin costo adicional.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Seguimiento Personal</h3>
                <p className="text-gray-600">
                  Asignamos un especialista para tu caso que te mantendrá 
                  informado durante todo el proceso de garantía.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Garantía Extendida</h3>
                <p className="text-gray-600">
                  Algunos productos incluyen garantía extendida de hasta 1 año. 
                  Consulta las especificaciones de cada producto.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Satisfacción Garantizada</h3>
                <p className="text-gray-600">
                  Si no estás 100% satisfecho con tu compra, tenemos opciones 
                  de devolución y reembolso flexibles.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-[#1e3a8a]/5 to-[#1e3a8a]/10 rounded-2xl p-8 border border-[#1e3a8a]/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas Usar tu Garantía?</h2>
            <p className="text-gray-600 mb-6">
              No esperes más. Contáctanos inmediatamente si tienes algún problema 
              con tu producto. Estamos aquí para ayudarte 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                Activar Garantía por WhatsApp
              </Button>
              <Button variant="outline">
                Enviar Email de Soporte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
