import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const defaultSalt = randomBytes(8).toString('hex');

export const hashPassword = async (
  password: string,
  salt = defaultSalt,
): Promise<string> => {
  const scrypt = promisify(_scrypt);
  const hash = (await scrypt(password, salt, 64)) as Buffer;

  return salt + '.' + hash.toString('hex');
};

export const compareHashedPassword = async (
  storedPassword: string,
  password: string,
): Promise<boolean> => {
  const [salt, storedHash] = storedPassword.split('.');
  console.log(salt, storedHash);
  const hash = (await hashPassword(password, salt)).split('.')[1];
  console.log(salt, hash);
  return storedHash === hash;
};
