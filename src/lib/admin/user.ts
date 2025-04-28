import { createServiceClient } from "@/src/lib/supabase"
import type { UserData, CreateUserData } from "@/types/user"

// Función para obtener todos los usuarios
export async function fetchUsers(): Promise<UserData[]> {
  try {
    // Usamos el cliente de servicio para acceder a la API administrativa de Supabase
    const serviceClient = createServiceClient()

    if (!serviceClient) {
      console.error("No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Obtener usuarios de auth.users
    const { data: authUsers, error: authError } = await serviceClient.auth.admin.listUsers()

    if (authError) {
      console.error("Error al obtener usuarios de auth:", authError)
      throw authError
    }

    // Obtener perfiles de usuarios de la tabla profiles
    const { data: profiles, error: profilesError } = await serviceClient.from("profiles").select("*")

    if (profilesError) {
      console.error("Error al obtener perfiles:", profilesError)
      // Continuamos aunque haya error, ya que podríamos no tener la tabla profiles
    }

    // Combinar datos de auth.users con profiles
    const users: UserData[] = authUsers.users.map((authUser) => {
      // Buscar el perfil correspondiente
      const profile = profiles?.find((p) => p.id === authUser.id)

      return {
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || profile?.full_name || "",
        phone: authUser.user_metadata?.phone || profile?.phone || "",
        role: profile?.role || authUser.role || "user",
        is_active: !authUser.banned && !authUser.deleted_at,
        created_at: authUser.created_at || "",
        last_sign_in_at: authUser.last_sign_in_at || "",
        confirmed_at: authUser.email_confirmed_at || "",
      }
    })

    return users
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    throw error
  }
}

// Función para crear un nuevo usuario
export async function createUser(userData: CreateUserData): Promise<UserData> {
  try {
    const serviceClient = createServiceClient()

    if (!serviceClient) {
      throw new Error("No se pudo crear el cliente de servicio de Supabase")
    }

    // Crear el usuario en Supabase Auth
    const { data, error } = await serviceClient.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Confirmar el email automáticamente
      user_metadata: {
        full_name: userData.full_name,
        phone: userData.phone,
      },
    })

    if (error) {
      throw error
    }

    // Crear el perfil del usuario en la tabla profiles
    const { error: profileError } = await serviceClient.from("profiles").insert({
      id: data.user.id,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      is_active: true,
      created_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error al crear perfil:", profileError)
      // No lanzamos error aquí para no interrumpir el flujo si la tabla no existe
    }

    // Devolver el usuario creado
    return {
      id: data.user.id,
      email: data.user.email || "",
      full_name: userData.full_name || "",
      phone: userData.phone || "",
      role: userData.role,
      is_active: true,
      created_at: data.user.created_at || new Date().toISOString(),
      last_sign_in_at: "",
      confirmed_at: data.user.email_confirmed_at || "",
    }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    throw error
  }
}

// Función para actualizar los detalles de un usuario
export async function updateUserDetails(userData: UserData): Promise<boolean> {
  try {
    const serviceClient = createServiceClient()

    if (!serviceClient) {
      throw new Error("No se pudo crear el cliente de servicio de Supabase")
    }

    // Actualizar metadatos del usuario
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userData.id, {
      user_metadata: {
        full_name: userData.full_name,
        phone: userData.phone,
      },
      banned: !userData.is_active, // Banear al usuario si está inactivo
    })

    if (updateError) {
      console.error("Error al actualizar usuario:", updateError)
      throw updateError
    }

    // Actualizar perfil en la tabla profiles
    const { error: profileError } = await serviceClient.from("profiles").upsert({
      id: userData.id,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      is_active: userData.is_active,
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error al actualizar perfil:", profileError)
      // No lanzamos error aquí para no interrumpir el flujo si la tabla no existe
    }

    return true
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    throw error
  }
}

// Función para cambiar el estado de un usuario (activo/inactivo)
export async function updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
  try {
    const serviceClient = createServiceClient()

    if (!serviceClient) {
      throw new Error("No se pudo crear el cliente de servicio de Supabase")
    }

    // Actualizar estado del usuario en Supabase Auth
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
      banned: !isActive, // Banear al usuario si está inactivo
    })

    if (updateError) {
      console.error("Error al actualizar estado del usuario:", updateError)
      throw updateError
    }

    // Actualizar estado en la tabla profiles
    const { error: profileError } = await serviceClient
      .from("profiles")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Error al actualizar perfil:", profileError)
      // No lanzamos error aquí para no interrumpir el flujo si la tabla no existe
    }

    return true
  } catch (error) {
    console.error("Error al actualizar estado del usuario:", error)
    throw error
  }
}

// Función para eliminar un usuario
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const serviceClient = createServiceClient()

    if (!serviceClient) {
      throw new Error("No se pudo crear el cliente de servicio de Supabase")
    }

    // Eliminar el perfil primero (para mantener la integridad referencial)
    const { error: profileError } = await serviceClient.from("profiles").delete().eq("id", userId)

    if (profileError) {
      console.error("Error al eliminar perfil:", profileError)
      // No lanzamos error aquí para no interrumpir el flujo si la tabla no existe
    }

    // Eliminar el usuario de Supabase Auth
    const { error: deleteError } = await serviceClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error("Error al eliminar usuario:", deleteError)
      throw deleteError
    }

    return true
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    throw error
  }
}
