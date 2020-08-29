import { ObjectType, ID, Field, Int } from 'type-graphql';
import { ICategory, ICategoryName } from "../interfaces/ICategory";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Post } from "./Post";
import { Project } from './Project';
import { ISection } from '../interfaces/ISection';

@ObjectType() // signifies class is part of GraphQL
@Entity({ name: `content_sections`, schema: 'rust' })
export class Section implements ISection {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field() // default is string
  @Column()
  name: string

  @Field(type => Int)
  @Column({ name: 'project_id' })
  projectId: number;

  @Field(type => Post)
  @OneToMany(type => Post, post => post.sectionId)
  @JoinColumn({ name: 'section_id' })
  posts: Post[]


}