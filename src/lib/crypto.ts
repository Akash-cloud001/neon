import * as CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES with a given passphrase.
 * @param data The string data to encrypt.
 * @param passphrase The secret passphrase.
 * @returns The encrypted string (in Base64 format).
 */
export function encrypt(data: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(data, passphrase).toString();
}

/**
 * Decrypts data using AES with a given passphrase.
 * @param encryptedData The encrypted string (in Base64 format).
 * @param passphrase The secret passphrase.
 * @returns The decrypted string.
 */
export function decrypt(encryptedData: string, passphrase: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}
