

interface JWTPayload {
    userId: string
    email: string
    iat: number
    exp: number
  }
  
  
  function base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
  
 
  function base64UrlDecode(str: string): string {
    str += '='.repeat((4 - str.length % 4) % 4)
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
  }
  
  
  export async function generateToken(userId: string, email: string, secret: string): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }
  
    const now = Math.floor(Date.now() / 1000)
    const payload: JWTPayload = {
      userId,
      email,
      iat: now,
      exp: now + (7 * 24 * 60 * 60) 
    }
  
    const headerEncoded = base64UrlEncode(JSON.stringify(header))
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload))
    
    const data = `${headerEncoded}.${payloadEncoded}`
    
    
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    const signatureEncoded = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))
    
    return `${data}.${signatureEncoded}`
  }
  
 
  export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
    try {
      const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.')
      
      if (!headerEncoded || !payloadEncoded || !signatureEncoded) {
        return null
      }
  
      
      const data = `${headerEncoded}.${payloadEncoded}`
      const encoder = new TextEncoder()
      
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )
      
      const signature = Uint8Array.from(base64UrlDecode(signatureEncoded), c => c.charCodeAt(0))
      
      const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data))
      
      if (!isValid) {
        return null
      }
  
     
      const payload: JWTPayload = JSON.parse(base64UrlDecode(payloadEncoded))
      
      
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        return null
      }
      
      return payload
      
    } catch (error) {
      console.error('JWT verification error:', error)
      return null
    }
  }