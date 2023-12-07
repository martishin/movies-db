import React, { createContext } from "react"

export interface JwtContext {
  jwtToken: string
  setJwtToken: React.Dispatch<React.SetStateAction<string>>
}

export const AuthContext = createContext<JwtContext | undefined>(undefined)
