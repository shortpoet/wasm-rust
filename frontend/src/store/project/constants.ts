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
    }
}
`
