function generateSalt(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string): Promise<string> {
    const salt = generateSalt()
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData)
    const hashArray = new Uint8Array(hashBuffer)
    const hashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
    return salt + hashHex
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const salt = hash.substring(0, 32)
        const originalHash = hash.substring(32)
        const encoder = new TextEncoder()
        const passwordData = encoder.encode(password + salt)
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData)
        const hashArray = new Uint8Array(hashBuffer)
        const newHashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
        return newHashHex === originalHash
    } catch (error) {
        console.error('Password verification error:', error)
        return false
    }
}

export function generateId(prefix: string = 'id'): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    const randomString = Array.from(array, byte => byte.toString(36)).join('').substring(0, 16)
    return `${prefix}_${Date.now()}_${randomString}`
}
