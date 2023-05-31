import { gCall } from "../../test-utils/graphqlCall";
import { faker } from "@faker-js/faker";
import { User } from "./user.entity";

const registerMutation = `
  mutation RegisterMutation($input: RegisterInput!) {
    register(input: $input) 
  }
`;

const meQuery = `
  query Query{
    me{
      id
      firstName
      lastName
      email
    }
  }
`;

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
};

describe("RegisterResolver", () => {
  it("create user", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: "Confirmation message sent to your email",
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser.confirmed).toBe(false);
    expect(dbUser.firstName).toBe(user.firstName);
    expect(dbUser.lastName).toBe(user.lastName);
    expect(dbUser.email).toBe(user.email);
  });
});

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }).save();

    const response = await gCall({
      source: meQuery,
      user: { id: user.id },
    });
    console.log(response);
    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  });

  it("return null", async () => {
    const response = await gCall({
      source: meQuery,
    });
    console.log("err", response);
    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toEqual("Not authenticated");
  });
});
