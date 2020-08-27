import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID, Arg } from "type-graphql";
import { ITag } from "../interfaces/ITag";
import { Post } from "./Post";
import { ICreateUser } from "../interfaces/ICreateUser";

@ObjectType()
@Entity({ name: `content_tags`, schema: 'rust' })
export class Tag implements ITag {

  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;
  
  // @Field(type => ID)
  @Field()
  @Column()
  name: string;

  @Field(type => [Post])
  @ManyToMany(type => Post, post => post.tags, {
    nullable: true
  })
  @JoinTable({ name: 'content_posts_tags' })
  posts: Post[];
  
}
