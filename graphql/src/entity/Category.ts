import { ObjectType, ID, Field, Int } from 'type-graphql';
import { ICategory, ICategoryName } from "../interfaces/ICategory";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Post } from "./Post";

@ObjectType() // signifies class is part of GraphQL
@Entity({ name: `content_categories`, schema: 'rust' })
export class Category implements ICategory {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field() // default is string
  @Column()
  name: ICategoryName

  @Field(type => Post)
  @OneToMany(type => Post, post => post.categoryId)
  @JoinColumn({ name: 'post_id' })
  posts: Post[]

}