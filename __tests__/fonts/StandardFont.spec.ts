import { ZapfDingbats } from 'helpers/StandardFonts/zapfDingbats'
import { TimesRoman } from 'helpers/StandardFonts/TimesRoman'
import { Symbol } from 'helpers/StandardFonts/symbol'
import { Courier } from 'helpers/StandardFonts/Courier'

describe('Embeded Standard', () => {
  describe('Encoding text with Standard Fonts', () => {
    it('replace missing glyph by .notdef', () => {
      const times = new TimesRoman
      const dingbats = new ZapfDingbats
      const symbol = new Symbol
      expect(times.charset.u('a').u).toBe('a')
      expect(symbol.charset.u('1').u).toBe('1')
      expect(dingbats.charset.u('✁').u).toBe('✁')
    })
    it('non-breaking space are encoded as space in latin font', () => {
      const times = new TimesRoman
      expect(times.charset.u(' ').n).toBe('space')
      expect(times.charset.u('\u00a0').n).toBe('space')
      expect(times.charset.u('\u00a0').c).toBe(0o040)
    })
    it('replace missing glyph by .notdef', () => {
      const times = new TimesRoman
      const dingbats = new ZapfDingbats
      const symbol = new Symbol
      expect(times.charset.u('✁').u).toBe('•')
      expect(symbol.charset.u('✁').u).toBe('•')
      expect(dingbats.charset.u('a').u).toBe('●')
    })
  })
  describe('Calculate advanced width of text in Standard Fonts', () => {
    it('calculate for fixed fonts', () => {
      const courier = new Courier
      expect(courier.charset.u('a').w).toBe(600)
      expect(courier.getAdvanceWidth('abc ')).toBe(4*600)
    })
    it('calculate for other latin fonts', () => {
      const times = new TimesRoman
      expect(times.charset.u('a').w).toBe(444)
      expect(times.charset.u('b').w).toBe(500)
      expect(times.charset.u('c').w).toBe(444)
      expect(times.charset.u('v').w).toBe(500)
      expect(times.charset.u(' ').w).toBe(300)
      expect(times.getAdvanceWidth('abc ')).toBe(444+500+444+300)
      // kerning is evaluated
      expect(times.getAdvanceWidth('abv ')).toBe(444+500+500+300-15)
    })
    it.only('calculate for other latin fonts', () => {
      const AfmK = require('../../node_modules/pdfkit/js/font/afm.js')
      // const afmK = AfmK.open(__dirname+'/../../node_modules/pdfkit/js/font/data/Courier.afm')
      // const afm = new Courier
      const afmK = AfmK.open(__dirname+'/../../node_modules/pdfkit/js/font/data/Times-Roman.afm')
      const afm = new TimesRoman
      expect(afm.ascent).toBe(afmK.ascender)
      expect(afm.descent).toBe(afmK.descender)
      expect(afm.lineGap).toBe(afmK.lineGap)
      expect(afm.fontName).toBe(afmK.attributes.FontName)
      expect(afm.fontBBox).toMatchObject(afmK.bbox.slice(0,4))
      afm.charset.all.forEach((entry,i) => {
        expect(entry.w).toBe(afmK.glyphWidths[entry.n])
        // kernPairs - lineGap
      })
      Object.keys(afm.charset.ks).forEach((pair) => {
        const left = pair.slice(0,1)
        const right = pair.slice(1,2)
        const kerning = afm.charset.k(pair)
        const kerningK = afmK.kernPairs[afm.charset.u(left).n+'\u0000'+afm.charset.u(right).n]
        expect(kerning).toBe(kerningK)
      })
    })
  })
})