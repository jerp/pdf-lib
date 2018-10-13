import { StandardFont } from 'helpers/StandardFonts/StandardFont'
import { LatinGlyphSet, encodingScheme } from 'helpers/StandardFonts/charset/latin'
import { kerningMap } from 'helpers/StandardFonts/charset/charset'

export class TimesRoman extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, TimesRomanWidths)
    this.charset.setKerning(TimesRomanKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Times-Roman'
    this.fullName= 'Times Roman'
    this.familyName= 'Times'
    this.weight= 'Roman'
    this.italicAngle= 0
    this.isFixedPitch= 0
    this.fontBBox= [-168,-218,1000,898]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 662
    this.xHeight= 450
    this.ascent= 683
    this.descent= -217
  }
}

export class TimesBold extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, TimesBoldWidths)
    this.charset.setKerning(TimesBoldKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Times-Bold'
    this.fullName= 'Times Bold'
    this.familyName= 'Times'
    this.weight= 'Bold'
    this.italicAngle= 0
    this.isFixedPitch= 0
    this.fontBBox= [-168,-218,1000,935]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 676
    this.xHeight= 461
    this.ascent= 683
    this.descent= -217
  }
}

export class TimesBoldItalic extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, TimesBoldItalicWidths)
    this.charset.setKerning(TimesBoldItalicKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Times-BoldItalic'
    this.fullName= 'Times Bold Italic'
    this.familyName= 'Times'
    this.weight= 'Bold'
    this.italicAngle= -15
    this.isFixedPitch= 0
    this.fontBBox= [-200,-218,996,921]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 669
    this.xHeight= 462
    this.ascent= 683
    this.descent= -217
  }
}

export class TimesItalic extends StandardFont {
  constructor(encodingScheme: encodingScheme = 4) {
    super()
    this.charset = LatinGlyphSet.fromScheme(encodingScheme, TimesItalicWidths)
    this.charset.setKerning(TimesItalicKerning)
    this.unitsPerEm= 1000
    this.fontName= 'Times-Italic'
    this.fullName= 'Times Italic'
    this.familyName= 'Times'
    this.weight= 'Medium'
    this.italicAngle= -15
    this.isFixedPitch= 0
    this.fontBBox= [-169,-217,1010,883]
    this.underlinePosition= -100
    this.underlineThickness= 50
    this.capHeight= 653
    this.xHeight= 441
    this.ascent= 683
    this.descent= -217
  }
}
const TimesItalicWidths = [611,944,889,722,611,722,611,722,611,722,611,722,611,722,611,611,611,722,667,611,667,500,722,500,611,556,611,611,611,722,611,722,611,722,722,722,500,722,611,611,722,833,722,611,333,556,333,556,333,556,333,556,333,556,444,500,667,500,556,500,556,333,833,500,667,667,667,500,722,778,500,444,422,444,541,444,500,500,920,889,500,889,500,500,278,675,275,500,400,333,400,389,389,278,389,500,333,500,275,500,350,500,444,500,333,167,444,500,333,500,500,333,333,675,333,500,250,500,760,333,500,333,500,500,500,333,500,333,400,278,333,278,675,278,500,278,333,278,278,278,444,444,444,278,675,500,675,500,278,500,722,420,333,556,675,556,500,556,675,333,500,333,500,333,500,214,500,389,500,760,500,333,500,389,500,389,667,500,333,500,500,500,500,750,278,750,250,300,500,276,278,310,500,500,500,500,750,500,300,523,333,333,980,333,500,833,300,250,500,250,500,1000,500,675,500,675,500,500,444,444,500,667,389,444,389,444,500,444]
const TimesItalicKerning: kerningMap = [
]

