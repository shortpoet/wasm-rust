import { Resolver, Arg, Info, Query, Mutation } from 'type-graphql';
import { Project } from '../entity/Project';
import { getRepository, FindOneOptions } from 'typeorm';
import { RequestInfo } from 'express-graphql';
import { MetadataStorage } from 'class-validator';
import { GraphQLResolveInfo } from 'graphql';
import { report } from 'process';
import { Section } from '../entity/Section';
import { CreateSectionInput } from '../inputs/section.input';
import { chalkLog } from '../utils/chalkLog';
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
    // const project = await getRepository(Project)
    //   .createQueryBuilder('project')
    //   .innerJoinAndSelect('project.tasks', 'tasks')
    //   .innerJoinAndSelect('tasks.categories', 'taskcategories')
    //   .innerJoinAndSelect('project.categories', 'categories')
    //   .innerJoinAndSelect('categories.tasks', 'categorytasks')
    //   .where('project.id = :id', { id: id })
    //   .getOne();
    // console.log(project);
    const project = await getRepository(Project).findOne({ name: name });
    if (!project) {
      throw Error(`Project with name ${name} not found`);
    }
    // const out: IProjectDTO = {
    //   id: project.id,
    //   name: project.name,
    //   categories: project.categories.map(y => <ICategoryDTO>({ id: y.id, name: y.name, projectId: y.projectId, tasks: y.tasks })),
    //   tasks: project.tasks.map(y => <ITaskDTO>({ id: y.id, name: y.name, projectId: y.projectId, categoryId: y.categoryId }))
    // };
    // console.log(util.inspect(out, false, null, true /* enable colors */))
    return project;
  }

  @Query(returns => [Project])
  async projects(): Promise<Project[]> {
    // no eager loading
    return getRepository(Project).find();
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

}