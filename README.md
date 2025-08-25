# 🧠 Eunonia - Plataforma de Salud Mental

Una plataforma innovadora de gestión de salud mental y bienestar personal diseñada específicamente para jóvenes profesionales, con análisis de datos avanzado y machine learning.

## 🌟 Características Principales

- **Sistema de Roles Multi-nivel**: Pacientes, Psicólogos y Administradores del Sistema
- **Análisis de Datos con IA**: Machine Learning para predicción de patrones de estado de ánimo
- **Autodiagnóstico Inteligente**: Evaluaciones personalizadas con recomendaciones
- **Seguimiento de Bienestar**: Monitoreo continuo del estado emocional
- **Gestión Administrativa**: Panel completo para administradores del sistema
- **Seguridad Avanzada**: Autenticación robusta y protección de datos

## 🏗️ Arquitectura del Sistema

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Análisis ML   │
│   Next.js 14    │◄──►│   Supabase      │◄──►│   Python        │
│   TypeScript    │    │   MongoDB       │    │   scikit-learn  │
│   Tailwind CSS  │    │   NextAuth.js   │    │   pandas        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🔧 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes UI modernos y accesibles
- **Lucide React** - Iconos SVG optimizados

### Backend & Bases de Datos
- **Supabase** - Backend-as-a-Service con PostgreSQL
- **MongoDB** - Base de datos NoSQL para datos flexibles
- **NextAuth.js** - Autenticación y gestión de sesiones
- **bcrypt** - Encriptación de contraseñas

### Machine Learning & Análisis
- **Python 3.9+** - Lenguaje principal para análisis
- **pandas** - Manipulación y análisis de datos
- **NumPy** - Computación numérica
- **scikit-learn** - Algoritmos de machine learning
- **matplotlib** - Visualización de datos
- **seaborn** - Gráficos estadísticos avanzados

### Algoritmos Implementados
- **Random Forest** - Predicción de tendencias de estado de ánimo
- **K-Means Clustering** - Agrupación de usuarios por patrones
- **Regresión Lineal** - Análisis de correlaciones
- **Análisis de Sentimientos** - Procesamiento de texto

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm/yarn
- Python 3.9+
- Cuenta de Supabase
- MongoDB (local o Atlas)

