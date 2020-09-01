import { Resolver, Arg, Info, Query, Mutation } from 'type-graphql';
import { Project } from '../entity/Project';
import { getRepository, FindOneOptions } from 'typeorm';
import { RequestInfo } from 'express-graphql';
import { MetadataStorage } from 'class-validator';
import { GraphQLResolveInfo } from 'graphql';
import { report } from 'process';
import { Section } from '../entity/Section';
import { CreateSectionInput } from '../inputs/section.input';
import { chalkLog } from '../../utils/chalkLog';
import { Post } from '../entity/Post';
// import { IProjectDTO } from '../interfaces/IProjectDTO';
// import { ICategoryDTO } from '../interfaces/ICategoryDTO';
// import { ITaskDTO } from '../interfaces/ITaskDTO';
const util = require('util');
@Resolver(of => Project)
export class ProjectsResolver {

  @Query(returns => Project)  // more than one type of query can be run (this one is akin to get); 
                              // eg.mutation(patch, post)
  async project(@Arg('name') name: string, @Info() info: GraphQLResolveInfo): Promise<Project> {
    // console.log(info.fieldNodes[0].selectionSet.selections);
    // https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#getting-values-using-querybuilder
    const project = await getRepository(Project)
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.category', 'categories')
      .innerJoinAndSelect('project.sections', 'sections')
      .leftJoinAndSelect('sections.posts', 'posts')
      // was only one post before using left join
      .leftJoinAndSelect('posts.tags', 'tags')
      .where('project.name = :name', { name: name })
      .getOne();
      // console.log(project);
      // project.sections.forEach(s => console.log(s.posts));
      // console.log(await getRepository(Post).find())
      // const _project = await getRepository(Project).findOne({ name: name });
      // console.log(_project);
      // _project.sections.forEach(s => console.log(s.posts));
    
    // if (!project) {
    //   throw Error(`Project with name ${name} not found`);
    // }
    // const out: IProjectDTO = {
    //   id: project.id,
    //   name: project.name,
    //   categories: project.categories.map(y => <ICategoryDTO>({ id: y.id, name: y.name, projectId: y.projectId, tasks: y.tasks })),
    //   tasks: project.tasks.map(y => <ITaskDTO>({ id: y.id, name: y.name, projectId: y.projectId, categoryId: y.categoryId }))
    // };
    // console.log(util.inspect(out, false, null, true /* enable colors */))
    return project;
  }

  // @Query(returns => [Project])
  // async projects(): Promise<Project[]> {
  //   // no eager loading
  //   return getRepository(Project).find();
  // }
  @Query(returns => [Project])
  async projects(): Promise<Project[]> {
    const projects = await getRepository(Project)
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.category', 'categories')
      .innerJoinAndSelect('project.sections', 'sections')
      .getMany()
    console.log(projects);
    return projects;
    
  }

  @Mutation(returns => Project)
  async createSection(@Arg("section") sectionInput: CreateSectionInput): Promise<Project> {
    chalkLog('green', '#### create section ####');
    const repo = getRepository(Section);    
    const results = await repo.save(sectionInput);
    chalkLog("magenta", results);
    const project = await getRepository(Project).findOne(sectionInput.projectId);
    return project;
  }
  
  @Mutation(returns => Boolean)
  async deleteSection(@Arg("id") id: string) {
    chalkLog('greenBright' ,'#### delete section ####');
    const repo = getRepository(Section);
    // const result = await repo.remove(await repo.findOne(id))
    // chalkLog('magenta', "result")
    // chalkLog('magenta', result)
    // return await repo.remove(await repo.findOne(id));
    const result =  await repo.delete(id)
    chalkLog('magenta', "result")
    chalkLog('magenta', result)

    return true;

  }

}

