import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCRMAuthStore } from '@/store/crmAuthStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AuthService } from '@/lib/auth-service';
import { CRMDashboard } from './CRMDashboard';

export function CRMAccessGate() {
  const [view, setView] = useState<'login' | 'forgot-password' | 'update-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login, isAuthenticated } = useCRMAuthStore();

  // Detectar si venimos de un enlace de recuperación de contraseña
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('update-password');
    }
  }, []);

  // Si está autenticado y no estamos restableciendo contraseña, mostrar el dashboard
  if (isAuthenticated && view !== 'update-password') {
    return <CRMDashboard />;
  }

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Ingresa tu correo electrónico');
      return;
    }
    setIsSubmitting(true);
    const result = await AuthService.resetPassword(email);
    if (result.success) {
      toast.success('Correo enviado. Revisa tu bandeja de entrada.');
      setView('login');
    } else {
      toast.error(result.error || 'Error al enviar el correo');
    }
    setIsSubmitting(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setIsSubmitting(true);
    
    if (!supabase) {
      toast.error('El servicio de base de datos no está disponible');
      setIsSubmitting(false);
      return;
    }

    const client = supabase;
    const { error } = await client.auth.updateUser({ password });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Contraseña actualizada con éxito');
      setView('login');
      navigate('/crm', { replace: true });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-stone-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            {view === 'update-password' ? <Lock className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <CardTitle>
            {view === 'login' && 'Acceso privado CRM'}
            {view === 'forgot-password' && 'Recuperar Contraseña'}
            {view === 'update-password' && 'Nueva Contraseña'}
          </CardTitle>
          <CardDescription>
            {view === 'login' && 'Ingresa con tus credenciales de administrador para abrir el panel.'}
            {view === 'forgot-password' && 'Te enviaremos un enlace a tu correo para restablecer tu contraseña.'}
            {view === 'update-password' && 'Establece tu nueva contraseña para el acceso administrativo.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crm-email">Correo</Label>
                <Input
                  id="crm-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@livo.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="crm-password">Contraseña</Label>
                  <button 
                    type="button" 
                    onClick={() => setView('forgot-password')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Input
                  id="crm-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
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
          )}

          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Correo electrónico</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-correo@dominio.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setView('login')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </form>
          )}

          {view === 'update-password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </form>
          )}

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
