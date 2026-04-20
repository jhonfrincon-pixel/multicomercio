import { useEffect, useState, useRef } from 'react';
import { useNavigationStore } from '@/store/navigationStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useCRMStore } from '@/store/crmStore';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { useProductsStore } from '@/store/productsStore';
import { useBrandStore } from '../store/brandStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Zap,
  Mail,
  BarChart3,
  Settings,
  Palette,
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
  LogOut,
  Plus,
  X,
  Trash2,
  Copy,
  ImagePlus,
  Download,
  Upload,
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
  { id: 'inventory', name: 'Inventario', icon: Package },
  { id: 'automations', name: 'Automatizaciones', icon: Zap },
  { id: 'campaigns', name: 'Campañas', icon: Mail },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'branding', name: 'Personalización', icon: Palette },
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
  const { logout, userEmail } = useCRMAuthStore();
  const { orders, fetchOrders, getMetrics: getOrderMetrics } = useOrdersStore();
  const { customers, automations, campaigns, loadCRMData, getCustomerMetrics } = useCRMStore();
  const { products } = useProductsStore();
  const { config: brand } = useBrandStore();


  // Estado para evitar notificaciones repetidas en la misma sesión
  const [notifiedProducts, setNotifiedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
    loadCRMData();
  }, [fetchOrders, loadCRMData]);

  // Lógica de Automatización: Notificación Push y In-App para Stock Bajo
  useEffect(() => {
    // Solicitar permiso para notificaciones push reales
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    products.forEach(product => {
      if (product.inStock < 5 && !notifiedProducts.has(product.id)) {
        // 1. Notificación In-App (Toast)
        toast.error(`¡Alerta de Stock Crítico!`, {
          description: `El producto "${product.name}" solo tiene ${product.inStock} unidades disponibles.`,
          duration: 10000,
          action: {
            label: 'Ver Inventario',
            onClick: () => setActiveSection('inventory')
          }
        });

        // 2. Notificación Push del Navegador
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⚠️ Alerta de Inventario", {
            body: `Stock bajo: ${product.name} (${product.inStock} un.)`,
            icon: product.images[0]
          });
        }

        setNotifiedProducts(prev => new Set(prev).add(product.id));
      }
    });
  }, [products, notifiedProducts]);

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
      case 'inventory':
        return <InventorySection />;
      case 'automations':
        return <AutomationsSection automations={automations} products={products} />;
      case 'campaigns':
        return <CampaignsSection campaigns={campaigns} />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'branding':
        return <SettingsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview orderMetrics={orderMetrics} customerMetrics={customerMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 flex-1 overflow-y-auto">
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
              <p className="text-xs text-stone-500">{brand.name}</p>
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

        <div className="p-6 border-t border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="font-semibold text-stone-600">A</span>
            </div>
            <div>
              <p className="font-medium text-stone-800">Admin</p>
              <p className="text-xs text-stone-500">{userEmail ?? 'admin@livo.com'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={async () => {
              await logout();
              goToHome();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión CRM
          </Button>
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

// Inventory Management Section
function InventorySection() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price)) {
      updateProduct(id, { price });
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    setEditingProduct(product);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Categoría', 'Precio', 'Estado', 'Etiqueta'];
    const csvData = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`, // Escapar comillas dobles
      p.category,
      p.price.toFixed(2),
      p.inStock > 0 ? 'En Stock' : 'Agotado',
      p.badge || ''
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Inventario exportado con éxito');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = content.split(/\r?\n/).filter(row => row.trim() !== '');
        
        if (rows.length <= 1) {
          toast.error('El archivo está vacío o no tiene el formato correcto');
          return;
        }

        // Ignorar encabezado y procesar filas
        const dataRows = rows.slice(1);
        let importedCount = 0;

        dataRows.forEach(row => {
          // Regex para separar por comas respetando el contenido entre comillas
          const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          if (columns.length >= 4) {
            const name = columns[1]?.replace(/^"|"$/g, '').replace(/""/g, '"');
            const category = columns[2] || 'Muebles';
            const price = parseFloat(columns[3]) || 0;

            const newProduct: Product = {
              id: `PRD-IMG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: name || 'Producto Importado',
              category: category as any,
              price: price,
              shortDescription: 'Producto cargado mediante importación masiva.',
              description: 'Este producto fue importado masivamente. Por favor, edita los detalles para mejorar su conversión.',
              images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
              features: ['Calidad garantizada', 'Diseño moderno'],
              benefits: [{ title: 'Durabilidad', description: 'Materiales resistentes.', icon: 'shield' }],
              specifications: { 'Estado': 'Nuevo' },
              rating: 5,
              reviewCount: 0,
              reviews: [],
              inStock: columns[4]?.includes('Stock') ? 10 : 0,
              tags: [category.toLowerCase()],
              badge: columns[5]?.replace(/^"|"$/g, '') || undefined
            };

            addProduct(newProduct);
            importedCount++;
          }
        });

        toast.success(`¡Importación completada!`, {
          description: `Se han añadido ${importedCount} productos al inventario.`
        });
      } catch (error) {
        toast.error('Error al procesar el archivo CSV');
        console.error(error);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Inventario</h2>
          <p className="text-stone-600">Gestiona precios, stock y catálogo</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Importar CSV
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Producto
          </Button>
        </div>
      </div>

      {/* Modal para añadir/editar producto */}
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={editingProduct} 
        isEditMode={isEditMode}
      />

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input 
              placeholder="Buscar por nombre o categoría..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Categoría</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Precio ($)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-stone-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{product.category}</td>
                    <td className="py-3 px-4">
                      <Input 
                        type="number" 
                        className="w-24 h-8"
                        defaultValue={product.price}
                        onBlur={(e) => handlePriceChange(product.id, e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${product.inStock < 5 ? 'text-red-600' : 'text-stone-600'}`}>
                        {product.inStock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={product.inStock > 0 ? (product.inStock < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700') : 'bg-red-100 text-red-700'}>
                        {product.inStock === 0 ? 'Agotado' : product.inStock < 5 ? 'Stock Bajo' : 'Disponible'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(product)}>
                          <Edit className="w-4 h-4 text-amber-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(product)}>
                          <Copy className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
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

// Componente Modal de Formulario Profesional
function ProductFormModal({ 
  isOpen, 
  onClose, 
  productToEdit,
  isEditMode
}: { 
  isOpen: boolean; 
  onClose: () => void;
  productToEdit?: Product | null;
  isEditMode: boolean;
}) {
  const { addProduct, updateProduct } = useProductsStore();
  const [images, setImages] = useState<string[]>(['']);
  
  useEffect(() => {
    if (isOpen) {
      setImages(productToEdit ? [...productToEdit.images] : ['']);
    }
  }, [isOpen, productToEdit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: any = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string),
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      images: images.filter(img => img.trim() !== ''),
      badge: formData.get('badge') as string || undefined,
      ...(isEditMode ? {} : {
        id: `PRD-${Date.now()}`,
        features: productToEdit?.features || [
          'Material de alta calidad',
          'Diseño ergonómico exclusivo',
          'Garantía extendida incluida'
        ],
        benefits: productToEdit?.benefits || [
          { title: 'Calidad Premium', description: 'Materiales seleccionados para durar.', icon: 'shield' }
        ],
        specifications: productToEdit?.specifications || {
          'Estado': 'Nuevo',
          'Origen': 'Importado'
        },
        rating: productToEdit?.rating || 5,
        reviewCount: 0,
        reviews: [],
        inStock: 10,
        tags: productToEdit?.tags || [(formData.get('category') as string).toLowerCase()],
      })
    };

    if (productData.originalPrice && productData.price > productData.originalPrice) {
      toast.error('Error de validación', {
        description: 'El precio de venta no puede ser mayor al precio original.',
      });
      return;
    }

    if (isEditMode && productToEdit) {
      updateProduct(productToEdit.id, productData);
      toast.success('¡Producto actualizado con éxito!');
    } else {
      addProduct(productData);
      toast.success(productToEdit ? '¡Variante creada con éxito!' : '¡Producto creado con éxito!');
    }

    onClose();
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, val: string) => {
    const newImgs = [...images];
    newImgs[index] = val;
    setImages(newImgs);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {isEditMode ? 'Editar Producto' : productToEdit ? 'Duplicar Producto' : 'Nuevo Producto'}
                </h3>
                <p className="text-sm text-stone-500">Completa los detalles para publicar en la tienda</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={isEditMode ? productToEdit?.name : productToEdit ? `${productToEdit.name} (Copia)` : ''}
                    placeholder="Ej: Sofá Nórdico Minimal" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select 
                    name="category" 
                    defaultValue={productToEdit?.category || 'Muebles'}
                    className="w-full h-10 px-3 rounded-md border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Muebles">Muebles</option>
                    <option value="Iluminación">Iluminación</option>
                    <option value="Cocina">Cocina</option>
                    <option value="Decoración">Decoración</option>
                    <option value="Electrodomésticos">Electrodomésticos</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    defaultValue={productToEdit?.price} 
                    placeholder="0.00" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Precio Original ($)</Label>
                  <Input 
                    id="originalPrice" 
                    name="originalPrice" 
                    type="number" 
                    step="0.01" 
                    defaultValue={productToEdit?.originalPrice} 
                    placeholder="Opcional" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge (Etiqueta)</Label>
                  <Input 
                    id="badge" 
                    name="badge" 
                    defaultValue={productToEdit?.badge} 
                    placeholder="Ej: Nuevo, -20%" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción Corta (SEO)</Label>
                <Input 
                  id="shortDescription" 
                  name="shortDescription" 
                  defaultValue={productToEdit?.shortDescription} 
                  placeholder="Breve resumen para el catálogo" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Detallada</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={4}
                  defaultValue={productToEdit?.description}
                  className="w-full p-3 rounded-md border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Describe las maravillas de este producto..."
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>URLs de Imágenes</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addImageField} className="text-amber-600 text-xs">
                    <ImagePlus className="w-4 h-4 mr-1" /> Añadir otra
                  </Button>
                </div>
                {images.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={url} onChange={(e) => updateImage(idx, e.target.value)} placeholder="https://unsplash.com/..." required={idx === 0} />
                    {idx > 0 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(idx)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                  {isEditMode ? 'Guardar Cambios' : productToEdit ? 'Crear Variante' : 'Publicar Producto'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
function AutomationsSection({ automations, products }: { automations: any[], products: Product[] }) {
  // Simulamos que la alerta de stock es una automatización de sistema activa
  const systemAutomations = [
    {
      id: 'stock-alert-system',
      name: 'Notificación de Stock Bajo',
      trigger: 'Stock < 5 unidades',
      isActive: true,
      runCount: products.filter(p => p.inStock < 5).length,
      lastRun: new Date().toISOString(),
      isSystem: true
    }
  ];

  const allAutomations = [...systemAutomations, ...automations];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Automatizaciones</h2>
          <p className="text-stone-600">Reglas y flujos de trabajo inteligentes</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Zap className="w-4 h-4 mr-2" />
          Nueva Automatización
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {allAutomations.length === 0 ? (
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
          allAutomations.map((automation) => (
            <Card key={automation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-stone-800">{automation.name}</h3>
                      {automation.isSystem && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Sistema</Badge>}
                    </div>
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
  const { config: brandData, updateBrandConfig } = useBrandStore();
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
              <Input 
                defaultValue={brandData.name} 
                onChange={(e) => updateBrandConfig({ name: e.target.value })}
              />
            </div>
            <div>
              <Label>Eslogan de la Marca</Label>
              <Input defaultValue={brandData.slogan} />
            </div>
            <div>
              <Label>WhatsApp / Contacto</Label>
              <Input defaultValue={brandData.whatsapp} />
            </div>
            <div>
              <Label>Color Primario</Label>
              <Input 
                type="color"
                defaultValue={brandData.primary_color}
                onChange={(e) => updateBrandConfig({ primary_color: e.target.value })}
              />
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
