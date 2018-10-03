import { TTFFont } from 'helpers/TTFFont'
import { readFileSync } from 'fs'

const testFontFile = (fontFile) => readFileSync(`${__dirname}/../../__integration_tests__/assets/fonts/${fontFile}`)

describe('TTFFont', () => {
  describe('Parses Mini Font', () => {
    const fontBuffer = testFontFile('CharisSIL/CharisSIL-abc.ttf')
    const fontData = new Uint8Array(fontBuffer)
    const font = new TTFFont(fontData)
    it('parses head', () => {
      expect(font.bbox.minX).toBe(29)
      expect(font.bbox.minY).toBe(-25)
      expect(font.bbox.maxX).toBe(1300)
      expect(font.bbox.maxY).toBe(1800)
      expect(font.__dir__.head.unitsPerEm).toBe(2048)
      expect(font.__dir__.head.xMin).toBe(29)
      expect(font.__dir__.head.yMin).toBe(-25)
      expect(font.__dir__.head.xMax).toBe(1300)
      expect(font.__dir__.head.yMax).toBe(1800)
      expect(font.__dir__.head._macStyle).toBe(0)
      expect(font.__dir__.head.indexToLocFormat).toBe(0)
    })
    it('parses name', () => {
      expect(font.__dir__.name.get('fontFamily')).toEqual('Charis SIL')
      expect(font.__dir__.name.get('fullName')).toEqual('Charis SIL')
      expect(font.__dir__.name.get('fontSubfamily')).toEqual('Regular')
      expect(font.__dir__.name.get('postScriptName')).toEqual('CharisSIL')
      expect(font.__dir__.name.get('uniqueID')).toEqual('SILInternational: Charis SIL: 2014')
    })
    it('parses hhea', () => {
      expect(font.__dir__.hhea.ascent).toEqual(2450)
      expect(font.__dir__.hhea.descent).toEqual(-900)
      expect(font.__dir__.hhea.lineGap).toEqual(0)
      expect(font.__dir__.hhea.numberOfHMetrics).toEqual(4)
    })
    it('parses maxp', () => {
      expect(font.__dir__.maxp.numGlyphs).toBe(4)
    })
    it('parses post', () => {
      expect(font.__dir__.post.italicAngle).toBe(0)
      expect(font.__dir__.post.isFixedPitch).toBe(0)
    })
    it('parses hmtx', () => {
      expect(font.__dir__.hmtx.advanceWidth(0)).toBe(1400)
      expect(font.__dir__.hmtx.advanceWidth(1)).toBe(1042)
      expect(font.__dir__.hmtx.advanceWidth(3)).toBe(954)
      expect(font.__dir__.hmtx.leftSideBearing(0)).toBe(100)
      expect(font.__dir__.hmtx.leftSideBearing(1)).toBe(70)
      expect(font.__dir__.hmtx.leftSideBearing(2)).toBe(29)
      expect(font.__dir__.hmtx.leftSideBearing(3)).toBe(70)
      expect(font.__dir__.hmtx.advanceWidth(4)).toBe(font.__dir__.hmtx.advanceWidth(3))
      expect(font.__dir__.hmtx.advanceWidth(100)).toBe(font.__dir__.hmtx.advanceWidth(3))
    })
    it('parses cmap', () => {
      expect(font.__dir__.cmap.get(0)).toBe(0)
      expect(font.__dir__.cmap.get(96)).toBe(0)
      expect(font.__dir__.cmap.get(97)).toBe(1)
      expect(font.__dir__.cmap.get(98)).toBe(2)
      expect(font.__dir__.cmap.get(99)).toBe(3)
      expect(font.__dir__.cmap.get(100)).toBe(0)
    })
    it('parses loca', () => {
      expect(font.__dir__.loca.get(0)).toBe(0)
      expect(font.__dir__.loca.get(1)).toBe(116)
      expect(font.__dir__.loca.get(2)).toBe(660)
      expect(font.__dir__.loca.get(3)).toBe(1072)
      expect(font.__dir__.loca.get(4)).toBe(1556)
      expect(font.__dir__.loca.length).toEqual(5)
    })
    it('parses glyf', () => {
      expect(font.__dir__.glyf.getGlyfData(0).length).toBe(116-0)
      expect(font.__dir__.glyf.getGlyfData(1).length).toBe(660-116)
      expect(font.__dir__.glyf.getGlyfData(2).length).toBe(1072-660)
      expect(font.__dir__.glyf.getGlyfData(3).length).toBe(1556-1072)
      expect(font.__dir__.glyf.length).toEqual(4)
    })
    it('parses OS/2', () => {
      expect(font.__dir__.os2.sFamilyClass).toBe(0)
      expect(font.__dir__.os2.sxHeight).toBe(987)
      expect(font.__dir__.os2.sCapHeight).toBe(1374)
    })
  })
  describe('parse larger TTF font (CharisSIL-R)', () => {
    const fontBuffer = testFontFile('CharisSIL/CharisSIL-R.ttf')
    const fontData = new Uint8Array(fontBuffer)
    const font = new TTFFont(fontData)
    it('parses head', () => {
      expect(font.bbox.minX).toBe(-1418)
      expect(font.bbox.minY).toBe(-1092)
      expect(font.bbox.maxX).toBe(6144)
      expect(font.bbox.maxY).toBe(2600)
      expect(font.__dir__.head.unitsPerEm).toBe(2048)
      expect(font.__dir__.head._macStyle).toBe(0)
      expect(font.__dir__.head.indexToLocFormat).toBe(1)
    })
    it('parses name', () => {
      expect(font.__dir__.name.get('fontFamily')).toEqual('Charis SIL')
      expect(font.__dir__.name.get('fullName')).toEqual('Charis SIL')
      expect(font.__dir__.name.get('fontSubfamily')).toEqual('Regular')
      expect(font.__dir__.name.get('postScriptName')).toEqual('CharisSIL')
      expect(font.__dir__.name.get('uniqueID')).toEqual('SILInternational: Charis SIL: 2014')
    })
    it('parses hhea', () => {
      expect(font.__dir__.hhea.ascent).toEqual(2450)
      expect(font.__dir__.hhea.descent).toEqual(-900)
      expect(font.__dir__.hhea.lineGap).toEqual(0)
      expect(font.__dir__.hhea.numberOfHMetrics).toEqual(3685)
    })
    it('parses maxp', () => {
      expect(font.__dir__.maxp.numGlyphs).toBe(3692)
    })
    it('parses post', () => {
      expect(font.__dir__.post.italicAngle).toBe(0)
      expect(font.__dir__.post.isFixedPitch).toBe(0)
    })
    it('parses hmtx', () => {
      expect(font.__dir__.hmtx.advanceWidth(0)).toBe(1400)
      expect(font.__dir__.hmtx.advanceWidth(106)).toBe(1042)
      expect(font.__dir__.hmtx.advanceWidth(176)).toBe(2046)
    })
    it('parses cmap', () => {
      expect(font.__dir__.cmap.get(0)).toBe(0)
      expect(font.__dir__.cmap.get(0x00e0)).toBe(106)   // 'à' === '\u00e0'
      expect(font.__dir__.cmap.get(0x0061)).toBe(68)    // 'a' === '\u00e0'
    })
    it('parses loca', () => {
      expect(font.__dir__.loca.get(0)).toBe(0)
      expect(font.__dir__.loca.get(1)).toBe(116)
      expect(font.__dir__.loca.get(2)).toBe(116)
      expect(font.__dir__.loca.get(106)).toBe(29360)
      expect(font.__dir__.loca.get(107)).toBe(29384)
      expect(font.__dir__.loca.length).toEqual(3692+1)
    })
    it('parses glyf', () => {
      expect(font.__dir__.glyf.getGlyfData(0).length).toBe(116-0)
      expect(font.__dir__.glyf.getGlyfData(1).length).toBe(0)
      expect(font.__dir__.glyf.getGlyfData(106).length).toBe(29384-29360)
    })
    it('parses OS/2', () => {
      expect(font.__dir__.os2.sFamilyClass).toBe(0)
      expect(font.__dir__.os2.sxHeight).toBe(987)
      expect(font.__dir__.os2.sCapHeight).toBe(1374)
    })
  })
  describe('parse larger TTF font (Ubuntu-R.ttf)', () => {
    const fontBuffer = testFontFile('ubuntu/Ubuntu-R.ttf')
    const fontData = new Uint8Array(fontBuffer)
    const font = new TTFFont(fontData)
    const cs = ('U').split('').map(c => c.charCodeAt(0))
    it('set attributes in a compatible way to fontkit', () => {
      expect(font.__dir__.post.isFixedPitch).toBe(font.post.isFixedPitch)
      expect(font.__dir__.head.macStyle.italic ? 1 : 0).toBe(font.head.macStyle.italic)
      expect(font.__dir__.os2.sFamilyClass).toBe(font['OS/2'].sFamilyClass)
    })
    it('parses hmtx', () => {
      expect(font.__dir__.hmtx.advanceWidth(0)).toBe(500)
      expect(font.__dir__.hmtx.advanceWidth(1)).toBe(0)
      expect(font.__dir__.hmtx.advanceWidth(19)).toBe(564)
      expect(font.__dir__.hmtx.advanceWidth(56)).toBe(688)
    })
    it('parses cmap', () => {
      expect(font.__dir__.cmap.get(-1)).toBe(0)
      expect(font.__dir__.cmap.get(0)).toBe(1)
      expect(font.__dir__.cmap.get(cs[0])).toBe(56)
    })
    it('advanced width', () => {
      expect(font.getAdvanceWidth('')).toBe(0)
      expect(font.getAdvanceWidth('U')).toBe(688)
      expect(font.getAdvanceWidth('€')).toBe(564)
      //expect(widths).toMatchObject(expected)
    })
    it('encode text', () => {
      // const gliphIds = font.__dir__.encodeText('Ubuntu')
      // const expected = new Uint16Array([56, 69, 88, 81, 87, 88])
      // expect(gliphIds).toMatchObject(expected)
      // expect(font.__dir__.encodeText('€')).toMatchObject(new Uint16Array([98]))
    })
    it('loca sorted', () => {
      let prevOffset = font.__dir__.loca.get(0)
      for (let i = 1; i<font.__dir__.loca.length - 1; i++) {
        expect(prevOffset).toBeLessThanOrEqual(font.__dir__.loca.get(i))
        prevOffset = font.__dir__.loca.get(i)
      }
    })
    it('parses glyf', () => {
      const glyfIds = [0, 56, 69, 88, 81, 87, 29, 3, 196, 195, 187, 201, 207, 212, 193, 197, 98, 125, 16, 72, 71]
      glyfIds.forEach(glyfId => expect(font.__dir__.glyf.getGlyfData(glyfId).length).toBe(font.__dir__.loca.get(glyfId+1)-font.__dir__.loca.get(glyfId)))
    })
  })
  // describe('API', () => {
  //   it('an encoded font retains required props', () => {
  //     const font = TTFFont.for(new Uint8Array(testFontFile('CharisSIL/CharisSIL-abc.ttf')))
  //     const subset = font.createSubset()
  //     font.includeGlyph(1, [], 0)
  //     font.includeGlyph(2, [], 0)
  //     font.includeGlyph(3, [], 0)
  //     const CDISdata = subset.encode()
  //     const CDIfont = TTFFont.for(CDISdata, true)
  //     expect(CDIfont.ascent).toBe(font.ascent)
  //     expect(CDIfont.bbox).toMatchObject(font.bbox)
  //     expect(CDIfont.descent).toBe(font.descent)
  //     expect(CDIfont.familyClass).toBe(font.familyClass)
  //     expect(CDIfont.flags).toBe(font.flags)
  //     expect(CDIfont.lineGap).toBe(font.lineGap)
  //     expect(CDIfont.macStyleItalic).toBe(font.macStyleItalic)
  //     expect(CDIfont.unitsPerEm).toBe(font.unitsPerEm)
  //     expect(CDIfont.__dir__.hhea.numberOfHMetrics).toEqual(4)
  //     expect(CDIfont.__dir__.hmtx.advanceWidth(0)).toBe(1400)
  //     expect(CDIfont.__dir__.hmtx.advanceWidth(1)).toBe(1042)
  //     expect(CDIfont.__dir__.hmtx.advanceWidth(3)).toBe(954)
  //     expect(CDIfont.__dir__.hmtx.leftSideBearing(0)).toBe(100)
  //     expect(CDIfont.__dir__.hmtx.leftSideBearing(1)).toBe(70)
  //     expect(CDIfont.__dir__.hmtx.leftSideBearing(2)).toBe(29)
  //     expect(CDIfont.__dir__.hmtx.leftSideBearing(3)).toBe(70)
  //     expect(CDIfont.__dir__.maxp.numGlyphs).toBe(4)
  //     // not exporting tables post, name, OS/2, so cannot compare!
  //     // expect(CDIfont.capHeight).toBe(font.capHeight)
  //     // expect(CDIfont.isFixedPitch).toBe(font.isFixedPitch)
  //     // expect(CDIfont.italicAngle).toBe(font.italicAngle)
  //     // expect(CDIfont.postscriptName).toBe(font.postscriptName)
  //     // expect(CDIfont.xHeight).toBe(font.xHeight)
  //   })
  // })
  // describe.skip('PDF-lib', () => {
  //   it('pdfkit', () => {
  //     const PDFDocument = require('pdfkit')
  //     const doc = new PDFDocument()
  //     doc.pipe(createWriteStream(__dirname+'/output.pdf'))
  //     doc.font(testFontFile('CharisSIL-R.ttf'))
  //     .fontSize(25)
  //     .text('a', 100, 100)
  //     // .text('a à €', 100, 100)
  //     // .text('Τη γλώσσα', 100, 200)
  //     // .text('PŮVODNÍ ZPRÁVA', 100, 300)
  //     doc.end()
  //   })
  //   // it('load', () => {
  //   //   const bytes = readFileSync(__dirname+'/output.pdf')
  //   //   const doc = PDFDocumentFactory.load(bytes)
  //   //   const fontRef = PDFIndirectReference.forNumbers(8,0)
  //   //   const fontObj = doc.index.lookup(fontRef)
  //   //   const fontData = inflate(fontObj.content)
  //   //   const bytes2 = readFileSync(__dirname+'/output2.pdf')
  //   //   const doc2 = PDFDocumentFactory.load(bytes2)
  //   //   const fontRef2 = PDFIndirectReference.forNumbers(3,0)
  //   //   const fontObj2 = doc2.index.lookup(fontRef2)
  //   //   const fontData2 = inflate(fontObj2.content)
  //   //   const font = TTFFont.for(fontData)
  //   //   const font2 = TTFFont.for(fontData2)
  //   //   for (let i=0; i<1463; i++) {
  //   //     if (fontData2[i] !== fontData[i]) debugger
  //   //   }
  //   // })
  //   it('pdflib', () => {
  //     const pdfDoc = PDFDocumentFactory.create();
  //     const font = new TTFFont(testFontFile('CharisSIL-R.ttf'))
  //     const [FontUbuntu, fontEncoder] = pdfDoc.embedFont(font)
  //     // Create pages:
  //     const pageSize = 750;
  //     const pageContentStream = pdfDoc.createContentStream(
  //       drawLinesOfText([
  //         // 'a',
  //         'a à €',
  //         'Τη γλώσσα',
  //         'PŮVODNÍ ZPRÁVA',
  //         ].map(text => fontEncoder.encodeText(text)),
  //         {
  //           x: 25,
  //           y: pageSize - 100,
  //           font: 'Ubuntu',
  //           size: 32,
  //           colorRgb: [1, 0, 1],
  //         },
  //       ),
  //     )
  //     const pageContentStreamRef = pdfDoc.register(pageContentStream);
  //     const page = pdfDoc
  //       .createPage([pageSize, pageSize])
  //       .addFontDictionary('Ubuntu', FontUbuntu)
  //       .addContentStreams(pageContentStreamRef);
  //     pdfDoc.addPage(page);
  //     const bytes = PDFDocumentWriter.saveToBytes(pdfDoc, { useObjectStreams: false });
  //     writeFileSync(__dirname+'/output2.pdf', bytes)
      
  //   })
  // })
})

