from pymongo import MongoClient
from datetime import datetime, timedelta
import json
import bcrypt
import random
from bson import ObjectId

class MongoDBManager:
    def __init__(self, connection_string="mongodb://localhost:27017/", db_name="Eunonia"):
        self.client = MongoClient(connection_string)
        self.db = self.client[db_name]
        
        # Colecciones
        self.users = self.db.users
        self.emotional_records = self.db.emotional_records
        self.recommendations = self.db.recommendations
        self.sessions = self.db.sessions
        self.assessments = self.db.assessments
        
    def setup_collections(self):
        """Configura las colecciones y sus índices"""
        print("🔧 Configurando colecciones MongoDB...")
        
        # Índices para usuarios
        self.users.create_index("email", unique=True)
        self.users.create_index("rol")
        self.users.create_index("activo")
        
        # Índices para registros emocionales
        self.emotional_records.create_index([("user_id", 1), ("fecha", -1)])
        self.emotional_records.create_index("fecha")
        
        # Índices para recomendaciones
        self.recommendations.create_index([("user_id", 1), ("fecha", -1)])
        self.recommendations.create_index("tipo")
        
        # Índices para sesiones
        self.sessions.create_index("user_id")
        self.sessions.create_index("expires_at")
        
        # Índices para evaluaciones
        self.assessments.create_index([("user_id", 1), ("fecha", -1)])
        self.assessments.create_index("tipo")
        
        print("✅ Colecciones configuradas correctamente")
    
    def hash_password(self, password):
        """Hashea una contraseña"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password, hashed):
        """Verifica una contraseña"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_test_users(self):
        """Crea usuarios de prueba"""
        print("👥 Creando usuarios de prueba...")
        
        test_users = [
            # Administradores
            {
                "email": "admin@Eunonia.com",
                "password": self.hash_password("admin123"),
                "nombre": "Administrador",
                "apellido": "Sistema",
                "rol": "administrador",
                "activo": True,
                "fecha_registro": datetime.now(),
                "configuracion": {
                    "notificaciones": True,
                    "tema": "claro",
                    "idioma": "es"
                }
            },
            
            # Psicólogos
            {
                "email": "dra.garcia@Eunonia.com",
                "password": self.hash_password("psicologo123"),
                "nombre": "María",
                "apellido": "García",
                "rol": "psicologo",
                "activo": True,
                "fecha_registro": datetime.now() - timedelta(days=30),
                "especialidad": "Psicología Clínica",
                "numero_licencia": "COL-12345",
                "telefono": "+34 600 123 456",
                "pacientes_asignados": [],
                "horario_disponible": {
                    "lunes": ["09:00", "17:00"],
                    "martes": ["09:00", "17:00"],
                    "miercoles": ["09:00", "17:00"],
                    "jueves": ["09:00", "17:00"],
                    "viernes": ["09:00", "15:00"]
                }
            },
            {
                "email": "dr.martinez@Eunonia.com",
                "password": self.hash_password("psicologo123"),
                "nombre": "Carlos",
                "apellido": "Martínez",
                "rol": "psicologo",
                "activo": True,
                "fecha_registro": datetime.now() - timedelta(days=45),
                "especialidad": "Psicología Laboral",
                "numero_licencia": "COL-67890",
                "telefono": "+34 600 789 012",
                "pacientes_asignados": [],
                "horario_disponible": {
                    "lunes": ["10:00", "18:00"],
                    "martes": ["10:00", "18:00"],
                    "miercoles": ["10:00", "18:00"],
                    "jueves": ["10:00", "18:00"],
                    "viernes": ["10:00", "16:00"]
                }
            },
            
            # Pacientes
            {
                "email": "ana.lopez@email.com",
                "password": self.hash_password("paciente123"),
                "nombre": "Ana",
                "apellido": "López",
                "rol": "paciente",
                "activo": True,
                "fecha_registro": datetime.now() - timedelta(days=60),
                "telefono": "+34 600 111 222",
                "fecha_nacimiento": datetime(1992, 5, 15),
                "profesion": "Desarrolladora de Software",
                "psicologo_asignado": None,
                "configuracion_privacidad": {
                    "compartir_datos_anonimos": True,
                    "notificaciones_email": True,
                    "notificaciones_push": True
                }
            },
            {
                "email": "pedro.ruiz@email.com",
                "password": self.hash_password("paciente123"),
                "nombre": "Pedro",
                "apellido": "Ruiz",
                "rol": "paciente",
                "activo": True,
                "fecha_registro": datetime.now() - timedelta(days=40),
                "telefono": "+34 600 333 444",
                "fecha_nacimiento": datetime(1988, 11, 22),
                "profesion": "Consultor de Marketing",
                "psicologo_asignado": None,
                "configuracion_privacidad": {
                    "compartir_datos_anonimos": True,
                    "notificaciones_email": True,
                    "notificaciones_push": False
                }
            },
            {
                "email": "laura.sanchez@email.com",
                "password": self.hash_password("paciente123"),
                "nombre": "Laura",
                "apellido": "Sánchez",
                "rol": "paciente",
                "activo": True,
                "fecha_registro": datetime.now() - timedelta(days=20),
                "telefono": "+34 600 555 666",
                "fecha_nacimiento": datetime(1995, 3, 8),
                "profesion": "Diseñadora UX",
                "psicologo_asignado": None,
                "configuracion_privacidad": {
                    "compartir_datos_anonimos": False,
                    "notificaciones_email": True,
                    "notificaciones_push": True
                }
            }
        ]
        
        # Insertar usuarios
        inserted_users = []
        for user in test_users:
            try:
                result = self.users.insert_one(user)
                user['_id'] = result.inserted_id
                inserted_users.append(user)
                print(f"✅ Usuario creado: {user['email']} ({user['rol']})")
            except Exception as e:
                print(f"❌ Error creando usuario {user['email']}: {e}")
        
        return inserted_users
    
    def create_sample_emotional_records(self, users):
        """Crea registros emocionales de muestra"""
        print("📊 Creando registros emocionales de muestra...")
        
        pacientes = [u for u in users if u['rol'] == 'paciente']
        records = []
        
        for paciente in pacientes:
            # Generar registros para los últimos 30 días
            for i in range(30):
                fecha = datetime.now() - timedelta(days=i)
                
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
                        "user_id": paciente['_id'],
                        "fecha": fecha,
                        "mood": round(mood, 1),
                        "stress": round(stress, 1),
                        "energy": round(energy, 1),
                        "sleep": round(sleep, 1),
                        "emociones": random.sample([
                            'feliz', 'ansioso', 'calmado', 'frustrado',
                            'motivado', 'cansado', 'optimista', 'abrumado'
                        ], random.randint(1, 3)),
                        "notas": random.choice([
                            "Día productivo en el trabajo",
                            "Mucho estrés por deadlines",
                            "Buen día, me siento equilibrado",
                            "Problemas para dormir",
                            "Ejercicio matutino me ayudó",
                            ""
                        ]) if random.random() < 0.3 else "",
                        "created_at": datetime.now()
                    }
                    records.append(record)
        
        # Insertar registros
        if records:
            result = self.emotional_records.insert_many(records)
            print(f"✅ {len(result.inserted_ids)} registros emocionales creados")
        
        return records
    
    def create_sample_assessments(self, users):
        """Crea evaluaciones de muestra"""
        print("📋 Creando evaluaciones de muestra...")
        
        pacientes = [u for u in users if u['rol'] == 'paciente']
        assessments = []
        
        for paciente in pacientes:
            # Evaluación inicial
            assessment = {
                "user_id": paciente['_id'],
                "tipo": "autodiagnostico_inicial",
                "fecha": paciente['fecha_registro'] + timedelta(days=1),
                "respuestas": {
                    "estado_animo": random.randint(1, 3),
                    "interes_actividades": random.randint(1, 3),
                    "ansiedad": random.randint(1, 3),
                    "preocupaciones": random.randint(1, 3),
                    "estres_laboral": random.randint(1, 3),
                    "desconexion_trabajo": random.randint(1, 3),
                    "problemas_sueno": random.randint(1, 3),
                    "fatiga": random.randint(1, 3),
                    "apoyo_social": random.randint(0, 3),
                    "autocuidado": random.randint(0, 3)
                },
                "puntuacion_total": 0,
                "nivel_riesgo": "",
                "recomendaciones": [],
                "created_at": datetime.now()
            }
            
            # Calcular puntuación
            assessment["puntuacion_total"] = sum(assessment["respuestas"].values())
            max_score = 30
            percentage = (assessment["puntuacion_total"] / max_score) * 100
            
            if percentage >= 70:
                assessment["nivel_riesgo"] = "alto"
                assessment["recomendaciones"] = [
                    "Buscar apoyo profesional inmediato",
                    "Implementar técnicas de manejo del estrés",
                    "Establecer rutina de autocuidado"
                ]
            elif percentage >= 40:
                assessment["nivel_riesgo"] = "moderado"
                assessment["recomendaciones"] = [
                    "Seguimiento regular del estado emocional",
                    "Practicar mindfulness",
                    "Mejorar higiene del sueño"
                ]
            else:
                assessment["nivel_riesgo"] = "bajo"
                assessment["recomendaciones"] = [
                    "Mantener hábitos saludables",
                    "Continuar con seguimiento preventivo"
                ]
            
            assessments.append(assessment)
        
        # Insertar evaluaciones
        if assessments:
            result = self.assessments.insert_many(assessments)
            print(f"✅ {len(result.inserted_ids)} evaluaciones creadas")
        
        return assessments
    
    def create_sample_recommendations(self, users, emotional_records):
        """Crea recomendaciones de muestra basadas en IA"""
        print("🤖 Creando recomendaciones de IA...")
        
        pacientes = [u for u in users if u['rol'] == 'paciente']
        recommendations = []
        
        for paciente in pacientes:
            # Obtener registros recientes del paciente
            recent_records = [r for r in emotional_records if r['user_id'] == paciente['_id']]
            
            if recent_records:
                # Calcular promedios recientes
                avg_mood = sum(r['mood'] for r in recent_records[-7:]) / min(7, len(recent_records))
                avg_stress = sum(r['stress'] for r in recent_records[-7:]) / min(7, len(recent_records))
                avg_energy = sum(r['energy'] for r in recent_records[-7:]) / min(7, len(recent_records))
                
                # Generar recomendaciones basadas en el estado
                daily_recommendations = []
                
                if avg_stress > 6:
                    daily_recommendations.append({
                        "tipo": "respiracion",
                        "titulo": "Técnica de Respiración 4-7-8",
                        "descripcion": "Reduce el estrés inmediatamente con esta técnica",
                        "duracion": "5 min",
                        "prioridad": "alta",
                        "efectividad": 95
                    })
                
                if avg_energy < 5:
                    daily_recommendations.append({
                        "tipo": "movimiento",
                        "titulo": "Rutina Energizante",
                        "descripcion": "Ejercicios suaves para aumentar tu energía",
                        "duracion": "10 min",
                        "prioridad": "media",
                        "efectividad": 88
                    })
                
                if avg_mood < 6:
                    daily_recommendations.append({
                        "tipo": "mindfulness",
                        "titulo": "Meditación de Gratitud",
                        "descripcion": "Practica la gratitud para mejorar tu estado de ánimo",
                        "duracion": "15 min",
                        "prioridad": "alta",
                        "efectividad": 92
                    })
                
                # Recomendaciones generales
                daily_recommendations.extend([
                    {
                        "tipo": "mindfulness",
                        "titulo": "Pausa Mindful de 3 Minutos",
                        "descripcion": "Breve práctica de atención plena",
                        "duracion": "3 min",
                        "prioridad": "baja",
                        "efectividad": 78
                    },
                    {
                        "tipo": "movimiento",
                        "titulo": "Estiramientos en el Escritorio",
                        "descripcion": "Alivia la tensión muscular",
                        "duracion": "7 min",
                        "prioridad": "media",
                        "efectividad": 82
                    }
                ])
                
                # Crear registro de recomendaciones
                recommendation_record = {
                    "user_id": paciente['_id'],
                    "fecha": datetime.now(),
                    "recomendaciones": daily_recommendations,
                    "estado_base": {
                        "mood": avg_mood,
                        "stress": avg_stress,
                        "energy": avg_energy
                    },
                    "algoritmo_version": "1.0",
                    "created_at": datetime.now()
                }
                
                recommendations.append(recommendation_record)
        
        # Insertar recomendaciones
        if recommendations:
            result = self.recommendations.insert_many(recommendations)
            print(f"✅ {len(result.inserted_ids)} conjuntos de recomendaciones creados")
        
        return recommendations
    
    def get_user_statistics(self):
        """Obtiene estadísticas de usuarios"""
        stats = {
            "total_users": self.users.count_documents({}),
            "active_users": self.users.count_documents({"activo": True}),
            "users_by_role": {},
            "recent_registrations": self.users.count_documents({
                "fecha_registro": {"$gte": datetime.now() - timedelta(days=30)}
            })
        }
        
        # Contar por rol
        for role in ["paciente", "psicologo", "administrador"]:
            stats["users_by_role"][role] = self.users.count_documents({"rol": role})
        
        return stats
    
    def get_emotional_data_statistics(self):
        """Obtiene estadísticas de datos emocionales"""
        stats = {
            "total_records": self.emotional_records.count_documents({}),
            "records_last_week": self.emotional_records.count_documents({
                "fecha": {"$gte": datetime.now() - timedelta(days=7)}
            }),
            "avg_mood": 0,
            "avg_stress": 0,
            "users_with_records": len(self.emotional_records.distinct("user_id"))
        }
        
        # Calcular promedios
        pipeline = [
            {"$group": {
                "_id": None,
                "avg_mood": {"$avg": "$mood"},
                "avg_stress": {"$avg": "$stress"}
            }}
        ]
        
        result = list(self.emotional_records.aggregate(pipeline))
        if result:
            stats["avg_mood"] = round(result[0]["avg_mood"], 2)
            stats["avg_stress"] = round(result[0]["avg_stress"], 2)
        
        return stats
    
    def cleanup_expired_sessions(self):
        """Limpia sesiones expiradas"""
        result = self.sessions.delete_many({
            "expires_at": {"$lt": datetime.now()}
        })
        print(f"🧹 {result.deleted_count} sesiones expiradas eliminadas")
    
    def export_data_backup(self, filename="Eunonia_backup.json"):
        """Exporta backup de datos"""
        backup_data = {
            "users": list(self.users.find({}, {"password": 0})),  # Excluir contraseñas
            "emotional_records": list(self.emotional_records.find({})),
            "assessments": list(self.assessments.find({})),
            "recommendations": list(self.recommendations.find({})),
            "backup_date": datetime.now().isoformat()
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"💾 Backup exportado a {filename}")
        return backup_data

