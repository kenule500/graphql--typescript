import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
import { InputType, Field, Int } from "type-graphql";
import { Upload } from "../../types/Upload";
import { UploadScalar } from "../../types/UploadScaler";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 55)
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class EmailVerifyInput {
  @Field()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  token: string;
}

@InputType()
export class ProfileInput {
  @Field(() => Int)
  age: number;

  @Field(() => UploadScalar, { nullable: true })
  image?: Upload;
}

// '{"query":"# mutation LoginMutation($input: LoginInput!) {\n#   login(input: $input) {\n#     id\n#     firstName\n#     lastName\n#     email\n#   }\n# }\n\nmutation UploadProfile($input: ProfileInput!) {\n    addProfilePicture(input: $input) \n  }","variables":{"input":{"age":5678,"image":"sfs"}}}'

// '{"query":"# mutation LoginMutation($input: LoginInput!) {\n#   login(input: $input) {\n#     id\n#     firstName\n#     lastName\n#     email\n#   }\n# }\n\nmutation UploadProfile($input: ProfileInput!) {\n    addProfilePicture(input: $input) \n  }"}'

// "variables":{"input":{"age":5678,"image":"sfs"}}

// {
//   "query": "mutation UploadProfile($input: ProfileInput!) {\n  addProfilePicture(input: $input)\n}",
//   "variables": {
//     "input": {
//       "age": 5678,
//       "image": null
//     }
//   }
// }
