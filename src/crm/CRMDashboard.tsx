import { useState } from 'react';
import { useNavigationStore } from '@/store/navigationStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Zap,
  Mail,
  BarChart3,
  Settings,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  UserPlus,
  ChevronRight,
  Search,
  Filter,
  Edit,
  Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', name: 'Clientes', icon: Users },
  { id: 'orders', name: 'Pedidos', icon: ShoppingBag },
  { id: 'automations', name: 'Automatizaciones', icon: Zap },
  { id: 'campaigns', name: 'Campañas', icon: Mail },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'settings', name: 'Configuración', icon: Settings },
];

// Mock data for charts
const salesData = [
  { name: 'Ene', sales: 4500 },
  { name: 'Feb', sales: 5200 },
  { name: 'Mar', sales: 4800 },
  { name: 'Abr', sales: 6100 },
  { name: 'May', sales: 7200 },
  { name: 'Jun', sales: 8500 },
];

const categoryData = [
  { name: 'Muebles', value: 35, color: '#d97706' },
  { name: 'Iluminación', value: 25, color: '#f59e0b' },
  { name: 'Cocina', value: 20, color: '#fbbf24' },
  { name: 'Decoración', value: 15, color: '#fcd34d' },
  { name: 'Electro', value: 5, color: '#fde68a' },
];

export function CRMDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { goToHome } = useNavigationStore();
  const { orders, getMetrics: getOrderMetrics } = useOrdersStore();
  const { customers, automations, campaigns, getCustomerMetrics } = useCRMStore();

  const orderMetrics = getOrderMetrics();
  const customerMetrics = getCustomerMetrics();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview orderMetrics={orderMetrics} customerMetrics={customerMetrics} />;
      case 'customers':
        return <CustomersSection customers={customers} />;
      case 'orders':
        return <OrdersSection orders={orders} />;
      case 'automations':
        return <AutomationsSection automations={automations} />;
      case 'campaigns':
        return <CampaignsSection campaigns={campaigns} />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview orderMetrics={orderMetrics} customerMetrics={customerMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex-shrink-0">
        <div className="p-6">
          <button
            onClick={goToHome}
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver a la tienda</span>
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-stone-800">CRM</h1>
              <p className="text-xs text-stone-500">HogarElegante</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="font-semibold text-stone-600">A</span>
            </div>
            <div>
              <p className="font-medium text-stone-800">Admin</p>
              <p className="text-xs text-stone-500">admin@hogarelegante.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ 
  orderMetrics, 
  customerMetrics 
}: { 
  orderMetrics: ReturnType<ReturnType<typeof useOrdersStore['getState']>['getMetrics']>;
  customerMetrics: ReturnType<ReturnType<typeof useCRMStore['getState']>['getCustomerMetrics']>;
}) {
  const { orders } = useOrdersStore();
  const stats = [
    {
      title: 'Ventas Totales',
      value: `$${orderMetrics.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Pedidos',
      value: orderMetrics.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Clientes',
      value: customerMetrics.totalCustomers.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Ticket Promedio',
      value: `$${orderMetrics.averageOrderValue.toFixed(2)}`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Dashboard</h2>
        <p className="text-stone-600">Resumen de tu tienda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-stone-500 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-stone-400">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ fill: '#d97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-stone-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos Recientes</CardTitle>
          <Button variant="ghost" size="sm">
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Orden</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.shippingInfo.email}</td>
                    <td className="py-3 px-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={`
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                      `}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Customers Section
function CustomersSection({ customers }: { customers: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Clientes</h2>
          <p className="text-stone-600">Gestiona tus clientes</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input placeholder="Buscar clientes..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Pedidos</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Total Gastado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      No hay clientes registrados aún
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-stone-600">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{customer.totalOrders}</td>
                      <td className="py-3 px-4 font-medium">${customer.totalSpent.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge className={`
                          ${customer.status === 'vip' ? 'bg-purple-100 text-purple-700' : ''}
                          ${customer.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                          ${customer.status === 'inactive' ? 'bg-stone-100 text-stone-700' : ''}
                        `}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Orders Section
function OrdersSection({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Pedidos</h2>
          <p className="text-stone-600">Gestiona los pedidos de tu tienda</p>
        </div>
        <Button variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input placeholder="Buscar pedidos..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Orden</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No hay pedidos aún
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.shippingInfo.email}</td>
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{order.items.length}</td>
                      <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge className={`
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                          ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Automations Section
function AutomationsSection({ automations }: { automations: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Automatizaciones</h2>
          <p className="text-stone-600">Crea flujos automáticos para tu tienda</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Zap className="w-4 h-4 mr-2" />
          Nueva Automatización
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {automations.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">
                No tienes automatizaciones
              </h3>
              <p className="text-stone-500 mb-4">
                Crea tu primera automatización para ahorrar tiempo
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Crear Automatización
              </Button>
            </CardContent>
          </Card>
        ) : (
          automations.map((automation) => (
            <Card key={automation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-stone-800">{automation.name}</h3>
                    <p className="text-sm text-stone-500">Trigger: {automation.trigger}</p>
                  </div>
                  <Badge className={automation.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}>
                    {automation.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span>Ejecutada {automation.runCount} veces</span>
                  {automation.lastRun && (
                    <span>Última: {new Date(automation.lastRun).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Campaigns Section
function CampaignsSection({ campaigns }: { campaigns: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Campañas de Email</h2>
          <p className="text-stone-600">Gestiona tus campañas de marketing</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Mail className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">
                No tienes campañas
              </h3>
              <p className="text-stone-500 mb-4">
                Crea tu primera campaña de email marketing
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Crear Campaña
              </Button>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-stone-800">{campaign.name}</h3>
                    <p className="text-sm text-stone-500">{campaign.subject}</p>
                  </div>
                  <Badge className={`
                    ${campaign.status === 'sent' ? 'bg-green-100 text-green-700' : ''}
                    ${campaign.status === 'draft' ? 'bg-stone-100 text-stone-700' : ''}
                    ${campaign.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : ''}
                  `}>
                    {campaign.status}
                  </Badge>
                </div>
                {campaign.openRate && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-stone-600">Apertura: {campaign.openRate}%</span>
                    <span className="text-stone-600">Clicks: {campaign.clickRate}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Analytics Section
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Analytics</h2>
        <p className="text-stone-600">Análisis detallado de tu tienda</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tráfico del Sitio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="sales" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <span className="text-stone-600">Visitas</span>
              <span className="font-bold text-stone-800">12,450</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <span className="text-stone-600">Carritos Creados</span>
              <span className="font-bold text-stone-800">3,210</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <span className="text-stone-600">Compras Completadas</span>
              <span className="font-bold text-stone-800">892</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <span className="text-stone-600">Tasa de Conversión</span>
              <span className="font-bold text-amber-700">7.16%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Configuración</h2>
        <p className="text-stone-600">Configura tu tienda</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de la Tienda</Label>
              <Input defaultValue="HogarElegante" />
            </div>
            <div>
              <Label>Email de Contacto</Label>
              <Input defaultValue="hola@hogarelegante.com" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input defaultValue="+52 (55) 1234-5678" />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Envío Gratis Desde</Label>
              <Input defaultValue="500" prefix="$" />
            </div>
            <div>
              <Label>Costo de Envío Estándar</Label>
              <Input defaultValue="49.99" prefix="$" />
            </div>
            <div>
              <Label>Costo de Envío Express</Label>
              <Input defaultValue="99.99" prefix="$" />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Label } from '@/components/ui/label';
