import { StandardFont } from 'helpers/StandardFonts/StandardFont'
import { LatinGlyphSet, encodingScheme } from 'helpers/StandardFonts/charset/latin'
import { kerningMap } from 'helpers/StandardFonts/charset/charset'


export class Helvetica extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, HelveticaWidths)
    this.charset.setKerning(HelveticaKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Helvetica'
    this.fullName= 'Helvetica'
    this.familyName= 'Helvetica'
    this.weight= 'Medium'
    this.italicAngle= 0
    this.isFixedPitch= 0
    this.fontBBox= [-166,-225,1000,931]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 718
    this.xHeight= 523
    this.ascent= 718
    this.descent= -207
  }
}

export class HelveticaBold extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, HelveticaBoldWidths)
    this.charset.setKerning(HelveticaBoldKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Helvetica-Bold'
    this.fullName= 'Helvetica Bold'
    this.familyName= 'Helvetica'
    this.weight= 'Bold'
    this.italicAngle= 0
    this.isFixedPitch= 0
    this.fontBBox= [-170,-228,1003,962]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 718
    this.xHeight= 532
    this.ascent= 718
    this.descent= -207
  }
}

export class HelveticaOblique extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, HelveticaObliqueWidths)
    this.charset.setKerning(HelveticaObliqueKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Helvetica-Oblique'
    this.fullName= 'Helvetica Oblique'
    this.familyName= 'Helvetica'
    this.weight= 'Medium'
    this.italicAngle= -12
    this.isFixedPitch= 0
    this.fontBBox= [-170,-225,1116,931]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 718
    this.xHeight= 523
    this.ascent= 718
    this.descent= -207
  }
}

export class HelveticaBoldOblique extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, HelveticaBoldObliqueWidths)
    this.charset.setKerning(HelveticaBoldObliqueKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Helvetica-BoldOblique'
    this.fullName= 'Helvetica Bold Oblique'
    this.familyName= 'Helvetica'
    this.weight= 'Bold'
    this.italicAngle= -12
    this.isFixedPitch= 0
    this.fontBBox= [-174,-228,1114,962]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 718
    this.xHeight= 532
    this.ascent= 718
    this.descent= -207
  }
}

const HelveticaWidths = [667,1000,1000,778,667,778,667,778,667,778,667,778,667,778,667,667,667,778,722,722,722,667,722,667,667,611,667,667,667,722,667,722,667,722,722,722,556,722,611,667,778,944,722,667,278,667,278,667,278,667,278,611,278,611,500,556,667,556,556,556,556,333,833,556,722,889,722,556,778,667,556,556,469,556,584,556,389,556,1015,1000,556,1000,556,556,278,584,260,556,334,278,334,333,278,278,278,500,333,556,260,500,350,556,500,556,333,167,500,556,333,611,556,333,333,584,278,556,278,556,737,333,556,333,556,556,556,333,556,333,400,222,333,278,584,278,556,278,333,278,278,222,556,500,556,222,584,556,584,556,222,611,833,355,333,333,584,333,556,333,584,222,556,222,556,222,556,191,556,333,556,737,556,333,556,500,556,500,944,556,278,556,556,556,556,834,278,834,278,333,556,370,278,365,556,611,556,556,834,556,333,537,333,333,1000,333,556,889,333,278,556,278,556,1000,556,584,556,584,556,556,500,500,556,722,500,500,500,500,556,500]
const HelveticaKerning: kerningMap = [
]

const HelveticaBoldWidths = [722,1000,1000,778,722,778,722,778,722,778,722,778,722,778,722,667,722,778,722,722,722,667,722,667,667,611,667,667,667,722,667,722,667,722,722,722,556,722,611,667,778,944,722,667,278,667,278,667,278,667,278,611,278,611,556,556,722,556,611,556,611,333,833,556,722,889,722,556,778,722,556,556,584,556,584,556,389,556,975,1000,556,1000,611,556,278,584,280,611,389,333,389,333,333,333,333,611,333,556,280,611,350,556,556,556,333,167,556,611,333,611,556,333,333,584,333,556,278,556,737,333,556,333,611,611,556,333,556,333,400,278,333,278,584,278,556,278,333,278,278,278,556,556,556,278,584,611,584,611,278,611,889,474,333,500,584,500,611,500,584,278,611,278,556,278,611,238,556,389,611,737,611,333,611,556,611,556,944,556,333,611,556,556,556,834,278,834,278,333,556,370,333,365,611,611,556,611,834,611,333,556,333,333,1000,333,556,889,333,278,611,278,611,1000,611,584,611,584,611,556,556,556,556,778,500,556,500,556,556,556]
const HelveticaBoldKerning: kerningMap = [
]

const HelveticaObliqueWidths = [667,1000,1000,778,667,778,667,778,667,778,667,778,667,778,667,667,667,778,722,722,722,667,722,667,667,611,667,667,667,722,667,722,667,722,722,722,556,722,611,667,778,944,722,667,278,667,278,667,278,667,278,611,278,611,500,556,667,556,556,556,556,333,833,556,722,889,722,556,778,667,556,556,469,556,584,556,389,556,1015,1000,556,1000,556,556,278,584,260,556,334,278,334,333,278,278,278,500,333,556,260,500,350,556,500,556,333,167,500,556,333,611,556,333,333,584,278,556,278,556,737,333,556,333,556,556,556,333,556,333,400,222,333,278,584,278,556,278,333,278,278,222,556,500,556,222,584,556,584,556,222,611,833,355,333,333,584,333,556,333,584,222,556,222,556,222,556,191,556,333,556,737,556,333,556,500,556,500,944,556,278,556,556,556,556,834,278,834,278,333,556,370,278,365,556,611,556,556,834,556,333,537,333,333,1000,333,556,889,333,278,556,278,556,1000,556,584,556,584,556,556,500,500,556,722,500,500,500,500,556,500]
const HelveticaObliqueKerning: kerningMap = [
]

const HelveticaBoldObliqueWidths = [722,1000,1000,778,722,778,722,778,722,778,722,778,722,778,722,667,722,778,722,722,722,667,722,667,667,611,667,667,667,722,667,722,667,722,722,722,556,722,611,667,778,944,722,667,278,667,278,667,278,667,278,611,278,611,556,556,722,556,611,556,611,333,833,556,722,889,722,556,778,722,556,556,584,556,584,556,389,556,975,1000,556,1000,611,556,278,584,280,611,389,333,389,333,333,333,333,611,333,556,280,611,350,556,556,556,333,167,556,611,333,611,556,333,333,584,333,556,278,556,737,333,556,333,611,611,556,333,556,333,400,278,333,278,584,278,556,278,333,278,278,278,556,556,556,278,584,611,584,611,278,611,889,474,333,500,584,500,611,500,584,278,611,278,556,278,611,238,556,389,611,737,611,333,611,556,611,556,944,556,333,611,556,556,556,834,278,834,278,333,556,370,333,365,611,611,556,611,834,611,333,556,333,333,1000,333,556,889,333,278,611,278,611,1000,611,584,611,584,611,556,556,556,556,778,500,556,500,556,556,556]
const HelveticaBoldObliqueKerning: kerningMap = [
]
