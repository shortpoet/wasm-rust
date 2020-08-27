import { Category } from "./Category";
import { ObjectType, ID, Field, Int } from 'type-graphql';
import { Post } from "./Post";
import { IProject } from "../interfaces/IProject";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

@ObjectType() // signifies class is part of GraphQL
@Entity({ name: 'content_projects' , schema: "rust"})
export class Project implements IProject {
  
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field() // default is string
  @Column()
  name: string
  
  @Field(type => Int)
  @Column({ name: 'category_id' })
  categoryId: number;

  @Field(type => Category)
  @ManyToOne(type => Category, category => category.projects, {
    eager: true
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Field(type => [Post]) // != Task[]
  @OneToMany(type => Post, post => post.project, {
    eager: true
  })
  posts: Post[]

  // one option to load related entites
  // for more fine-grained control declare in viewmodel  
  // @OneToMany(type => Category, category => category.project, {
  //   eager: true
  // })



}