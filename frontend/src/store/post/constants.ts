import { IPost } from '@/interfaces/IPost'
import { IProject } from '@/interfaces/IProject'
import { ICreatePost } from '@/interfaces/ICreatePost'
import { IUpdatePost } from '@/interfaces/IUpdatePost'

export const POSTS = 'posts'
export const POSTS_INIT = 'posts_init'
export const FETCH_POSTS = `
  query {
    posts{
      id
      title
      type
      html
      markdown
      sectionId
      categoryId
      created
      category{
        id
        name
      }
      tags{
        id
        name
      }
    }
  }
`

export const POSTS_BY_PROJECT = 'posts_by_project'
export const FETCH_POSTS_BY_PROJECT = (projectName: IProject['name']) => `
  query {
    project(name: "${projectName}"){
      id
      name
      category {
        id
        name
      }
      posts{
        id
        title
        type
        html
        markdown
        sectionId
        categoryId
        created
        category{
          id
          name
        }
        tags{
          id
          name
        }
      }
    }
  }
`
export const CREATE_POST = (createPost: ICreatePost) => `
      mutation {
        createPost (post: {${createPost}}) {
          id
          title
          type
          html
          markdown
          sectionId
          categoryId
          projectId
          created
        }
      }
    `

export const UPDATE_POST = (updatePost: string) => `
      mutation {
        updatePost (post: {${updatePost}}) {
          id
          type
          title
          html
          markdown
          created
          sectionId
          categoryId
          projectId
        }
      }
    `

export const DELETE_POST = (record: IPost) => `
      mutation {
        deletePost(id: "${record['id']}")
      }
    `