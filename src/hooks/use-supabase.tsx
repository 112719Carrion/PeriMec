import { supabase } from "@/src/lib/supabase"

// Hook simple para usar el cliente de Supabase
export function useSupabase() {
  return supabase
}
