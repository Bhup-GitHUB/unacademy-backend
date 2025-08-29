import jwt, { JwtPayload } from "jsonwebtoken"

export function generateToken(input: any): string {
  try {
    const token = jwt.sign({ userId: input }, process.env.JWT_SECRET || "pravin")
    return token
  } catch (error) {
    throw new Error("Error while generating token")
  }
}

export function verifyToken(token: string): JwtPayload {
  try {
    const verify = jwt.verify(
      token,
      process.env.JWT_SECRET || "pravin"
    ) as JwtPayload
    return verify
  } catch (error) {
    throw new Error("Error while verifying token")
  }
}