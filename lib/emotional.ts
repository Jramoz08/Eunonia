import { supabase } from "@/lib/supabaseClient"

export interface EmotionalRecord {
    id: string
    user_id: string
    fecha: string
    mood: number
    stress: number
    energy: number
    sleep: number
    emociones: string[]
    notas: string
    created_at: string
}

export async function getEmotionalRecords(userId: string): Promise<EmotionalRecord[]> {
    const { data, error } = await supabase
        .from("emotional_records")
        .select("*")
        .eq("user_id", userId)
        .order("fecha", { ascending: true })

    if (error) {
        console.error("Error al obtener registros emocionales:", error)
        return []   
    }

    return data || []
}