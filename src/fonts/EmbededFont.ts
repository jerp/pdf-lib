/*
  EmbededFont
  Inspired by work done by https://github.com/foliojs/pdfkit, https://github.com/nodebox/opentype.js and https://github.com/mozilla/pdf.js
*/

import { DataStream } from 'fonts/DataStream';
import { IFont, ISubset } from 'fonts/Font'

export { IFont }

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

export class EmbededFont {
  private subset: ISubset
  private subsetCodePoints: (number[])[] = [[0]]
  private widths: number[] = [1400]
  private cachedSubsetData: subsetDataType
  private cachedFontName: string
  static for(font: IFont) {
    return new EmbededFont(font)
  }
  constructor(private font: IFont) {
    this.subset = this.font.createSubset()
    // fix fontkit issues when cff.topDict.Private.Subrs is missing
    this.fixSubset(this.subset)
  }
  private fixSubset(subset: any) {
    if (subset.cff && subset.cff.topDict && subset.cff.topDict.Private && !subset.cff.topDict.Private.Subrs) {
      subset.cff.topDict.Private.Subrs = []
    }
  }
  /** get basic properties of font to be embeded */
  widthOfText(text: string): number {
    return this.font.layout(text).advanceWidth
  }
  get fontBBox() {
    return [this.font.bbox.minX, this.font.bbox.minX, this.font.bbox.maxX, this.font.bbox.maxY]
  }
  get italicAngle() {
    return this.font.italicAngle
  }
  get ascent() {
    return this.font.ascent
  }
  get descent() {
    return this.font.descent
  }
  get capHeight() {
    return this.font.capHeight
  }
  get xHeight() {
    return this.font.xHeight
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
  /** encode a series of words - no advance consideration */
  encodeText(text: string): number[] {
    const { glyphs } = this.font.layout(text)
    const glyphIds = glyphs.map(({id, codePoints, advanceWidth}) => {
      const subsetId = this.subset.includeGlyph(id)
      this.subsetCodePoints[subsetId] = codePoints
      this.widths[subsetId] = advanceWidth
      return subsetId
    })
    return glyphIds
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
        widths: this.widths
      }
    }
    return this.cachedSubsetData
  }
  get unitsPerEm() {
    return this.font.unitsPerEm
  }
}