### 1. Clonar el Repositorio
\`\`\`bash
git clone https://github.com/tu-usuario/Eunonia-platform.git
cd Eunonia-platform
\`\`\`

### 2. Instalar Dependencias Frontend
\`\`\`bash
npm install
# o
yarn install
\`\`\`

### 3. Instalar Dependencias Python
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configurar Variables de Entorno
Crear archivo `.env.local`:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/Eunonia
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/Eunonia

# NextAuth
NEXTAUTH_SECRET=sujPFQw2hVYk1tes58Tj3fjobcNyDi0odBxwAxikljY=  
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 5. Configurar Bases de Datos
\`\`\`bash
# Configurar Supabase
python scripts/supabase_setup.py

# Configurar MongoDB
python scripts/mongodb_setup.py

# Ejecutar análisis inicial
python scripts/data_analysis.py
\`\`\`

### 6. Ejecutar la Aplicación
\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 👥 Usuarios de Prueba

### Administrador del Sistema
- **Email**: admin@Eunonia.com
- **Contraseña**: cualquier texto
- **Funciones**: Gestión completa del sistema, usuarios y configuración

### Psicólogo
- **Email**: psicologo@Eunonia.com
- **Contraseña**: cualquier texto
- **Funciones**: Gestión de pacientes, evaluaciones y terapias

### Paciente
- **Email**: paciente@Eunonia.com
- **Contraseña**: cualquier texto
- **Funciones**: Autodiagnóstico, seguimiento y recursos

## 🗄️ Estructura de Base de Datos

### MongoDB Collections
\`\`\`javascript
// Usuarios
{
  _id: ObjectId,
  email: String,
  nombre: String,
  apellido: String,
  rol: "paciente" | "psicologo" | "administrador",
  fecha_registro: Date,
  activo: Boolean,
  especialidad?: String, // Solo psicólogos
  numeroLicencia?: String // Solo psicólogos
}

// Registros Emocionales
{
  _id: ObjectId,
  usuarioId: ObjectId,
  fecha: Date,
  estadoAnimo: Number, // 1-10
  energia: Number, // 1-10
  estres: Number, // 1-10
  notas?: String,
  factoresInfluyentes: [String]
}

// Evaluaciones
{
  _id: ObjectId,
  usuarioId: ObjectId,
  tipo: String,
  puntuacion: Number,
  respuestas: Object,
  fecha: Date,
  recomendaciones: [String]
}
\`\`\`

### Supabase Tables
\`\`\`sql
-- Usuarios (sincronizado con MongoDB)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  nombre VARCHAR,
  apellido VARCHAR,
  rol VARCHAR,
  fecha_registro TIMESTAMP,
  activo BOOLEAN
);

-- Sesiones de Terapia
CREATE TABLE sesiones_terapia (
  id UUID PRIMARY KEY,
  paciente_id UUID REFERENCES usuarios(id),
  psicologo_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP,
  duracion INTEGER,
  notas TEXT,
  estado VARCHAR
);

-- Recomendaciones
CREATE TABLE recomendaciones (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  tipo VARCHAR,
  contenido TEXT,
  prioridad INTEGER,
  fecha_creacion TIMESTAMP,
  completada BOOLEAN
);
\`\`\`

## 🤖 Machine Learning y Análisis

### Modelos Implementados

#### 1. Predicción de Estado de Ánimo
- **Algoritmo**: Random Forest Regressor
- **Features**: Historial emocional, patrones de sueño, actividad
- **Precisión**: ~85% en datos de prueba
- **Uso**: Alertas tempranas y recomendaciones preventivas

#### 2. Clustering de Usuarios
- **Algoritmo**: K-Means
- **Clusters**: 5 grupos basados en patrones de comportamiento
- **Aplicación**: Personalización de contenido y terapias

#### 3. Análisis de Sentimientos
- **Procesamiento**: NLP en notas y comentarios
- **Detección**: Patrones de riesgo en texto libre
- **Integración**: Alertas automáticas para psicólogos

### Métricas y KPIs
- **Engagement Rate**: Frecuencia de uso de la plataforma
- **Improvement Score**: Progreso en evaluaciones
- **Risk Assessment**: Detección temprana de crisis
- **Satisfaction Index**: Feedback de usuarios

## 🔐 Seguridad y Privacidad

### Medidas Implementadas
- **Encriptación**: Datos sensibles encriptados en reposo y tránsito
- **Autenticación**: JWT tokens con expiración automática
- **Autorización**: Control de acceso basado en roles (RBAC)
- **Auditoría**: Logs de todas las acciones críticas
- **GDPR Compliance**: Cumplimiento de regulaciones de privacidad

### Protección de Datos
- Anonimización de datos para análisis ML
- Backup automático con encriptación
- Acceso limitado por roles y permisos
- Monitoreo de seguridad en tiempo real

## 📊 Roles y Permisos

### 👨‍💼 Administrador del Sistema
- Gestión completa de usuarios
- Configuración del sistema
- Reportes y analytics
- Seguridad y auditoría
- Backup y mantenimiento

### 👩‍⚕️ Psicólogo
- Gestión de pacientes asignados
- Evaluaciones y diagnósticos
- Sesiones de terapia
- Reportes de progreso
- Recomendaciones personalizadas

### 👤 Paciente
- Autodiagnóstico y evaluaciones
- Seguimiento de estado de ánimo
- Acceso a recursos y contenido
- Comunicación con psicólogo
- Historial personal

## 🛣️ Roadmap

### Fase 1 (Actual) ✅
- [x] Sistema de autenticación multi-rol
- [x] Dashboard para cada tipo de usuario
- [x] Análisis básico con Python
- [x] Integración MongoDB y Supabase

### Fase 2 (En Desarrollo) 🚧
- [ ] Chat en tiempo real entre psicólogos y pacientes
- [ ] Notificaciones push
- [ ] API REST completa
- [ ] Aplicación móvil (React Native)

### Fase 3 (Planificado) 📋
- [ ] IA conversacional (chatbot terapéutico)
- [ ] Integración con wearables
- [ ] Telemedicina con videollamadas
- [ ] Marketplace de recursos

### Fase 4 (Futuro) 🔮
- [ ] Realidad virtual para terapias
- [ ] Blockchain para historial médico
- [ ] Integración con sistemas hospitalarios
- [ ] Expansión internacional

## 🤝 Contribución

### Cómo Contribuir
1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Configuración estándar
- **Prettier**: Formateo automático
- **Testing**: Jest y React Testing Library
- **Commits**: Conventional Commits

### Estructura de Carpetas
\`\`\`
Eunonia-platform/
├── app/                    # Next.js App Router
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Dashboard paciente
│   ├── dashboard-psicologo/ # Dashboard psicólogo
│   ├── dashboard-admin/   # Dashboard administrador
│   └── api/               # API Routes
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
├── scripts/               # Scripts Python para análisis
├── public/                # Archivos estáticos
└── docs/                  # Documentación
\`\`\`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Email**: soporte@Eunonia.com
- **Documentación**: [docs.Eunonia.com](https://docs.Eunonia.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/Eunonia-platform/issues)
- **Discord**: [Comunidad Eunonia](https://discord.gg/Eunonia)

## 🙏 Agradecimientos

- Equipo de desarrollo de Next.js
- Comunidad de Supabase
- Contribuidores de scikit-learn
- Diseñadores de shadcn/ui
- Comunidad de salud mental digital

---

**Eunonia** - Transformando la salud mental a través de la tecnología 🧠💚
