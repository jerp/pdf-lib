import { DataStream } from 'fonts/DataStream';
import { Table } from 'fonts/tables/Table'

type directoryItem = { name: string, checkSum: number, offset: number, byteLength: number }

export class Directory {
  private items: { [index: string]:  directoryItem } = {}
  private streamDecoder: DataStream
  private tableIndex: { [index: string]: Table } = {}
  constructor(
    public tag: string,
    public numTables?: number,
    public searchRange?: number,
    public entrySelector?: number,
    public rangeShift?: number,
  ) {}
  static decode(stream: DataStream) {
    const directory = new Directory(
      stream.getString(4), // tag
      stream.getUint16(), // numTables
      stream.getUint16(), // searchRange
      stream.getUint16(), // entrySelector
      stream.getUint16(), // rangeShift
    )
    for(let i=0; i < (directory.numTables || 0); i++) {
      const tableName = stream.getString(4)
      directory.items[tableName] = {
        name: tableName,
        checkSum: stream.getUint32(),
        offset: stream.getUint32(),
        byteLength: stream.getUint32(),
      }
    }
    directory.streamDecoder = stream
    return directory
  }
  hasTable(tableClass: any): boolean {
    return !!this.items[tableClass.tableName]
  }
  getTable(tableClass: any): Table {
    return this.tableIndex[typeof tableClass === 'string' ? tableClass : tableClass.tableName] || this.decodeTable(tableClass)
  }
  /** lazy decodeo a table */
  decodeTable(tableClass: any): Table {
    const tablePos = this.items[tableClass.tableName]
    const table = new tableClass()
    if (tablePos != null) {
      this.streamDecoder.offset = tablePos.offset
      table.decode(this.streamDecoder, tablePos.byteLength, this)
    }
    return this.tableIndex[tableClass.tableName] = table
  }
  private cloneTableData(streamEncoder: DataStream, table: Table) {
    const tablePos = this.items[table.tableName]
    if (tablePos != null) {
      this.streamDecoder.offset = tablePos.offset
      streamEncoder.setBytes(this.streamDecoder.getBytes(tablePos.byteLength))
    }
  }
  // // quick access to main tables
  // get cmap(): cmap {
  //   return <cmap>this.getTable('cmap')
  // }
  // get head(): head {
  //   return <head>this.getTable('head')
  // }
  // get hhea(): hhea {
  //   return <hhea>this.getTable('hhea')
  // }
  // get hmtx(): hmtx {
  //   return <hmtx>this.getTable('hmtx')
  // }
  // get maxp(): maxp {
  //   return <maxp>this.getTable('maxp')
  // }
  // get name(): name {
  //   return <name>this.getTable('name')
  // }
  // get fpgm(): fpgm {
  //   return <fpgm>this.getTable('fpgm')
  // }
  // get loca(): loca {
  //   return <loca>this.getTable('loca')
  // }
  // get prep(): prep {
  //   return <prep>this.getTable('prep')
  // }
  // get cvt(): cvt {
  //   return <cvt>this.getTable('cvt ')
  // }
  // get glyf(): glyf {
  //   return <glyf>this.getTable('glyf')
  // }
  // get post(): post {
  //   return <post>this.getTable('post')
  // }
  // get os2(): OS2 {
  //   return <OS2>this.getTable('OS/2')
  // }
  // get ltag(): any {
  //   // TODO [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html)
  //   return {}
  // }
  encode(stream: DataStream, tables: Table[], glifIds: number[]) {
    const numTables = tables.length
    const searchRange = Math.floor(Math.log(numTables) / Math.LN2) * 16;
    const entrySelector = Math.floor(searchRange / Math.LN2);
    const rangeShift = numTables * 16 - searchRange;
    stream.setString(this.tag)
    stream.setInt16(numTables)
    stream.setInt16(searchRange)
    stream.setInt16(entrySelector)
    stream.setInt16(rangeShift)
    const reservebBytes = numTables * (4 + 32 + 32 + 32)
    let nextTableOffset = stream.offset += reservebBytes
    let directoryOffset = stream.offset
    tables.forEach((table) => {
      const tableOffset = stream.offset = nextTableOffset
      // @ts-ignore
      if (typeof table.encode === 'function') {
        // @ts-ignore
        table.encode(stream, glifIds)
      } else {
        this.cloneTableData(stream, table)
      }
      const tableLength = stream.offset - tableOffset
      nextTableOffset = stream.offset
      stream.offset = directoryOffset
      stream.setString(typeof table === 'string' ? table : table.tableName)
      stream.setInt32(0) // TODO: checkSum
      stream.setInt32(tableOffset)
      stream.setInt32(tableLength)
      directoryOffset = stream.offset
    })
  }
}
