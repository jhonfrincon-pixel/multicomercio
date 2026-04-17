import { useEffect } from 'react';
import { 
  LayoutGrid, 
  Package, 
  Users, 
  ShoppingBag, 
  Plus, 
  Search,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { useProductsStore } from '@/crm/productsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CRMDashboard() {
  const { products, isLoading, fetchProducts, deleteProduct } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const stats = [
    { title: 'Total Productos', value: products.length, icon: Package, color: 'text-blue-600' },
    { title: 'Ventas Hoy', value: '$0.00', icon: ShoppingBag, color: 'text-green-600' },
    { title: 'Clientes', value: '0', icon: Users, color: 'text-purple-600' },
    { title: 'Stock Bajo', value: products.filter(p => p.stock < 5).length, icon: AlertTriangle, color: 'text-amber-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-stone-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Panel de Control</h1>
          <p className="text-stone-500">Gestiona el inventario y operaciones de HogarElegante</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-stone-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-stone-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventario de Productos</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-stone-400" />
            <input
              placeholder="Buscar producto..."
              className="pl-8 h-9 w-full rounded-md border border-stone-200 bg-white px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-y border-stone-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-stone-400">Cargando productos...</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-900">{product.name}</td>
                    <td className="px-4 py-3 text-stone-600">{product.category}</td>
                    <td className="px-4 py-3 text-stone-600">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-amber-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => deleteProduct(product.id)} variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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