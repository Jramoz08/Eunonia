def verificar_columnas_necesarias(supabase, tabla, columnas_esperadas):
    """
    Verifica que todas las columnas esperadas existan en una tabla de Supabase
    """
    try:
        # Obtener metadatos de la tabla usando una consulta SQL
        sql = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '{tabla}';
        """
        result = supabase.rpc("exec_sql", {"sql": sql}).execute()

        columnas_actuales = [col["column_name"] for col in result.data]
        faltantes = [col for col in columnas_esperadas if col not in columnas_actuales]

        if not faltantes:
            print(f"✅ Todas las columnas están presentes en '{tabla}'")
        else:
            print(f"❌ Faltan columnas en '{tabla}': {faltantes}")

        return faltantes == []

    except Exception as e:
        print(f"⚠️ Error verificando columnas de '{tabla}': {e}")
        return False
