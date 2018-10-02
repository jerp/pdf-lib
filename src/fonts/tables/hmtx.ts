/* 
  
  ## 'hmtx': Horizontal Metrics Table
  
  [ms](https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html)
  contains metric information for the horizontal layout each of the glyphs in the font.
*/

import { DataStream, Int16View } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'
import { directory } from 'fonts/tables/DirectoryTypes'

export class TableHmtx extends Table {
  static tableName: string = 'hmtx'
  private hMetrics: HMetrics
  private lastAdvanceWidth: number
  private leftSideBearingsView: Int16View
  doDecode = (directory: directory) => {
    const stream = this.sourceStream
      //@ts-ignore FIXME
    const numberOfHMetrics = directory.hhea.numberOfHMetrics || 0
    this.hMetrics = new HMetrics(stream, numberOfHMetrics)
    this.lastAdvanceWidth = this.hMetrics.advanceWidth(numberOfHMetrics-1)
    //@ts-ignore FIXME
    const numGlyphs = directory.maxp.numGlyphs
    const numberOfBearings = numGlyphs ? numGlyphs - numberOfHMetrics : 0
    this.leftSideBearingsView = stream.getTypedView(numberOfBearings, Int16View)
  }
  encode(stream: DataStream, subset: number[]) {
    for (let i = 0; i < subset.length; i++) {
      stream.setUint16(this.advanceWidth(subset[i]))
      stream.setInt16(this.leftSideBearing(subset[i]))
    }
  }
  advanceWidth(id: number): number {
    return id < this.hMetrics.length ? this.hMetrics.advanceWidth(id) : this.lastAdvanceWidth
  }
  leftSideBearing(id: number): number {
    return id < this.hMetrics.length ? this.hMetrics.leftSideBearing(id) : this.leftSideBearingsView.get(id - this.hMetrics.length)
  }
}

// local helper

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
