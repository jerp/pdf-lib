import { GlyphSet, GlyphMap, widths, glyphSetOptions } from 'helpers/StandardFonts/glyphset/glyphset'
export class StandardFont {
  public fontName: string
  public fullName: string
  public familyName: string
  public weight: string
  public fontBBox: number[]
  public italicAngle: number
  public isFixedPitch: number
  public ascent: number
  public descent: number
  public xHeight: number
  public capHeight: number
  public underlinePosition: number
  public underlineThickness: number
  public unitsPerEm = 1000
  public charset: GlyphSet
  setCharset(glyphMap: GlyphMap, widths: widths, charset: string, opts?: glyphSetOptions) {
    this.charset = new GlyphSet(glyphMap, widths, charset, opts)
  }
  get lineGap() {
    return this.fontBBox[3] + this.descent - this.fontBBox[1] - this.ascent
  }
  encodeText(text: string) {
    return new Uint8Array(text.split('').map(this.charset.u2c.bind(this.charset)))
  }
  getAdvanceWidth(text: string) {
    const chars = text.split('')
    return chars.reduce((advanceWidth, char, i) => {
      return advanceWidth + this.charset.w(char) + this.charset.k(text.slice(i,i+2))
    }, 0)
  }
}
