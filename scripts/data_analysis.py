import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import json
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import warnings
warnings.filterwarnings('ignore')

class MentalHealthAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.mood_predictor = RandomForestRegressor(n_estimators=100, random_state=42)
        
    def generate_sample_data(self, n_users=100, days_back=90):
        """Genera datos de muestra para análisis"""
        np.random.seed(42)
        
        # Generar usuarios
        users = []
        for i in range(n_users):
            user_type = np.random.choice(['paciente', 'psicologo'], p=[0.8, 0.2])
            users.append({
                'user_id': f'user_{i:03d}',
                'tipo': user_type,
                'edad': np.random.randint(22, 45),
                'genero': np.random.choice(['M', 'F', 'Otro']),
                'profesion': np.random.choice([
                    'Desarrollador', 'Diseñador', 'Marketing', 'Consultor',
                    'Analista', 'Gerente', 'Ingeniero', 'Abogado'
                ])
            })
        
        # Generar registros emocionales
        registros = []
        base_date = datetime.now() - timedelta(days=days_back)
        
        for user in users:
            if user['tipo'] == 'paciente':
                # Cada paciente tiene un patrón único de bienestar
                base_mood = np.random.uniform(4, 8)
                base_stress = np.random.uniform(2, 7)
                
                for day in range(days_back):
                    current_date = base_date + timedelta(days=day)
                    
                    # Variaciones estacionales y semanales
                    week_effect = 0.5 * np.sin(2 * np.pi * day / 7)  # Efecto semanal
                    trend_effect = 0.1 * (day / days_back)  # Tendencia de mejora
                    noise = np.random.normal(0, 0.5)
                    
                    mood = np.clip(base_mood + week_effect + trend_effect + noise, 1, 10)
                    stress = np.clip(base_stress - week_effect - trend_effect + noise, 1, 10)
                    energy = np.clip(mood * 0.8 + np.random.normal(0, 0.5), 1, 10)
                    sleep = np.clip(8 - stress * 0.3 + np.random.normal(0, 0.5), 1, 10)
                    
                    # Probabilidad de registro basada en el estado emocional
                    if np.random.random() < 0.7:  # 70% de días con registro
                        registros.append({
                            'user_id': user['user_id'],
                            'fecha': current_date.isoformat(),
                            'mood': round(mood, 1),
                            'stress': round(stress, 1),
                            'energy': round(energy, 1),
                            'sleep': round(sleep, 1),
                            'emociones': np.random.choice([
                                'feliz', 'ansioso', 'calmado', 'frustrado', 
                                'motivado', 'cansado', 'optimista', 'abrumado'
                            ], size=np.random.randint(1, 4)).tolist()
                        })
        
        return pd.DataFrame(users), pd.DataFrame(registros)
    
    def analyze_mood_patterns(self, df_registros):
        """Analiza patrones de estado de ánimo"""
        df_registros['fecha'] = pd.to_datetime(df_registros['fecha'])
        df_registros['dia_semana'] = df_registros['fecha'].dt.day_name()
        df_registros['semana'] = df_registros['fecha'].dt.isocalendar().week
        
        # Análisis por día de la semana
        mood_by_day = df_registros.groupby('dia_semana').agg({
            'mood': ['mean', 'std'],
            'stress': ['mean', 'std'],
            'energy': ['mean', 'std']
        }).round(2)
        
        # Tendencias temporales
        weekly_trends = df_registros.groupby('semana').agg({
            'mood': 'mean',
            'stress': 'mean',
            'energy': 'mean',
            'sleep': 'mean'
        }).round(2)
        
        return {
            'mood_by_day': mood_by_day,
            'weekly_trends': weekly_trends,
            'correlations': df_registros[['mood', 'stress', 'energy', 'sleep']].corr()
        }
    
    def cluster_users(self, df_users, df_registros):
        """Agrupa usuarios por patrones de bienestar"""
        # Calcular métricas por usuario
        user_metrics = df_registros.groupby('user_id').agg({
            'mood': ['mean', 'std'],
            'stress': ['mean', 'std'],
            'energy': ['mean', 'std'],
            'sleep': ['mean', 'std']
        }).round(2)
        
        # Aplanar columnas
        user_metrics.columns = ['_'.join(col).strip() for col in user_metrics.columns]
        user_metrics = user_metrics.fillna(0)
        
        # Clustering
        X = self.scaler.fit_transform(user_metrics)
        kmeans = KMeans(n_clusters=4, random_state=42)
        clusters = kmeans.fit_predict(X)
        
        user_metrics['cluster'] = clusters
        
        # Interpretar clusters
        cluster_interpretation = {}
        for i in range(4):
            cluster_data = user_metrics[user_metrics['cluster'] == i]
            cluster_interpretation[f'Cluster_{i}'] = {
                'size': len(cluster_data),
                'avg_mood': cluster_data['mood_mean'].mean(),
                'avg_stress': cluster_data['stress_mean'].mean(),
                'description': self._interpret_cluster(
                    cluster_data['mood_mean'].mean(),
                    cluster_data['stress_mean'].mean()
                )
            }
        
        return user_metrics, cluster_interpretation
    
    def _interpret_cluster(self, avg_mood, avg_stress):
        """Interpreta el significado de un cluster"""
        if avg_mood >= 7 and avg_stress <= 4:
            return "Bienestar Alto - Estado emocional positivo y bajo estrés"
        elif avg_mood >= 6 and avg_stress <= 6:
            return "Bienestar Moderado - Estado emocional estable"
        elif avg_mood <= 5 and avg_stress >= 6:
            return "Riesgo Alto - Requiere atención inmediata"
        else:
            return "Bienestar Variable - Necesita seguimiento"
    
    def predict_mood_trends(self, df_registros):
        """Predice tendencias futuras de estado de ánimo"""
        df_registros['fecha'] = pd.to_datetime(df_registros['fecha'])
        df_registros = df_registros.sort_values('fecha')
        
        # Preparar datos para predicción
        df_registros['days_since_start'] = (df_registros['fecha'] - df_registros['fecha'].min()).dt.days
        df_registros['day_of_week'] = df_registros['fecha'].dt.dayofweek
        
        # Features para el modelo
        features = ['days_since_start', 'day_of_week', 'stress', 'energy', 'sleep']
        X = df_registros[features].fillna(df_registros[features].mean())
        y = df_registros['mood']
        
        # Entrenar modelo
        self.mood_predictor.fit(X, y)
        
        # Predicciones para próximos 7 días
        last_day = df_registros['days_since_start'].max()
        predictions = []
        
        for i in range(1, 8):
            future_day = last_day + i
            day_of_week = (df_registros['fecha'].max() + timedelta(days=i)).weekday()
            
            # Usar promedios para stress, energy, sleep
            avg_stress = df_registros['stress'].mean()
            avg_energy = df_registros['energy'].mean()
            avg_sleep = df_registros['sleep'].mean()
            
            pred_features = [[future_day, day_of_week, avg_stress, avg_energy, avg_sleep]]
            mood_pred = self.mood_predictor.predict(pred_features)[0]
            
            predictions.append({
                'day': i,
                'predicted_mood': round(mood_pred, 1),
                'confidence': 'Alta' if abs(mood_pred - df_registros['mood'].mean()) < 1 else 'Media'
            })
        
        return predictions
    
    def generate_insights(self, df_users, df_registros):
        """Genera insights y recomendaciones"""
        insights = []
        
        # Análisis general
        avg_mood = df_registros['mood'].mean()
        avg_stress = df_registros['stress'].mean()
        
        if avg_stress > 6:
            insights.append({
                'type': 'alert',
                'title': 'Nivel de Estrés Elevado',
                'description': f'El estrés promedio es {avg_stress:.1f}/10. Se recomienda implementar más técnicas de relajación.',
                'priority': 'high'
            })
        
        if avg_mood < 5:
            insights.append({
                'type': 'alert',
                'title': 'Estado de Ánimo Bajo',
                'description': f'El estado de ánimo promedio es {avg_mood:.1f}/10. Considerar intervenciones adicionales.',
                'priority': 'high'
            })
        
        # Análisis de correlaciones
        corr_stress_sleep = df_registros['stress'].corr(df_registros['sleep'])
        if corr_stress_sleep < -0.5:
            insights.append({
                'type': 'insight',
                'title': 'Relación Estrés-Sueño',
                'description': f'Fuerte correlación negativa ({corr_stress_sleep:.2f}) entre estrés y calidad del sueño.',
                'priority': 'medium'
            })
        
        # Patrones semanales
        df_registros['dia_semana'] = pd.to_datetime(df_registros['fecha']).dt.day_name()
        worst_day = df_registros.groupby('dia_semana')['mood'].mean().idxmin()
        
        insights.append({
            'type': 'pattern',
            'title': 'Patrón Semanal',
            'description': f'Los {worst_day}s muestran el estado de ánimo más bajo de la semana.',
            'priority': 'low'
        })
        
        return insights
    
    def export_analysis_report(self, analysis_results, filename='mental_health_report.json'):
        """Exporta el reporte de análisis"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': analysis_results,
            'recommendations': [
                'Implementar sesiones de mindfulness los días de mayor estrés',
                'Crear alertas automáticas para usuarios en riesgo alto',
                'Desarrollar programas personalizados basados en clusters de usuarios',
                'Monitorear patrones de sueño como indicador temprano de estrés'
            ]
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"Reporte exportado a {filename}")
        return report

# Ejecutar análisis
if __name__ == "__main__":
    analyzer = MentalHealthAnalyzer()
    
    print("🧠 Generando datos de muestra...")
    df_users, df_registros = analyzer.generate_sample_data(n_users=150, days_back=90)
    
    print("📊 Analizando patrones de estado de ánimo...")
    mood_patterns = analyzer.analyze_mood_patterns(df_registros)
    
    print("👥 Agrupando usuarios por patrones...")
    user_clusters, cluster_info = analyzer.cluster_users(df_users, df_registros)
    
    print("🔮 Prediciendo tendencias futuras...")
    mood_predictions = analyzer.predict_mood_trends(df_registros)
    
    print("💡 Generando insights...")
    insights = analyzer.generate_insights(df_users, df_registros)
    
    # Compilar resultados
    analysis_results = {
        'total_users': len(df_users),
        'total_records': len(df_registros),
        'mood_patterns': mood_patterns,
        'user_clusters': cluster_info,
        'predictions': mood_predictions,
        'insights': insights
    }
    
    print("📄 Exportando reporte...")
    report = analyzer.export_analysis_report(analysis_results)
    
    print("\n✅ Análisis completado!")
    print(f"📈 Usuarios analizados: {len(df_users)}")
    print(f"📊 Registros procesados: {len(df_registros)}")
    print(f"🎯 Insights generados: {len(insights)}")
    print(f"🔮 Predicciones: {len(mood_predictions)} días")
