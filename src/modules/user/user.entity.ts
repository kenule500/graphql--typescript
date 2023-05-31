import { Field, ID, ObjectType, Root } from "type-graphql";
import bcrypt from "bcryptjs";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeUpdate, BeforeInsert, AfterLoad } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ complexity: 4 })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ nullable: true })
  passwordToken: string;

  @Column({ nullable: true })
  passwordTokenExpirationDate: Date;

  private previousPassword: string;

  @AfterLoad()
  private loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.previousPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
