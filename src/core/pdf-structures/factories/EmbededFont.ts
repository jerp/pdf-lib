/*
  EmbededFont
  Inspired by work done by https://github.com/foliojs/pdfkit, https://github.com/nodebox/opentype.js and https://github.com/mozilla/pdf.js
*/

import { DataStream } from 'helpers/DataStream';
import { TTFFont } from 'helpers/TTFFont'
import { FontkitFont } from 'fontkit'
import { Font as OpentypeJsFont, RenderOptions, Glyph, FontConstructorOptions } from 'opentype.js'

export type embedableFont = TTFFont | FontkitFont | OpentypeJsFont
export { TTFFont, FontkitFont, OpentypeJsFont }

export type namedEmbededFonts = { [index: string]: EmbededFont}
export { RenderOptions }

export abstract class EmbededFont {
  public fontName: string
  public fontBBox: number[]
  public ascent: number
  public descent: number
  public xHeight: number
  public capHeight: number
  public subtype: string = 'Type0'
  public encoding: string = 'Identity-H'
  public registry: string = 'Adobe'
  public ordering: string = 'Identity'
  public supplement: number = 0
  public fontCidType: number = 2
  public fontStreamSubtype: string
  public widths: number[]
  protected codePoints: (number[])[] = [[0]]
  /** creates EmbededFont instance from a TTFFont instance */
  static forTTFont(font: TTFFont): EmbededFont {
    return new EmbededTTFFont(font)
  }
  /** creates EmbededFont instance from a `fontkit` Font instance */
  static forFonkitFont(font: FontkitFont): EmbededFont {
    // fix subset: fontkit issues when cff.topDict.Private.Subrs is missing
    return new EmbededFontKitFont(font)
  }
  /** creates EmbededFont instance from a `opentype.js` Font instance */
  static forOpentypeJs(font: OpentypeJsFont): EmbededFont {
    return new EmbededOpentypeJsFont(font)
  }
  abstract getAdvanceWidth(text: string, fontSize: number, options?: RenderOptions): number
    /** encode a series of words - no advance consideration */
  abstract encodeText(text: string, options?: RenderOptions): Uint16Array
  constructor(
    protected font: embedableFont,
    postScriptName: string,
    public unitsPerEm: number,
    ascent: number,
    descent: number,
    xHeight: number,
    capHeight: number,
    public lineGap: number,
    bbox: number[],
    public isFixedPitch: number,
    public macStyleItalic: boolean,
    public familyClass: number,
    public italicAngle: number,
    public isTTF: boolean
  ) {
    this.seFontName(postScriptName)
    this.fontBBox = bbox.map(this.scaling.bind(this))
    this.ascent = this.scaling(ascent)
    this.descent = this.scaling(descent)
    this.capHeight = this.scaling(capHeight)
    this.xHeight = this.scaling(xHeight)
    this.widths = [this.scaling(this.getAdvanceWidth(String.fromCharCode(0), 1000))]
  }
  // scaling to PDF units (1000/em)
  private scaling(width: number) {
    return Math.round(width * 1000 / this.unitsPerEm)
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
    let flags = 0
    if (this.isFixedPitch) {
      flags |= 1 << 0;
    }
    if ((1 <= this.familyClass && this.familyClass <= 7)) {
      flags |= 1 << 1;
    }
    flags |= 1 << 2;
    if (this.familyClass === 10) {
      flags |= 1 << 3;
    }
    if (this.macStyleItalic) {
      flags |= 1 << 6;
    }
    return flags
  }
  seFontName(postScriptName: string) {
    const randomChar = () => String.fromCharCode(Math.random() * 26 + 65)
    this.fontName = [randomChar(), randomChar(), randomChar(), randomChar(), '+', postScriptName].join('')
  }
  includeGlyph(glyph: number | Glyph, codePoints: number[], advanceWidth: number) {
    const subsetId = this.addGlyph(glyph)
    this.codePoints[subsetId] = codePoints
    this.widths[subsetId] = this.scaling(advanceWidth)
    return subsetId
  }
  abstract addGlyph(glyph: number | Glyph): number
  abstract encode() : Uint8Array
  get CMap() {
    return {
      codespacerange: [0, 0xFFFF],
      ranges: this.codePoints.slice(1),
      cidSystemInfo: { registry: 'Adobe', ordering: 'UCS', supplement: 0 },
      name: 'Adobe-Identity-UCS',
    }
  }

}

