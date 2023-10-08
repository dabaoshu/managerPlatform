import JSEncrypt from 'node-jsencrypt'


export const RsaEncrypt = (publicKey, value) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const encryptKey = encrypt.encrypt(value);
  return encryptKey
}

