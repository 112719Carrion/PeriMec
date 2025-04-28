export interface UserData {
    id: string
    email: string
    full_name?: string
    phone?: string
    role: string
    is_active: boolean
    created_at: string
    last_sign_in_at?: string
    confirmed_at?: string
  }
  
  export interface CreateUserData {
    email: string
    password: string
    full_name?: string
    phone?: string
    role: string
  }
  