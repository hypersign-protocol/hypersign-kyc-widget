const CryptoJS = require('crypto-js')

const keySize = 256
const iterations = 10000

async function encrypt(msg, password, salt = null) {
  if (!password) throw Error('Encryption error: Password is empty.')
  if (!msg) throw Error('Encryption error: Message is empty.')
  const salt1 = salt || CryptoJS.lib.WordArray.random(128 / 8)
  const key = CryptoJS.PBKDF2(password, salt1, {
    keySize: keySize / 8, // 32 bytes key size
    iterations,
  }) // 32 bytes

  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  })
  const transitmessage = salt1.toString() + iv.toString() + encrypted.toString()
  return transitmessage
}

async function decrypt(transitmessage, password, salt = null) {
  try {
    if (!password) throw Error('Decryption error: Password is empty.')
    if (!transitmessage) throw Error('Decryption error: Message is empty.')
    const salt1 = salt || CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
    const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    const encrypted = transitmessage.substring(64)

    const key = CryptoJS.PBKDF2(password, salt1, {
      keySize: keySize / 8,
      iterations,
    })

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    if (!decrypted || decrypted === '') throw Error('Decryption error: Could not decrypt the data. Please check your password.')
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    console.error(e)
    throw new Error('Could not decrypt data, your PIN may be wrong')
  }
}

export { encrypt, decrypt }
