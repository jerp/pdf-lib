export interface IEmbededFont {
  hasCff: boolean
  widthOfText(text: string): number
  encodeText(text: string): Uint16Array
}

export type namedEmbededFonts = { [index: string]: IEmbededFont}
// stream methods used by PDFKit must be implemented
export interface IStream {
  writeString(string: string, encoding: string): void
  writeUInt8(value: number): void
  writeUInt16LE(value: number): void
  writeUInt16BE(value: number): void
  writeUInt32LE(value: number): void
  writeUInt32BE(value: number): void
  writeInt8(value: number): void
  writeInt16LE(value: number): void
  writeInt16BE(value: number): void
  writeInt32LE(value: number): void
  writeInt32BE(value: number): void
  writeFloatLE(value: number): void
  writeFloatBE(value: number): void
  writeDoubleLE(value: number): void
  writeDoubleBE(value: number): void
  fill(value: any, offset?: number, end?: number): void
}
// min requirement for a font (PDFkit compatible)
export interface IFont {
  isTTF: boolean
  postscriptName: string
  unitsPerEm: number
  ascent: number
  descent: number
  xHeight: number
  capHeight: number
  lineGap: number
  bbox: { height: number, maxX: number, maxY: number, minX: number, minY: number, width: number }
  post: { isFixedPitch: number }
  head: { macStyle: {italic: number} }
  'OS/2': { sFamilyClass: number}
  italicAngle: number
  layout(text: string, features?: any): {
    glyphs: ({  // minimal glyph info
      id: number,
      advanceWidth: number,
      codePoints: number[]
    })[],
    // positions: ({
    //   xAdvance: number,
    //   yAdvance: number,
    // })[],
    advanceWidth: number,
  }
  createSubset(): ISubset
}
// min requirement for a font subset (PDFkit compatible)
export interface ISubset {
  cff?: any
  includeGlyph: (glyphId: number) => number
  encode: (stream: IStream) => void
}
