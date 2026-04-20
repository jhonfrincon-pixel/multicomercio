import { useCartStore } from '@/store/cartStore';
import { useNavigationStore } from '@/store/navigationStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { goToHome, goToCheckout } = useNavigationStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 49.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-stone-600 mb-8">
              Explora nuestro catálogo y encuentra productos increíbles para tu hogar.
            </p>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={goToHome}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Tu Carrito</h1>
          <button
            onClick={goToHome}
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm text-amber-600 font-medium">
                            {item.product.category}
                          </span>
                          <h3 className="font-semibold text-stone-800">
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success('Producto eliminado');
                          }}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-sm text-stone-500 line-clamp-1 mb-4">
                        {item.product.shortDescription}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-lg font-bold text-stone-800">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-sm text-stone-500 block">
                            ${item.product.price.toFixed(2)} c/u
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart();
                toast.success('Carrito vaciado');
              }}
              className="text-stone-500 hover:text-red-500 text-sm transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Envío</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-stone-500">
                    Te faltan ${(500 - subtotal).toFixed(2)} para envío gratis
                  </p>
                )}
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-stone-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 rounded-xl mb-4"
                onClick={goToCheckout}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceder al Pago
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Envío seguro
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Pago protegido
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
