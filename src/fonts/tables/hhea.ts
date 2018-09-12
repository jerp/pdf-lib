/*
  
  ## The 'hhea' table: General table information
  
  The [hhea](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hhea.html) table
  contains information needed to layout fonts whose characters are written horizontally,
  that is, either left to right or right to left.

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

export class TableHhea extends Table {
  static tableName: string = 'hhea'
  public version: number
  /** Distance from baseline of highest ascender */
  public ascent: number
  /** Distance from baseline of lowest descender */
  public descent: number
  /** Typographic line gap */
  public lineGap: number
  /** Maximum advance width value in 'hmtx' table */
  public advanceWidthMax: number
  /** Maximum advance width value in 'hmtx' table */
  public minLeftSideBearing: number
  /** Minimum right sidebearing value */
  public minRightSideBearing: number
  public xMaxExtent: number
  /** Used to calculate the slope of the cursor (rise/run); 1 for vertical */
  public caretSlopeRise: number
  /** 0 for vertical */
  public caretSlopeRun: number
  /** Set to 0 for non-slanted fonts */
  public caretOffset: number
  public reserved: number[] 
  /** 0 for current format */
  public metricDataFormat: number
  /** Number of advance widths in 'hmtx' table */
  public numberOfHMetrics: number
  // size: number = (32 + 16 * 16 )
  decode(stream: DataStream) {
    this.version = stream.getFixed32()
    this.ascent = stream.getInt16()
    this.descent = stream.getInt16()
    this.lineGap = stream.getUint16()
    this.advanceWidthMax = stream.getInt16()
    this.minLeftSideBearing = stream.getInt16()
    this.minRightSideBearing = stream.getInt16()
    this.xMaxExtent = stream.getInt16()
    this.caretSlopeRise = stream.getInt16()
    this.caretSlopeRun = stream.getInt16()
    this.caretOffset = stream.getInt16()
    this.reserved = [stream.getInt16(), stream.getInt16(), stream.getInt16(), stream.getInt16()]
    this.metricDataFormat = stream.getInt16()
    this.numberOfHMetrics = stream.getUint16()
  }
  // encode(stream: DataStream) {
  //   stream.setFixed32(this.version)
  //   stream.setInt16(this.ascent)
  //   stream.setInt16(this.descent)
  //   stream.setUint16(this.lineGap)
  //   stream.setInt16(this.advanceWidthMax)
  //   stream.setInt16(this.minLeftSideBearing)
  //   stream.setInt16(this.minRightSideBearing)
  //   stream.setInt16(this.xMaxExtent)
  //   stream.setInt16(this.caretSlopeRise)
  //   stream.setInt16(this.caretSlopeRun)
  //   stream.setInt16(this.caretOffset)
  //   stream.setInt16(0); stream.setInt16(0); stream.setInt16(0); stream.setInt16(0)
  //   stream.setInt16(this.metricDataFormat)
  //   stream.setUint16(this.numberOfHMetrics)
  // }
}
