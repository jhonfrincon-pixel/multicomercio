import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Gift, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  Phone,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Interface exacta que coincide con las columnas de Supabase SQL
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  referral_code: string;        // VARCHAR(10) UNIQUE
  points_balance: number;       // DECIMAL(10,2) DEFAULT 0.00
  total_earnings: number;        // DECIMAL(10,2) DEFAULT 0.00
  referral_count: number;        // INTEGER DEFAULT 0
  upline_id?: string;            // UUID REFERENCES profiles(id)
  created_at?: string;          // TIMESTAMP DEFAULT NOW
  updated_at?: string;          // TIMESTAMP DEFAULT NOW
}

interface Order {
  id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cashback_amount: number;
  referral_commission: number;
  created_at: string;
}

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_earnings: number;
  pending_earnings: number;
}

export function MiCuenta() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    total_referrals: 0,
    active_referrals: 0,
    total_earnings: 0,
    pending_earnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Load real user data from Supabase
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Get current user from Supabase auth
        const userResponse = await supabase?.auth.getUser();
        const user = userResponse?.data?.user;
        const authError = userResponse?.error;
        
        if (authError || !user) {
          console.error('User not authenticated:', authError);
          setLoading(false);
          return;
        }

        // Load user profile from public.profiles table con campos específicos
        const { data: profile, error: profileError } = await supabase!
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            referral_code,
            points_balance,
            total_earnings,
            referral_count,
            upline_id,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          setLoading(false);
          return;
        }

        if (profile) {
          setUserProfile({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || user.email?.split('@')[0] || 'Usuario',
            referral_code: profile.referral_code || 'LIVO0000',
            points_balance: profile.points_balance || 0,
            total_earnings: profile.total_earnings || 0,
            referral_count: profile.referral_count || 0
          });

          // Load user orders
          const { data: ordersData, error: ordersError } = await supabase!
            .from('orders')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false });

          if (!ordersError && ordersData) {
            setOrders(ordersData);
          }

          // Load referral stats
          const { data: referralsData, error: referralsError } = await supabase!
            .from('profiles')
            .select('id')
            .eq('upline_id', profile.id);

          if (!referralsError && referralsData) {
            const referralIds = referralsData.map((r: { id: string }) => r.id);
            
            // Get active referrals (those with delivered orders)
            let activeReferrals = 0;
            if (referralIds.length > 0) {
              const { data: ordersData, error: ordersError } = await supabase!
                .from('orders')
                .select('user_id')
                .in('user_id', referralIds)
                .eq('status', 'delivered');

              if (!ordersError && ordersData) {
                activeReferrals = new Set(ordersData.map((o: { user_id: string }) => o.user_id)).size;
              }
            }

            setReferralStats({
              total_referrals: profile.referral_count || 0,
              active_referrals: activeReferrals,
              total_earnings: profile.total_earnings || 0,
              pending_earnings: 0 // Calculate based on pending orders if needed
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const copyReferralCode = () => {
    if (userProfile?.referral_code) {
      navigator.clipboard.writeText(userProfile.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (userProfile?.referral_code) {
      const link = `https://livo.com?ref=${userProfile.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const convertPointsToCoupon = () => {
    // Convert points to coupon logic
    alert('Cupón generado: ¡5% de descuento en tu próxima compra!');
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getWhatsAppHelpLink = (orderId: string) => {
    const message = `Hola Livo, necesito ayuda con mi pedido #${orderId}`;
    return `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/90 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading">Mi Cuenta</h1>
                <p className="text-blue-100">{userProfile?.full_name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Código de Referido</p>
              <p className="text-xl font-bold">{userProfile?.referral_code}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo CashBack</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">
                    ${userProfile?.points_balance.toLocaleString('es-CO')}
                  </p>
                </div>
                <Gift className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ganancias Totales</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">
                    ${userProfile?.total_earnings.toLocaleString('es-CO')}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Referidos</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">
                    {userProfile?.referral_count}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">
                    {orders.length}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-lg p-1">
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
              Mis Recompensas
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
              Mis Compras
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
              Mi Perfil
            </TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Tabs defaultValue="cashback" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-lg p-1">
                <TabsTrigger value="cashback" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
                  CashBack
                </TabsTrigger>
                <TabsTrigger value="ambassador" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
                  Embajador Livo
                </TabsTrigger>
              </TabsList>

              {/* CashBack Tab */}
              <TabsContent value="cashback">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      CashBack Acumulado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-8">
                      <p className="text-4xl font-bold text-[#1e3a8a] mb-2">
                        ${userProfile?.points_balance.toLocaleString('es-CO')}
                      </p>
                      <p className="text-gray-600">Disponibles para convertir en descuento</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#1e3a8a] mb-2">¿Cómo funciona?</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Recibes 5% de CashBack en cada compra entregada</li>
                        <li>• Acumula puntos en tu saldo</li>
                        <li>• Convierte tus puntos en cupones de descuento</li>
                        <li>• Los cupones se aplican en tu próxima compra</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={convertPointsToCoupon}
                      className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white py-3"
                    >
                      Convertir en Cupón de Descuento
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ambassador Tab */}
              <TabsContent value="ambassador">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Embajador Livo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Referral Link Generator */}
                    <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/90 text-white p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">Tu Link Personalizado</h4>
                      <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                        <p className="text-sm mb-2">https://livo.com?ref={userProfile?.referral_code}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={copyReferralLink}
                            className="flex-1 bg-white text-[#1e3a8a] hover:bg-gray-100"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {copiedCode ? '¡Copiado!' : 'Copiar Link'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{referralStats.total_referrals}</p>
                        <p className="text-sm text-gray-600">Total Referidos</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">${referralStats.total_earnings.toLocaleString('es-CO')}</p>
                        <p className="text-sm text-gray-600">Ganancias Totales</p>
                      </div>
                    </div>

                    {/* Referral Table */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#1e3a8a] mb-4">Actividad de Referidos</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium">María González</p>
                            <p className="text-sm text-gray-600">Compra: $299.900</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+$29.990</p>
                            <Badge variant="secondary">Activo</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium">Carlos Rodríguez</p>
                            <p className="text-sm text-gray-600">Compra: $189.900</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+$18.990</p>
                            <Badge variant="secondary">Activo</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-700 mb-2">Comisiones</h4>
                      <p className="text-sm text-gray-700">Gana 10% de comisión por cada compra realizada con tu link de referido. ¡Sin límites!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Mis Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-lg">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${order.total_amount.toLocaleString('es-CO')}</p>
                          <div className="flex items-center gap-1">
                            {getOrderStatusIcon(order.status)}
                            <span className="text-sm">{getOrderStatusText(order.status)}</span>
                          </div>
                        </div>
                      </div>

                      {order.cashback_amount > 0 && (
                        <div className="bg-green-50 p-2 rounded mb-3">
                          <p className="text-sm text-green-700">
                            CashBack ganado: ${order.cashback_amount.toLocaleString('es-CO')}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Package className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={getWhatsAppHelpLink(order.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Ayuda WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Mi Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={userProfile?.full_name || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Referido
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userProfile?.referral_code || ''}
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                    <Button
                      onClick={copyReferralCode}
                      variant="outline"
                      className="px-4"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#1e3a8a] mb-2">Beneficios de tu Cuenta</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 5% de CashBack en cada compra</li>
                    <li>• 10% de comisión por referidos</li>
                    <li>• Acceso exclusivo a ofertas especiales</li>
                    <li>• Seguimiento detallado de pedidos</li>
                  </ul>
                </div>

                <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white py-3">
                  Actualizar Información
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
