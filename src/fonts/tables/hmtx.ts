/* 
 ## **'hmtx'**: Horizontal Metrics Table
  
  The hmtx table
  [ms](https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html)
  contains metric information for the horizontal layout each of the glyphs in the font.
*/

import { DataStream, Int16View } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'
import { Directory } from 'fonts/tables/Directory'

class HMetrics {
  private view: DataView
  constructor(stream: DataStream, public length: number) {
    this.view = stream.getDataView(this.length * 4)
  }
  advanceWidth(idx: number) {
    return this.view.getUint16(idx * 4)
  }
  leftSideBearing(idx: number) {
    return this.view.getInt16(idx * 4 + 2)
  }
}

export class TableHtmx extends Table {
  static tableName: string = 'hmtx'
  private hMetrics: HMetrics
  private lastAdvanceWidth: number
  private leftSideBearingsView: Int16View
  decode(stream: DataStream, length: number, directory: Directory) {
    //@ts-ignore FIXME
    const numberOfHMetrics = directory.getTable('hhea').numberOfHMetrics || 0
    this.hMetrics = new HMetrics(stream, numberOfHMetrics)
    this.lastAdvanceWidth = this.hMetrics.advanceWidth(numberOfHMetrics-1)
    //@ts-ignore FIXME
    const numGlyphs = directory.getTable('maxp').numGlyphs
    const numberOfBearings = numGlyphs ? numGlyphs - numberOfHMetrics : 0
    this.leftSideBearingsView = stream.getTypedView(numberOfBearings, Int16View)
  }
  encode(stream: DataStream) {
    // todo: needed for subsetting
  }
  advanceWidth(id: number): number {
    return id < this.hMetrics.length ? this.hMetrics.advanceWidth(id) : this.lastAdvanceWidth
  }
  leftSideBearing(id: number): number {
    return id < this.hMetrics.length ? this.hMetrics.leftSideBearing(id) : this.leftSideBearingsView.get(id - this.hMetrics.length)
  }
}
Table.register('hmtx', TableHtmx)