class EmbededTTFFont extends EmbededFont {
  private subsetMap: number[]
  constructor(font: TTFFont) {
    super(
      font,
      font.postscriptName,
      font.unitsPerEm,
      font.ascent,
      font.descent,
      font.xHeight,
      font.capHeight,
      font.lineGap,
      [font.bbox.minX, font.bbox.minY, font.bbox.maxX, font.bbox.maxY],
      font.isFixedPitch,
      font.macStyleItalic,
      font.familyClass,
      font.italicAngle,
      false,
    )
    this.subsetMap = [0]
  }
  getAdvanceWidth(text: string, fontSize: number) {
    const font = this.font as TTFFont
    return font.getAdvanceWidth(text) * fontSize / this.font.unitsPerEm
  }
  encodeText(text: string, options?: RenderOptions) {
    const font = this.font as TTFFont
    const glyphs = font.layout(text, options).glyphs
    const glyphIds = glyphs.map(glyph => this.includeGlyph(glyph.id, glyph.codePoints, glyph.advanceWidth))
    return new Uint16Array(glyphIds)
  }
  addGlyph(sourceGlyphId: number) {
    const subsetId = this.subsetMap.indexOf(sourceGlyphId)
    // need to add the glyph to subset?
    return subsetId < 0 ? this.subsetMap.push(sourceGlyphId) - 1 : subsetId
  }
  encode() {
    const font = this.font as TTFFont
    return font.encodeSubset(this.subsetMap)
  }
}
class EmbededFontKitFont extends EmbededFont {
  private subset: any
  constructor(font: FontkitFont) {
    super(
      font,
      font.postscriptName,
      font.unitsPerEm,
      font.ascent,
      font.descent,
      font.xHeight,
      font.capHeight,
      font.lineGap,
      [font.bbox.minX, font.bbox.minY, font.bbox.maxX, font.bbox.maxY],
      font.post.isFixedPitch,
      !!(font.head.macStyle && font.head.macStyle.italic),
      (font['OS/2'] && font['OS/2'].sFamilyClass || 0) >> 8,
      font.italicAngle,
      false)
    this.subset = font.createSubset()
      // fix subset: fontkit issues when cff.topDict.Private.Subrs is missing
    const cff = font['CFF ']
    if (cff && cff.topDict && cff.topDict.Private && !cff.topDict.Private.Subrs) {
      cff.topDict.Private.Subrs = []
    }
    this.fontStreamSubtype = 'CIDFontType0C'
  }
  getAdvanceWidth(text: string, fontSize: number, options?: RenderOptions) {
    const font = this.font as FontkitFont
    return font.layout(text, options).advanceWidth * fontSize / this.unitsPerEm
  }
  encodeText(text: string, options?: RenderOptions) {
    const font = this.font as FontkitFont
    const glyphs = font.layout(text, options).glyphs as {id: number, codePoints: number[], advanceWidth: number}[]
    const glyphIds = glyphs.map(glyph => this.includeGlyph(glyph.id, glyph.codePoints, glyph.advanceWidth))
    return new Uint16Array(glyphIds)
  }
  addGlyph(glyphId: number) {
    return this.subset.includeGlyph(glyphId) as number
  }
  encode() {
    const stream = new DataStream()
    this.subset.encode(stream)
    return stream.getBytes()
  }
}

class EmbededOpentypeJsFont extends EmbededFont {
  private glyphs: any[]
  private OpentypeFont: any
  constructor(font: OpentypeJsFont) {
    const tables = font.tables
    super(
      font,
      font.names.postScriptName.en,
      font.unitsPerEm,
      font.ascender,
      font.descender,
      tables.os2.sxHeight || 0,
      tables.os2.sCapHeight || font.ascender,
      0, // TODO check line gap with opentype.js
      [tables.head.xMin, tables.head.yMin, tables.head.xMax, tables.head.yMax],
      tables.post.isFixedPitch,
      !!tables.head.macStyle.italic,
      (tables.os2 && tables.os2.sFamilyClass || 0) >> 8,
      tables.post.italicAngle, false)
    this.glyphs = [font.glyphs.get(0)]
    this.fontStreamSubtype = 'OpenType'
  }
  getAdvanceWidth(text: string, fontSize: number, options?: RenderOptions) {
    const font = this.font as OpentypeJsFont
    return font.getAdvanceWidth(text, fontSize, options)
  }
  encodeText(text: string) {
    const font = this.font as OpentypeJsFont
    const glyphs = font.stringToGlyphs(text)
    const glyphIds = glyphs.map(glyph => this.includeGlyph(glyph, glyph.unicodes, glyph.advanceWidth))
    return new Uint16Array(glyphIds)
  }
  addGlyph(glyph: Glyph) {
    const subsetId = this.glyphs.indexOf(glyph)
    return subsetId > -1 ? subsetId : this.glyphs.push(glyph) - 1
  }
  encode() {
    const font = this.font as OpentypeJsFont
    const OpentypeJsFont = this.font.constructor as OpentypeJsFontConstructable
    const glyphs = []
    for (const pos in this.glyphs) {
      glyphs.push(this.glyphs[pos])
    }
    const subsetFont = new OpentypeJsFont({
      // TODO check what's the most appropriate name for the subset font...
      // TODO chekc if other properties of the source font should be exported too,
      // in particular, weightClass - widthClass - fsSelection
      familyName: font.names.fontFamily.en,
      styleName:  font.names.fontSubfamily.en,
      unitsPerEm: font.unitsPerEm,
      ascender:   font.ascender,
      descender:  font.descender,
      glyphs:     glyphs
    })
    return new Uint8Array(subsetFont.toTables().encode())
  }
}
interface OpentypeJsFontConstructable {
  new(o: FontConstructorOptions): OpentypeJsFont;
}
