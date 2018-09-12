// This code is based on Array.from implementation for strings in https://github.com/mathiasbynens/Array.from
const arrayFromString: (s: string) => string[] = Array.from || ((s: string) => s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[^\uD800-\uDFFF]|./g) || [])

export abstract class Encoding  {
  constructor(private notDefCodePoint: number = 0xfffe) {}
  abstract codePointToGlyphIndex(codePoint: number): number
  stringToCodePoints(string: string): Uint32Array {
    return new Uint32Array(arrayFromString(string).map(c => c.codePointAt(0) || this.notDefCodePoint))
  }
  /** Get glyph indexes from string */
  stringToGlyphIds(string: string) {
    // Get glyph indexes
    const codePoints = this.stringToCodePoints(string)
    return this.codePointsToGlyphIds(codePoints)
  }
  /** Get glyph indexes from string */
  codePointsToGlyphIds(codePoints: Uint32Array) {
    // Get glyph indexes
    return codePoints.map(codePoint => this.codePointToGlyphIndex(codePoint))
  }
}

/**
 * Slow default searc in absence of other method (cmap).
 */
export class DefaultEncoding extends Encoding {
  constructor(private glyphs: any[]) {
    super(glyphs[0] && glyphs[0].unicodes && glyphs[0].unicodes[0] != null ? glyphs[0].unicodes[0] : undefined)
  }
  codePointToGlyphIndex(codePoint: number) {
    if (codePoint !== undefined) {
      for (let i = 0; i < this.glyphs.length; i++) {
        const unicodes = <number[]>this.glyphs[i].unicodes
        if (unicodes.some(unicode => unicode === codePoint)) {
          return i
        }
      }
    }
    return 0
  }
}

/**
 * cmap lookup
 */
export class CmapEncoding extends Encoding {
  constructor(private cmap: any) {
    super()
  }
  codePointToGlyphIndex(codePoint: number) {
    return codePoint !== undefined ? this.cmap[codePoint] || 0 : 0
  }
}
/**
 * cmap lookup
 */
export class CffEncoding extends Encoding {
  constructor(private encoding: any, private charset: any) {
    super()
  }
  codePointToGlyphIndex(codePoint: number) {
    if (codePoint !== undefined) {
      const charName = this.encoding[codePoint]
      return this.charset.indexOf(charName) || 0
    } else {
      return 0
    }
  }
}