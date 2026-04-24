import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth-service';
import { Gift, User, Mail, Lock, CheckCircle } from 'lucide-react';

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🎯 Capturar código de referido del sessionStorage (persistencia entre páginas)
  const referralCode = AuthService.getReferralCodeFromStorage();
  const hasReferralCode = AuthService.hasValidReferralCode();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    
    if (!formData.password) {
      setError('La contraseña es requerida');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (!formData.fullName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 🎯 Llamar a AuthService con captura automática de referido desde sessionStorage
      const result = await AuthService.signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim()
        // referralCode se captura automáticamente del sessionStorage
      });
      
      if (result.success) {
        setSuccess(true);
        
        // 🎯 El trigger de la BD asignará automáticamente:
        // - $10,000 de bono de bienvenida en points_balance
        // - Código de referido único
        // - upline_id si hay referral_code en sessionStorage
        
        // 🔄 Redirigir a Mi Cuenta usando react-router
        setTimeout(() => {
          navigate('/mi-cuenta');
        }, 3000);
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Registro Exitoso!
          </h3>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada con éxito
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-green-700">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">
                ¡$10,000 de bono de bienvenida!
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Han sido agregados a tu saldo CashBack
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirigiendo al inicio...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#1e3a8a]">
          Crear Cuenta Livo
        </CardTitle>
        <p className="text-gray-600">
          Únete y obtén beneficios exclusivos
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 🎯 Banner de referido si hay código */}
        {hasReferralCode && (
          <Alert className="bg-blue-50 border-blue-200">
            <Gift className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>¡Bienvenido por referido!</strong><br />
              Estás registrándote con el código: <span className="font-mono bg-white px-2 py-1 rounded">{referralCode}</span>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Nombre Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>
          
          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>
          
          {/* Error */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white py-3"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </form>
        
        {/* Beneficios */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Beneficios al Registrarte
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• $10,000 de bono de bienvenida</li>
            <li>• 5% de CashBack en cada compra</li>
            <li>• 10% de comisión por referidos</li>
            <li>• Acceso a ofertas exclusivas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
