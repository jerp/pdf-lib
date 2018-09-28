/**
 * Support for Simple TTF font
 * no support for tables:
 * - GSUB
 * - GPOS
 * - CFF
 * 
 */

import { DataStream } from 'fonts/DataStream';
import { IFont, ISubset } from 'fonts/Font'

import { Table } from 'fonts/tables/Table'
import {
  directory,
  TableHead, TableName, TableHhea, TableMaxp, TablePost, TableCmap,
  TableHmtx, TableOS2, TableLoca, TableGlyf
} from 'fonts/tables/DirectoryTypes';

/**
 * Decoding TTF, subsetting...
 */
export class TTFFont implements IFont {
  static for = (data: Uint8Array, CIDFont?: boolean) => new TTFFont(data, CIDFont)
  // mapping subset[targetId] > sourceId
  public subsetCodePoints: Array<boolean[]> = [[true]]
  // mapping subsetIndex[sourceId] > targetId
  public subsetIndex: {[index: number] :number} = { 0: 0 }
  public directory: directory
  constructor(private data: Uint8Array, private CIDFont: boolean = false) {
    const stream = new DataStream(this.data)
    const directoryFactory = DirectoryFactory.forDecode(stream)
    this.directory = {
      head: new TableHead(),
      name: new TableName(),
      hhea: new TableHhea(),
      maxp: new TableMaxp(),
      post: new TablePost(),
      cmap: new TableCmap(),
      hmtx: new TableHmtx(),
      os2: new TableOS2(),
      fpgm: new Table(),
      loca: new TableLoca(),
      prep: new Table(),
      cvt: new Table(),
      glyf: new TableGlyf(),
    }
    directoryFactory.decodeTable('head', this.directory.head, this.directory)
    directoryFactory.decodeTable('name', this.directory.name, this.directory) // just read
    directoryFactory.decodeTable('hhea', this.directory.hhea, this.directory)
    directoryFactory.decodeTable('maxp', this.directory.maxp, this.directory)
    directoryFactory.decodeTable('post', this.directory.post, this.directory) // just read
    directoryFactory.decodeTable('cmap', this.directory.cmap, this.directory) // just read
    directoryFactory.decodeTable('hmtx', this.directory.hmtx, this.directory)
    directoryFactory.decodeTable('OS/2', this.directory.os2, this.directory) // just read
    directoryFactory.decodeTable('fpgm', this.directory.fpgm, this.directory)
    directoryFactory.decodeTable('loca', this.directory.loca, this.directory)
    directoryFactory.decodeTable('prep', this.directory.prep, this.directory)
    directoryFactory.decodeTable('cvt ', this.directory.cvt, this.directory)
    directoryFactory.decodeTable('glyf', this.directory.glyf, this.directory)
    this.validateTTF()
    this.post.isFixedPitch = this.directory.post.isFixedPitch
    this.head.macStyle.italic = this.directory.head.macStyle.italic ? 1 : 0
    this.directory.os2.sFamilyClass = this['OS/2'].sFamilyClass
  }
  private validateTTF() {
    if (!this.CIDFont && !this.directory.cmap.hasData) throw new Error('TTF required table cmap is missing')
    if (!this.directory.glyf.hasData) throw new Error('TTF required table glyf is missing')
    if (!this.directory.head.hasData) throw new Error('TTF required table head is missing')
    if (!this.directory.hhea.hasData) throw new Error('TTF required table hhea is missing')
    if (!this.directory.hmtx.hasData) throw new Error('TTF required table hmtx is missing')
    if (!this.directory.loca.hasData) throw new Error('TTF required table loca is missing')
    if (!this.directory.maxp.hasData) throw new Error('TTF required table maxp is missing')
    if (!this.CIDFont && !this.directory.name.hasData) throw new Error('TTF required table name is missing')
    if (!this.CIDFont && !this.directory.post.hasData) throw new Error('TTF required table post is missing')
  }
  widthOfText(text: string) {
    const cmap = this.directory.cmap
    return stringToCodePoints(text)
    .map(codePoint => cmap.get(codePoint))
    .reduce((advanceWidth, glyphId) => advanceWidth + this.getGlyphWidth(glyphId), 0)
  }
  post = { isFixedPitch: 0}
  head = { macStyle: {italic: 0} }
  'OS/2'= { sFamilyClass: 0}
  layout(text: string, features?: any) {
    const cmap = this.directory.cmap
    return stringToCodePoints(text)
    .reduce((run, codePoint) => {
      const glyphId = cmap.get(codePoint)
      const advanceWidth = this.getGlyphWidth(glyphId)
      run.advanceWidth += advanceWidth
      run.glyphs.push({
        id: glyphId,
        codePoints: [codePoint],
        advanceWidth: advanceWidth
      })
      return run
    }, {
      glyphs: <({ id: number, codePoints: number[], advanceWidth: number })[]>[],
      advanceWidth: 0
    })
  }
  createSubset() {
    return new Subset(this.directory)
  }
  get bbox() {
    const head = this.directory.head
    return {
      minX: head.xMin,
      minY: head.yMin,
      maxX: head.xMax,
      maxY: head.yMax,
      height: head.yMax - head.yMin,
      width: head.xMax - head.xMin,
    }
  }
  get italicAngle() {
    return this.directory.post.italicAngle
  }
  get ascent() {
    return this.directory.hhea.ascent
  }
  get descent() {
    return this.directory.hhea.descent
  }
  get capHeight() {
    return this.directory.os2.sCapHeight || this.directory.hhea.ascent
  }
  get xHeight() {
    return this.directory.os2.sxHeight || 0
  }
  get postscriptName() {
    return this.directory.name.get('postScriptName') || ''
  }
  get familyClass() {
    return (this.directory.os2 && this.directory.os2.sFamilyClass || 0) >> 8
  }
  get isFixedPitch() {
    return this.directory.post.isFixedPitch
  }
  get macStyleItalic() {
    return this.directory.head.macStyle.italic
  }
  get flags(): number {
    // FixedPitch: 1,
    // Serif: 2,
    // Symbolic: 4,
    // Script: 8,
    // Nonsymbolic: 32,
    // Italic: 64,
    // AllCap: 65536,
    // SmallCap: 131072,
    // ForceBold: 262144
    const familyClass = (this.directory.os2.sFamilyClass || 0) >> 8
    let flags = 0
    if (this.directory.post.isFixedPitch) {
      flags |= 1 << 0;
    }
    if ((1 <= familyClass && familyClass <= 7)) {
      flags |= 1 << 1;
    }
    flags |= 1 << 2;
    if (familyClass === 10) {
      flags |= 1 << 3;
    }
    if (this.directory.head.macStyle.italic) {
      flags |= 1 << 6;
    }
    return flags
  }
  private getGlyphWidth(glyphId: number) {
    return this.directory.hmtx.advanceWidth(glyphId)
  }
  get unitsPerEm() { return this.directory.head.unitsPerEm }
  get lineGap() { return this.directory.head.unitsPerEm }
  // for unit testing only
  get __dir__() {
    return this.directory
  }
}

