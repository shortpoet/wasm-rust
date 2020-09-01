// https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
export function useStorage() {
  const set = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
  const get = (key: string) => JSON.parse(localStorage.getItem(key) || '{}')
  const setWExpiry =
    (key: string, value: any, expiry = 36000000 ) =>
      localStorage.setItem(key, JSON.stringify({
        value: value,
        expiry: new Date().getTime() + expiry
      }))
  const getWExpiry =
    (key: string) => {
      const item = JSON.parse(localStorage.getItem(key) || '{}')
      return item
        ? new Date().getTime() > item.expiry
          ? localStorage.removeItem(key)
          : item.value
        : null
    }
      
  const remove = (key: string) => localStorage.removeItem(key)
  return {
    set,
    get,
    setWExpiry,
    getWExpiry,
    remove
  }
}