# Ejecutar configuración
if __name__ == "__main__":
    print("🚀 Iniciando configuración de MongoDB...")
    
    # Inicializar manager
    mongo_manager = MongoDBManager()
    
    # Configurar colecciones
    mongo_manager.setup_collections()
    
    # Crear usuarios de prueba
    users = mongo_manager.create_test_users()
    
    # Crear datos de muestra
    emotional_records = mongo_manager.create_sample_emotional_records(users)
    assessments = mongo_manager.create_sample_assessments(users)
    recommendations = mongo_manager.create_sample_recommendations(users, emotional_records)
    
    # Mostrar estadísticas
    print("\n📊 Estadísticas finales:")
    user_stats = mongo_manager.get_user_statistics()
    emotional_stats = mongo_manager.get_emotional_data_statistics()
    
    print(f"👥 Total usuarios: {user_stats['total_users']}")
    print(f"✅ Usuarios activos: {user_stats['active_users']}")
    print(f"🏥 Pacientes: {user_stats['users_by_role']['paciente']}")
    print(f"👨‍⚕️ Psicólogos: {user_stats['users_by_role']['psicologo']}")
    print(f"🛡️ Administradores: {user_stats['users_by_role']['administrador']}")
    print(f"📊 Registros emocionales: {emotional_stats['total_records']}")
    print(f"📈 Estado de ánimo promedio: {emotional_stats['avg_mood']}")
    print(f"⚡ Estrés promedio: {emotional_stats['avg_stress']}")
    
    # Crear backup
    mongo_manager.export_data_backup()
    
    print("\n✅ Configuración de MongoDB completada!")
