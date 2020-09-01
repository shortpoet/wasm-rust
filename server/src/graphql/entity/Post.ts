import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID, Int, GraphQLISODateTime } from "type-graphql";
import { IPost } from "../interfaces/IPost";
import moment, { Moment } from "moment";
import { Tag } from "./Tag";
import { Category } from "./Category";
import { Project } from "./Project";
import { Section } from "./Section";

require("dotenv").config();
console.log("$# Entity Config @7");


console.log("$# PROVIDER @7");
console.log(process.env.PROVIDER);
const dateType = process.env.PROVIDER == 'postgres' ? 'timestamp' : 'datetime'
console.log(dateType);


@ObjectType()
@Entity({ name: `content_posts`, schema: 'rust' })
export class Post implements IPost {
  
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;
  
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  type: string;
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  markdown?: string;
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  html?: string;
  
  @Field(type => GraphQLISODateTime)
  @Column({ type: dateType, default: moment() })
  created: Moment;

  @Field(type => Int)
  @Column({ name: 'section_id' })
  sectionId: number;
  @Field(type => Section)
  @ManyToOne(type => Section, section => section.posts, {
    // can't do both sides
    // choose one or do manually
    // eager: true
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;


  @Field(type => Int)
  @Column({ name: 'project_id' })
  projectId: number;
  @Field(type => Project)
  @ManyToOne(type => Project, project => project.posts)
  @JoinColumn({ name: 'project_id' })
  project: Project

  
  @Field(type => Int)
  @Column({ name: 'category_id' })
  categoryId: number;
  @Field(type => Category)
  @ManyToOne(type => Category, category => category.posts, {
    eager: true
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Field(type => [Tag])
  @ManyToMany(type => Tag, tag => tag.posts, {
    cascade: true,
    nullable: true,
    eager: true
  })
  @JoinTable({
    name: 'content_posts_tags',
    joinColumns: [
      {name: 'post_id'},
    ],
    inverseJoinColumns: [
      {name: 'tag_id'}
  ]
  })
  tags?: Tag[];

}
