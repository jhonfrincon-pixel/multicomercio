import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useNavigationStore } from '@/store/navigationStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Shield,
  CheckCircle,
  MapPin,
  Phone,
  User,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

interface CheckoutColombiaProps {}

export function CheckoutColombia({}: CheckoutColombiaProps) {
  const { items, getTotalPrice, getFunnelTotal, clearCart } = useCartStore();
  const { goToHome } = useNavigationStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    city: '',
    address: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    'Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
    'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
    'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^3\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos y comenzar con 3';
    }
    
    if (!formData.department) {
      newErrors.department = 'El departamento es obligatorio';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        customer: formData,
        items: items,
        total: getFunnelTotal() || getTotalPrice(),
        paymentMethod: 'contraentrega',
        createdAt: new Date().toISOString()
      };
      
      console.log('Order submitted:', orderData);
      
      toast.success('¡Pedido confirmado!', {
        description: 'Nos comunicaremos contigo en las próximas 24 horas para coordinar la entrega.',
        duration: 5000,
      });
      
      // Clear cart and redirect
      clearCart();
      goToHome();
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = getFunnelTotal() || getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Agrega productos para continuar con tu compra
          </p>
          <Button onClick={goToHome} className="bg-blue-600 hover:bg-blue-700">
            Seguir comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={goToHome}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir comprando
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.product.name}
                      </h3>
                      
                      {/* Show funnel-specific details */}
                      {item.tripwirePrice && (
                        <Badge className="bg-orange-100 text-orange-700 border-0 text-xs mt-1">
                          Oferta Tripwire
                        </Badge>
                      )}
                      
                      {item.isUpsell && (
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-xs mt-1">
                          Pack Familiar
                        </Badge>
                      )}
                      
                      <div className="text-sm text-gray-600 mt-1">
                        Cantidad: {item.quantity}
                      </div>
                      
                      {/* Show order bump */}
                      {item.orderBump && item.product.orderBump && (
                        <div className="text-sm text-green-600 mt-1">
                          + Protector de Pantalla: {formatPrice(item.product.orderBump.price)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {item.tripwirePrice ? (
                        <div>
                          <div className="text-sm text-gray-400 line-through">
                            {formatPrice(item.product.price)}
                          </div>
                          <div className="font-semibold text-gray-800">
                            {formatPrice(item.tripwirePrice)}
                          </div>
                        </div>
                      ) : item.isUpsell && item.upsellPrice ? (
                        <div className="font-semibold text-purple-600">
                          {formatPrice(item.upsellPrice)}
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-800">
                          {formatPrice(item.product.price)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Trust Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Información de Envío
                </h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Envío GRATIS a todo Colombia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Tiempo de entrega: 2-3 días hábiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Pagas solo cuando recibas tu pedido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Transportadoras: Servientrega, Interrapidísimo, Envía</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Información de Entrega
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Juan Pérez González"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Celular (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: 3001234567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                        errors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona tu departamento</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Bogotá, Medellín, Cali"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Calle 123 #45-67, Apt 302, Barrio La Soledad"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas de Entrega (Opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Indicaciones adicionales para la entrega..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-4 rounded-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      ¡CONFIRMAR PEDIDO CONTRAENTREGA!
                    </div>
                  )}
                </Button>
              </form>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span>No necesitas tarjeta de crédito</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Resumen de Compra
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Envío</span>
                <span>GRATIS</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total a pagar</span>
                  <span className="text-orange-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-700 font-medium">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">PAGO CONTRAENTREGA</span>
              </div>
              <p className="text-sm text-orange-600 mt-2">
                Pagarás en efectivo solo cuando recibas tu pedido en la puerta de tu casa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
