import { TTFFont } from 'fonts/TTFFont'
import { EmbededFont } from 'fonts/EmbededFont'
const fontkit = require('fontkit')
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
          ].map(text => fontEncoder.encodeText(text)),
          {
            x: 25,
            y: pageSize - 100,
            font: 'CharisSIL',
            size: 32,
            colorRgb: [1, 0, 1],
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

})
