import { db } from "@/server/db";

export const createVerificationToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return db.verificationToken.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteExistingVerificationTokenByEmail = async (email: string) => {
  try {
    return db.verificationToken.deleteMany({
      where: {
        email,
      },
    });
  } catch (error) {
    throw error;
  }
};