// local helpers

class DirectoryFactory {
  private static entryLength = 4 + 3 * 4
  constructor(private stream: DataStream, private numTables: number) {
    stream.save('tableOffsetsPos')
  }
  static forDecode(stream: DataStream) {
    const format = stream.getString(4)
    if (format !== 'true' && format !== 'OTTO' && format !== String.fromCharCode(0, 1, 0, 0)) {
      new Error(`Unsupport format by TTFFont class (${format})`)
    }
    const numTables = stream.getUint16()
    stream.skip(6) // skipping 3 Uint16: searchRange, entrySelector, rangeShift
    return new DirectoryFactory(stream, numTables)
  }
  static forEncode(stream: DataStream, numTables: number) {
    const searchRange = Math.floor(Math.log(numTables) / Math.LN2) * 16;
    stream.setString('true')
    stream.setInt16(numTables)
    stream.setInt16(searchRange)
    stream.setInt16(Math.floor(searchRange / Math.LN2))
    stream.setInt16(numTables * 16 - searchRange)
    const directoryFactory = new DirectoryFactory(stream, 0)
    // make room for directory items
    stream.offset += numTables * DirectoryFactory.entryLength
    return directoryFactory
  }
  getTableNames() {
    const names = []
    for (let i = 0; i<this.numTables; i++) {
      names.push(this.stream.restore('tableOffsetsPos').skip(i * DirectoryFactory.entryLength).getString(4))
    }
    return names
  }
  scanTableName(tableName: string) {
    for (let i = 0; i<this.numTables; i++) {
      if (this.stream.restore('tableOffsetsPos').skip(i * DirectoryFactory.entryLength).getString(4) === tableName) return true
    }
  }
  decodeTable(tableName: string, table: Table, directory: directory) {
    if (this.scanTableName(tableName)) {
      const tableOffsetPos = this.stream.skip(4).getUint32()
      const tableByteLength = this.stream.getUint32()
      table.decode(new DataStream(this.stream.at(tableOffsetPos).getBytes(tableByteLength)), directory)
    } else {
      // debugger
      // TODO recovery mode: in some case it is possible to rebuld the table...
    }
  }
  encodeTable(tableName: string, table: Table, subsetMap: number[]) {
    if (table.hasData) {
      const tableOffset = this.stream.offset
      table.encode(this.stream, subsetMap)
      // encode direcotry entry
      const tableByteLength = this.stream.offset - tableOffset
      this.stream.restore('tableOffsetsPos').skip(DirectoryFactory.entryLength * this.numTables++)
      .setString(tableName)
      .setInt32(0) // TODO: checkSum
      .setInt32(tableOffset)
      .setInt32(tableByteLength)
      // reset offest
      this.stream.at(tableOffset + tableByteLength)
    }
  }
}

