import { Field, Int, GraphQLISODateTime, InputType } from "type-graphql";
import { IPost } from "../interfaces/IPost";
import { Post } from "../entity/Post";
import moment, { Moment } from "moment";

@InputType()
export class CreatePostInput implements Partial<Post> {
  
  @Field()
  title: string;
  
  @Field({ nullable: true })
  markdown?: string;
  
  @Field({ nullable: true })
  html?: string;
  
  @Field(type => GraphQLISODateTime)
  created: Moment;
  
  @Field(type => Int)
  categoryId: number;
  
  @Field({ nullable: true })
  tag?: string;
}
@InputType()
export class UpdatePostInput {
  
  @Field()
  id: string;

  @Field()
  title: string;
  
  @Field({ nullable: true })
  markdown?: string;
  
  @Field({ nullable: true })
  html?: string;
  
  @Field(type => GraphQLISODateTime)
  created: Moment;

  @Field(type => Int)
  categoryId: number;
  
  @Field({ nullable: true })
  tag?: string;

}