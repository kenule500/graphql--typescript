import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ArgumentValidationError } from "type-graphql";
import { QueryFailedError } from "typeorm";
import { DuplicateEmailError } from "./errors";

// Custom error formatter function
export const errorFormatter = (error: GraphQLError): GraphQLFormattedError => {
  // Handle ArgumentValidationError separately
  if (error.originalError instanceof ArgumentValidationError) {
    return {
      message: "Validation Error",
      extensions: {
        code: "ARGUMENT_VALIDATION_ERROR",
        errors: error.originalError.validationErrors,
      },
    };
  }
  if (
    error.originalError instanceof QueryFailedError && // Check if it's a duplicate key error
    error.message.includes("UQ_e12875dfb3b1d92d7d7c5377e22") // Specify the unique constraint name
  ) {
    // const parameters = error.extensions?.exception || {}; // Get all parameters
    // throw new DuplicateEmailError(error.originalError);
    return {
      message: "Email already exists",
      extensions: {
        code: "DUPLICATE_EMAIL_ERROR",
      },
    }; // Custom error for duplicate email
  }

  // For other errors, use the default format
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
    extensions: error.extensions,
  };
};
