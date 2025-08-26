"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MentalHealthDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analitycs");
      const json = await res.json();
      setData(json);
      setOpen(true); // abre modal cuando llegan los datos
      console.log("abriendo modal con data:", json);
    } catch (err) {
      console.error("Error ejecutando análisis:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Análisis de Salud Mental</h1>

      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          runAnalysis();
        }}
        disabled={loading}
      >
        {loading ? "Analizando..." : "Ejecutar análisis"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resultados del Análisis</DialogTitle>
            <DialogDescription>
              Aquí encontrarás un resumen, patrones y recomendaciones basados en
              los datos procesados.
            </DialogDescription>
          </DialogHeader>

          {data ? (
            <Tabs defaultValue="resumen">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="patrones">Patrones</TabsTrigger>
                <TabsTrigger value="predicciones">Predicciones</TabsTrigger>
                <TabsTrigger value="recomendaciones">
                  Recomendaciones
                </TabsTrigger>
              </TabsList>

              {/* 📌 Resumen */}
              <TabsContent value="resumen">
                <p>
                  <strong>Total usuarios:</strong>{" "}
                  {data?.summary?.total_users ?? "N/A"}
                </p>
                <p>
                  <strong>Total registros:</strong>{" "}
                  {data?.summary?.total_records ?? "N/A"}
                </p>

                <h3 className="font-semibold mt-4">Insights</h3>
                <ul className="list-disc ml-6">
                  {(data?.summary?.insights || []).map((i, idx) => (
                    <li key={idx}>
                      <strong>{i.title}:</strong> {i.description}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              {/* 📌 Patrones */}
              <TabsContent value="patrones">
                <h3 className="font-semibold">Promedios por día</h3>
                <ul className="list-disc ml-6">
                  {data?.summary?.mood_patterns?.mood_by_day?.mood_mean
                    ? Object.entries(
                        data.summary.mood_patterns.mood_by_day.mood_mean
                      ).map(([day, val]) => (
                        <li key={day}>
                          {day}: ánimo promedio {val.toFixed(2)}
                        </li>
                      ))
                    : <li>No hay datos disponibles</li>}
                </ul>
              </TabsContent>

              {/* 📌 Predicciones */}
              <TabsContent value="predicciones">
                <h3 className="font-semibold">Predicciones de ánimo</h3>
                <ul className="list-disc ml-6">
                  {(data?.summary?.predictions || []).map((p, idx) => (
                    <li key={idx}>
                      Día {p.day}: {p.predicted_mood} (Confianza {p.confidence})
                    </li>
                  ))}
                </ul>
              </TabsContent>

              {/* 📌 Recomendaciones */}
              <TabsContent value="recomendaciones">
                <h3 className="font-semibold">Recomendaciones</h3>
                <ul className="list-disc ml-6">
                  {(data?.recommendations || []).map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-gray-500">
              Ejecuta un análisis para ver resultados
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
