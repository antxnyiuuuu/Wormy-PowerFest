import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  label: string;
  username: string;
  domain: string;
  onUsernameChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const EMAIL_DOMAINS = [
  '@gmail.com',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com',
];

export function EmailInput({
  label,
  username,
  domain,
  onUsernameChange,
  onDomainChange,
  error,
  required = false,
}: EmailInputProps) {
  const [isCustomEmail, setIsCustomEmail] = useState(false);
  const [localValue, setLocalValue] = useState('');

  const handleDomainChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomEmail(true);
      // Inicializar con el email actual si existe
      const currentEmail = username && domain ? `${username}${domain}` : '';
      setLocalValue(currentEmail);
    } else {
      setIsCustomEmail(false);
      setLocalValue('');
      onDomainChange(value);
    }
  };

  const handleInputChange = (value: string) => {
    if (isCustomEmail) {
      // Actualizar el valor local
      setLocalValue(value);
      
      // En modo custom, separar el email completo
      const atIndex = value.lastIndexOf('@');
      if (atIndex > 0) {
        // Si hay @, separar username y domain
        const newUsername = value.substring(0, atIndex);
        const newDomain = '@' + value.substring(atIndex + 1);
        console.log('EmailInput - Parsing email - username:', newUsername, 'domain:', newDomain);
        
        // Actualizar el padre - domain primero, luego username
        // Con la forma funcional de setState en el padre, ambos se preservarán
        onDomainChange(newDomain);
        onUsernameChange(newUsername);
      } else if (atIndex === 0) {
        // Si solo hay @ al inicio (ej: "@espe.edu.ec")
        console.log('EmailInput - Only domain:', value);
        onDomainChange(value);
        onUsernameChange('');
      } else {
        // Si no hay @, guardar todo como username
        console.log('EmailInput - Setting username (no @):', value);
        onUsernameChange(value);
        onDomainChange('');
      }
    } else {
      // Si no está en modo custom, solo actualizar el username
      onUsernameChange(value);
    }
  };

  const inputClasses = `
    flex-1 min-w-0 pl-10 pr-2 py-3 rounded-l-xl border-2 border-r-0 border-gray-200 
    bg-gray-50 text-gray-900 font-medium text-sm
    focus:border-magenta focus:ring-0 focus:bg-white focus:z-10
    transition-all duration-300 outline-none
    placeholder:text-gray-400
    ${error ? 'border-red-500 focus:border-red-500' : ''}
  `;

  const selectClasses = `
    px-2 py-3 rounded-r-xl border-2 border-l-0 border-gray-200 
    bg-gray-50 text-gray-900 font-medium text-sm
    focus:border-magenta focus:ring-0 focus:bg-white focus:z-10
    transition-all duration-300 outline-none cursor-pointer
    max-w-[140px] flex-shrink-0
    ${error ? 'border-red-500 focus:border-red-500' : ''}
  `;

  // Calcular el valor del input basado en el modo
  const inputValue = isCustomEmail ? localValue : username;

  const placeholder = isCustomEmail ? 'correo@ejemplo.com' : 'usuario';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="flex items-center w-full overflow-hidden">
          <motion.input
            type={isCustomEmail ? 'email' : 'text'}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
            initial={false}
            whileFocus={{ scale: 1.01 }}
          />
          
          <motion.select
            value={isCustomEmail ? 'custom' : domain}
            onChange={(e) => handleDomainChange(e.target.value)}
            className={selectClasses}
            initial={false}
            whileFocus={{ scale: 1.01 }}
          >
            {EMAIL_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value="custom">Otro</option>
          </motion.select>
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Mail className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium ml-1"
        >
          {error}
        </motion.p>
      )}

      <p className="text-xs text-gray-500 ml-1">
        Email completo: {isCustomEmail 
          ? (inputValue || 'correo@ejemplo.com')
          : `${username || 'usuario'}${domain}`
        }
      </p>
    </div>
  );
}
