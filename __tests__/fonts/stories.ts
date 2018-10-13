import { readFileSync } from 'fs'
import { inflate } from 'pako'

import {
  drawLinesOfText,
  PDFDocumentFactory,
  PDFDocumentWriter,
  PDFContentStream,
  PDFRawStream
} from '../../src';
import {
  PDFHexString,
  PDFIndirectReference,
  
} from '../../src/core/pdf-objects';

describe('EmbededTTFFont', () => {
  describe('Embeds TTF Font with internal TTFFont, opentype.js and with fontkit', () => {
    it('parses', () => {
      const fileData = readFileSync(__dirname+'/indesign-test.pdf')
      const doc = PDFDocumentFactory.load(fileData)
      const pages = doc.getPages()
      const page0 = pages[0]
      const contentStream0 = doc.index.lookup(page0.get('Contents')) as PDFRawStream
      const content = inflate(contentStream0.content)
      const page0Font = doc.index.lookup(page0.get('Resources')).get('Font')
      const stru=doc.index.lookup(doc.catalog.get('StructTreeRoot'))
      const struString = stru.toString()
      const K=doc.index.lookup(stru.get('K'))
      const K2=doc.index.lookup(doc.index.lookup(K.get('K')).get('K'))
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