// query that made graphql choke when naively returning results
// SELECT "Project"."id" AS "Project_id", "Project"."name" AS "Project_name", "Project"."category_id" AS "Project_category_id", "Project_category"."id" AS "Project_category_id", "Project_category"."name" AS "Project_category_name", "Project_posts"."id" AS "Project_posts_id", "Project_posts"."title" AS "Project_posts_title", "Project_posts"."type" AS "Project_posts_type", "Project_posts"."markdown" AS "Project_posts_markdown", "Project_posts"."html" AS "Project_posts_html", "Project_posts"."created" AS "Project_posts_created", "Project_posts"."section_id" AS "Project_posts_section_id", "Project_posts"."project_id" AS "Project_posts_project_id", "Project_posts"."category_id" AS "Project_posts_category_id", "Project_posts_category"."id" AS "Project_posts_category_id", "Project_posts_category"."name" AS "Project_posts_category_name", "Project_posts_tags"."id" AS "Project_posts_tags_id", "Project_posts_tags"."name" AS "Project_posts_tags_name", "Project_sections"."id" AS "Project_sections_id", "Project_sections"."name" AS "Project_sections_name", "Project_sections"."project_id" AS "Project_sections_project_id", "Project_sections_posts"."id" AS "Project_sections_posts_id", "Project_sections_posts"."title" AS "Project_sections_posts_title", "Project_sections_posts"."type" AS "Project_sections_posts_type", "Project_sections_posts"."markdown" AS "Project_sections_posts_markdown", "Project_sections_posts"."html" AS "Project_sections_posts_html", "Project_sections_posts"."created" AS "Project_sections_posts_created", "Project_sections_posts"."section_id" AS "Project_sections_posts_section_id", "Project_sections_posts"."project_id" AS "Project_sections_posts_project_id", "Project_sections_posts"."category_id" AS "Project_sections_posts_category_id", "Project_sections_posts_category"."id" AS "Project_sections_posts_category_id", "Project_sections_posts_category"."name" AS "Project_sections_posts_category_name", "Project_sections_posts_tags"."id" AS "Project_sections_posts_tags_id", "Project_sections_posts_tags"."name" AS "Project_sections_posts_tags_name" FROM "rust"."content_projects" "Project" LEFT JOIN "rust"."content_categories" "Project_category" ON "Project_category"."id"="Project"."category_id"  LEFT JOIN "rust"."content_posts" "Project_posts" ON "Project_posts"."project_id"="Project"."id"  LEFT JOIN "rust"."content_categories" "Project_posts_category" ON "Project_posts_category"."id"="Project_posts"."category_id"  LEFT JOIN "rust"."content_posts_tags" "Project_posts_Project_posts_tags" ON "Project_posts_Project_posts_tags"."post_id"="Project_posts"."id" LEFT JOIN "rust"."content_tags" "Project_posts_tags" ON "Project_posts_tags"."id"="Project_posts_Project_posts_tags"."tag_id"  LEFT JOIN "rust"."content_sections" "Project_sections" ON "Project_sections"."project_id"="Project"."id"  LEFT JOIN "rust"."content_posts" "Project_sections_posts" ON "Project_sections_posts"."section_id"="Project_sections"."id"  LEFT JOIN "rust"."content_categories" "Project_sections_posts_category" ON "Project_sections_posts_category"."id"="Project_sections_posts"."category_id"  LEFT JOIN "rust"."content_posts_tags" "Project_sections_posts_Project_sections_posts_tags" ON "Project_sections_posts_Project_sections_posts_tags"."post_id"="Project_sections_posts"."id" LEFT JOIN "rust"."content_tags" "Project_sections_posts_tags" ON "Project_sections_posts_tags"."id"="Project_sections_posts_Project_sections_posts_tags"."tag_id"
/*
Project_id	Project_name	Project_category_id	Project_category_id	Project_category_name	Project_posts_id	Project_posts_title	Project_posts_type	Project_posts_markdown	Project_posts_html	Project_posts_created	Project_posts_section_id	Project_posts_project_id	Project_posts_category_id	Project_posts_category_id	Project_posts_category_name	Project_posts_tags_id	Project_posts_tags_name	Project_sections_id	Project_sections_name	Project_sections_project_id	Project_sections_posts_id	Project_sections_posts_title	Project_sections_posts_type	Project_sections_posts_markdown	Project_sections_posts_html	Project_sections_posts_created	Project_sections_posts_section_id	Project_sections_posts_project_id	Project_sections_posts_category_id	Project_sections_posts_category_id	Project_sections_posts_category_name	Project_sections_posts_tags_id	Project_sections_posts_tags_name
1	hello-wasm	4	4	nodejs	1	hello-wasm-say-intro	intro	# Hello Rust	<h1>Hello Rust</h1>	2020-08-31 00:21:52.9966667	1	1	4	4	nodejs	1	node	1	say	1	1	hello-wasm-say-intro	intro	# Hello Rust	<h1>Hello Rust</h1>	2020-08-31 00:21:52.9966667	1	1	4	4	nodejs	1	node
2	quadratic-solve	4	4	nodejs	2	quadratic-solve-intro	intro	# Quadratic	<h1>Quadratic</h1>	2020-08-24 00:21:52.9966667	2	2	4	4	nodejs	2	rust	2	solve	2	2	quadratic-solve-intro	intro	# Quadratic	<h1>Quadratic</h1>	2020-08-24 00:21:52.9966667	2	2	4	4	nodejs	2	rust
3	functions-say	4	4	nodejs	3	functions-say-intro	intro	# Functions	<h1>Functions</h1>	2020-08-17 00:21:52.9966667	3	3	4	4	nodejs	3	math	3	say	3	3	functions-say-intro	intro	# Functions	<h1>Functions</h1>	2020-08-17 00:21:52.9966667	3	3	4	4	nodejs	3	math

*/



// vs

// query that worked
// SELECT "project"."id" AS "project_id", "project"."name" AS "project_name", "project"."category_id" AS "project_category_id", "categories"."id" AS "categories_id", "categories"."name" AS "categories_name", "sections"."id" AS "sections_id", "sections"."name" AS "sections_name", "sections"."project_id" AS "sections_project_id" FROM "rust"."content_projects" "project" INNER JOIN "rust"."content_categories" "categories" ON "categories"."id"="project"."category_id"  INNER JOIN "rust"."content_sections" "sections" ON "sections"."project_id"="project"."id"

/* 
project_id	project_name	project_category_id	categories_id	categories_name	sections_id	sections_name	sections_project_id
1	hello-wasm	4	4	nodejs	1	say	1
2	quadratic-solve	4	4	nodejs	2	solve	2
3	functions-say	4	4	nodejs	3	say	3
*/