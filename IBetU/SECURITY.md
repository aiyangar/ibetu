# 🔒 Reglas de Seguridad - iBetu

## 📋 Resumen de Seguridad

Este proyecto implementa un sistema de seguridad estricto donde **solo la aplicación puede acceder a la base de datos**. Ningún usuario externo, autenticado o no, puede acceder directamente a los datos.

## 🛡️ Características de Seguridad

### 1. Row Level Security (RLS)
- ✅ Habilitado en todas las tablas
- ✅ Políticas restrictivas que solo permiten acceso al `service_role`
- ✅ Sin acceso público a los datos

### 2. Claves de Acceso
- **Anon Key**: Solo para autenticación de usuarios
- **Service Role Key**: Para operaciones de base de datos (MANTENER SECRETA)

### 3. Políticas de Acceso
- ❌ **Sin acceso público**
- ❌ **Sin acceso para usuarios autenticados**
- ✅ **Solo acceso para la aplicación (service_role)**

## 📊 Estructura de la Base de Datos

### Tabla: `participants`
```sql
- id (UUID, Primary Key)
- nickname (TEXT, NOT NULL)
- email (TEXT, NOT NULL, UNIQUE)
- total_paid (REAL, NOT NULL, DEFAULT 0.00)
- created_at (TIMESTAMPTZ, NOT NULL)
- updated_at (TIMESTAMPTZ, NOT NULL)
```

### Tabla: `payments`
```sql
- id (UUID, Primary Key)
- participant_id (UUID, Foreign Key)
- amount (REAL, NOT NULL)
- created_at (TIMESTAMPTZ, NOT NULL)
```

## 🔐 Reglas de Seguridad Implementadas

### Para la tabla `participants`:
- `app_read_participants`: Solo la aplicación puede leer
- `app_insert_participants`: Solo la aplicación puede insertar
- `app_update_participants`: Solo la aplicación puede actualizar
- `app_delete_participants`: Solo la aplicación puede eliminar

### Para la tabla `payments`:
- `app_read_payments`: Solo la aplicación puede leer
- `app_insert_payments`: Solo la aplicación puede insertar
- `app_update_payments`: Solo la aplicación puede actualizar
- `app_delete_payments`: Solo la aplicación puede eliminar

## 🚀 Configuración Requerida

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### Pasos de Configuración
1. Ejecutar `supabase-security-rules.sql` en el Editor SQL de Supabase
2. Configurar las variables de entorno en el archivo `.env`
3. Verificar que la aplicación funcione correctamente

## ⚠️ Consideraciones de Seguridad

### ✅ Lo que está protegido:
- Acceso directo a la base de datos
- Consultas SQL maliciosas
- Manipulación de datos por usuarios no autorizados
- Exposición de datos sensibles

### 🔒 Buenas Prácticas:
- **NUNCA** exponer la `service_role_key` en el frontend
- **NUNCA** compartir las claves de acceso
- **SIEMPRE** usar HTTPS en producción
- **MONITOREAR** los logs de acceso

### 🚨 Advertencias:
- La `service_role_key` tiene acceso completo a la base de datos
- Mantener esta clave segura es crítico
- No incluir en repositorios públicos
- Rotar las claves periódicamente

## 🔍 Verificación de Seguridad

### Comandos de verificación:
```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('participants', 'payments');

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('participants', 'payments');
```

## 📝 Logs y Monitoreo

### Recomendaciones:
- Habilitar logs de auditoría en Supabase
- Monitorear intentos de acceso fallidos
- Revisar regularmente los logs de acceso
- Configurar alertas para actividades sospechosas

## 🛠️ Mantenimiento

### Tareas periódicas:
- Revisar y actualizar políticas de seguridad
- Rotar claves de acceso
- Actualizar dependencias de seguridad
- Revisar logs de auditoría
- Probar restauraciones de backup

---

**Nota**: Esta configuración de seguridad es estricta y solo permite que la aplicación acceda a los datos. Cualquier cambio en las políticas debe ser cuidadosamente evaluado para mantener la seguridad.
