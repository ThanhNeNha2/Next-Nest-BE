import { compare, hash } from 'bcrypt';

const saltRounds = 10;
export const hashPassword = async (plainPassword: string) => {
  try {
    return await hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (
  plainPassword: string,
  passData: string,
) => {
  try {
    return await compare(plainPassword, passData);
  } catch (error) {
    console.log(error);
  }
};
