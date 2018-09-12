/*
  
  ## The 'loca' table: General table information
  
  The [loca](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6loca.html) table
  stores the offsets to the locations of the glyphs in the font relative to the beginning of the 'glyf' table.
  Its purpose is to provide quick access to the data for a particular character.
  For example, in the standard Macintosh glyph ordering, the character A is the 76th glyph in a font.
  The 'loca' table stores the offset from the start of the 'glyf' table to the position at which
  the data for each glyph can be found.

  */
 
import { DataStream, Uint16View, Uint32View } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

export class TableLoca extends Table {
  static tableName: string = 'loca'
  private offsets: Uint16View | Uint32View
  private subsetOffsets: Uint16View | Uint32View
  /** returns offset of a glif id */
  get(id: number) {
    return this.offsets.get(id)
  }
  get length() {
    return this.offsets.length
  }
  decode(stream: DataStream, byteLength: number, directory: any) {
    const short = directory.getTable('head').indexToLocFormat === 0
    const typedViewClass = short ? Uint16View : Uint32View
    this.offsets = stream.getTypedView(byteLength / typedViewClass.elemByteLength, typedViewClass)
  }
  encode(stream: DataStream, subset: number[]) {
    const short = subset.length < 0xffff
    const typedViewClass = short ? Uint16View : Uint32View
    this.subsetOffsets = stream.setTypedView(subset.length, typedViewClass)
  }
  set(id: number, offset: number) {
    this.subsetOffsets.set(id, offset)
  }
}