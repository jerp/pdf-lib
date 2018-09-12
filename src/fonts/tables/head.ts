/*
  
  ## The 'head' table: General table information
  
  The [head](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6head.html) table contains global information about the font.

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'



class BitField {
  constructor(public names: string[]) {}
  decode(bits: number): any {
    return this.names.reduce((o, name, i) => {
      if (name != null) o[name] = !!(bits & (1 << i))
      return o
    }, <any>{})
  }
  encode(o: any): number {
    return this.names.reduce((value, name, i) => {
      if (o[name]) value |= 1 << i
      return value
    }, 0)
  }
}

const macStyleCoder = new BitField(['bold', 'italic', 'underline', 'outline', 'shadow', 'condensed', 'extended'])

export class TableHead extends Table {
  static tableName: string = 'head'
  /** 0x00010000 if (version 1.0) */
  public version:            number
  /** set by font manufacturer */
  public fontRevision:       number                   
  public checkSumAdjustment: number
  /** set to 0x5F0F3CF5 */
  public magicNumber:        number
  public flags:              number
  /** range from 64 to 16384 */
  public unitsPerEm:         number
  public created:            number[]
  public modified:           number[]
  /** bounding boxe */
  public xMin:               number
  /** bounding boxe */
  public yMin:               number
  /** bounding boxe */
  public xMax:               number
  /** bounding boxe */
  public yMax:               number
  /**  'bold', 'italic', 'underline', 'outline', 'shadow', 'condensed', 'extended' */
  public macStyle:           any
  /** smallest readable size in pixels */
  public lowestRecPPEM:      number
  public fontDirectionHint:  number
  /** loca format: 0 for short offsets, 1 for long */
  public indexToLocFormat:   number
  /** 0 for current format */
  public glyphDataFormat:    number
  //size: number = (4 * 32 + 2*16 + 2*2*32 + 4 * 16 + 16 + 4 * 16)
  decode(stream: DataStream) {
    this.version = stream.getFixed32()
    this.fontRevision = stream.getFixed32()
    this.checkSumAdjustment = stream.getUint32()
    this.magicNumber = stream.getUint32()
    this.flags = stream.getUint16()
    this.unitsPerEm = stream.getUint16()
    this.created = [stream.getInt32(), stream.getInt32()]
    this.modified = [stream.getInt32(), stream.getInt32()]
    this.xMin = stream.getInt16()
    this.yMin = stream.getInt16()
    this.xMax = stream.getInt16()
    this.yMax = stream.getInt16()
    this.macStyle = stream.getInt16()
    this.lowestRecPPEM = stream.getUint16()
    this.fontDirectionHint = stream.getInt16()
    this.indexToLocFormat = stream.getInt16()
    this.glyphDataFormat = stream.getInt16()
  }
  // encode(stream: DataStream) {
  //   stream.setInt32(this.version)
  //   stream.setInt32(this.fontRevision)
  //   stream.setUint32(this.checkSumAdjustment)
  //   stream.setUint32(this.magicNumber)
  //   stream.setUint16(this.flags)
  //   stream.setUint16(this.unitsPerEm)
  //   stream.setInt32(this.created[0]); stream.setInt32(this.created[1])
  //   stream.setInt32(this.modified[0]); stream.setInt32(this.modified[1])
  //   stream.setInt16(this.xMin)
  //   stream.setInt16(this.yMin)
  //   stream.setInt16(this.xMax)
  //   stream.setInt16(this.yMax)
  //   stream.setInt16(this.macStyle)
  //   stream.setUint16(this.lowestRecPPEM)
  //   stream.setInt16(this.fontDirectionHint)
  //   stream.setInt16(this.indexToLocFormat)
  //   stream.setInt16(this.glyphDataFormat)
  // }
}
