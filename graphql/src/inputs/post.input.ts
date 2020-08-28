import { Field, Int, GraphQLISODateTime, InputType } from "type-graphql";
import { IPost } from "../interfaces/IPost";
import { Post } from "../entity/Post";
import moment, { Moment } from "moment";
import { Tag } from "../entity/Tag";

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
  
  @Field()
  type: string;

  @Field(type => Int)
  projectId: number;

  @Field(type => Int)
  categoryId: number;
  
  @Field(type => String, { nullable: true })
  tags?: Tag[];
}
@InputType()
export class UpdatePostInput {
  
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  type: string;
  
  @Field({ nullable: true })
  markdown?: string;
  
  @Field({ nullable: true })
  html?: string;
  
  @Field(type => GraphQLISODateTime)
  created: Moment;
  
  @Field(type => Int)
  projectId: number;

  @Field(type => Int)
  categoryId: number;
  
  @Field(type => String, { nullable: true })
  tags?: Tag[];

}