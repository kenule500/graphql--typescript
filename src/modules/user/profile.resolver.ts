import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "./user.entity";
import { ProfileInput } from "./user.input";
import { UploadScalar } from "../../types/UploadScaler";
import { Upload } from "../../types/Upload";

@Resolver()
export class ProfileResolver {
  @Mutation(() => String)
  async addProfilePicture(@Arg("input") input: ProfileInput) {
    console.log("input", input);
    return "uploaded";
  }

  @Mutation(() => String)
  async addProfilePictures(@Arg("pic", () => UploadScalar) pic: Upload) {
    console.log("input", pic);
    return "uploaded";
  }
}
