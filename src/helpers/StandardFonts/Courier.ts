import { StandardFont } from 'helpers/StandardFonts/StandardFont'
import { LatinGlyphSet, encodingScheme } from 'helpers/StandardFonts/charset/latin'

export class Courier extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, 600)
    this.unitsPerEm= 1000
    this.fontName= 'Courier'
    this.fullName= 'Courier'
    this.familyName= 'Courier'
    this.weight= 'Medium'
    this.italicAngle= 0
    this.isFixedPitch= 1
    this.fontBBox= [-23, -250, 715, 805]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 562
    this.xHeight= 426
    this.ascent= 629
    this.descent= -157
  }
}
export class CourierBold extends Courier {
  constructor() {
    super()
    this.fontName= 'Courier-Bold'
    this.fullName= 'Courier Bold'
    this.weight= 'Bold'
    this.xHeight= 439
    this.fontBBox= [-113,-250,749,801]
  }
}
export class CourierBoldOblique extends Courier {
  constructor() {
    super()
    this.fontName= 'Courier-BoldOblique'
    this.fullName= 'Courier Bold Oblique'
    this.weight= 'Bold'
    this.italicAngle= -12
    this.xHeight= 439
    this.fontBBox= [-57, -250, 869, 801]
  }
}
export class CourierOblique extends Courier {
  constructor() {
    super()
    this.fontName= 'Courier-Oblique'
    this.fullName= 'Courier Oblique'
    this.italicAngle= -12
    this.fontBBox= [-27, -250, 849, 805]
  }
}
