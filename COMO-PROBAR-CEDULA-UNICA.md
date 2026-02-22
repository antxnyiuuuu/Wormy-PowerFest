# 🧪 Cómo Probar la Validación de Cédula Única

## 🚀 Inicio Rápido

### 1. Iniciar Backend
```bash
cd Wormy-PowerFest-backend/backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd Wormy-PowerFest
npm run dev
```

---

## 📋 Casos de Prueba

### ✅ Prueba 1: Registro Normal (Primera vez)

**Pasos:**
1. Abre la aplicación en el navegador
2. Llena el formulario de registro:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 0987654321
   - Email: juan@ejemplo.com
   - **Cédula: 1234567890** ← Cédula válida
   - Edad: 25
   - Sector: Norte
3. Selecciona deportes (opcional)
4. Haz clic en "Siguiente"
5. Haz clic en "Completar Registro"

**Resultado Esperado:**
- ✅ Registro exitoso
- ✅ Confetti y mensaje de éxito
- ✅ QR enviado por email

---

### ❌ Prueba 2: Registro con Cédula Duplicada

**Pasos:**
1. Intenta registrar otro usuario con:
   - Nombre: María
   - Apellido: González
   - Teléfono: 0998765432
   - Email: maria@ejemplo.com
   - **Cédula: 1234567890** ← LA MISMA CÉDULA
   - Edad: 30
   - Sector: Sur
2. Haz clic en "Siguiente"
3. Haz clic en "Completar Registro"

**Resultado Esperado:**
- ❌ Modal de error aparece
- ❌ Mensaje: "Esta cédula ya está registrada"
- ℹ️ Mensaje de ayuda azul:
  ```
  ¿Ya te registraste antes? 
  Usa la opción "Reenviar QR" en el menú superior 
  para recuperar tu código de acceso.
  ```

---

### ✅ Prueba 3: Registro sin Cédula (NULL)

**Pasos:**
1. Llena el formulario pero **deja la cédula vacía**
2. Completa los demás campos
3. Registra

**Resultado Esperado:**
- ❌ Error de validación: "La cédula es requerida"
- (La cédula es obligatoria en el formulario)

---

### ✅ Prueba 4: Recuperar QR con Cédula Duplicada

**Pasos:**
1. Después de ver el error de cédula duplicada
2. Haz clic en "Reenviar QR" en el menú superior
3. Ingresa la cédula: 1234567890
4. Haz clic en "Buscar Usuario"
5. Verifica que aparezcan los datos: Juan Pérez
6. Modifica el email si quieres
7. Haz clic en "Reenviar QR"

**Resultado Esperado:**
- ✅ Usuario encontrado
- ✅ Datos mostrados correctamente
- ✅ QR reenviado exitosamente

---

## 🔍 Verificación en Base de Datos

### Opción 1: Prisma Studio
```bash
cd Wormy-PowerFest-backend/backend
npx prisma studio
```

Luego:
1. Abre la tabla `Registration`
2. Busca registros con la misma cédula
3. Verifica que solo haya uno

### Opción 2: Query SQL
```sql
SELECT cedula, COUNT(*) as count
FROM "Registration"
WHERE cedula IS NOT NULL
GROUP BY cedula
HAVING COUNT(*) > 1;
```

**Resultado Esperado:** 0 filas (sin duplicados)

---

## 🧪 Pruebas con cURL

### Probar endpoint directamente

```bash
# Primer registro (debe funcionar)
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "phone": "0987654321",
    "email": "test@ejemplo.com",
    "sports": ["Correr"],
    "cedula": "9999999999",
    "edad": 25,
    "sector": "Norte"
  }'
```

**Respuesta esperada:** 201 Created

```bash
# Segundo registro con misma cédula (debe fallar)
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Another",
    "lastName": "User",
    "phone": "0998765432",
    "email": "another@ejemplo.com",
    "sports": ["Nadar"],
    "cedula": "9999999999",
    "edad": 30,
    "sector": "Sur"
  }'
```

**Respuesta esperada:** 409 Conflict
```json
{
  "success": false,
  "error": "Esta cédula ya está registrada"
}
```

---

## 📊 Checklist de Verificación

- [ ] Backend compila sin errores
- [ ] Frontend compila sin errores
- [ ] Registro con cédula nueva funciona
- [ ] Registro con cédula duplicada muestra error
- [ ] Mensaje de error es claro
- [ ] Mensaje de ayuda aparece
- [ ] Sugerencia de "Reenviar QR" se muestra
- [ ] "Reenviar QR" funciona con la cédula
- [ ] No hay duplicados en la base de datos

---

## 🐛 Solución de Problemas

### Error: "Prisma Client not generated"
```bash
cd Wormy-PowerFest-backend/backend
npx prisma generate
```

### Error: "Migration not applied"
```bash
cd Wormy-PowerFest-backend/backend
npx prisma migrate dev
```

### Frontend no muestra el mensaje de ayuda
- Verifica que el error contenga "cédula" y "registrada"
- Revisa la consola del navegador para errores
- Limpia caché del navegador (Ctrl + Shift + R)

### Backend no valida duplicados
- Verifica que el método `getRegistrationByCedula()` exista
- Revisa los logs del backend
- Verifica que la migración se haya aplicado

---

## ✅ Resultado Esperado Final

Después de todas las pruebas:

1. ✅ Solo un registro por cédula
2. ✅ Mensajes de error claros
3. ✅ Usuario sabe cómo recuperar su QR
4. ✅ Flujo completo funciona sin problemas
5. ✅ Base de datos sin duplicados

---

**¡Listo para producción!** 🚀