class Subset implements ISubset {
  private subsetMap: number[] = [0]
  constructor(private directory: directory) {}
  includeGlyph(sourceGlyphId: number) {
    const targetId = this.subsetMap.indexOf(sourceGlyphId)
    // need to add the glyph to subset?
    return targetId < 0 ? this.subsetMap.push(sourceGlyphId) - 1 : targetId
  }
  encode(stream: DataStream) {
    const directoryFactory = DirectoryFactory.forEncode(stream, 9)
    // glyf table must be encode first since other tables depend on the nb of glyphs
    directoryFactory.encodeTable('glyf', this.directory.glyf, this.subsetMap)
    directoryFactory.encodeTable('head', this.directory.head, this.subsetMap)
    // loca must be after head as head.indexToLocFormat depends on length of largest loca offset
    directoryFactory.encodeTable('loca', this.directory.loca, this.subsetMap)
    directoryFactory.encodeTable('hhea', this.directory.hhea, this.subsetMap)
    directoryFactory.encodeTable('maxp', this.directory.maxp, this.subsetMap)
    directoryFactory.encodeTable('cvt ', this.directory.cvt, this.subsetMap)
    directoryFactory.encodeTable('prep', this.directory.prep, this.subsetMap)
    directoryFactory.encodeTable('hmtx', this.directory.hmtx, this.subsetMap)
    directoryFactory.encodeTable('fpgm', this.directory.fpgm, this.subsetMap)
  }
}

const stringToCodePoints = (string: string) => arrayFromString(string).map( c => c.codePointAt(0) || 0)
// This is based on Array.from implementation for strings in https://github.com/mathiasbynens/Array.from
const arrayFromString: (s: string) => string[] = Array.from || ((s: string) => s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[^\uD800-\uDFFF]|./g) || [])
