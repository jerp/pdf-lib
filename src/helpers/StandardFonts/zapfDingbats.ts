import { StandardFont } from 'helpers/StandardFonts/StandardFont'
import { zapfDingbatsCharsetMap } from 'helpers/StandardFonts/charset/zapfDingbats'

export class ZapfDingbats extends StandardFont {
  constructor() {
    super()
    this.setCharset(zapfDingbatsCharsetMap)
    this.charset.notdef('a71')
    this.unitsPerEm= 1000
    this.fontName= 'ZapfDingbats'
    this.fullName= 'ITC Zapf Dingbats'
    this.familyName= 'ZapfDingbats'
    this.weight= 'Medium'
    this.italicAngle= 0
    this.isFixedPitch= 0
    this.fontBBox= [-1, -143, 981, 820]
    this.underlinePosition= -100
    this.underlineThickness= 50
  }
}
