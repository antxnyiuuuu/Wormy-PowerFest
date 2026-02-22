import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mail,
  Phone,
  User,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { FestivalButton } from '../components/ui/FestivalButton';
import { FestivalInput } from '../components/ui/FestivalInput';
import { FestivalCard } from '../components/ui/FestivalCard';
import { registrationService } from '../services';
import {
  validateEcuadorCedula,
  formatEcuadorCedula,
  validateEmail,
  ERROR_MESSAGES,
} from '../utils/validation';

interface FoundUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cedula: string | null;
}

export function ResendQRPage() {
  const [step, setStep] = useState<'search' | 'edit'>('search');
  const [cedula, setCedula] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Handle cedula input with formatting
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEcuadorCedula(e.target.value);
    setCedula(formatted);
    if (cedulaError) {
      setCedulaError('');
    }
  };

  // Search user by cedula
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cedula.trim()) {
      setCedulaError(ERROR_MESSAGES.CEDULA_REQUIRED || 'La cédula es requerida');
      return;
    }

    if (!validateEcuadorCedula(cedula)) {
      setCedulaError(ERROR_MESSAGES.CEDULA_INVALID);
      return;
    }

    setIsSearching(true);
    setCedulaError('');

    try {
      const response = await registrationService.searchByCedula(cedula);

      if (response.success && response.data) {
        setFoundUser(response.data);
        setNewEmail(response.data.email);
        setStep('edit');
      } else {
        setCedulaError('No se encontró ningún registro con esta cédula');
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      setCedulaError('No se encontró ningún registro con esta cédula');
    } finally {
      setIsSearching(false);
    }
  };

  // Resend QR with updated email
  const handleResend = async () => {
    if (!newEmail.trim()) {
      setEmailError(ERROR_MESSAGES.EMAIL_REQUIRED);
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError(ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    if (!foundUser) return;

    setIsResending(true);
    setEmailError('');

    try {
      // Update email if changed
      if (newEmail !== foundUser.email) {
        const updateResponse = await registrationService.updateData(foundUser.id, {
          email: newEmail,
        });

        if (!updateResponse.success) {
          throw new Error('Error al actualizar el correo');
        }
      }

      // Resend QR
      const resendResponse = await registrationService.resendNotifications(foundUser.id);

      if (resendResponse.success) {
        setResendSuccess(true);
      } else {
        throw new Error('Error al reenviar el QR');
      }
    } catch (error) {
      console.error('Error al reenviar QR:', error);
      setEmailError('Error al reenviar el QR. Por favor, intenta de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep('search');
    setCedula('');
    setCedulaError('');
    setFoundUser(null);
    setNewEmail('');
    setEmailError('');
    setResendSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <AnimatePresence mode="wait">
        {step === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-magenta to-violet rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Reenviar QR
              </h1>
              <p className="text-lg text-gray-600">
                Busca tu registro con tu número de cédula
              </p>
            </div>

            <FestivalCard className="border-t-4 border-t-magenta shadow-xl">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <FestivalInput
                    label="Número de Cédula"
                    type="text"
                    placeholder="1234567890"
                    value={cedula}
                    onChange={handleCedulaChange}
                    error={cedulaError}
                    maxLength={10}
                    required
                  />
                  {!cedulaError && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      Ingresa 10 dígitos de tu cédula ecuatoriana
                    </p>
                  )}
                </div>

                <FestivalButton
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isSearching}
                  disabled={isSearching}
                >
                  {isSearching ? 'Buscando...' : 'Buscar Usuario'}
                  <Search className="w-5 h-5 ml-2" />
                </FestivalButton>
              </form>
            </FestivalCard>
          </motion.div>
        )}

        {step === 'edit' && foundUser && !resendSuccess && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet to-magenta rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                ¡Usuario Encontrado!
              </h1>
              <p className="text-lg text-gray-600">
                Hola {foundUser.firstName} {foundUser.lastName}
              </p>
            </div>

            <FestivalCard className="border-t-4 border-t-violet shadow-xl">
              <div className="space-y-6">
                {/* User Info Display */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-magenta" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Nombre Completo
                      </p>
                      <p className="font-bold text-gray-900">
                        {foundUser.firstName} {foundUser.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-violet" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Teléfono
                      </p>
                      <p className="font-bold text-gray-900">{foundUser.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Email Edit Section */}
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Modifica tu correo electrónico para reenviar tu código QR:
                  </p>
                  <FestivalInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailError) {
                        setEmailError('');
                      }
                    }}
                    error={emailError}
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <FestivalButton
                    variant="ghost"
                    onClick={handleReset}
                    disabled={isResending}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </FestivalButton>
                  <FestivalButton
                    onClick={handleResend}
                    isLoading={isResending}
                    disabled={isResending}
                    fullWidth
                  >
                    {isResending ? 'Reenviando...' : 'Reenviar QR'}
                    <Mail className="w-5 h-5 ml-2" />
                  </FestivalButton>
                </div>
              </div>
            </FestivalCard>
          </motion.div>
        )}

        {resendSuccess && foundUser && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                ¡QR Reenviado!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Tu código QR ha sido enviado exitosamente
              </p>

              <FestivalCard className="border-t-4 border-t-green-500 shadow-xl mb-8">
                <div className="text-center space-y-4">
                  <div className="bg-green-50 rounded-xl p-6">
                    <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      QR enviado a:
                    </p>
                    <p className="text-lg font-bold text-green-600">{newEmail}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 text-left">
                        Revisa tu bandeja de entrada y carpeta de spam. El correo puede tardar unos minutos en llegar.
                      </p>
                    </div>
                  </div>
                </div>
              </FestivalCard>

              <FestivalButton onClick={handleReset} size="lg">
                <RefreshCw className="w-5 h-5 mr-2" />
                Buscar Otro Usuario
              </FestivalButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
