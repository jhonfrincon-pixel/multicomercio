import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { isSupabaseConfigured } from '@/lib/supabase';

export function CRMAccessGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login } = useCRMAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Acceso autorizado al CRM');
      navigate('/crm');
      setPassword('');
      setIsSubmitting(false);
      return;
    }

    toast.error(result.message ?? 'Credenciales incorrectas');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-stone-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle>Acceso privado CRM</CardTitle>
          <CardDescription>
            Ingresa con tus credenciales de administrador para abrir el panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crm-email">Correo</Label>
              <Input
                id="crm-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu-correo@dominio.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm-password">Contraseña</Label>
              <Input
                id="crm-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
              <Lock className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Validando...' : 'Entrar al CRM'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
              Volver a la tienda
            </Button>
          </form>
          <p className="text-xs text-stone-500 mt-4">
            Tip: puedes abrir esta pantalla con el atajo <span className="font-medium">Ctrl + Shift + A</span>.
          </p>
          {!isSupabaseConfigured && (
            <p className="text-xs text-amber-700 mt-2">
              Supabase no está configurado. Se usa acceso local temporal con variables `VITE_ADMIN_EMAIL` y `VITE_ADMIN_PASSWORD`.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
