/*
  
  ## The 'maxp' table: General table information
  
  The [maxp](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6maxp.html) table
  ...

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

// TODO skip what is not required
// TODO clone what is not modified
export class TableMaxp extends Table {
  /** The number of glyphs in the font */
  public numGlyphs: number
  doDecode = () => {
    const stream = this.sourceStream
    this.numGlyphs = stream.skip(4).getUint16()
  }
  encode(stream: DataStream, subset: number[]) {
    const posNumGlyphs = stream.offset + 4
    super.encode(stream)
    // encode nb glyphs at right offset and set offset back
    stream.save().at(posNumGlyphs).setUint16(subset.length)
    .restore()
  }
}
