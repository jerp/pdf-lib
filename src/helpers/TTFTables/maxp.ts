/*
  
  ## 'maxp': General table information
  
  [ms](https://docs.microsoft.com/en-us/typography/opentype/spec/maxp)
  [maxp](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6maxp.html)
  ...

*/

import { DataStream } from 'helpers/DataStream'
import { Table } from 'helpers/TTFTables/Table'

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
