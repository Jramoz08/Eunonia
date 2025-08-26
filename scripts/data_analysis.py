import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from supabase import create_client
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import json
import warnings
from dotenv import load_dotenv
load_dotenv()

warnings.filterwarnings('ignore')


class MentalHealthAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.mood_predictor = RandomForestRegressor(n_estimators=100, random_state=42)

    def fetch_data(self, supabase):
        res_users = supabase.table("users").select("id, rol, profesion").eq("rol", "paciente").execute()
        df_users = pd.DataFrame(res_users.data or [])

        res_records = supabase.table("emotional_records").select("*").execute()
        df_registros = pd.DataFrame(res_records.data or [])

        if df_registros.empty or df_users.empty:
            print(" No se encontraron registros o usuarios.")
            return df_users, df_registros

        df_registros['fecha'] = pd.to_datetime(df_registros['fecha'])

        if df_registros['emociones'].dtype == object:
            df_registros['emociones'] = df_registros['emociones'].apply(
                lambda x: list(x) if isinstance(x, list) else json.loads(x) if isinstance(x, str) else []
            )

        df_registros = df_registros[df_registros['user_id'].isin(df_users['id'])]
        return df_users, df_registros

    def analyze_mood_patterns(self, df):
        df = df.copy()
        df['dia_semana'] = df['fecha'].dt.day_name()
        df['semana'] = df['fecha'].dt.isocalendar().week.astype(int)  # <-- CORRECCIÓN: convertir a int nativo

        mood_by_day = df.groupby('dia_semana').agg({
            'mood': ['mean', 'std'],
            'stress': ['mean', 'std'],
            'energy': ['mean', 'std']
        }).round(2)
        mood_by_day.columns = ['_'.join(col) for col in mood_by_day.columns]

        weekly_trends = df.groupby('semana').agg({
            'mood': 'mean',
            'stress': 'mean',
            'energy': 'mean',
            'sleep': 'mean'
        }).round(2)
        weekly_trends.index = weekly_trends.index.astype(int)  # <-- CORRECCIÓN: índice a int nativo

        return {
            'mood_by_day': mood_by_day.to_dict(),
            'weekly_trends': weekly_trends.to_dict(),
            'correlations': df[['mood', 'stress', 'energy', 'sleep']].corr().round(2).to_dict()
        }

    def cluster_users(self, df_users, df_registros):
        user_metrics = df_registros.groupby('user_id').agg({
            'mood': ['mean', 'std'],
            'stress': ['mean', 'std'],
            'energy': ['mean', 'std'],
            'sleep': ['mean', 'std']
        }).round(2).fillna(0)

        user_metrics.columns = ['_'.join(col) for col in user_metrics.columns]
        X = self.scaler.fit_transform(user_metrics)
        kmeans = KMeans(n_clusters=4, random_state=42)
        user_metrics['cluster'] = kmeans.fit_predict(X)

        cluster_info = {}
        for i in range(4):
            grp = user_metrics[user_metrics['cluster'] == i]
            cluster_info[f'Cluster_{i}'] = {
                'size': len(grp),
                'avg_mood': round(grp['mood_mean'].mean(), 2),
                'avg_stress': round(grp['stress_mean'].mean(), 2),
                'description': self._interpret_cluster(grp['mood_mean'].mean(), grp['stress_mean'].mean())
            }

        return user_metrics.reset_index(), cluster_info

    def _interpret_cluster(self, avg_mood, avg_stress):
        if avg_mood >= 7 and avg_stress <= 4:
            return "Bienestar Alto"
        elif avg_mood >= 6 and avg_stress <= 6:
            return "Bienestar Moderado"
        elif avg_mood <= 5 and avg_stress >= 6:
            return "Riesgo Alto"
        else:
            return "Bienestar Variable"

    def predict_mood_trends(self, df):
        df = df.copy().sort_values('fecha')
        df['days_since'] = (df['fecha'] - df['fecha'].min()).dt.days
        df['dow'] = df['fecha'].dt.dayofweek

        features = ['days_since', 'dow', 'stress', 'energy', 'sleep']
        X = df[features].fillna(df[features].mean())
        y = df['mood']
        self.mood_predictor.fit(X, y)

        last_day = df['days_since'].max()
        base_date = df['fecha'].max()
        avg = df[['stress', 'energy', 'sleep']].mean()

        predictions = []
        for i in range(1, 8):
            future_day = last_day + i
            dow = (base_date + timedelta(days=i)).weekday()
            pred = self.mood_predictor.predict([[future_day, dow, avg['stress'], avg['energy'], avg['sleep']]])[0]
            predictions.append({
                'day': i,
                'predicted_mood': round(pred, 1),
                'confidence': 'Alta' if abs(pred - df['mood'].mean()) < 1 else 'Media'
            })
        return predictions

    def generate_insights(self, df_users, df_registros):
        insights = []
        avg_mood = df_registros['mood'].mean()
        avg_stress = df_registros['stress'].mean()

        if avg_stress > 6:
            insights.append({
                'type': 'alert',
                'title': 'Nivel de Estrés Elevado',
                'description': f'Estrés promedio: {avg_stress:.1f}/10.',
                'priority': 'high'
            })

        if avg_mood < 5:
            insights.append({
                'type': 'alert',
                'title': 'Estado de Ánimo Bajo',
                'description': f'Ánimo promedio: {avg_mood:.1f}/10.',
                'priority': 'high'
            })

        corr = df_registros['stress'].corr(df_registros['sleep'])
        if corr < -0.5:
            insights.append({
                'type': 'insight',
                'title': 'Relación Estrés-Sueño',
                'description': f'Correlación negativa significativa ({corr:.2f})',
                'priority': 'medium'
            })

        peor_dia = df_registros.groupby(df_registros['fecha'].dt.day_name())['mood'].mean().idxmin()
        insights.append({
            'type': 'pattern',
            'title': 'Día de Ánimo Más Bajo',
            'description': f'Los {peor_dia}s son los peores en promedio.',
            'priority': 'low'
        })

        return insights

    def export_analysis_report(self, analysis_results, filename='mental_health_report.json'):
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': analysis_results,
            'recommendations': [
                'Implementar técnicas de relajación los días críticos',
                'Monitorear usuarios en clúster de alto riesgo',
                'Personalizar intervenciones según clúster',
                'Observar calidad del sueño como predictor de estrés'
            ]
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        print(f" Reporte exportado a {filename}")
        return report


