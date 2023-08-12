/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class PasswordService {
  private readonly defaultSalt: string = randomBytes(8).toString('hex');

  constructor() {}

  public hash = async (
    password: string,
    salt = this.defaultSalt,
  ): Promise<string> => {
    const scrypt = promisify(_scrypt);
    const hash = (await scrypt(password.trim(), salt.trim(), 64)) as Buffer;

    return salt + '.' + hash.toString('hex');
  };

  public compare = async (
    storedPassword: string,
    password: string,
  ): Promise<boolean> => {
    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await this.hash(password.trim(), salt.trim())).split('.')[1];

    return storedHash === hash;
  };
}
