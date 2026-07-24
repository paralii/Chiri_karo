import { IUser, UserModel } from "../../domain/entities/User.entity";
import { BaseRepository } from "../database/mongodb/mongodb.base.repository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  public async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<IUser | null> {
    const query = this.model.findOne({ email: email.toLowerCase() });
    if (withPassword) {
      query.select("+password");
    }
    return query.exec();
  }

  public async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this.model.findOne({ googleId }).select("+googleId").exec();
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

  public async findByIdWithOtp(id: string): Promise<IUser | null> {
    return this.model.findById(id).select("+otp").exec();
  }

  public async findByEmailWithOtp(email: string): Promise<IUser | null> {
    return this.model
      .findOne({ email: email.toLowerCase() })
      .select("+otp +password")
      .exec();
  }

  // public async aggregate({$'match' : {'role' : ' PATIENT'}, {'$regex' : '^A'}});
  // public async findPatientStartsA(letter : string): Promise<IUser | null> {
  //   return this.model.aggregate([{"$match" : { "role" : "PATIENT"}, {'$regex' : '^A'}}])
  // }
}