def main():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print(" Faltan variables de entorno SUPABASE.")
        return

    supabase = create_client(url, key)
    analyzer = MentalHealthAnalyzer()

    print(" Cargando datos desde Supabase...")
    df_users, df_registros = analyzer.fetch_data(supabase)

    if df_users.empty or df_registros.empty:
        print(" Datos insuficientes para análisis.")
        return

    print(" Analizando patrones de estado de ánimo...")
    mood_patterns = analyzer.analyze_mood_patterns(df_registros)

    print("Agrupando usuarios...")
    user_clusters, cluster_info = analyzer.cluster_users(df_users, df_registros)

    print("Prediciendo tendencias...")
    predictions = analyzer.predict_mood_trends(df_registros)

    print("Generando insights...")
    insights = analyzer.generate_insights(df_users, df_registros)

    results = {
        'total_users': len(df_users),
        'total_records': len(df_registros),
        'mood_patterns': mood_patterns,
        'user_clusters': cluster_info,
        'predictions': predictions,
        'insights': insights
    }

    print(" Exportando reporte final...")
    analyzer.export_analysis_report(results)

    print(" Análisis completado.")
    print(f" Usuarios analizados: {len(df_users)}")
    print(f" Registros emocionales: {len(df_registros)}")

    return results  


if __name__ == "__main__":
    results = main()
    if results:
        print(json.dumps(results))  # <-- Esto es clave para leer desde Next.js

