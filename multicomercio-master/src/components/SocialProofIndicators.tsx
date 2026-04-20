import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShoppingCart, Users, TrendingUp, Flame } from 'lucide-react';

interface SocialProofIndicatorsProps {
  productId: string;
  stock?: number;
  isOnSale?: boolean;
}

// Generate pseudo-random but consistent numbers based on productId
const getProductHash = (productId: string): number => {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export function SocialProofIndicators({ productId, stock = 15, isOnSale = false }: SocialProofIndicatorsProps) {
  const [viewers, setViewers] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showPurchaseNotification, setShowPurchaseNotification] = useState(false);

  const hash = getProductHash(productId);

  useEffect(() => {
    // Set initial values based on product hash
    const baseViewers = 5 + (hash % 20); // 5-25 viewers
    const basePurchases = 2 + (hash % 8); // 2-10 recent purchases
    
    setViewers(baseViewers);
    setRecentPurchases(basePurchases);

    // Random viewers fluctuation
    const viewersInterval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(3, Math.min(30, newValue));
      });
    }, 5000);

    // Purchase notifications
    const purchaseInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowPurchaseNotification(true);
        setRecentPurchases((prev) => prev + 1);
        setTimeout(() => setShowPurchaseNotification(false), 4000);
      }
    }, 15000);

    return () => {
      clearInterval(viewersInterval);
      clearInterval(purchaseInterval);
    };
  }, [productId, hash]);

  // Countdown timer for sales
  useEffect(() => {
    if (!isOnSale) return;

    // Set end time to 24 hours from now based on product hash
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    endTime.setMinutes(endTime.getMinutes() + (hash % 60));

    const timerInterval = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timerInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [productId, isOnSale, hash]);

  // Determine stock level indicator
  const getStockLevel = () => {
    if (stock <= 3) return { level: 'critical', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    if (stock <= 8) return { level: 'low', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { level: 'normal', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  };

  const stockInfo = getStockLevel();

  return (
    <div className="space-y-3">
      {/* Live Viewers */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <Eye className="w-4 h-4 text-stone-500" />
        <span className="text-stone-600">
          <strong className="text-stone-800">{viewers}</strong> personas viendo este producto
        </span>
      </motion.div>

      {/* Stock Indicator */}
      {stock <= 8 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 p-3 rounded-xl ${stockInfo.bgColor} border ${stockInfo.borderColor}`}
        >
          <TrendingUp className={`w-4 h-4 ${stockInfo.color}`} />
          <span className={`text-sm font-medium ${stockInfo.color}`}>
            ¡Solo quedan <strong>{stock}</strong> unidades disponibles!
          </span>
        </motion.div>
      )}

      {/* Sale Countdown */}
      {isOnSale && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">
            Oferta termina en:{' '}
            <strong className="font-mono">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </strong>
          </span>
        </motion.div>
      )}

      {/* Recent Purchases Notification */}
      <AnimatePresence>
        {showPurchaseNotification && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200"
          >
            <ShoppingCart className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              ¡Alguien acaba de comprar este producto!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total Sold */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Users className="w-4 h-4" />
        <span>
          <strong className="text-stone-700">{50 + recentPurchases}</strong> vendidos en los últimos 30 días
        </span>
      </div>
    </div>
  );
}

// Compact version for product cards
export function SocialProofBadge({ productId }: { productId: string }) {
  const [viewers, setViewers] = useState(0);
  const hash = getProductHash(productId);

  useEffect(() => {
    setViewers(5 + (hash % 15));
    
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(25, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [productId, hash]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-500">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
      </span>
      <span>{viewers} viendo</span>
    </div>
  );
}
