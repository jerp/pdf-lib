/*
  
  ## The 'prep' Control Value Program
  
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6prep.html)
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/prep)

  The Control Value Program consists of a set of TrueType instructions that will be executed
  whenever the font or point size or transformation matrix change and before each glyph is interpreted.
  Any instruction is legal in the CV Program but since no glyph is associated with it, instructions
  intended to move points within a particular glyph outline cannot be used in the CV Program.
  The name 'prep' is anachronistic (the table used to be known as the Pre Program table.)

  ... Set of instructions executed whenever the point size or font transformation change ...

*/
import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'


export class TablePrep extends Table {
  static tableName: string = 'prep'
  public controlValueProgram: Uint8Array
  // get size(): number {
  //   return 1 * this.controlValueProgram.length
  // }
  decode(stream: DataStream, length: number) {
    this.controlValueProgram = stream.getBytes(length)
  }
  // encode(stream: DataStream) {
  //   stream.setBytes(this.controlValueProgram)
  // }
}
