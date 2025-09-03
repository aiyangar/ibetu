# 🔌 Configuración de Supabase

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente con Supabase, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase
- Ve a [https://supabase.com](https://supabase.com)
- Inicia sesión o crea una cuenta
- Crea un nuevo proyecto

### 2. Obtener Credenciales
- En tu proyecto, ve a **Settings** > **API**
- Copia la **Project URL**
- Copia la **anon/public key**

### 3. Crear Archivo .env
En la raíz del proyecto (`ibetu-app/`), crea un archivo llamado `.env`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Crear Tablas en Supabase

#### Tabla `participants`
```sql
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  total_paid NUMERIC DEFAULT 0
);
```

#### Tabla `payments`
```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  amount FLOAT4 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Insertar Datos de Prueba
```sql
-- Insertar participantes de ejemplo
INSERT INTO participants (nickname, email, total_paid) VALUES
  ('Juan Pérez', 'juan@example.com', 150.00),
  ('María García', 'maria@example.com', 200.00),
  ('Carlos López', 'carlos@example.com', 75.50);

-- Insertar pagos de ejemplo
INSERT INTO payments (participant_id, amount) VALUES
  ((SELECT id FROM participants WHERE email = 'juan@example.com'), 50.00),
  ((SELECT id FROM participants WHERE email = 'juan@example.com'), 100.00),
  ((SELECT id FROM participants WHERE email = 'maria@example.com'), 200.00),
  ((SELECT id FROM participants WHERE email = 'carlos@example.com'), 75.50);
```

## 🔍 Verificar Conexión

Una vez configurado, el componente `SupabaseConnectionTest` en la landing page te mostrará:

- ✅ **Estado de conexión**
- ✅ **Variables de entorno detectadas**
- ✅ **Errores específicos** si los hay
- ✅ **Datos de prueba** si la conexión es exitosa

## 🚨 Problemas Comunes

### Variables de entorno no configuradas
- **Síntoma:** Error "Variables de entorno de Supabase no configuradas"
- **Solución:** Crear archivo `.env` con las credenciales correctas

### Tabla no encontrada
- **Síntoma:** Error "Conexión exitosa, pero la tabla no existe"
- **Solución:** Crear las tablas en Supabase usando el SQL proporcionado

### Error de autenticación
- **Síntoma:** Error 401 o 403
- **Solución:** Verificar que la anon key sea correcta

### Error de red
- **Síntoma:** Error de timeout o conexión rechazada
- **Solución:** Verificar que la URL del proyecto sea correcta

## 📱 Reiniciar Aplicación

Después de crear el archivo `.env`, **reinicia la aplicación** para que las variables de entorno se carguen:

```bash
npm run dev
```
