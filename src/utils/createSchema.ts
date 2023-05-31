import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/user/user.resolver";
import { ProfileResolver } from "../modules/user/profile.resolver";

export const createSchema = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, ProfileResolver],
  });

  return schema;
};
