/*
  
  ## The 'glyf' table: General table information
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/glyf)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html)
  The 'glyf' table contains the data that defines the appearance of the glyphs in the font.
  The 'glyf' table supports the definition of simple glyphs and compound glyphs, that is,
  glyphs that are made up of other glyphs.

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'
import { directory } from 'fonts/tables/DirectoryTypes'


export class TableGlyf extends Table {
  static tableName: string = 'glyf'
  private loca: directory['loca']

  doDecode = (directory: directory) => {
    // glyf table must be decoded after loca table
    this.loca = directory.loca
  }
  encode(stream: DataStream, subset: number[]) {
    const startOffest = stream.offset
    let targetId = 0
    // offset of the first glyph is 0 in the loca table
    // folowing offset are relative to startOffest
    this.loca.set(0, 0)
    while (targetId < subset.length) {
      const sourceId = subset[targetId]
      const glyfOffset = stream.offset
      const glyfBytes = this.readGlyfData(sourceId)
      // some glyphs have not data (space just need an advance with to be rendered)
      if (glyfBytes.length > 0) {
        // this could add glyphs to the subset if the current glyph is composed of glyphs not yet in subset
        this.processComposite(glyfBytes, subset)
        // clone glyph from source font stream
        stream.setBytes(glyfBytes)
      }
      targetId++
      // the end of this glyph is the begining of the next one
      // loca stores nbGlyphs + 1 offset
      this.loca.set(targetId, glyfOffset-startOffest + glyfBytes.byteLength)
    }
  }
  private readGlyfData(id: number): Uint8Array {
    const currLoca = this.loca.get(id)
    const nextLoca = this.loca.get(id+1)
    // could happen that loca offset is one byte longer than the glyf table last offset
    return this.sourceStream.at(currLoca).getBytes(Math.min(this.sourceStream.byteLength, nextLoca) - currLoca)
  }
  private processComposite(glyfBytes: Uint8Array, subset: number[]) {
    const stream = new DataStream(glyfBytes)
    const numberOfContours = stream.getInt16()
    stream.offset += 4 * 2 // xMin, yMin, xMax, yMax
    if (numberOfContours < 0) {
      while (true) {
        const flags = stream.getUint16()
        const compId = stream.getUint16()
        // get compId of the source font
        let subsetIndex = subset.indexOf(compId)
        if (subsetIndex < 0) {
          // add comp if not already in subset
          subsetIndex = subset.push(compId) - 1
        }
        // fix id of the comp in the target font
        stream.skip(-2).setUint16(subsetIndex)
        if (!(flags & 32)) break
        stream.skip(((flags & 1) > 0) ? 4 : 2) // 2 pairs of words or bytes
        const nbTrailingBytes = (flags & 8) > 0 ? 2 : (flags & 64) > 0 ? 4 : (flags & 128) > 0 ? 8 : 0
        stream.skip(nbTrailingBytes)
      }
    }
  }
  // for unit test only - to delete
  getGlyfData(id: number): Uint8Array {
    return this.readGlyfData(id)
  }
  get length() {
    return this.loca.length - 1
  }
}
