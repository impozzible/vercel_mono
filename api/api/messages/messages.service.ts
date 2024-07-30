import { Message } from "./message.model";

export const getPublicMessage = (): Message => {
  return {
    text: "This is a public message. Codewords: public carrots",
  };
};

export const getProtectedMessage = (): Message => {
  return {
    text: "This is a protected message. Codewords: protected bananas",
  };
};

export const getAdminMessage = (): Message => {
  return {
    text: "This is an admin message.",
  };
};