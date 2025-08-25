import os
from supabase import create_client, Client
import json
from datetime import datetime, timedelta
import random
import bcrypt
import time


class SupabaseManager:
    def __init__(self):
        # Configuración de Supabase (usar variables de entorno en producción)
        self.supabase_url = os.getenv(
            "SUPABASE_URL", "https://gyyoqlmgwaosnkodfalp.supabase.co"
        )
        self.supabase_key = os.getenv(
            "SUPABASE_ANON_KEY",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eW9xbG1nd2Fvc25rb2RmYWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzgyNzMsImV4cCI6MjA2ODcxNDI3M30.R_thw0ZlPDrcjTLqGhdkcZ5BOszMf5RsoiGh0qRnyGs",
        )

        try:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
            print("✅ Conexión a Supabase establecida")
        except Exception as e:
            print(f"❌ Error conectando a Supabase: {e}")
            self.supabase = None

    def create_tables(self):
        """Crea las tablas necesarias en Supabase"""
        print("🔧 Creando tablas en Supabase...")

        # SQL para crear tablas
        sql_commands = [
            # Tabla de usuarios
            """
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                email VARCHAR UNIQUE NOT NULL,
                password_hash VARCHAR NOT NULL,
                nombre VARCHAR NOT NULL,
                apellido VARCHAR NOT NULL,
                rol VARCHAR CHECK (rol IN ('paciente', 'psicologo', 'administrador')) NOT NULL,
                activo BOOLEAN DEFAULT true,
                fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                telefono VARCHAR,
                fecha_nacimiento DATE,
                profesion VARCHAR,
                especialidad VARCHAR,
                numero_licencia VARCHAR,
                psicologo_asignado UUID REFERENCES users(id),
                configuracion JSONB DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            # Tabla de registros emocionales
            """
                CREATE TABLE IF NOT EXISTS emotional_records (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    fecha DATE NOT NULL,
                    mood DECIMAL(3,1) CHECK (mood >= 1 AND mood <= 10),
                    stress DECIMAL(3,1) CHECK (stress >= 1 AND stress <= 10),
                    energy DECIMAL(3,1) CHECK (energy >= 1 AND energy <= 10),
                    sleep DECIMAL(3,1) CHECK (sleep >= 1 AND sleep <= 10),
                    emociones TEXT[],
                    notas TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            """,
            # Tabla de evaluaciones
            """
            CREATE TABLE IF NOT EXISTS assessments (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                tipo VARCHAR NOT NULL,
                fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                respuestas JSONB NOT NULL,
                puntuacion_total INTEGER,
                nivel_riesgo VARCHAR CHECK (nivel_riesgo IN ('bajo', 'moderado', 'alto')),
                recomendaciones TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            # Tabla de recomendaciones
            """
            CREATE TABLE IF NOT EXISTS recommendations (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                tipo VARCHAR NOT NULL,
                titulo VARCHAR NOT NULL,
                descripcion TEXT,
                duracion VARCHAR,
                prioridad VARCHAR CHECK (prioridad IN ('baja', 'media', 'alta')),
                efectividad INTEGER CHECK (efectividad >= 0 AND efectividad <= 100),
                completada BOOLEAN DEFAULT false,
                fecha_completada TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            # Tabla de sesiones de terapia
            """
            CREATE TABLE IF NOT EXISTS therapy_sessions (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                paciente_id UUID REFERENCES users(id) ON DELETE CASCADE,
                psicologo_id UUID REFERENCES users(id) ON DELETE CASCADE,
                fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
                duracion INTEGER DEFAULT 60,
                tipo VARCHAR CHECK (tipo IN ('presencial', 'virtual')) DEFAULT 'virtual',
                estado VARCHAR CHECK (estado IN ('programada', 'confirmada', 'completada', 'cancelada')) DEFAULT 'programada',
                notas_psicologo TEXT,
                notas_paciente TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            # Tabla de mensajes
            """
            CREATE TABLE IF NOT EXISTS messages (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
                receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
                mensaje TEXT NOT NULL,
                leido BOOLEAN DEFAULT false,
                fecha_leido TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            # Índices para optimización
            """
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
            CREATE INDEX IF NOT EXISTS idx_emotional_records_user_fecha ON emotional_records(user_id, fecha DESC);
            CREATE INDEX IF NOT EXISTS idx_assessments_user_fecha ON assessments(user_id, fecha DESC);
            CREATE INDEX IF NOT EXISTS idx_recommendations_user_fecha ON recommendations(user_id, fecha DESC);
            CREATE INDEX IF NOT EXISTS idx_therapy_sessions_paciente ON therapy_sessions(paciente_id);
            CREATE INDEX IF NOT EXISTS idx_therapy_sessions_psicologo ON therapy_sessions(psicologo_id);
            CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, created_at DESC);
            """,
            # Función para actualizar updated_at
            """
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
            """,
            # Triggers para updated_at
            """
            CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            """,
        ]

        # Ejecutar comandos SQL
        for i, sql in enumerate(sql_commands):
            try:
                result = self.supabase.rpc("exec_sql", {"sql": sql}).execute()
                print(f"✅ Comando SQL {i+1} ejecutado correctamente")
            except Exception as e:
                print(f"⚠️ Error en comando SQL {i+1}: {e}")

        print("✅ Tablas creadas en Supabase")
        time.sleep(3) # Esperar 10 segundos para que las tablas se creen

    def hash_password(self, password):
        """Hashea una contraseña"""
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def create_test_users(self):
        """Crea usuarios de prueba en Supabase"""
        print("👥 Creando usuarios de prueba en Supabase...")

        test_users = [
            # Administrador
            {
                "email": "admin@Eunonia.com",
                "password_hash": self.hash_password("admin123"),
                "nombre": "Administrador",
                "apellido": "Sistema",
                "rol": "administrador",
                "activo": True,
                "configuracion": {
                    "notificaciones": True,
                    "tema": "claro",
                    "idioma": "es",
                },
            },
            # Psicólogos
            {
                "email": "dra.garcia@Eunonia.com",
                "password_hash": self.hash_password("psicologo123"),
                "nombre": "María",
                "apellido": "García",
                "rol": "psicologo",
                "activo": True,
                "especialidad": "Psicología Clínica",
                "numero_licencia": "COL-12345",
                "telefono": "+34 600 123 456",
                "configuracion": {
                    "horario_disponible": {
                        "lunes": ["09:00", "17:00"],
                        "martes": ["09:00", "17:00"],
                        "miercoles": ["09:00", "17:00"],
                        "jueves": ["09:00", "17:00"],
                        "viernes": ["09:00", "15:00"],
                    }
                },
            },
            {
                "email": "dr.martinez@Eunonia.com",
                "password_hash": self.hash_password("psicologo123"),
                "nombre": "Carlos",
                "apellido": "Martínez",
                "rol": "psicologo",
                "activo": True,
                "especialidad": "Psicología Laboral",
                "numero_licencia": "COL-67890",
                "telefono": "+34 600 789 012",
                "configuracion": {
                    "horario_disponible": {
                        "lunes": ["10:00", "18:00"],
                        "martes": ["10:00", "18:00"],
                        "miercoles": ["10:00", "18:00"],
                        "jueves": ["10:00", "18:00"],
                        "viernes": ["10:00", "16:00"],
                    }
                },
            },
            # Pacientes
            {
                "email": "ana.lopez@email.com",
                "password_hash": self.hash_password("paciente123"),
                "nombre": "Ana",
                "apellido": "López",
                "rol": "paciente",
                "activo": True,
                "telefono": "+34 600 111 222",
                "fecha_nacimiento": "1992-05-15",
                "profesion": "Desarrolladora de Software",
                "configuracion": {
                    "privacidad": {
                        "compartir_datos_anonimos": True,
                        "notificaciones_email": True,
                        "notificaciones_push": True,
                    }
                },
            },
            {
                "email": "pedro.ruiz@email.com",
                "password_hash": self.hash_password("paciente123"),
                "nombre": "Pedro",
                "apellido": "Ruiz",
                "rol": "paciente",
                "activo": True,
                "telefono": "+34 600 333 444",
                "fecha_nacimiento": "1988-11-22",
                "profesion": "Consultor de Marketing",
                "configuracion": {
                    "privacidad": {
                        "compartir_datos_anonimos": True,
                        "notificaciones_email": True,
                        "notificaciones_push": False,
                    }
                },
            },
            {
                "email": "laura.sanchez@email.com",
                "password_hash": self.hash_password("paciente123"),
                "nombre": "Laura",
                "apellido": "Sánchez",
                "rol": "paciente",
                "activo": True,
                "telefono": "+34 600 555 666",
                "fecha_nacimiento": "1995-03-08",
                "profesion": "Diseñadora UX",
                "configuracion": {
                    "privacidad": {
                        "compartir_datos_anonimos": False,
                        "notificaciones_email": True,
                        "notificaciones_push": True,
                    }
                },
            },
        ]

        # Insertar usuarios
        created_users = []
        for user in test_users:
            try:
                result = self.supabase.table("users").insert(user).execute()
                if result.data:
                    created_users.append(result.data[0])
                    print(f"✅ Usuario creado: {user['email']} ({user['rol']})")
            except Exception as e:
                print(f"❌ Error creando usuario {user['email']}: {e}")

        return created_users

    def create_sample_emotional_records(self, users):
        """Crea registros emocionales de muestra"""
        print("📊 Creando registros emocionales en Supabase...")

        pacientes = [u for u in users if u["rol"] == "paciente"]
        records = []

        for paciente in pacientes:
            # Generar registros para los últimos 30 días
            for i in range(30):
                fecha = (datetime.now() - timedelta(days=i)).date()

                # Simular patrones realistas
                base_mood = random.uniform(4, 8)
                base_stress = random.uniform(2, 7)

                # Efecto fin de semana
                if fecha.weekday() >= 5:  # Sábado y domingo
                    base_mood += 0.5
                    base_stress -= 0.5

                # Variación aleatoria
                mood = max(1, min(10, base_mood + random.uniform(-1, 1)))
                stress = max(1, min(10, base_stress + random.uniform(-1, 1)))
                energy = max(1, min(10, mood * 0.8 + random.uniform(-0.5, 0.5)))
                sleep = max(1, min(10, 8 - stress * 0.3 + random.uniform(-0.5, 0.5)))

                # Solo crear registro si es un día "activo" (70% probabilidad)
                if random.random() < 0.7:
                    record = {
                        "user_id": paciente["id"],
                        "fecha": fecha.isoformat(),
                        "mood": round(mood, 1),
                        "stress": round(stress, 1),
                        "energy": round(energy, 1),
                        "sleep": round(sleep, 1),
                        "emociones": random.sample(
                            [
                                "feliz",
                                "ansioso",
                                "calmado",
                                "frustrado",
                                "motivado",
                                "cansado",
                                "optimista",
                                "abrumado",
                            ],
                            random.randint(1, 3),
                        ),
                        "notas": (
                            random.choice(
                                [
                                    "Día productivo en el trabajo",
                                    "Mucho estrés por deadlines",
                                    "Buen día, me siento equilibrado",
                                    "Problemas para dormir",
                                    "Ejercicio matutino me ayudó",
                                    None,
                                ]
                            )
                            if random.random() < 0.3
                            else None
                        ),
                    }
                    records.append(record)

        # Insertar registros en lotes
        batch_size = 50
        total_inserted = 0

        for i in range(0, len(records), batch_size):
            batch = records[i : i + batch_size]
            try:
                result = (
                    self.supabase.table("emotional_records").insert(batch).execute()
                )
                if result.data:
                    total_inserted += len(result.data)
            except Exception as e:
                print(f"❌ Error insertando lote de registros: {e}")

        print(f"✅ {total_inserted} registros emocionales creados en Supabase")
        return total_inserted

    def create_sample_assessments(self, users):
        """Crea evaluaciones de muestra"""
        print("📋 Creando evaluaciones en Supabase...")

        pacientes = [u for u in users if u["rol"] == "paciente"]
        assessments = []

        for paciente in pacientes:
            # Evaluación inicial
            respuestas = {
                "estado_animo": random.randint(1, 3),
                "interes_actividades": random.randint(1, 3),
                "ansiedad": random.randint(1, 3),
                "preocupaciones": random.randint(1, 3),
                "estres_laboral": random.randint(1, 3),
                "desconexion_trabajo": random.randint(1, 3),
                "problemas_sueno": random.randint(1, 3),
                "fatiga": random.randint(1, 3),
                "apoyo_social": random.randint(0, 3),
                "autocuidado": random.randint(0, 3),
            }

            puntuacion_total = sum(respuestas.values())
            max_score = 30
            percentage = (puntuacion_total / max_score) * 100

            if percentage >= 70:
                nivel_riesgo = "alto"
                recomendaciones = [
                    "Buscar apoyo profesional inmediato",
                    "Implementar técnicas de manejo del estrés",
                    "Establecer rutina de autocuidado",
                ]
            elif percentage >= 40:
                nivel_riesgo = "moderado"
                recomendaciones = [
                    "Seguimiento regular del estado emocional",
                    "Practicar mindfulness",
                    "Mejorar higiene del sueño",
                ]
            else:
                nivel_riesgo = "bajo"
                recomendaciones = [
                    "Mantener hábitos saludables",
                    "Continuar con seguimiento preventivo",
                ]

            assessment = {
                "user_id": paciente["id"],
                "tipo": "autodiagnostico_inicial",
                "respuestas": respuestas,
                "puntuacion_total": puntuacion_total,
                "nivel_riesgo": nivel_riesgo,
                "recomendaciones": recomendaciones,
            }

            assessments.append(assessment)

        # Insertar evaluaciones
        try:
            result = self.supabase.table("assessments").insert(assessments).execute()
            if result.data:
                print(f"✅ {len(result.data)} evaluaciones creadas en Supabase")
                return result.data
        except Exception as e:
            print(f"❌ Error creando evaluaciones: {e}")
            return []

    def create_sample_recommendations(self, users):
        """Crea recomendaciones de muestra"""
        print("🤖 Creando recomendaciones en Supabase...")

        pacientes = [u for u in users if u["rol"] == "paciente"]
        recommendations = []

        recommendation_templates = [
            {
                "tipo": "respiracion",
                "titulo": "Técnica de Respiración 4-7-8",
                "descripcion": "Reduce el estrés inmediatamente con esta técnica de respiración profunda",
                "duracion": "5 min",
                "prioridad": "alta",
                "efectividad": 95,
            },
            {
                "tipo": "movimiento",
                "titulo": "Rutina Energizante de 10 Minutos",
                "descripcion": "Ejercicios suaves para aumentar tu energía sin agotarte",
                "duracion": "10 min",
                "prioridad": "media",
                "efectividad": 88,
            },
            {
                "tipo": "mindfulness",
                "titulo": "Meditación de Gratitud",
                "descripcion": "Practica la gratitud para mejorar tu estado de ánimo y perspectiva",
                "duracion": "15 min",
                "prioridad": "alta",
                "efectividad": 92,
            },
            {
                "tipo": "sueno",
                "titulo": "Rutina de Relajación Nocturna",
                "descripcion": "Prepara tu mente y cuerpo para un sueño reparador",
                "duracion": "20 min",
                "prioridad": "media",
                "efectividad": 85,
            },
            {
                "tipo": "mindfulness",
                "titulo": "Pausa Mindful de 3 Minutos",
                "descripcion": "Una breve práctica de atención plena para reconectar contigo mismo",
                "duracion": "3 min",
                "prioridad": "baja",
                "efectividad": 78,
            },
        ]

        for paciente in pacientes:
            # Crear 3-5 recomendaciones por paciente
            num_recommendations = random.randint(3, 5)
            selected_templates = random.sample(
                recommendation_templates, num_recommendations
            )

            for template in selected_templates:
                recommendation = {
                    "user_id": paciente["id"],
                    **template,
                    "completada": (
                        random.choice([True, False]) if random.random() < 0.3 else False
                    ),
                }

                if recommendation["completada"]:
                    recommendation["fecha_completada"] = (
                        datetime.now() - timedelta(days=random.randint(1, 7))
                    ).isoformat()

                recommendations.append(recommendation)

        # Insertar recomendaciones en lotes
        batch_size = 50
        total_inserted = 0

        for i in range(0, len(recommendations), batch_size):
            batch = recommendations[i : i + batch_size]
            try:
                result = self.supabase.table("recommendations").insert(batch).execute()
                if result.data:
                    total_inserted += len(result.data)
            except Exception as e:
                print(f"❌ Error insertando lote de recomendaciones: {e}")

        print(f"✅ {total_inserted} recomendaciones creadas en Supabase")
        return total_inserted

    def create_sample_therapy_sessions(self, users):
        """Crea sesiones de terapia de muestra"""
        print("🗓️ Creando sesiones de terapia en Supabase...")

        pacientes = [u for u in users if u["rol"] == "paciente"]
        psicologos = [u for u in users if u["rol"] == "psicologo"]

        if not psicologos:
            print("⚠️ No hay psicólogos disponibles para crear sesiones")
            return 0

        sessions = []

        for paciente in pacientes:
            # Asignar un psicólogo aleatorio
            psicologo = random.choice(psicologos)

            # Crear 2-4 sesiones (pasadas y futuras)
            num_sessions = random.randint(2, 4)

            for i in range(num_sessions):
                # Mezcla de sesiones pasadas y futuras
                if i < num_sessions // 2:
                    # Sesiones pasadas
                    fecha = datetime.now() - timedelta(days=random.randint(7, 30))
                    estado = random.choice(["completada", "cancelada"])
                else:
                    # Sesiones futuras
                    fecha = datetime.now() + timedelta(days=random.randint(1, 14))
                    estado = random.choice(["programada", "confirmada"])

                session = {
                    "paciente_id": paciente["id"],
                    "psicologo_id": psicologo["id"],
                    "fecha_programada": fecha.isoformat(),
                    "duracion": random.choice([45, 60, 90]),
                    "tipo": random.choice(["presencial", "virtual"]),
                    "estado": estado,
                }

                if estado == "completada":
                    session["notas_psicologo"] = random.choice(
                        [
                            "Sesión productiva, el paciente muestra progreso en el manejo del estrés",
                            "Trabajamos técnicas de respiración, el paciente las aplicó correctamente",
                            "Discutimos estrategias para el equilibrio trabajo-vida personal",
                            "El paciente reporta mejoras en la calidad del sueño",
                        ]
                    )

                sessions.append(session)

        # Insertar sesiones
        try:
            result = self.supabase.table("therapy_sessions").insert(sessions).execute()
            if result.data:
                print(f"✅ {len(result.data)} sesiones de terapia creadas en Supabase")
                return len(result.data)
        except Exception as e:
            print(f"❌ Error creando sesiones: {e}")
            return 0

    def get_database_statistics(self):
        """Obtiene estadísticas de la base de datos"""
        stats = {}

        tables = [
            "users",
            "emotional_records",
            "assessments",
            "recommendations",
            "therapy_sessions",
            "messages",
        ]

        for table in tables:
            try:
                result = (
                    self.supabase.table(table).select("id", count="exact").execute()
                )
                stats[table] = result.count if hasattr(result, "count") else 0
            except Exception as e:
                print(f"❌ Error obteniendo estadísticas de {table}: {e}")
                stats[table] = 0

        return stats

    def export_data_sample(self, filename="supabase_sample_data.json"):
        """Exporta una muestra de datos para análisis"""
        sample_data = {}

        try:
            # Obtener muestra de cada tabla
            sample_data["users"] = (
                self.supabase.table("users")
                .select("id,email,nombre,apellido,rol,activo,fecha_registro")
                .limit(10)
                .execute()
                .data
            )
            sample_data["emotional_records"] = (
                self.supabase.table("emotional_records")
                .select("*")
                .limit(50)
                .execute()
                .data
            )
            sample_data["assessments"] = (
                self.supabase.table("assessments").select("*").limit(10).execute().data
            )
            sample_data["recommendations"] = (
                self.supabase.table("recommendations").select("*").limit(20).execute().data
            )
            sample_data["therapy_sessions"] = (
                self.supabase.table("therapy_sessions").select("*").limit(20).execute().data
            )

            # Guardar la muestra en un archivo JSON
            with open(filename, "w", encoding="utf-8") as f:
                import json

                json.dump(sample_data, f, ensure_ascii=False, indent=4)

            print(f"Muestra de datos exportada correctamente a {filename}")

        except Exception as e:
            print(f"Error al exportar la muestra de datos: {e}")


if __name__ == "__main__":
    manager = SupabaseManager()
    manager.create_tables()
    users = manager.create_test_users()
    manager.create_sample_emotional_records(users)
    manager.create_sample_assessments(users)
    manager.create_sample_recommendations(users)
    manager.create_sample_therapy_sessions(users)
    stats = manager.get_database_statistics()
    print(stats)

