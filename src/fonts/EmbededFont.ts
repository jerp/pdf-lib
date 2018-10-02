/*
  EmbededFont
  Inspired by work done by https://github.com/foliojs/pdfkit, https://github.com/nodebox/opentype.js and https://github.com/mozilla/pdf.js
*/

import { DataStream } from 'fonts/DataStream';
import { IFont, ISubset, IEmbededFont } from 'fonts/Font'
// import {
//   PDFIndirectReference,
// } from 'core/pdf-objects';

export interface IFontFlagOptions {
  FixedPitch?: boolean;
  Serif?: boolean;
  Symbolic?: boolean;
  Script?: boolean;
  Nonsymbolic?: boolean;
  Italic?: boolean;
  AllCap?: boolean;
  SmallCap?: boolean;
  ForceBold?: boolean;
}

export type subsetDataType = {
  data: Uint8Array,
  CMap: {
    codespacerange: number[],
    ranges: (number[])[]
  },
  widths: number[],
}

export class EmbededFont implements IEmbededFont { // extends PDFIndirectReference
  get hasCff() {
    return this.subset.cff != null
  }
  private subset: ISubset
  private subsetCodePoints: (number[])[] = [[0]]
  private widths: number[]
  private cachedSubsetData: subsetDataType
  private cachedFontName: string
  static for(font: IFont) {
    return new EmbededFont(font)
  }
  constructor(private font: IFont) {
    this.subset = this.font.createSubset()
    this.widths = [ this.widthOfText(String.fromCharCode(0)) ]
    // fix fontkit issues when cff.topDict.Private.Subrs is missing
    this.fixSubset(this.subset.cff)
  }
  private fixSubset(cff: any) {
    if (cff && cff.topDict && cff.topDict.Private && !cff.topDict.Private.Subrs) {
      cff.topDict.Private.Subrs = []
    }
  }
  // scaling to PDF units (1000/em)
  private scaling(width: number) {
    return Math.round(width * 1000 / this.unitsPerEm)
  }
  get fontBBox() {
    return [this.font.bbox.minX, this.font.bbox.minX, this.font.bbox.maxX, this.font.bbox.maxY].map(this.scaling.bind(this))
  }
  get italicAngle() {
    return this.font.italicAngle
  }
  get ascent() {
    return this.scaling(this.font.ascent)
  }
  get descent() {
    return this.scaling(this.font.descent)
  }
  get capHeight() {
    return this.scaling(this.font.capHeight)
  }
  get xHeight() {
    return this.scaling(this.font.xHeight)
  }
  get postScriptName() {
    return this.font.postscriptName
  }
  get familyClass() {
    return (this.font['OS/2'] && this.font['OS/2'].sFamilyClass || 0) >> 8
  }
  get isFixedPitch() {
    return this.font.post.isFixedPitch
  }
  get macStyleItalic() {
    return !!this.font.head.macStyle.italic
  }
  /** get basic properties of font to be embeded */
  widthOfText(text: string): number {
    return this.scaling(this.font.layout(text).advanceWidth)
  }
  /** encode a series of words - no advance consideration */
  encodeText(text: string): Uint16Array {
    const { glyphs } = this.font.layout(text)
    const glyphIds = glyphs.map(({id, codePoints, advanceWidth}) => {
      const subsetId = this.subset.includeGlyph(id)
      this.subsetCodePoints[subsetId] = codePoints
      this.widths[subsetId] = this.scaling(advanceWidth)
      return subsetId
    })
    return new Uint16Array(glyphIds)
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
  get fontName() {
    if (this.cachedFontName == null) {
      const randomChar = () => String.fromCharCode(Math.random() * 26 + 65)
      this.cachedFontName = [randomChar(), randomChar(), randomChar(), randomChar(), '+', this.postScriptName].join('')
    }
    return this.cachedFontName
  }
  get subsetData(): subsetDataType {
    if (this.cachedSubsetData == null) {
      const stream = new DataStream()
      this.subset.encode(stream)
      this.cachedSubsetData = {
        data: stream.getBytes(),
        CMap: {
          codespacerange: [0, 0xFFFF],
          ranges: this.subsetCodePoints.slice(1),
        },
        widths: this.widths,
      }
    }
    return this.cachedSubsetData
  }
  get unitsPerEm() {
    return this.font.unitsPerEm
  }
}
