/*
  
  ## 'hhea': General table information
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/hhea)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hhea.html)
  
  contains information needed to layout fonts whose characters are written horizontally,
  that is, either left to right or right to left.

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

export class TableHhea extends Table {
  static tableName: string = 'hhea'
  /** Distance from baseline of highest ascender */
  public ascent: number
  /** Distance from baseline of lowest descender */
  public descent: number
  /** Typographic line gap */
  public lineGap: number
  /** Number of advance widths in 'hmtx' table */
  public numberOfHMetrics: number
  // size: number = (32 + 16 * 16 )
  doDecode = () => {
    const stream = this.sourceStream
    this.ascent = stream.skip(4).getInt16()
    this.descent = stream.getInt16()
    this.lineGap = stream.getUint16()
    this.numberOfHMetrics = stream.skip(12*2).getUint16()
  }
  encode(stream: DataStream, subset: number[]) {
    super.encode(stream)
    stream.skip(-2).setUint16(subset.length)
  }
}
