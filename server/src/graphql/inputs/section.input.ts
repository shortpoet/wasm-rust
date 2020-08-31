import { Field, Int, GraphQLISODateTime, InputType } from "type-graphql";
import { Section } from "../entity/Section";

@InputType()
export class CreateSectionInput implements Partial<Section> {
  
  @Field()
  name: string;

  @Field()
  projectId: number;
  
}
