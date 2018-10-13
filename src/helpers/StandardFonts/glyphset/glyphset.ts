export type kerningMap = ([number, string])[]
export type widths = number | { [index: string]: number }
export type glyphSetOptions = { changing?: string[], adding?: string, aliases?: string[] }

export type glyphList = [string, string][]
export class GlyphMap {
  u: { [index: string]: string }
  n: { [index: string]: string }
  constructor(glyphList: glyphList) {
    this.u = glyphList.reduce((idx, [u,n]) => {
      Object.defineProperty(idx, u, { value: n })
      return idx
    }, Object.create(null))
    this.n = glyphList.reduce((idx, [u,n]) => {
      Object.defineProperty(idx, n, { value: u })
      return idx
    }, Object.create(null))
  }
}

/** Standard Font glyph set */
export class GlyphSet {
  /** index of CIDs -> unicode */
  private cs: string[] = []
  /** index of CIDs -> width */
  private ws: number[] = []
  /** index of unicodes */
  private us: { [index: string]: number } = Object.create(null)
  /** kerning pairs and theis value */
  private ks: { [index: string]: number } = Object.create(null)
  /** differences from the encoding charset */
  protected differences: { [index: string]: number } = Object.create(null)
  constructor(private glyphMap: GlyphMap, private widths: widths, charset: string, opts?: glyphSetOptions) {
    const chars = charset.split('')
    if (opts && opts.changing) {
      // modifing the charset means replacing an existing CID <-> GID mapping with another one
      // the source unicode character cannot be encoded once replace, it will be ascociated with `.notdef`
      opts.changing.forEach((pair)=> {
        const source = pair.charAt(0)
        const target = pair.charAt(1)
        const c = chars.indexOf(source)
        if (c > -1) {
          this.differences[target] = c
          chars[c] = target
        }
      })
    }
    chars.forEach((u, c) => {
      // � indicates un unassigned code in the charset
      if (u !== '�') this.addGlyph(u, c)
    })
    if (opts) {
      // map a unicode not in the charset to the CID of an existing glyph
      if (opts.aliases) opts.aliases.forEach(pair => this.mapUnicode(pair.charAt(0), pair.charAt(1)))
      // adds a set of additional unicode chars to the glyph set
      if (opts.adding) opts.adding.split('')
      // add glyph that are not yet in set and can be added
      .filter(u => this.us[u] == null && this.glyphMap.u[u] != null)
      .forEach(u => {
        const c = this.nextAvailableCid
        if (c) {
          this.differences[u] = c
          this.addGlyph(u, c)
        }
      })
    }
  }
  protected addGlyph(u: string, c: number) {
    this.cs[c] = u
    this.ws[c] = typeof this.widths === 'number' ? this.widths : this.widths[u]
    Object.defineProperty(this.us, u, { value: c, enumerable: true })
  }
  /** set kerning based on a map of kerning value and a pipe separated list of char pairs */
  setKerning(kerningMap: kerningMap) {
    kerningMap.forEach(([kerning, pairString]) => {
      pairString.split('|').forEach(pair => {
        const left = pair.slice(0,1)
        const right = pair.slice(1,2)
        // kerning should only be defined for char pairs that are both present in the charset
        // if one of the pair is not in sharset -> replaced 
        // replacement char should be chosen so that it does not have any kenring
        if (this.us[left] != null && this.us[right] != null)
          Object.defineProperty(this.ks, pair, { value: kerning, enumerable: true })
      })
    })
  }
  protected get nextAvailableCid() {
    for (let i = 1; i<256; i++) if (this.cs[i] == null) return i
  }
  /** map additional unicode to an existing glyph */
  protected mapUnicode(source: string, target: string) {
    const glyph = this.u(source)
    Object.defineProperty(this.us, target, { value: glyph, enumerable: true })
  }
  /** list all glyphs */
  get all() {
    return Object.keys(this.us).map(u=>this.u(u))
  }
  get notdef() {
    return this.cs[0]
  }
  /** get glyph from unicode */
  u(u: string) {
    return this.us[u] || 0
  }
  /** encode unicode char */
  u2c(u: string) {
    return this.cs[this.u(u)]
  }
  /** get glyph from code */
  c(c: number) {
    return this.cs[c]
  }
  /** get unicode char for a glyph name */
  n(n: string): string {
    return (this.glyphMap.n[n] || this.glyphMap.n['.notdef'])
  }
  /** get width for unicode */
  w(u: string) {
    return this.ws[this.u(u)]
  }
  /** get kerning of a pair of code */
  k(pair: string) {
    return this.ks[pair] || 0
  }
}
