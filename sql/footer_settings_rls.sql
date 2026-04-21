-- SQL para configurar RLS y permisos para la tabla footer_settings
-- Ejecutar en el editor SQL de Supabase

-- 1. Habilitar RLS en la tabla
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Users can view footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Users can insert footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Users can update footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Users can upsert footer_settings" ON footer_settings;

-- 3. Política para que todos los usuarios autenticados puedan ver los datos
CREATE POLICY "Users can view footer_settings" ON footer_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Política para que todos los usuarios autenticados puedan insertar datos
CREATE POLICY "Users can insert footer_settings" ON footer_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Política para que todos los usuarios autenticados puedan actualizar datos
CREATE POLICY "Users can update footer_settings" ON footer_settings
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 6. Política específica para tu usuario (jhonrincon.marketer@gmail.com)
-- Esto da permisos adicionales a tu email específico
CREATE POLICY "jhonrincon.marketer@gmail.com can manage footer_settings" ON footer_settings
    FOR ALL USING (
        auth.email() = 'jhonrincon.marketer@gmail.com' OR 
        auth.role() = 'authenticated'
    )
    WITH CHECK (
        auth.email() = 'jhonrincon.marketer@gmail.com' OR 
        auth.role() = 'authenticated'
    );

-- 7. Opcional: Si quieres que solo tú puedas modificar los datos
-- Descomenta las siguientes líneas y comenta las anteriores

/*
-- Eliminar políticas anteriores
DROP POLICY IF EXISTS "Users can insert footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Users can update footer_settings" ON footer_settings;

-- Política restringida solo para tu usuario
CREATE POLICY "Only jhonrincon.marketer@gmail.com can modify footer_settings" ON footer_settings
    FOR INSERT WITH CHECK (auth.email() = 'jhonrincon.marketer@gmail.com');

CREATE POLICY "Only jhonrincon.marketer@gmail.com can modify footer_settings" ON footer_settings
    FOR UPDATE USING (auth.email() = 'jhonrincon.marketer@gmail.com')
    WITH CHECK (auth.email() = 'jhonrincon.marketer@gmail.com');
*/

-- 8. Verificar que las políticas estén activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'footer_settings';

-- 9. Verificar permisos del usuario actual
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'footer_settings' 
    AND grantee = current_user;
