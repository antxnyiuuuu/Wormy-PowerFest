# 📤 Funcionalidad: Reenviar QR por Cédula

## 🎯 Descripción

Nueva funcionalidad que permite a los usuarios buscar su registro usando su número de cédula y reenviar el código QR a un correo electrónico actualizado.

## 🚀 Características

### Frontend

1. **Nuevo botón en la navegación**: "Reenviar QR"
2. **Página de búsqueda**: Permite buscar usuarios por cédula
3. **Página de edición**: Muestra datos del usuario y permite modificar el correo
4. **Confirmación**: Pantalla de éxito al reenviar el QR

### Backend

1. **Nuevo endpoint**: `GET /api/registrations/search?cedula=XXXXXXXXXX`
2. **Validación de cédula**: Verifica formato de 10 dígitos
3. **Búsqueda en base de datos**: Encuentra registro por cédula
4. **Integración con servicios existentes**: Usa los mismos servicios de reenvío

## 📋 Flujo de Usuario

1. Usuario hace clic en "Reenviar QR" en la navegación
2. Ingresa su número de cédula (10 dígitos)
3. Sistema busca el registro en la base de datos
4. Si se encuentra:
   - Muestra nombre completo y teléfono del usuario
   - Muestra correo actual (editable)
   - Usuario puede modificar el correo
   - Usuario hace clic en "Reenviar QR"
   - Sistema actualiza el correo (si cambió)
   - Sistema reenvía el QR al correo
   - Muestra pantalla de confirmación
5. Si no se encuentra:
   - Muestra mensaje de error
   - Usuario puede intentar de nuevo

## 🔧 Archivos Modificados

### Frontend

- `src/App.tsx`: Añadido tab "Reenviar QR" y ruta
- `src/pages/ResendQRPage.tsx`: Nueva página (creada)
- `src/services/registration.service.ts`: Añadido método `searchByCedula`
- `src/config/api.ts`: Añadido endpoint `SEARCH_BY_CEDULA`

### Backend

- `backend/src/routes/registration.routes.ts`: Añadida ruta `/search`
- `backend/src/controllers/registration.controller.ts`: Añadido método `searchByCedula`
- `backend/src/services/registration.service.ts`: Añadido método `getRegistrationByCedula`

## 🔒 Seguridad

- Validación de formato de cédula (10 dígitos)
- Validación de email antes de actualizar
- No expone información sensible
- Usa los mismos servicios de autenticación existentes

## ✅ Validaciones

### Cédula
- Debe tener exactamente 10 dígitos
- Solo números
- Formato ecuatoriano

### Email
- Formato válido de email
- Campo requerido

## 🎨 Diseño

- Mantiene el mismo estilo visual del resto de la aplicación
- Usa los componentes existentes: `FestivalCard`, `FestivalInput`, `FestivalButton`
- Animaciones con Framer Motion
- Responsive design

## 🧪 Pruebas

### Probar en Frontend

1. Iniciar el servidor de desarrollo:
```bash
cd Wormy-PowerFest
npm run dev
```

2. Hacer clic en "Reenviar QR" en la navegación
3. Ingresar una cédula registrada
4. Verificar que se muestre la información correcta
5. Modificar el correo y reenviar

### Probar el Endpoint

```bash
# Buscar por cédula
curl "http://localhost:3003/api/registrations/search?cedula=1234567890"
```

## 📝 Notas Importantes

- La funcionalidad NO afecta el flujo de registro existente
- NO modifica la lógica de check-in
- Usa los servicios de reenvío ya existentes y probados
- La cédula debe estar registrada previamente en el sistema
- El endpoint de búsqueda está antes de las rutas con parámetros para evitar conflictos

## 🔄 Integración con Sistema Existente

Esta funcionalidad se integra perfectamente con:
- Sistema de registro existente
- Servicio de envío de emails
- Validaciones de cédula ya implementadas
- Componentes UI existentes

No requiere cambios en:
- Base de datos (la cédula ya existe en el schema)
- Servicios de email
- Lógica de verificación de tickets
- Panel de administración
