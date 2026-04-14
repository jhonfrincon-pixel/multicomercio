import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore, type ShippingInfo, type PaymentInfo } from '@/store/checkoutStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useLoyaltyStore } from '@/store/loyaltyStore';
import { useCRMStore } from '@/store/crmStore';
import { useNavigationStore } from '@/store/navigationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  CreditCard,
  Wallet,
  Store,
  Check,
  Package,
  MapPin,
  Shield,
  Lock,
  Tag,
  X,
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Envío', icon: MapPin },
  { id: 2, name: 'Método', icon: Truck },
  { id: 3, name: 'Pago', icon: CreditCard },
  { id: 4, name: 'Confirmar', icon: Check },
];

export function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const {
    currentStep,
    setStep,
    shippingInfo,
    setShippingInfo,
    paymentMethod,
    setPaymentMethod,
    setPaymentInfo,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    resetCheckout,
    createOrder,
  } = useCheckoutStore();
  const { addOrder } = useOrdersStore();
  const { currentMember, addPoints, getPointsForPurchase } = useLoyaltyStore();
  const { syncFromOrder } = useCRMStore();
  const { goToHome } = useNavigationStore();

  const [discountInput, setDiscountInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shipping = discountCode === 'FREESHIP' ? 0 : subtotal > 500 ? 0 : 49.99;
  const tax = subtotal * 0.16;
  const discount = subtotal * discountAmount;
  const total = subtotal + shipping + tax - discount;

  const handleApplyDiscount = () => {
    const result = applyDiscount(discountInput);
    if (result.success) {
      toast.success(result.message);
      setDiscountInput('');
    } else {
      toast.error(result.message);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const info: ShippingInfo = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      country: 'México',
    };
    setShippingInfo(info);
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      const formData = new FormData(e.currentTarget);
      const info: PaymentInfo = {
        cardNumber: formData.get('cardNumber') as string,
        cardName: formData.get('cardName') as string,
        expiryDate: formData.get('expiryDate') as string,
        cvv: formData.get('cvv') as string,
      };
      setPaymentInfo(info);
    }
    setStep(4);
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = createOrder(orderItems);
    addOrder(order);
    syncFromOrder(order);

    // Add loyalty points
    if (currentMember) {
      const points = getPointsForPurchase(subtotal);
      addPoints(currentMember.email, points, 'Compra completada');
    }

    setCompletedOrderId(order.id);
    setOrderComplete(true);
    clearCart();
    resetCheckout();
    setIsProcessing(false);

    toast.success('¡Pedido completado exitosamente!', {
      description: `Orden #${order.id}`,
    });
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-stone-50 py-20">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-stone-400" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-stone-600 mb-8">
            Agrega productos a tu carrito para continuar con la compra.
          </p>
          <Button onClick={goToHome} className="bg-amber-600 hover:bg-amber-700 text-white">
            Ver Productos
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-stone-50 py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800 mb-2">
              ¡Gracias por tu compra!
            </h2>
            <p className="text-stone-600 mb-6">
              Tu pedido ha sido confirmado y está siendo procesado.
            </p>
            
            <div className="bg-stone-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-stone-500 mb-1">Número de orden</p>
              <p className="text-xl font-bold text-stone-800">{completedOrderId}</p>
            </div>

            {currentMember && (
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-700">
                  ¡Ganaste <strong>{getPointsForPurchase(subtotal)} puntos</strong> de fidelidad!
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={goToHome} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Seguir Comprando
              </Button>
              <Button variant="outline" onClick={goToHome} className="w-full">
                Ver mis pedidos
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => currentStep > 1 ? setStep(currentStep - 1) : goToHome()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-stone-800">Finalizar Compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-white text-stone-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-white/20'
                        : isCompleted
                        ? 'bg-green-200'
                        : 'bg-stone-100'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-stone-800 mb-6">
                    Información de Envío
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          defaultValue={shippingInfo?.firstName}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          defaultValue={shippingInfo?.lastName}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        defaultValue={shippingInfo?.email}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        defaultValue={shippingInfo?.phone}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        defaultValue={shippingInfo?.address}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          defaultValue={shippingInfo?.city}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          defaultValue={shippingInfo?.state}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          required
                          defaultValue={shippingInfo?.zipCode}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6"
                    >
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-stone-800 mb-6">
                    Método de Envío
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setStep(3)}
                      className="w-full flex items-center gap-4 p-4 border-2 border-amber-600 bg-amber-50 rounded-xl text-left"
                    >
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-stone-800">
                          Envío {shipping === 0 ? 'Gratis' : 'Estándar'}
                        </p>
                        <p className="text-sm text-stone-600">
                          {shipping === 0
                            ? '¡Envío gratis por compra mayor a $500!'
                            : '3-5 días hábiles'}
                        </p>
                      </div>
                      <p className="font-bold text-stone-800">
                        {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                      </p>
                    </button>

                    {shipping > 0 && (
                      <button
                        onClick={() => {
                          // Would set express shipping
                          setStep(3);
                        }}
                        className="w-full flex items-center gap-4 p-4 border-2 border-stone-200 hover:border-amber-300 rounded-xl text-left transition-colors"
                      >
                        <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-stone-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-stone-800">Envío Express</p>
                          <p className="text-sm text-stone-600">1-2 días hábiles</p>
                        </div>
                        <p className="font-bold text-stone-800">$99.99</p>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-stone-800 mb-6">
                    Método de Pago
                  </h2>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-sm">Tarjeta</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                        paymentMethod === 'paypal'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <Wallet className="w-6 h-6" />
                      <span className="text-sm">PayPal</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('oxxo')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                        paymentMethod === 'oxxo'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <Store className="w-6 h-6" />
                      <span className="text-sm">Oxxo</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Continuar de forma segura
                      </Button>
                    </form>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="text-center py-8">
                      <p className="text-stone-600 mb-4">
                        Serás redirigido a PayPal para completar tu pago
                      </p>
                      <Button
                        onClick={() => setStep(4)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-6"
                      >
                        Continuar con PayPal
                      </Button>
                    </div>
                  )}

                  {paymentMethod === 'oxxo' && (
                    <div className="text-center py-8">
                      <p className="text-stone-600 mb-4">
                        Generaremos una ficha de pago para que pagues en cualquier Oxxo
                      </p>
                      <Button
                        onClick={() => setStep(4)}
                        className="bg-amber-600 hover:bg-amber-700 text-white py-6"
                      >
                        Generar Ficha de Pago
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-stone-800 mb-6">
                    Revisar Pedido
                  </h2>

                  {/* Shipping Info */}
                  <div className="bg-stone-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-stone-800">Dirección de Envío</p>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-amber-600 hover:underline"
                      >
                        Editar
                      </button>
                    </div>
                    <p className="text-stone-600">
                      {shippingInfo?.firstName} {shippingInfo?.lastName}<br />
                      {shippingInfo?.address}<br />
                      {shippingInfo?.city}, {shippingInfo?.state} {shippingInfo?.zipCode}<br />
                      {shippingInfo?.email}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-stone-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-stone-800">Método de Pago</p>
                      <button
                        onClick={() => setStep(3)}
                        className="text-sm text-amber-600 hover:underline"
                      >
                        Editar
                      </button>
                    </div>
                    <p className="text-stone-600 capitalize">
                      {paymentMethod === 'card' && 'Tarjeta de Crédito/Débito'}
                      {paymentMethod === 'paypal' && 'PayPal'}
                      {paymentMethod === 'oxxo' && 'Pago en Oxxo'}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-stone-800">{item.product.name}</p>
                          <p className="text-sm text-stone-500">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-800">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Completar Pedido - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-stone-800 mb-4">Resumen del Pedido</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-stone-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                {discountCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">{discountCode}</span>
                    </div>
                    <button onClick={removeDiscount}>
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de descuento"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={!discountInput}
                    >
                      Aplicar
                    </Button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-stone-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Envío</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">IVA (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Descuento</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-stone-200 pt-2">
                  <span>Total</span>
                  <span className="text-amber-700">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-stone-500">
                <Shield className="w-4 h-4" />
                <span>Pago seguro con encriptación SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
