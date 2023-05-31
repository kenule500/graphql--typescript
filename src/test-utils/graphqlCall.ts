import { GraphQLSchema, graphql } from "graphql";
import { createSchema } from "../utils/createSchema";
import { Maybe } from "graphql/jsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  user?: { id: number } | null;
}
let schema: GraphQLSchema;
export const gCall = async ({ source, variableValues, user }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {},
      res: {
        clearCookie: jest.fn(),
      },
      user,
    },
  });
};
