import { ICreateSection } from '@/interfaces/ICreateSection'
import { ISection } from '@/interfaces/ISection'

export const PROJECTS = 'projects'
export const PROJECTS_INIT = 'projects_init'
export const FETCH_PROJECTS = `
  query {
    projects {
      id
      name
      category {
        id
        name
      }
      sections {
        id
        name
      }
    }
}
`
export const CREATE_SECTION = (createSection: string) => `
mutation {
  createSection (section: {${createSection}}) {
    id
    name
    category {
      id
      name
    }
    sections {
      id
      name
    }
  }
}
`
export const DELETE_SECTION = (record: ISection) => `
      mutation {
        deleteSection(id: "${(record['id'])}")
      }
    `