const TimesBoldItalicWidths = [667,944,944,722,667,722,667,722,667,722,667,722,667,722,667,611,667,722,667,667,667,556,722,556,667,611,667,611,667,722,667,722,667,722,722,722,500,722,667,667,722,889,778,667,389,611,389,611,389,611,389,611,389,611,500,500,667,500,611,500,611,333,889,500,722,722,722,500,722,778,500,444,570,444,570,444,500,500,832,1000,500,1000,500,500,278,570,220,500,348,389,348,389,333,333,333,556,333,500,220,556,350,500,444,500,333,167,444,500,333,500,500,333,333,570,333,500,250,500,747,333,500,333,500,556,500,333,500,333,400,278,333,278,570,278,500,278,333,278,278,278,444,500,444,278,570,500,606,500,278,500,778,555,333,500,606,500,576,500,570,333,556,333,500,333,556,278,500,389,500,747,500,333,500,389,500,389,722,500,333,500,500,500,500,750,278,750,250,300,500,266,278,300,500,500,500,500,750,500,300,500,333,333,1000,333,500,833,300,250,556,250,556,1000,556,570,556,570,556,500,444,444,500,667,389,500,389,444,500,444]
const TimesBoldItalicKerning: kerningMap = [
]

const TimesBoldWidths = [722,1000,1000,778,722,778,722,778,722,778,722,778,722,778,722,611,667,778,722,722,722,556,722,556,667,667,667,611,667,722,667,722,667,722,722,722,500,722,611,722,778,1000,778,722,389,722,389,722,389,722,389,667,389,667,500,500,778,500,667,500,667,333,944,500,722,722,722,500,778,833,500,444,581,444,520,444,500,500,930,1000,500,1000,556,500,278,570,220,500,394,333,394,333,333,333,333,556,333,500,220,556,350,500,444,500,333,167,444,500,333,556,500,333,333,570,333,500,250,500,747,333,500,333,556,556,500,333,500,333,400,278,333,278,570,278,500,278,333,278,278,333,444,556,444,278,570,556,570,500,278,500,833,555,333,500,570,500,556,500,570,333,556,333,500,333,556,278,500,444,500,747,500,333,500,389,500,389,722,500,333,500,500,500,500,750,278,750,250,300,500,300,333,330,556,500,500,500,750,556,300,540,333,333,1000,333,500,1000,300,250,556,250,556,1000,556,570,556,570,556,500,500,500,500,722,444,500,444,500,500,500]
const TimesBoldKerning: kerningMap = [
]

