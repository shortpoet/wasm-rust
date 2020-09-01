import { ObjectType, ID, Field, Int } from 'type-graphql';
import { ICategory, ICategoryName } from "../interfaces/ICategory";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Post } from "./Post";
import { Project } from './Project';

@ObjectType() // signifies class is part of GraphQL
@Entity({ name: `content_categories`, schema: 'rust' })
export class Category implements ICategory {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field() // default is string
  @Column()
  name: ICategoryName

  @Field(type => [Post])
  @OneToMany(type => Post, post => post.category, {
    eager: true
  })
  @JoinColumn({ name: 'post_id' })
  posts: Post[]

  @Field(type => [Project])
  @OneToMany(type => Project, project => project.category)
  @JoinColumn({ name: 'project_id' })
  projects: Project[]

}