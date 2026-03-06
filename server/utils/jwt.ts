import jwt from 'jsonwebtoken'

export interface JWTPayload {
  userId: number
  email: string
  role: string
}

export function signToken(payload: JWTPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string, secret: string): JWTPayload | null {
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}
