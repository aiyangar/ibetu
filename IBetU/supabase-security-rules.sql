-- =====================================================
-- REGLAS DE SEGURIDAD PARA SUPABASE - iBetu
-- =====================================================
-- Este archivo contiene todas las reglas de seguridad
-- para que solo la aplicación pueda acceder a los datos

-- =====================================================
-- 1. CREAR TABLAS
-- =====================================================

-- Crea la tabla 'participants'
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  total_paid REAL NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crea la tabla 'payments'
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREAR FUNCIONES DE SEGURIDAD
-- =====================================================

-- Función para verificar si el usuario es un administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar si el usuario tiene el rol 'service_role' (solo la aplicación)
  RETURN current_setting('role') = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario es autenticado
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. CREAR TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en participants
DROP TRIGGER IF EXISTS update_participants_updated_at ON participants;
CREATE TRIGGER update_participants_updated_at 
  BEFORE UPDATE ON participants 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. REGLAS DE SEGURIDAD PARA PARTICIPANTS
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow public read access" ON participants;
DROP POLICY IF EXISTS "Allow authenticated insert" ON participants;
DROP POLICY IF EXISTS "Allow authenticated update" ON participants;
DROP POLICY IF EXISTS "Allow authenticated delete" ON participants;

-- Política: Solo la aplicación puede leer participantes
CREATE POLICY "app_read_participants" ON participants
  FOR SELECT USING (is_admin());

-- Política: Solo la aplicación puede insertar participantes
CREATE POLICY "app_insert_participants" ON participants
  FOR INSERT WITH CHECK (is_admin());

-- Política: Solo la aplicación puede actualizar participantes
CREATE POLICY "app_update_participants" ON participants
  FOR UPDATE USING (is_admin());

-- Política: Solo la aplicación puede eliminar participantes
CREATE POLICY "app_delete_participants" ON participants
  FOR DELETE USING (is_admin());

-- =====================================================
-- 6. REGLAS DE SEGURIDAD PARA PAYMENTS
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow public read access" ON payments;
DROP POLICY IF EXISTS "Allow authenticated insert" ON payments;
DROP POLICY IF EXISTS "Allow authenticated update" ON payments;
DROP POLICY IF EXISTS "Allow authenticated delete" ON payments;

-- Política: Solo la aplicación puede leer payments
CREATE POLICY "app_read_payments" ON payments
  FOR SELECT USING (is_admin());

-- Política: Solo la aplicación puede insertar payments
CREATE POLICY "app_insert_payments" ON payments
  FOR INSERT WITH CHECK (is_admin());

-- Política: Solo la aplicación puede actualizar payments
CREATE POLICY "app_update_payments" ON payments
  FOR UPDATE USING (is_admin());

-- Política: Solo la aplicación puede eliminar payments
CREATE POLICY "app_delete_payments" ON payments
  FOR DELETE USING (is_admin());

-- =====================================================
-- 7. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_total_paid ON participants(total_paid DESC);
CREATE INDEX IF NOT EXISTS idx_payments_participant_id ON payments(participant_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- =====================================================
-- 8. DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar datos de ejemplo solo si la tabla está vacía
INSERT INTO participants (nickname, email, total_paid) 
SELECT 'Ganador1', 'ganador1@example.com', 1500.00
WHERE NOT EXISTS (SELECT 1 FROM participants LIMIT 1);

INSERT INTO participants (nickname, email, total_paid) 
SELECT 'Participante2', 'participante2@example.com', 1200.50
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE email = 'participante2@example.com');

INSERT INTO participants (nickname, email, total_paid) 
SELECT 'Usuario3', 'usuario3@example.com', 800.25
WHERE NOT EXISTS (SELECT 1 FROM participants WHERE email = 'usuario3@example.com');

-- =====================================================
-- 9. VERIFICACIÓN DE SEGURIDAD
-- =====================================================

-- Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('participants', 'payments');

-- Verificar políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('participants', 'payments');
