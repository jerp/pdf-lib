/*
  
  ## 'cmap' Character to Glyph Index Mapping Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/cmap)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html)
  
  The 'cmap' table maps character codes to glyph indices. The choice of encoding for a particular
  font is dependent upon the conventions used by the intended platform. A font intended to run on
  multiple platforms with different encoding conventions will require multiple encoding tables.
  As a result, the 'cmap' table may contain multiple subtables, one for each supported encoding scheme.

*/

import { DataStream, Uint16View } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

export class TableCmap extends Table {
  static tableName: string = 'cmap'
  private cmap: Cmap
  decode(stream: DataStream) {
    const startOffset = stream.offset
    const version = stream.getUint16()
    const numberSubtables = stream.getUint16()
    const subTables: any[] = []
    while (subTables.length < numberSubtables) {
      const subTable: any = {}
      subTable.id = stream.getUint16()
      subTable.specificId = stream.getUint16() // encoding identifier
      subTable.offset = stream.getUint32()
      subTables.push(subTable)
    }
    const subTableOffset = this.findSubTable(subTables)
    stream.offset = startOffset + subTableOffset
    this.cmap = Cmap.create(stream, version)
  }
  private findSubTable(subTables: any[]): number {
    const lookup = [
      // 32-bit subtables
      [3, 10], // Microsoft - Unicode full repertoire
      [0, 4],  // Unicode 2.0 or later semantics (non-BMP characters allowed)
      [0, 6],  // Unicode - Full Unicode

      // 16-bit subtables
      [3, 1],  // Microsoft - Unicode BMP
      [0, 3],  // Unicode - Unicode 2.0 or later semantics (BMP only)
      // [0, 2],  // ISO 10646 1993 semantics (deprecated)
      [0, 1], // Version 1.1 semantics
      [0, 0]  // Default semantics
    ]
    let found: any
    lookup.some(([id, specificId]) =>
      subTables.some(subTable => subTable.id === id && subTable.specificId === specificId && (found = subTable) )
    )
    if (found == null) {
      throw new Error('not valid cmap found')
    }
    return found.offset
  }
  encode(stream: DataStream) {
    throw new Error('encoding cmap is not supported')
  }
  get(codePoint: number) {
    return this.cmap.get(codePoint)
  }
}

const CmapClasses: any[] = []
abstract class Cmap {
  public version: number
  static create(stream: DataStream, version: number): Cmap {
    const format = stream.getUint16()
    const cmapClass = CmapClasses[format]
    if (cmapClass == null) throw new Error('not valid cmap found: unsuported format: ' + format)
    const cmap = new cmapClass(stream)
    cmap.version = version
    return cmap
  }
  abstract get(codePoint: number): number
}
class Cmap0 extends Cmap {
  private glyphIndexArray: Uint8Array
  constructor(stream: DataStream) {
    super()
    stream.getUint16() // length
    stream.getUint16() // language
    this.glyphIndexArray = stream.getBytes(256)
  }
  get(codePoint: number): number {
    return this.glyphIndexArray[codePoint] || 0
  }
}
CmapClasses[0] = Cmap0
/*
TODO when required
class Cmap2 extends Cmap {
  private subHeaderKeys: Uint16Array
  private subHeaders: Uint16Array
  private glyphIndexArray: Uint16Array
  constructor(stream: DataStream) {
    super()
    stream.getUint16() // length
    stream.getUint16() // language
    this.subHeaderKeys = <Uint16Array>stream.getTypedArray(256, Uint16Array)
    this.subHeaders = <Uint16Array>stream.getTypedArray(256, Uint16Array)
    this.glyphIndexArray = <Uint16Array>stream.getTypedArray(256, Uint16Array)
  }
  get(codePoint: number): number {
    return this.glyphIndexArray[codePoint]
  }
}
CmapClasses[2] = Cmap2
*/

class Cmap4 extends Cmap {
  private segCount: number
  private endCode: Uint16View
  private startCode: Uint16View
  private idDelta: Uint16View
  private idRangeOffset: Uint16View
  private glyphIndexArray: Uint16View
  constructor(stream: DataStream) {
    super()
    const startOffset = stream.offset
    const byteLength = stream.getUint16() // byteLength
    stream.getUint16() // language
    const segCountX2 = stream.getUint16()
    this.segCount = segCountX2 >> 1
    stream.getUint16() // searchRange
    stream.getUint16() // entrySelector
    stream.getUint16() // rangeShift
    this.endCode = stream.getTypedView(this.segCount, Uint16View)
    stream.getUint16() // reservedPad - This value should be zero
    this.startCode = stream.getTypedView(this.segCount, Uint16View)
    this.idDelta = stream.getTypedView(this.segCount, Uint16View)
    this.idRangeOffset = stream.getTypedView(this.segCount, Uint16View)
    this.glyphIndexArray = stream.getTypedView((byteLength - (stream.offset - startOffset)) / 2, Uint16View)
  }
  get(codePoint: number): number {
    let min = 0
    let max = this.segCount - 1
    while (min <= max) {
      let mid = (min + max) >> 1
      if (codePoint < this.startCode.get(mid)) {
        max = mid - 1
      } else if (codePoint > this.endCode.get(mid)) {
        min = mid + 1
      } else {
        let rangeOffset = this.idRangeOffset.get(mid)
        let gid
        if (rangeOffset === 0) {
          gid = codePoint + this.idDelta.get(mid)
        } else {
          let index = rangeOffset / 2 + (codePoint - this.startCode.get(mid)) - (this.segCount - mid)
          gid = this.glyphIndexArray.get(index) || 0
          if (gid !== 0) {
            gid += this.idDelta.get(mid)
          }
        }
        return gid & 0xffff
      }
    }
    return 0
  }
}
CmapClasses[4] = Cmap4
class Cmap12 extends Cmap {
  private groups: { startCharCode: number, endCharCode: number, startGlyphCode: number }[]
  constructor(stream: DataStream) {
    super()
    stream.getUint16() // strange
    stream.getUint32() // length
    stream.getUint32() // language
    const nGroups = stream.getUint32()
    for (let i = 0; i < nGroups; i++) {
      // groups are Uint32 triplets
      const startCharCode = stream.getUint32()
      const endCharCode = stream.getUint32()
      const startGlyphCode = stream.getUint32()
      this.groups.push({ startCharCode, endCharCode, startGlyphCode })
    }
    this.groups.sort((g1, g2) => g1.startCharCode - g2.startCharCode)
  }
  get(codePoint: number): number {
    let min = 0;
    let max = this.groups.length - 1
    while (min <= max) {
      let mid = (min + max) >> 1
      const group = this.groups[mid]
      if (codePoint < group.startCharCode) {
        max = mid - 1
      } else if (codePoint > group.endCharCode) {
        min = mid + 1
      } else {
        return group.startGlyphCode + (codePoint - group.startCharCode)
      }
    }
    return 0
  }
}
CmapClasses[12] = Cmap12
