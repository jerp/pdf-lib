/*
  
  ## 'loca': General table information
  
  [ms](https://docs.microsoft.com/en-us/typography/opentype/spec/loca)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6loca.html)
  stores the offsets to the locations of the glyphs in the font relative to the beginning of the 'glyf' table.
  Its purpose is to provide quick access to the data for a particular character.
  For example, in the standard Macintosh glyph ordering, the character A is the 76th glyph in a font.
  The 'loca' table stores the offset from the start of the 'glyf' table to the position at which
  the data for each glyph can be found.

  */
 
import { DataStream, Uint16View, Uint32View } from 'helpers/DataStream'
import { Table } from 'helpers/TTFTables/Table'
import { directory } from 'helpers/TTFTables/DirectoryTypes'

export class TableLoca extends Table {
  static tableName: string = 'loca'
  private offsets: Uint16View | Uint32View
  private subsetOffsets: number[] = []
  private offsetMultiplier: number
  /** returns offset of a glif id */
  get(id: number) {
    return this.offsets.get(id) * this.offsetMultiplier
  }
  get length() {
    return this.offsets.length
  }
  doDecode = (directory: directory) => {
    const stream = this.sourceStream
    const shortVersion = directory.head.indexToLocFormat === 0
    const typedViewClass = shortVersion ? Uint16View : Uint32View
    this.offsetMultiplier = shortVersion ? 2 : 1
    this.offsets = stream.getTypedView(stream.byteLength / typedViewClass.elemByteLength, typedViewClass)
  }
  // must be called after glyf table is encoded
  encode(stream: DataStream, subset: number[]) {
    if (subset.length < 0xffff) {
      // The short table version stores the actual offset divided by 2.
      this.subsetOffsets.forEach(offset => stream.setUint16(offset >>> 1))
    } else {
      // Need to update head.indexToLocFormat since it is defaulted to 1
      stream.save().restore('indexToLocFormat').setInt16(0).restore()
      this.subsetOffsets.forEach(offset => stream.setUint32(offset))
    }
  }
  set(id: number, offset: number) {
    this.subsetOffsets[id] = offset
  }
}