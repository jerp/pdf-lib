/*
  
  ## 'fpgm' — Font Program
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/fpgm)
  This table is similar to the CVT Program, except that it is only run once,
  when the font is first used. It is used only for FDEFs and IDEFs.
  Thus the CVT Program need not contain function definitions.
  However, the CVT Program may redefine existing FDEFs or IDEFs.

  The 'fpgm' table is optional. It is needed by fonts that are instructed. Like the 'cvt ',
  it is an ordered list which is stored as an array. Since it contains instructions,
  it contains 8 bit values. It consists of a list of instructions that are executed
  once when a font is first used. These instructions are known as the font program.
  The main use of this table is for the definition of functions that are used in many different glyph programs.

*/

import { DataStream } from 'fonts/DataStream'

import { Table } from 'fonts/tables/Table'

export class TableFpgm extends Table {
  static tableName: string = 'fpgm'
  public instructions: Uint8Array
  decode(stream: DataStream, byteLength: number) {
    this.instructions = stream.getBytes(byteLength)
  }
  // encode(stream: DataStream) {
  //   stream.setBytes(this.instructions)
  // }
}

