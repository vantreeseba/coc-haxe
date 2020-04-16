export default interface Command {
  readonly id: string | string[]
  execute(...args: any[]): void | Promise<any>
}
