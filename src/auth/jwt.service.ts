/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');

@Injectable()
export class JWTService {
  constructor() {}

  public generateJWT(data: any) {
    return jwt.sign({ data }, 'secret', { expiresIn: '1h' });
  }

  public validateJWT(token: string) {
    return jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        console.log(err, decoded);
      }
    });
  }
}
