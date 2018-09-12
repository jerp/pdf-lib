import { DataStream } from 'fonts/DataStream';
export abstract class Table {
  static index: any = {}
  public name: string
  static register(name: string, definition: any) {
    Table.index[name] = definition
  }
  get tableName(): string {
    // @ts-ignore
    return this.constructor.tableName
  }
  // // TODO how to type directory without creating a circular ref
  // static decode(tableName: string, stream: DataStream, offset: number, byteLength: number, directory: any): Table | null {
  //   const tableDefinition = Table.index[tableName]
  //   if (tableDefinition) {
  //     stream.offset = offset
  //     const table = tableDefinition.decode(stream, byteLength, directory)
  //     table.name = tableName
  //     return table
  //   } else {
  //     return null
  //   }
  // }
  // TODO how to type directory without creating a circular ref
  abstract decode(stream: DataStream, byteLength: number, directory?: any): void
}