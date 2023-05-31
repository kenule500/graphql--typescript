import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { AppDataSource } from "./data-source";
import { errorFormatter } from "./middleware/errorHandling";
import cookieParser from "cookie-parser";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { isTokenValid } from "./utils/jwt";
import { createSchema } from "./utils/createSchema";
import { getComplexity, fieldExtensionsEstimator, simpleEstimator } from "graphql-query-complexity";

class Server {
  private async main(): Promise<void> {
    const schema = await createSchema();

    const server = new ApolloServer({
      schema,
      formatError: errorFormatter,
      context: ({ req, res }: any) => {
        const accessToken = req.cookies.accessToken;
        let user = null;

        if (accessToken) {
          user = isTokenValid(accessToken);
        }
        return { req, res, user };
      },
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
        {
          requestDidStart: () =>
            ({
              didResolveOperation({ request, document }) {
                const complexity = getComplexity({
                  // Our built schema
                  schema,
                  operationName: request.operationName,
                  // The GraphQL query document
                  query: document,
                  // The variables for our GraphQL query
                  variables: request.variables,
                  estimators: [
                    // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                    fieldExtensionsEstimator(),
                    simpleEstimator({ defaultComplexity: 1 }),
                  ],
                });
                // Here we can react to the calculated complexity,
                // like compare it with max and throw error when the threshold is reached.
                if (complexity > 20) {
                  throw new Error(`Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`);
                }
                // And here we can e.g. subtract the complexity point from hourly API calls limit.
                console.log("Used query complexity points:", complexity);
              },
            } as any),
        },
      ],
    });
    const app = Express();
    app.use(cookieParser());
    app.use(cors());

    await server.start();
    server.applyMiddleware({ app });
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`🚀😁💕 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  }

  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();
      await this.main();
    } catch (error) {
      console.log(error);
    }
  }
}

const server = new Server();
server.start();
