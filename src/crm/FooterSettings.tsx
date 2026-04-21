import { useEffect, useState } from 'react';
import { Save, ArrowLeft, Link, MapPin, Phone, Mail } from 'lucide-react';
import { useFooterSettingsStore } from '@/store/footerSettingsStore';
import { useNavigationStore } from '@/store/navigationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export function FooterSettings() {
  const { settings, isLoading, error, loadSettings, updateSettings } = useFooterSettingsStore();
  const { goToCRM } = useNavigationStore();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    quick_links: {
      enlaces_rapidos: '#',
      sobre_nosotros: '#',
      catalogo_productos: '#',
      ofertas_especiales: '#',
      blog_decoracion: '#',
      preguntas_frecuentes: '#',
      atencion_cliente: '#',
      mi_cuenta: '#',
      seguimiento_pedidos: '#',
      politica_devoluciones: '#',
      terminos_condiciones: '#',
      politica_privacidad: '#',
      contacto: '#',
    },
    contact_info: {
      direccion: 'Av. Principal 1234',
      telefono: '+52 (55) 1234-5678',
      email: 'hola@livo.com',
    },
  });

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings && settings.quick_links && settings.contact_info) {
      setFormData({
        quick_links: {
          enlaces_rapidos: settings.quick_links.enlaces_rapidos || '#',
          sobre_nosotros: settings.quick_links.sobre_nosotros || '#',
          catalogo_productos: settings.quick_links.catalogo_productos || '#',
          ofertas_especiales: settings.quick_links.ofertas_especiales || '#',
          blog_decoracion: settings.quick_links.blog_decoracion || '#',
          preguntas_frecuentes: settings.quick_links.preguntas_frecuentes || '#',
          atencion_cliente: settings.quick_links.atencion_cliente || '#',
          mi_cuenta: settings.quick_links.mi_cuenta || '#',
          seguimiento_pedidos: settings.quick_links.seguimiento_pedidos || '#',
          politica_devoluciones: settings.quick_links.politica_devoluciones || '',
          terminos_condiciones: settings.quick_links.terminos_condiciones || '',
          politica_privacidad: settings.quick_links.politica_privacidad || '',
          contacto: settings.quick_links.contacto || '#',
        },
        contact_info: {
          direccion: settings.contact_info.direccion || 'Av. Principal 1234',
          telefono: settings.contact_info.telefono || '+52 (55) 1234-5678',
          email: settings.contact_info.email || 'hola@livo.com',
        },
      });
    }
  }, [settings]);

  const handleInputChange = (section: 'quick_links' | 'contact_info', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      setHasChanges(false);
      toast.success('Configuración del footer actualizada correctamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
        goToCRM('dashboard');
      }
    } else {
      goToCRM('dashboard');
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Configuración de Footer</h1>
            <p className="text-stone-600">Edita los enlaces e información de contacto del footer</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isLoading}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enlaces Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5 text-amber-600" />
              Enlaces Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="enlaces_rapidos">Enlaces Rápidos</Label>
                <Input
                  id="enlaces_rapidos"
                  value={formData.quick_links.enlaces_rapidos}
                  onChange={(e) => handleInputChange('quick_links', 'enlaces_rapidos', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="sobre_nosotros">Sobre Nosotros</Label>
                <Input
                  id="sobre_nosotros"
                  value={formData.quick_links.sobre_nosotros}
                  onChange={(e) => handleInputChange('quick_links', 'sobre_nosotros', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="catalogo_productos">Catálogo de Productos</Label>
                <Input
                  id="catalogo_productos"
                  value={formData.quick_links.catalogo_productos}
                  onChange={(e) => handleInputChange('quick_links', 'catalogo_productos', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="ofertas_especiales">Ofertas Especiales</Label>
                <Input
                  id="ofertas_especiales"
                  value={formData.quick_links.ofertas_especiales}
                  onChange={(e) => handleInputChange('quick_links', 'ofertas_especiales', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="blog_decoracion">Blog de Decoración</Label>
                <Input
                  id="blog_decoracion"
                  value={formData.quick_links.blog_decoracion}
                  onChange={(e) => handleInputChange('quick_links', 'blog_decoracion', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="preguntas_frecuentes">Preguntas Frecuentes</Label>
                <Input
                  id="preguntas_frecuentes"
                  value={formData.quick_links.preguntas_frecuentes}
                  onChange={(e) => handleInputChange('quick_links', 'preguntas_frecuentes', e.target.value)}
                  placeholder="#"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Más Enlaces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5 text-amber-600" />
              Más Enlaces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="atencion_cliente">Atención al Cliente</Label>
                <Input
                  id="atencion_cliente"
                  value={formData.quick_links.atencion_cliente}
                  onChange={(e) => handleInputChange('quick_links', 'atencion_cliente', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="mi_cuenta">Mi Cuenta</Label>
                <Input
                  id="mi_cuenta"
                  value={formData.quick_links.mi_cuenta}
                  onChange={(e) => handleInputChange('quick_links', 'mi_cuenta', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="seguimiento_pedidos">Seguimiento de Pedidos</Label>
                <Input
                  id="seguimiento_pedidos"
                  value={formData.quick_links.seguimiento_pedidos}
                  onChange={(e) => handleInputChange('quick_links', 'seguimiento_pedidos', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="politica_devoluciones">Política de Devoluciones</Label>
                <Input
                  id="politica_devoluciones"
                  value={formData.quick_links.politica_devoluciones}
                  onChange={(e) => handleInputChange('quick_links', 'politica_devoluciones', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="terminos_condiciones">Términos y Condiciones</Label>
                <Input
                  id="terminos_condiciones"
                  value={formData.quick_links.terminos_condiciones}
                  onChange={(e) => handleInputChange('quick_links', 'terminos_condiciones', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="politica_privacidad">Política de Privacidad</Label>
                <Input
                  id="politica_privacidad"
                  value={formData.quick_links.politica_privacidad}
                  onChange={(e) => handleInputChange('quick_links', 'politica_privacidad', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div>
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.quick_links.contacto}
                  onChange={(e) => handleInputChange('quick_links', 'contacto', e.target.value)}
                  placeholder="#"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="direccion" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </Label>
                <Textarea
                  id="direccion"
                  value={formData.contact_info.direccion}
                  onChange={(e) => handleInputChange('contact_info', 'direccion', e.target.value)}
                  placeholder="Av. Principal 1234"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="telefono" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={formData.contact_info.telefono}
                  onChange={(e) => handleInputChange('contact_info', 'telefono', e.target.value)}
                  placeholder="+52 (55) 1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_info.email}
                  onChange={(e) => handleInputChange('contact_info', 'email', e.target.value)}
                  placeholder="hola@livo.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
