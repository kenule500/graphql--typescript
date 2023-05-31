import { ApolloError } from "apollo-server-express";

export class DuplicateEmailError extends ApolloError {
  constructor(err: Error) {
    const errorMessage = "Email already exists";
    const extensions = {
      code: "DUPLICATE_EMAIL_ERROR",
      originalMessage: err.message,
      stackTrace: err.stack,
    };

    super(errorMessage, "DUPLICATE_EMAIL_ERROR", extensions);
  }
}
