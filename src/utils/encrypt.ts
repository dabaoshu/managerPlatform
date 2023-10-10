import JSEncrypt from 'node-jsencrypt'
import { md5 } from 'js-md5'
export function md5Encryption(pwd: any) {
  return md5(pwd)
}

export const RsaEncrypt = (publicKey, value) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const encryptKey = encrypt.encrypt(value);
  return encryptKey
}

