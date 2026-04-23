import { ArrowLeft, Shield, Lock, Eye, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigationStore';

export function ProteccionDatos() {
  const { goToHome } = useNavigationStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
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
            Protección de Datos Personales
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Cumplimos con la Ley 1581 de 2012. Tu información está segura con nosotros. 
            Conoce cómo protegemos y manejamos tus datos personales.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Legal Framework */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Marco Legal</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Ley 1581 de 2012</h3>
              <p className="text-blue-700 mb-3">
                Livo cumple con la legislación colombiana sobre protección de datos 
                personales, garantizando el derecho fundamental que tienen todas las 
                personas a conocer, actualizar y rectificar las informaciones que 
                se hayan recogido sobre ellas.
              </p>
              <p className="text-blue-700">
                Somos responsables del tratamiento de tus datos y nos comprometemos 
                a proteger tu privacidad en todas nuestras operaciones.
              </p>
            </div>

            <div className="prose prose-lg text-gray-600">
              <p>
                Como empresa colombiana, nos regimos por los principios de 
                legalidad, finalidad, libertad, veracidad, integridad y transparencia 
                en el tratamiento de tus datos personales.
              </p>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Información que Recopilamos</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Datos de Identificación</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Nombre completo</li>
                  <li>• Número de identificación (cédula)</li>
                  <li>• Fecha de nacimiento</li>
                  <li>• Dirección de correspondencia</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Datos de Contacto</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Número de teléfono (WhatsApp)</li>
                  <li>• Correo electrónico</li>
                  <li>• Ciudad y departamento</li>
                  <li>• Datos de envío específicos</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Datos de Transacción</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Historial de compras</li>
                  <li>• Métodos de pago utilizados</li>
                  <li>• Direcciones de envío anteriores</li>
                  <li>• Preferencias de productos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Purpose of Data */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalidad del Tratamiento</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Finalidades Principales</h3>
                <ul className="text-blue-700 space-y-2">
                  <li>• Procesar y cumplir con tus pedidos</li>
                  <li>• Realizar envíos a tu dirección</li>
                  <li>• Procesar pagos y facturación</li>
                  <li>• Ofrecer soporte al cliente</li>
                  <li>• Gestionar garantías y devoluciones</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-purple-800 mb-3">Finalidades Secundarias</h3>
                <ul className="text-purple-700 space-y-2">
                  <li>• Enviar información de productos</li>
                  <li>• Personalizar tu experiencia</li>
                  <li>• Mejorar nuestros servicios</li>
                  <li>• Realizar encuestas de satisfacción</li>
                  <li>• Ofrecer promociones relevantes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rights */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Tus Derechos ARCO</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  A
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acceso</h3>
                  <p className="text-gray-600">
                    Tienes derecho a conocer qué datos personales tenemos sobre ti 
                    y cómo los estamos utilizando.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  R
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Rectificación</h3>
                  <p className="text-gray-600">
                    Puedes solicitar la corrección de datos inexactos o incompletos 
                    que tengamos en nuestros registros.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  C
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cancelación</h3>
                  <p className="text-gray-600">
                    Tienes derecho a solicitar la eliminación de tus datos cuando 
                    ya no sean necesarios para las finalidades por las que fueron 
                    recopilados.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  O
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Oposición</h3>
                  <p className="text-gray-600">
                    Puedes oponerte al tratamiento de tus datos para fines 
                    comerciales o cuando consideres que vulneran tus derechos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Medidas de Seguridad</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Encriptación de Datos</h3>
                  <p className="text-gray-600">
                    Toda tu información está encriptada usando protocolos SSL/TLS 
                    para protegerla durante la transmisión.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
                  <p className="text-gray-600">
                    Solo personal autorizado puede acceder a tus datos, con 
                    controles estrictos y auditorías regulares.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Almacenamiento Seguro</h3>
                  <p className="text-gray-600">
                    Utilizamos servidores certificados con copias de seguridad 
                    automáticas y protección contra accesos no autorizados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ejerce tus Derechos</h2>
            <p className="text-gray-600 mb-6">
              Si deseas acceder, rectificar, cancelar u oponerte al tratamiento de 
              tus datos personales, contáctanos a través de nuestros canales oficiales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Enviar Solicitud por Email
              </Button>
              <Button variant="outline">
                Contactar por WhatsApp
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Email:</strong> datos@livo.com</p>
              <p><strong>Teléfono:</strong> 300 123 4567</p>
              <p><strong>Dirección:</strong> Bogotá D.C., Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
