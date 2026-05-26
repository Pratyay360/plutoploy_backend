import encryptor, { decryptor } from "age-encryption";

export const encrypt = async (
  data: string,
  key: string,
  recipient: string,
): Promise<string> => {
  const encrypted = await encryptor(data, key, recipient);
  return encrypted;
};

export const decrypt = async (data: string, key: string): Promise<string> => {
  const decrypted = await decryptor(data, key);
  return decrypted;
};
