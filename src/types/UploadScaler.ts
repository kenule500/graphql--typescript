import { GraphQLScalarType, Kind } from "graphql";

export const UploadScalar = new GraphQLScalarType({
  name: "Upload",
  description: "The `Upload` scalar type represents a file upload.",
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
  serialize: (value) => value,
});
