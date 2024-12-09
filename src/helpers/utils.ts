import { hash } from 'bcrypt';

const saltRounds = 10;
export const hashPassword = async (plainPassword: string) => {
  try {
    return await hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
};
