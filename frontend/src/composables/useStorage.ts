// https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
export function useStorage() {
  const set = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
  const get = (key:string) => JSON.parse(localStorage.getItem(key) || '{}')
  const remove = (key:string) => localStorage.removeItem(key)
  return {
    set,
    get,
    remove
  }
}