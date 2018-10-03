/*
  
  ## The 'head' table: General table information

  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/head)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6head.html)
  table contains global information about the font.

*/

import { DataStream } from 'helpers/DataStream'
import { Table } from 'helpers/TTFTables/Table'

export class TableHead extends Table {
  static tableName: string = 'head'
  /** range from 64 to 16384 */
  public unitsPerEm: number
  /** bounding box */
  public xMin: number
  /** bounding box */
  public yMin: number
  /** bounding box */
  public xMax: number
  /** bounding box */
  public yMax: number
  /** byte encoded style 'bold', 'italic', 'underline', 'outline', 'shadow', 'condensed', 'extended' */
  public _macStyle: number
  /** loca format: 0 for short offsets, 1 for long */
  public indexToLocFormat:   number
  doDecode = () => {
    const stream = this.sourceStream
    this.unitsPerEm = stream.skip(18).getUint16() // skipping up to after flags
    this.xMin = stream.skip(16).getInt16() // skipping dates
    this.yMin = stream.getInt16()
    this.xMax = stream.getInt16()
    this.yMax = stream.getInt16()
    this._macStyle = stream.getInt16()
    this.indexToLocFormat = stream.skip(4).getInt16()
  }
  get macStyle() {
    return {
      bold: !!(this._macStyle & 0b1),
      italic: !!(this._macStyle & 0b10),
      underline: !!(this._macStyle & 0b100),
      outline: !!(this._macStyle & 0b1000),
      shadow: !!(this._macStyle & 0b10000),
      condensed: !!(this._macStyle & 0b100000),
      extended: !!(this._macStyle & 0b1000000),
    }
  }
  encode(stream: DataStream) {
    super.encode(stream)
    stream.skip(-4)
    .save('indexToLocFormat')
    .setInt16(0) // indexToLocFormat
    .skip(2)
  }
}
