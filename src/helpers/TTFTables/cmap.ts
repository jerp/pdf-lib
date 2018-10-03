/*
  
  ## 'cmap' Character to Glyph Index Mapping Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/cmap)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html)
  
  The 'cmap' table maps character codes to glyph indices. The choice of encoding for a particular
  font is dependent upon the conventions used by the intended platform. A font intended to run on
  multiple platforms with different encoding conventions will require multiple encoding tables.
  As a result, the 'cmap' table may contain multiple subtables, one for each supported encoding scheme.

*/

import { DataStream, Uint16View, Int16View } from 'helpers/DataStream'
import { Table } from 'helpers/TTFTables/Table'

const subtablePriority = [
  // [0, 2],  // ISO 10646 1993 semantics (deprecated)
  0x00,  // Default semantics
  0x01, // Version 1.1 semantics
  // 16-bit subtables
  0x03,  // Unicode - Unicode 2.0 or later semantics (BMP only)
  0x31,  // Microsoft - Unicode BMP
  // 32-bit subtables
  0x06,  // Unicode - Full Unicode
  0x04,  // Unicode 2.0 or later semantics (non-BMP characters allowed)
  0x3a, // Microsoft - Unicode full repertoire
]

export class TableCmap extends Table {
  static tableName: string = 'cmap'
  private subtable: CmapSubtable
  doDecode = () => {
    const stream = this.sourceStream
    const numberSubtables = stream.skip(2).getUint16() // skipping version
    const foundSubtable = {
      priority: -1,
      offset: 0,
    }
    // prioritizing available subtable according to our usecase
    for (let i = 0; i < numberSubtables; i++) {
      const platformId = stream.getUint16()
      const specificId = stream.getUint16() // encoding identifier
      const priority = subtablePriority.indexOf(platformId*16 + specificId)
      if (priority > foundSubtable.priority) {
        foundSubtable.priority = priority
        foundSubtable.offset = stream.getUint32()
      } else {
        stream.skip(4)
      }
    }
    if (foundSubtable.priority < 0) throw new Error('not valid cmap found')
    switch (stream.at(foundSubtable.offset).getUint16()) {
      case 0: this.subtable = new CmapSubtable0(stream); break;
      case 4: this.subtable = new CmapSubtable4(stream); break;
      case 12: this.subtable = new CmapSubtable12(stream); break;
      default: throw new Error('not valid cmap found: unsuported format: ' + stream.skip(-2).getUint16())
    }
  }
  get(codePoint: number) {
    return this.subtable.get(codePoint)
  }
}

abstract class CmapSubtable {
  abstract get(codePoint: number): number
}
class CmapSubtable0 extends CmapSubtable {
  private glyphIndexArray: Uint8Array
  constructor(stream: DataStream) {
    super()
    const byteLength = stream.getUint16() // length
    stream.getUint16() // language
    this.glyphIndexArray = stream.getBytes(256)
  }
  get(codePoint: number): number {
    return this.glyphIndexArray[codePoint] || 0
  }
}

// TODO when required add format 2
/*
class CmapSubtable2 extends Cmap {
  private subHeaderKeys: Uint16View
  private subHeaders: Uint16View
  private glyphIndexArray: Uint16View
  constructor(stream: DataStream) {
    super()
    stream.getUint16() // length
    stream.getUint16() // language
    this.subHeaderKeys = stream.getTypedView((256, Uint16View)
    this.subHeaders = stream.getTypedView((256, Uint16View)
    this.glyphIndexArray = stream.getTypedView((256, Uint16View)
  }
  get(codePoint: number): number {
    return this.glyphIndexArray.get(codePoint)
  }
}
CmapClasses[2] = Cmap2
*/
// Format 4
class CmapSubtable4 extends CmapSubtable {
  private segCount: number
  private endCode: Uint16View
  private startCode: Uint16View
  private idDelta: Int16View
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
    this.idDelta = stream.getTypedView(this.segCount, Int16View)
    this.idRangeOffset = stream.getTypedView(this.segCount, Uint16View)
    this.glyphIndexArray = stream.getTypedView((byteLength - (stream.offset - startOffset)) / 2, Uint16View)
  }
  get(c: number): number {
    const i = this.searchSegment(c)
    if (i === -1) {
      return 0
    } else {
      let rangeOffset = this.idRangeOffset.get(i)
      if (rangeOffset === 0) {
        /*
           If the idRangeOffset is 0, the idDelta value is added directly to the character code
           to get the corresponding glyph index
           glyphIndex = idDelta[i] + c
           All idDelta[i] arithmetic is modulo 65536
        */
       return (c + this.idDelta.get(i)) & 0xffff
      } else {
        /*
          If the idRangeOffset value for the segment is not 0, the mapping of the character codes relies on the glyphIndexArray.
          The character code offset from startCode is added to the idRangeOffset value.
          This sum is used as an offset from the current location within idRangeOffset itself to index out the correct glyphIdArray value.
          glyphIndex = *( &idRangeOffset[i] + idRangeOffset[i] / 2 + (c - startCode[i]) )
        */
        const glyphIndex = rangeOffset / 2 - (this.segCount - i) + (c - this.startCode.get(i))
        return glyphIndex < this.glyphIndexArray.length ? this.glyphIndexArray.get(glyphIndex) + this.idDelta.get(i) & 0xffff : 0
      }
    }
  }
  // Binary search on segments
  private searchSegment(c: number): number {
    let left = 0
    let right = this.segCount - 1
    while (left <= right) {
      const middle = left + ((right - left) / 2) | 0
      if (c < this.startCode.get(middle)) {
        right = middle - 1
      } else if (c > this.endCode.get(middle)) {
        left = middle + 1
      } else {
        return middle
      }
    }
    return -1
  }
}

// Format 12
class CmapSubtable12 extends CmapSubtable {
  private groups: { startCharCode: number, endCharCode: number, startGlyphCode: number }[] = []
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
