import { Resolver, Query, Arg, Info, Mutation } from "type-graphql";
import { Post } from "../entity/Post";
import { getRepository, DeleteResult, Any, SaveOptions, DeepPartial } from "typeorm";
import { GraphQLResolveInfo } from "graphql";
import { IPost } from "../interfaces/IPost";
import { CreatePostInput, UpdatePostInput } from "../inputs/post.input";
import { chalkLog } from "../../utils/chalkLog";
import { Category } from "../entity/Category";
import { Project } from "../entity/Project";
import { Section } from "../entity/Section";

@Resolver(of => Post)
export class PostsResolver {

  // will return server error 500 if not set nullable: true
  @Query(returns => Post, { nullable: true })
  async post(
    @Arg('id') id: string,
    @Info() info: GraphQLResolveInfo
  ): Promise<Post> {
    
    try {
      const post = await getRepository(Post).findOne(id);
      return post;
      
    } catch (error) {
      console.log(error);
      
    }
  
    // throwing error is cheaper than catching using try/catch
    // if (!user) {
    //   throw new Error(`Post with username ${username} not found`);
    // }

  }

  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    chalkLog('magentaBright', '#### database fetch ####')
    const data = await getRepository(Post).find({relations: ['section', 'project', 'category', 'tags']})
    // chalkLog('magenta', data)
    return data;
  }

  @Mutation(returns => Post)
  async createPost(@Arg("post") postInput: CreatePostInput): Promise<Post> {
    chalkLog('yellow', '#### create post ####');
    console.log(postInput);
    
    const repo = getRepository(Post);    
    const category = await getRepository(Category)
      .createQueryBuilder('category')
      .where('category.name = :name', { name: postInput.categoryName })
      .getOne();
    console.log(category);
    
    const section = await getRepository(Section)
    .createQueryBuilder('section')
    .where('section.name = :name', { name: postInput.sectionName })
    .getOne();
    console.log(section);
    const project = await getRepository(Project)
    .createQueryBuilder('project')
    .where('project.name = :name', { name: postInput.projectName })
    .getOne();
    console.log(project);

    const newPost = await repo.create(<Partial<Post>>{
      ...postInput,
      categoryId: category.id,
      sectionId: section.id,
      projectId: project.id
    });
    console.log(newPost);
    const results = await repo.save(<Partial<Post>>newPost);
    return results;

    // below is for upsert
    // https://github.com/typeorm/typeorm/issues/1090
    // const data = post;
    // const row = Array.isArray(data) ? data[0] : data;
    // const keys = Object.keys(row);

    // if (keys.length < 1) {
    //   throw new Error("Cannot upsert without any values specified");
    // }
    // const primaryKey = 'id';
    // const updateStr = keys.map(key => `"${key}" = EXCLUDED."${key}"`).join(",");
    // const rest = keys.filter(key => key != primaryKey)
    // const results = repo
    //   .createQueryBuilder()
    //   .insert()
    //   .values(post)
    //   .orUpdate({ conflict_target: [`${primaryKey}`], overwrite: rest })
    //   .execute()

    // const results = await repo.findOne(newId);
  }
  @Mutation(returns => Post)
  async updatePost(@Arg("post") postInput: UpdatePostInput): Promise<Post> {
    console.log('#### create post ####');
    const repo = getRepository(Post);
    const oldPost = await repo.findOne(parseInt(postInput.id));
    console.log(oldPost);
    const category = await getRepository(Category).findOne({ name: postInput.categoryName as Category['name'] })
    const section = await getRepository(Section).findOne({ name: postInput.sectionName as Section['name'] })
    const project = await getRepository(Project).findOne({ name: postInput.projectName as Project['name'] })
    const newPost = await repo.create(<Partial<Post>>{
      ...postInput,
      id: oldPost.id,
      // category: category,
      categoryId: category.id,
      sectionId: section.id,
      projectId: project.id
    });
    console.log(newPost);
    const results = await repo.save(<Partial<Post>>newPost);
    return results;
  }

  @Mutation(returns => Boolean)
  async deletePost(@Arg("id") id: string) {
    chalkLog('greenBright' ,'#### delete post ####');
    const repo = getRepository(Post);
    // const result = await repo.remove(await repo.findOne(id))
    // chalkLog('magenta', "result")
    // chalkLog('magenta', result)
    // return await repo.remove(await repo.findOne(id));
    const result =  await repo.delete(id)
    chalkLog('magenta', "result")
    chalkLog('magenta', result)
    return true
  }
}