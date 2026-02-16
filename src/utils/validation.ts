// Validaciones para formularios

/**
 * Valida formato de teléfono ecuatoriano
 * Formato: 09XXXXXXXX (10 dígitos, empieza con 09)
 */
export const validateEcuadorPhone = (phone: string): boolean => {
  // Remover espacios y caracteres especiales
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Debe tener exactamente 10 dígitos y empezar con 09
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Formatea el teléfono mientras el usuario escribe
 * Limita a 10 dígitos y solo permite números
 */
export const formatEcuadorPhone = (value: string): string => {
  // Solo permitir números
  const numbers = value.replace(/\D/g, '');
  
  // Limitar a 10 dígitos
  const limited = numbers.slice(0, 10);
  
  return limited;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida nombre (solo letras y espacios)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  PHONE_INVALID: 'El teléfono debe tener 10 dígitos y empezar con 09',
  PHONE_REQUIRED: 'El teléfono es requerido',
  EMAIL_INVALID: 'El correo electrónico no es válido',
  EMAIL_REQUIRED: 'El correo electrónico es requerido',
  NAME_INVALID: 'El nombre solo puede contener letras',
  NAME_REQUIRED: 'El nombre es requerido',
  SPORTS_REQUIRED: 'Debes seleccionar al menos un deporte',
};
