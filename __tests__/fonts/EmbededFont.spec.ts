import { TTFFont } from 'fonts/TTFFont'
import { EmbededFont } from 'fonts/EmbededFont'
const fontkit = require('fontkit')
const pdfkit = require('pdfkit')
import { inflate } from 'pako'
import { readFileSync, createWriteStream, writeFileSync } from 'fs'

import {
  drawLinesOfText,
  PDFDocumentFactory,
  PDFDocumentWriter,
} from '../../src';
import {
  PDFHexString,
  PDFIndirectReference,
} from '../../src/core/pdf-objects';
import { toUnicode } from 'punycode';

const pdfjscore = require('pdfjs-core/index.cjs.js')

const testFontFile = (fontFile) => readFileSync(`${__dirname}/../../__integration_tests__/assets/fonts/${fontFile}`)

describe('EmbededTTFFont', () => {
  describe('Embeds Mini TTF Font with internal TTFFont and with fontkit', () => {
    it('loads same properties', () => {
      const font = new TTFFont(new Uint8Array(testFontFile('CharisSIL/CharisSIL-R.ttf')))
      const fkFont = fontkit.create(testFontFile('CharisSIL/CharisSIL-R.ttf'))
      const embededFont = EmbededFont.for(font)
      const embededFkFont = EmbededFont.for(fkFont)
      expect(embededFont.ascent).toBe(embededFkFont.ascent)
      expect(embededFont.fontBBox).toMatchObject(embededFkFont.fontBBox)
      expect(embededFont.capHeight).toBe(embededFkFont.capHeight)
      expect(embededFont.descent).toBe(embededFkFont.descent)
      expect(embededFont.familyClass).toBe(embededFkFont.familyClass)
      expect(embededFont.flags).toBe(embededFkFont.flags)
      //expect(embededFont.lineGap)embededFont.exkFpect()
      expect(embededFont.macStyleItalic).toBe(embededFkFont.macStyleItalic)
      expect(embededFont.unitsPerEm).toBe(embededFkFont.unitsPerEm)
      expect(embededFont.italicAngle).toBe(embededFkFont.italicAngle)
      expect(embededFont.isFixedPitch).toBe(embededFkFont.isFixedPitch)
      expect(embededFont.postScriptName).toBe(embededFkFont.postScriptName)
      expect(embededFont.xHeight).toBe(embededFkFont.xHeight)
    })
  //   it('layout text', () => {
  //     const embededFont = EmbededFont.for(font)
  //     const embededFkFont = EmbededFont.for(fkFont)
  //     expect(embededFont.encodeText('b')).toMatchObject(embededFkFont.encodeText('b'))
  //     expect(embededFont.encodeText('ab')).toMatchObject(embededFkFont.encodeText('ab'))
  //     expect(embededFont.encodeText('cab')).toMatchObject([3,2,1])
  //   })
    it('encodes same subset', () => {
      const ttfFont = new TTFFont(new Uint8Array(testFontFile('CharisSIL/CharisSIL-R.ttf')))
      const fkFont = fontkit.create(testFontFile('CharisSIL/CharisSIL-R.ttf'))
      const embededTTFFont = EmbededFont.for(ttfFont)
      const embededFkFont = EmbededFont.for(fkFont)
      const text = 'a'
      // const text = 'a à € Τη γλώσσα PŮVODNÍ ZPRÁVA'
      const encodedTTF = embededTTFFont.encodeText(text)
      const encodedFontkit = embededFkFont.encodeText(text)
      const subsetDataTTF = embededTTFFont.subsetData
      const subsetDataFk = embededFkFont.subsetData
      expect(subsetDataTTF.CMap).toMatchObject(subsetDataFk.CMap)
      expect(subsetDataTTF.widths).toMatchObject(subsetDataFk.widths)
      expect(encodedTTF).toMatchObject(encodedFontkit)
      expect(subsetDataTTF.data.length).toBe(subsetDataFk.data.length)
      const subsetTTF = new TTFFont(subsetDataTTF.data, true)
      const subsetFK = new TTFFont(subsetDataFk.data, true)
      const dirTTF = subsetTTF.__dir__
      const dirFK = subsetFK.__dir__
      const compareTable = (dirTTF: any, dirFK: any, tableName: string) => {
        const dataTTF = dirTTF[tableName].sourceStream.data
        const dataFK = dirTTF[tableName].sourceStream.data
        expect(dataTTF).toMatchObject(dataFK)
      }
      compareTable(dirTTF, dirFK, 'head')
      compareTable(dirTTF, dirFK, 'hhea')
      compareTable(dirTTF, dirFK, 'glyf')
      compareTable(dirTTF, dirFK, 'loca')
      compareTable(dirTTF, dirFK, 'maxp')
      compareTable(dirTTF, dirFK, 'cvt')
      compareTable(dirTTF, dirFK, 'prep')
      compareTable(dirTTF, dirFK, 'hmtx')
      compareTable(dirTTF, dirFK, 'fpgm')
    })
  })
  describe('Embeds other TTF fonts', () => {
    const fontPaths = [
      'bio_rhyme/BioRhymeExpanded-Bold.ttf',
      'ubuntu/Ubuntu-R.ttf',
      'press_start_2p/PressStart2P-Regular.ttf',
      'indie_flower/IndieFlower.ttf',
      'great_vibes/GreatVibes-Regular.ttf'
    ]
    fontPaths.forEach(fontPath => {
      it(`encodes various ${fontPath}`, () => {
        const font = new TTFFont(new Uint8Array(testFontFile(fontPath)))
        const embededFont = EmbededFont.for(font)
        embededFont.encodeText('abc')
        const subsetData = embededFont.subsetData
        expect(subsetData.data.length).toBeGreaterThan(0)
      })
    })
  })
  describe('Embeds other TTF fonts', () => {
    const fontPaths = [
      'fantasque/OTF/FantasqueSansMono-BoldItalic.otf',
      'hussar_3d/Hussar3DFour.otf',
      'apple_storm/AppleStormCBo.otf',
    ]
    fontPaths.forEach(fontPath => {
      it(`encodes various ${fontPath}`, () => {
        const font = fontkit.create(testFontFile(fontPath))
        const embededFont = EmbededFont.for(font)
        embededFont.encodeText('abc')
        const subsetData = embededFont.subsetData
        expect(subsetData.data.length).toBeGreaterThan(0)
      })
    })
  })
  describe('Embeds TTF font in a document', () => {
    const createSample = (internalTTF) => {
      const pdfDoc = PDFDocumentFactory.create();
      const font = internalTTF ? new TTFFont(testFontFile('CharisSIL/CharisSIL-R.ttf')) : fontkit.create(testFontFile('CharisSIL/CharisSIL-R.ttf'))
      const [FontUbuntu, fontEncoder] = pdfDoc.embedFont(font)
      // Create pages:
      const pageSize = 750;
      const pageContentStream = pdfDoc.createContentStream(
        drawLinesOfText([
          'ab',
          // 'a à €',
          // 'Τη γλώσσα',
          // 'PŮVODNÍ ZPRÁVA',
          ],
          {
            x: 25,
            y: pageSize - 100,
            font: 'CharisSIL',
            size: 32,
            colorRgb: [1, 0, 1],
            embededFont: fontEncoder,
          },
        ),
      )
      const pageContentStreamRef = pdfDoc.register(pageContentStream);
      const page = pdfDoc
        .createPage([pageSize, pageSize])
        .addFontDictionary('CharisSIL', FontUbuntu)
        .addContentStreams(pageContentStreamRef);
      pdfDoc.addPage(page);
      const bytes = PDFDocumentWriter.saveToBytes(pdfDoc, { useObjectStreams: false });
      writeFileSync(__dirname+`/output_${internalTTF ? 'ttf' : 'fk'}.pdf`, bytes)      
    }
    it('pdflib', () => {
      createSample(true)
      createSample(false)
    })
  })
  describe('advance font', () => {
    it('works with fontlib', () => {
      const pdfDoc = PDFDocumentFactory.create();
      const font = fontkit.create(testFontFile('fantasque/OTF/FantasqueSansMono-BoldItalic.otf'))
      const [FantasqueSansMono, fontEncoder] = pdfDoc.embedFont(font)
      // Create pages:
      const pageSize = 750;
      const pageContentStream = pdfDoc.createContentStream(
        drawLinesOfText([
          'ab',
          // 'a à €',
          // 'Τη γλώσσα',
          // 'PŮVODNÍ ZPRÁVA',
          ],
          {
            x: 25,
            y: pageSize - 100,
            font: 'FantasqueSansMono',
            size: 32,
            colorRgb: [1, 0, 1],
            embededFont: fontEncoder,
          },
        ),
      )
      const pageContentStreamRef = pdfDoc.register(pageContentStream);
      const page = pdfDoc
        .createPage([pageSize, pageSize])
        .addFontDictionary('FantasqueSansMono', FantasqueSansMono)
        .addContentStreams(pageContentStreamRef);
      pdfDoc.addPage(page);
      const bytes = PDFDocumentWriter.saveToBytes(pdfDoc, { useObjectStreams: false });
      writeFileSync(__dirname+`/output_otto.pdf`, bytes)      
    })
    it('works with pdfkit', () => {
      const doc = new pdfkit()
      doc.pipe(createWriteStream(__dirname+'/output_pk.pdf'))
      doc.font(testFontFile('fantasque/OTF/FantasqueSansMono-BoldItalic.otf'))
      .fontSize(25)
      .text('Some text with an embedded FantasqueSansMono font!', 100, 100)
      doc.end()
    })
    it.only('works with PDFJS', () => {
      const pdf = require('pdfjs')
      const font = new pdf.Font(testFontFile('fantasque/OTF/FantasqueSansMono-BoldItalic.otf'))
      var doc = new pdf.Document({ font: font })
      doc.cell({ paddingBottom: 0.5*pdf.cm }).text()
      .add('For more information visit the')
      doc.pipe(createWriteStream(__dirname+'/output_pdfjs.pdf'))
      doc.end()
    })
    it('works with pdfkit', () => {
      const fileData = readFileSync(__dirname+'/output_pk.pdf')
      const doc = PDFDocumentFactory.load(fileData)
      const pages = doc.getPages()
      const page0 = pages[0]
      const page0Font = doc.index.lookup(page0.get('Resources')).get('Font')
      page0Font.map.forEach((fontRef, fontName, m, i)=> {
        const name = fontName.key
        const font = doc.index.lookup(fontRef)
        const fontString = font.toString()
        const fontDescriptorRef = font.getMaybe('FontDescriptor')
        if (fontDescriptorRef != null) {
          const fontDescriptorDict = doc.index.lookup(fontDescriptorRef)
          const fontDescriptorDictString = fontDescriptorDict.toString()
          debugger
          const fontFileRef = doc.index.lookup(fontDescriptorDict.get('FontFile3'))
          const fontData = new Buffer(inflate(fontFileRef.content))
          const fontBuffer = new Buffer(fontData)
          //const fkFont = fontkit.create(fontBuffer)
        } else {
          const toUnicodeStream = doc.index.lookup(font.get('ToUnicode'))
          const toUnicodeContent = inflate(toUnicodeStream.content)
          const descendantFontArray = doc.index.lookup(font.get('DescendantFonts'))
          const descendantFontRef = descendantFontArray.get(0)
          const descendantFontDict = doc.index.lookup(descendantFontRef)
          const descendantFontDictString = descendantFontDict.toString()
          const CIDSystemInfoDict = doc.index.lookup(descendantFontDict.get('CIDSystemInfo'))
          const CIDSystemInfoDictString = CIDSystemInfoDict.toString()
          const fontDescriptorDict = doc.index.lookup(descendantFontDict.get('FontDescriptor'))
          const fontFileRef = doc.index.lookup(fontDescriptorDict.getMaybe('FontFile3') || fontDescriptorDict.getMaybe('FontFile2'))
          if (fontDescriptorDict.getMaybe('CIDSet')) {
            const CIDSetRef = doc.index.lookup(fontDescriptorDict.get('CIDSet'))
            const CIDSetData = inflate(CIDSetRef.content)
          }
          const fontData = new Buffer(inflate(fontFileRef.content))
          const fontBuffer = new Buffer(fontData)
          const d4 = String.fromCharCode.apply(null, fontData.subarray(0,4))
          const p = pdfjscore
          const fkFont = fontkit.create(fontBuffer)
          // const ttfFont = new TTFFont(fontData)
        }
      })
      debugger
    })
  })
})