const TimesRomanWidths = [722,889,889,722,722,722,722,722,722,722,722,722,722,722,722,556,667,722,667,667,667,556,722,556,611,611,611,556,611,722,611,722,611,722,722,722,500,722,556,722,722,944,722,722,333,722,333,722,333,722,333,611,333,611,389,444,722,444,611,444,611,333,889,444,722,667,722,444,722,778,444,444,469,444,541,444,500,500,921,1000,444,1000,500,500,278,564,200,500,480,333,480,333,333,333,333,556,333,500,200,556,350,500,444,500,333,167,444,500,333,500,500,333,333,564,278,500,250,500,760,333,500,333,500,500,500,333,500,333,400,278,333,278,564,278,500,278,333,278,278,278,444,500,444,278,564,500,564,444,278,444,778,408,333,444,564,444,500,444,564,333,500,333,500,333,500,180,500,333,500,760,500,333,500,389,500,389,722,500,333,278,500,500,500,500,750,278,750,250,300,500,276,278,310,500,500,500,500,750,500,300,453,333,333,980,333,500,833,300,250,500,250,500,1000,500,564,500,564,500,500,500,500,500,722,444,500,444,500,500,500]
const TimesRomanKerning: kerningMap = [
  [-40, 'AC|AÇ|AG|ÁC|ÁÇ|ÁG|ÂC|ÂÇ|ÂG|ÄC|ÄÇ|ÄG|ÀC|ÀÇ|ÀG|ÅC|ÅÇ|ÅG|ÃC|ÃÇ|ÃG|DA|DÁ|DÂ|DÄ|DÀ|DÅ|DÃ|DV|OT|OX|ÓT|ÓX|ÔT|ÔX|ÖT|ÖX|ÒT|ÒX|ØT|ØX|ÕT|ÕX|RO|RÓ|RÔ|RÖ|RÒ|RØ|RÕ|RU|RÚ|RÛ|RÜ|RÙ|Tä|Tà|Tã|UA|UÁ|UÂ|UÄ|UÀ|UÅ|UÃ|ÚA|ÚÁ|ÚÂ|ÚÄ|ÚÀ|ÚÅ|ÚÃ|ÛA|ÛÁ|ÛÂ|ÛÄ|ÛÀ|ÛÅ|ÛÃ|ÜA|ÜÁ|ÜÂ|ÜÄ|ÜÀ|ÜÅ|ÜÃ|ÙA|ÙÁ|ÙÂ|ÙÄ|ÙÀ|ÙÅ|ÙÃ|VO|VÓ|VÔ|VÖ|VÒ|VØ|VÕ|Wë|Wè|Wi|Wí|b.|nv|ñv|r,'],
  [-55, 'AO|AÓ|AÔ|AÖ|AÒ|AØ|AÕ|AQ|AU|AÚ|AÛ|AÜ|AÙ|ÁO|ÁÓ|ÁÔ|ÁÖ|ÁÒ|ÁØ|ÁÕ|ÁQ|ÁU|ÁÚ|ÁÛ|ÁÜ|ÁÙ|ÂO|ÂÓ|ÂÔ|ÂÖ|ÂÒ|ÂØ|ÂÕ|ÂQ|ÂU|ÂÚ|ÂÛ|ÂÜ|ÂÙ|ÄO|ÄÓ|ÄÔ|ÄÖ|ÄÒ|ÄØ|ÄÕ|ÄQ|ÄU|ÄÚ|ÄÛ|ÄÜ|ÄÙ|ÀO|ÀÓ|ÀÔ|ÀÖ|ÀÒ|ÀØ|ÀÕ|ÀQ|ÀU|ÀÚ|ÀÛ|ÀÜ|ÀÙ|ÅO|ÅÓ|ÅÔ|ÅÖ|ÅÒ|ÅØ|ÅÕ|ÅQ|ÅU|ÅÚ|ÅÛ|ÅÜ|ÅÙ|ÃO|ÃÓ|ÃÔ|ÃÖ|ÃÒ|ÃØ|ÃÕ|ÃQ|ÃU|ÃÚ|ÃÛ|ÃÜ|ÃÙ|DY|DÝ|DŸ|Ly|Lý|Lÿ|Ły|Łý|Łÿ|RW|T;|Yi|Yí|Ýi|Ýí|Ÿi|Ÿí|’s|’š|r.| A| Á| Â| Ä| À| Å| Ã'],
  [-111, 'AT|A’|ÁT|Á’|ÂT|Â’|ÄT|Ä’|ÀT|À’|ÅT|Å’|ÃT|Ã’|P,|P.|Va|Vá|Vå|Ve|Vé|Y-|Yu|Yú|Yû|Ý-|Ýu|Ýú|Ýû|Ÿ-|Ÿu|Ÿú|Ÿû'],
  [-135, 'AV|ÁV|ÂV|ÄV|ÀV|ÅV|ÃV|VA|VÁ|VÂ|VÄ|VÀ|VÅ|VÃ'],
  [-90, 'AW|ÁW|ÂW|ÄW|ÀW|ÅW|ÃW| Y| Ý| Ÿ'],
  [-105, 'AY|AÝ|AŸ|ÁY|ÁÝ|ÁŸ|ÂY|ÂÝ|ÂŸ|ÄY|ÄÝ|ÄŸ|ÀY|ÀÝ|ÀŸ|ÅY|ÅÝ|ÅŸ|ÃY|ÃÝ|ÃŸ'],
  [-74, 'Av|Áv|Âv|Äv|Àv|Åv|Ãv|FA|FÁ|FÂ|FÄ|FÀ|FÅ|FÃ|LW|ŁW|T,|T.|V:|V;|‘‘|’’|’ '],
  [-92, 'Aw|Ay|Aý|Aÿ|Áw|Áy|Áý|Áÿ|Âw|Ây|Âý|Âÿ|Äw|Äy|Äý|Äÿ|Àw|Ày|Àý|Àÿ|Åw|Åy|Åý|Åÿ|Ãw|Ãy|Ãý|Ãÿ|LT|L’|ŁT|Ł’|PA|PÁ|PÂ|PÄ|PÀ|PÅ|PÃ|T-|W,|W.|Y:|Y;|Ý:|Ý;|Ÿ:|Ÿ;'],
  [-52, ''],
  [-35, 'BA|BÁ|BÂ|BÄ|BÀ|BÅ|BÃ|Ko|Kó|Kô|Kö|Kò|Kø|Kõ|NA|NÁ|NÂ|NÄ|NÀ|NÅ|NÃ|ÑA|ÑÁ|ÑÂ|ÑÄ|ÑÀ|ÑÅ|ÑÃ|OA|OÁ|OÂ|OÄ|OÀ|OÅ|OÃ|OW|ÓA|ÓÁ|ÓÂ|ÓÄ|ÓÀ|ÓÅ|ÓÃ|ÓW|ÔA|ÔÁ|ÔÂ|ÔÄ|ÔÀ|ÔÅ|ÔÃ|ÔW|ÖA|ÖÁ|ÖÂ|ÖÄ|ÖÀ|ÖÅ|ÖÃ|ÖW|ÒA|ÒÁ|ÒÂ|ÒÄ|ÒÀ|ÒÅ|ÒÃ|ÒW|ØA|ØÁ|ØÂ|ØÄ|ØÀ|ØÅ|ØÃ|ØW|ÕA|ÕÁ|ÕÂ|ÕÄ|ÕÀ|ÕÅ|ÕÃ|ÕW|Ti|Tí|Tr'],
  [-10, 'BU|BÚ|BÛ|BÜ|BÙ|QU|QÚ|QÛ|QÜ|QÙ|WO|WÓ|WÔ|WÖ|WÒ|WØ|WÕ|fa|fá|fâ|fä|fà|få|fã|ke|ké|kê|kë|kè|ko|kó|kô|kö|kò|kø|kõ|lw|łw|oy|oý|oÿ|óy|óý|óÿ|ôy|ôý|ôÿ|öy|öý|öÿ|òy|òý|òÿ|øy|øý|øÿ|õy|õý|õÿ|py|pý|pÿ|’l|’ł|wa|wá|wâ|wä|wà|wå|wã|wo|wó|wô|wö|wò|wø|wõ'],
  [-30, 'DW|KO|KÓ|KÔ|KÖ|KÒ|KØ|KÕ|Të|YO|YÓ|YÔ|YÖ|YÒ|YØ|YÕ|ÝO|ÝÓ|ÝÔ|ÝÖ|ÝÒ|ÝØ|ÝÕ|ŸO|ŸÓ|ŸÔ|ŸÖ|ŸÒ|ŸØ|ŸÕ| W'],
  [-15, 'Fa|Fá|Fâ|Fä|Fà|Få|Fã|Fo|Fó|Fô|Fö|Fò|Fø|Fõ|Ku|Kú|Kû|Kü|Kù|Pa|Pá|Pâ|Pä|Pà|På|Pã|VG|aw|áw|âw|äw|àw|åw|ãw|bv|cy|cý|cÿ|çy|çý|çÿ|eg|ex|ey|eý|eÿ|ég|éx|éy|éý|éÿ|êg|êx|êy|êý|êÿ|ëg|ëx|ëy|ëý|ëÿ|èg|èx|èy|èý|èÿ|ky|ký|kÿ|ny|ný|nÿ|ñy|ñý|ñÿ|ov|óv|ôv|öv|òv|øv|õv|ve|vé|vê|vë|vè|xe|xé|xê|xë|xè'],
  [-80, 'F,|F.|RV|Ta|Tá|Tâ|Tå|To|Tó|Tô|Tö|Tò|Tø|Tõ|Tw|Ty|Tý|Tÿ|Wa|Wá|Wâ|Wä|Wà|Wå|Wã|We|Wé|Wê|Wo|Wó|Wô|Wö|Wò|Wø|Wõ|“A|“Á|“Â|“Ä|“À|“Å|“Ã|‘A|‘Á|‘Â|‘Ä|‘À|‘Å|‘Ã'],
  [-60, 'JA|JÁ|JÂ|JÄ|JÀ|JÅ|JÃ|RT|Vi|Ví|Yä|Yà|Yã|Yë|Yè|Ýä|Ýà|Ýã|Ýë|Ýè|Ÿä|Ÿà|Ÿë|Ÿè'],
  [-25, 'Ke|Ké|Kê|Kë|Kè|Ky|Ký|Kÿ|ev|ew|év|éw|êv|êw|ëv|ëw|èv|èw|ff|iv|ív|îv|ïv|ìv|ow|ów|ôw|öw|òw|øw|õw|va|vá|vâ|vä|và|vå|vã'],
  [-100, 'LV|LY|LÝ|LŸ|ŁV|ŁY|ŁÝ|ŁŸ|V-|Ya|Yá|Yâ|Yå|Ye|Yé|Yê|Ýa|Ýá|Ýâ|Ýå|Ýe|Ýé|Ýê|Ÿa|Ÿá|Ÿâ|Ÿå|Ÿã|Ÿe|Ÿé|Ÿê'],
  [-50, 'OV|OY|OÝ|OŸ|ÓV|ÓY|ÓÝ|ÓŸ|ÔV|ÔY|ÔÝ|ÔŸ|ÖV|ÖY|ÖÝ|ÖŸ|ÒV|ÒY|ÒÝ|ÒŸ|ØV|ØY|ØÝ|ØŸ|ÕV|ÕY|ÕÝ|ÕŸ|T:|Wu|Wú|Wû|Wü|Wù|fı|’d|’r|’v| V'],
  [-65, 'RY|RÝ|RŸ|W-|v,|v.|w,|w.|y,|y.|ý,|ý.|ÿ,|ÿ.'],
  [-93, 'TA|TÁ|TÂ|TÄ|TÀ|TÅ|TÃ'],
  [-18, 'TO|TÓ|TÔ|TÖ|TÒ|TØ|TÕ|’t|rg| T'],
  [-70, 'Te|Té|Tê|Tè|Yö|Yò|Yõ|Ýö|Ýò|Ýõ|Ÿö|Ÿò|Ÿõ|,”|,’|.”|.’'],
  [-45, 'Tu|Tú|Tû|Tü|Tù'],
  [-71, 'Vâ|Vä|Và|Vã|Vê|Vë|Vè|Yü|Yù|Ýü|Ýù|Ÿü|Ÿù'],
  [-129, 'V,|Vo|Vó|Vô|Vø|V.|Y,|Y.|Ý,|Ý.|Ÿ,|Ÿ.'],
  [-20, 'Vî|Vï|Vì|av|áv|âv|äv|àv|åv|ãv|bu|bú|bû|bü|bù|fi|fí|r-|vo|vó|vô|vö|vò|vø|võ'],
  [-89, 'Vö|Vò|Võ'],
  [-75, 'Vu|Vú|Vû|Vü|Vù'],
  [-120, 'WA|WÁ|WÂ|WÄ|WÀ|WÅ|WÃ|YA|YÁ|YÂ|YÄ|YÀ|YÅ|YÃ|ÝA|ÝÁ|ÝÂ|ÝÄ|ÝÀ|ÝÅ|ÝÃ|ŸA|ŸÁ|ŸÂ|ŸÄ|ŸÀ|ŸÅ|ŸÃ'],
  [-37, 'W:|W;'],
  [-73, 'Wy|Wý|Wÿ'],
  [-110, 'Yo|Yó|Yô|Yø|Ýo|Ýó|Ýô|Ýø|Ÿo|Ÿó|Ÿô|Ÿø'],
  [55, 'f’'],
  [-5, 'ga|gá|gâ|gä|gà|gå|gã|hy|hý|hÿ'],
]