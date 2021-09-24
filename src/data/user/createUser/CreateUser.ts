import bcrypt from 'bcrypt';
import { db } from '../../../database';
import { ICreateUser } from './repositories/ICreateUser';

export class CreateUser implements ICreateUser {
  name: string;

  email: string;

  password: string;

  encriptedPassword: string;

  constructor(user: ICreateUser.Request) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.encriptedPassword = null;
  }

  private async userExists(): Promise<boolean> {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [this.email]);
  }

  private async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);

    this.encriptedPassword = hashed;
  }

  private async validateFields(): Promise<boolean> {
    return this.name === null || this.email === null || this.password === null;
  }

  async createUser(): Promise<ICreateUser.Response> {
    const invalidFields = await this.validateFields();
    if (invalidFields) {
      throw new Error('Please provide all fields!');
    }
    const existUser = await this.userExists();
    await this.hashPassword();
    if (!existUser) {
      return db.none('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [this.name, this.email, this.encriptedPassword]);
    }

    throw new Error('Email already being used!');
  }
}
