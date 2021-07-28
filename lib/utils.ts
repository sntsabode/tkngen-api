// eslint-disable-next-line
export type untyped = any

export function panic<E>(...msg: E[]): never {
  console.error(...msg)
  process.exit(1)
}