import { deflate } from 'pako';

import { EmbededFont, embedableFont, TTFFont, FontkitFont, OpentypeJsFont } from 'core/pdf-structures/factories/EmbededFont'

import PDFDocument from 'core/pdf-document/PDFDocument';
import {
  PDFArray,
  PDFDictionary,
  PDFIndirectReference,
  PDFName, PDFString,
  PDFNumber,
  PDFRawStream,
} from 'core/pdf-objects';
import { or, uint16ToHex, typedArrayFor } from 'utils';

/**
 * This Factory supports TrueType and OpenType fonts.
 * It needs a font instance created using the intarnal TTFFont class or
 * one of the 2 supported libs: `fontkit` or `opentype.js`
 */
class PDFFontFactory {
  /** creates EmbededFont trying to indetify the managing font lib (internal | `fontkit` | `opentype.js`) */
  static for = (font: embedableFont) => font instanceof TTFFont ?
    EmbededFont.forTTFont(font) :
    font.hasOwnProperty('head') ?
      // assumes that the presence of `font.head` means instance of fonkit Font
      EmbededFont.forFonkitFont(font as FontkitFont) :
      // last option is opentype.js
      EmbededFont.forOpentypeJs(font as OpentypeJsFont)
  
  /*
    Embed the used subset of this font into a document
  */
 static embedFontIn = (
    pdfDoc: PDFDocument,
    embededFont: EmbededFont,
  ): PDFIndirectReference<PDFDictionary> => {
    /*
      A composite font, also called a Type 0 font, is one whose glyphs are obtained from a fontlike object
      called a CIDFont.

      When the current font is composite, the text-showing operators shall behave differently than with
      simple fonts. For simple fonts, each byte of a string to be shown selects one glyph, whereas for
      composite fonts, a sequence of one or more bytes are decoded to select a glyph from the descendant CIDFont.

      A CID-keyed font, then, shall be the combination of a CMap with a CIDFont containing glyph descriptions.
      It shall be represented as a Type 0 font. It contains an Encoding entry whose value shall be a CMap
      dictionary, and its DescendantFonts entry shall reference the CIDFont dictionary with which the CMap
      has been combined.
    */
    const fontStream = PDFRawStream.from(PDFDictionary.from(Object.assign({
        Length: PDFNumber.fromNumber(0),
      }, embededFont.fontStreamSubtype ? {
        Subtype: PDFName.from(embededFont.fontStreamSubtype)
      } : null),
      pdfDoc.index,
    ), new Uint8Array(0))
    const embededFontDict = PDFDictionary.from(Object.assign({
        Type: PDFName.from('FontDescriptor'),
        FontName: PDFName.from(embededFont.fontName),
        Flags: PDFNumber.fromNumber(4 || embededFont.flags), // 32 Nonsymboli 4 symbolic
        FontBBox: PDFArray.fromArray(embededFont.fontBBox.map((n: number) => PDFNumber.fromNumber(n)), pdfDoc.index),
        ItalicAngle: PDFNumber.fromNumber(embededFont.italicAngle),
        Ascent: PDFNumber.fromNumber(embededFont.ascent),
        Descent: PDFNumber.fromNumber(embededFont.descent),
        CapHeight: PDFNumber.fromNumber(embededFont.capHeight),
        XHeight: PDFNumber.fromNumber(embededFont.xHeight),
        StemV: PDFNumber.fromNumber(0), // StemV
      }, embededFont.fontCidType === 0 ? {
        FontFile3: pdfDoc.register(fontStream),
      } : {
        FontFile2: pdfDoc.register(fontStream),
      }),
      pdfDoc.index,
    );
    const widthArray = PDFArray.fromArray(<PDFNumber[]>[], pdfDoc.index)
    const descendantFontDict = PDFDictionary.from(
      {
        Type: PDFName.from('Font'),
        Subtype: PDFName.from(embededFont.fontCidType === 0 ? 'CIDFontType0' : 'CIDFontType2'),
        BaseFont: PDFName.from(embededFont.fontName),
        // TODO would it be possible to evaluate a better value based on font attibutes...
        DW: PDFNumber.fromNumber(1000),
        CIDToGIDMap: PDFName.from('Identity'),
        CIDSystemInfo: PDFDictionary.from({
          Registry: PDFString.fromString(embededFont.registry),
          Ordering: PDFString.fromString(embededFont.ordering),
          Supplement: PDFNumber.fromNumber(embededFont.supplement),
        }, pdfDoc.index),
        // W: widths for the glyphs in the CIDFont - entry example: [ 0 [1400 325 ...] ]
        W: PDFArray.fromArray([
          PDFNumber.fromNumber(0),
          widthArray
        ], pdfDoc.index),
        FontDescriptor: pdfDoc.register(embededFontDict),
      }, pdfDoc.index,
    )
    const toUnicodeStream = PDFRawStream.from(
      PDFDictionary.from({
        Length: PDFNumber.fromNumber(0),
      }, pdfDoc.index), new Uint8Array)
    const widthArrayBytesSize = widthArray.bytesSize
    widthArray.bytesSize = ():number => {
      embededFont.widths.forEach((w,i) => widthArray.array[i] = PDFNumber.fromNumber(w))
      return widthArrayBytesSize()
    }
    const fontStreamBytesSize = fontStream.bytesSize
    const toUnicodeStreamBytesSize = toUnicodeStream.bytesSize
    // const fontStreamCopyBytesInto = fontStream.copyBytesInto
    fontStream.bytesSize = ():number => {
      // TODO fix this uggly dirty piece
      // embededFontInfo.data should be calculated only just before writing the PDF
      fontStream.dictionary.set(PDFName.from('Filter'), PDFName.from('FlateDecode'));
      const encodedContent = deflate(embededFont.encode())
      fontStream.dictionary.set('Length', PDFNumber.fromNumber(encodedContent.byteLength))
      fontStream.content = encodedContent
      return fontStreamBytesSize()
    }

    toUnicodeStream.bytesSize = ():number => {
      // TODO fix this uggly dirty pieace
      // embededFontInfo.data should be calculated only just before writing the PDF
      const CMap = embededFont.CMap
          // The Identity-H and Identity-V CMaps may be used to refer to glyphs directly by their CIDs when showing a text string
        /*
          In addition to displaying text, conforming readers sometimes need to determine the information content
          of text—that is, its meaning according to some standard character identification as opposed to its rendered
          appearance. This need arises during operations such as searching, indexing, and exporting of text to other
          file formats.
        */
      const toUnicodeData = typedArrayFor([
        '/CIDInit /ProcSet findresource begin',
        '12 dict begin',
        'begincmap',
        '/CIDSystemInfo',
        `<< /Registry (${CMap.cidSystemInfo.registry})`,
        `/Ordering (${CMap.cidSystemInfo.ordering})`,
        `/Supplement ${CMap.cidSystemInfo.supplement}`,
        '>> def',
        `/CMapName ${CMap.name} def`,
        '/CMapType 2 def',
        '1 begincodespacerange',
        CMap.codespacerange.map((c: number) => `<${uint16ToHex(c)}>`).join(' '),
        'endcodespacerange',
        '1 beginbfrange',
        // most compact form for our use case
        `<0000> <${uint16ToHex(CMap.ranges.length)}> [<0000> ${CMap.ranges.map(codePoints => `<${codePoints.map(cp => uint16ToHex(cp)).join('')}>`).join(' ')}]`,
        'endbfrange',
        // 1 beginbfchar
        // <3A51> <D840DC3E>
        // endbfchar
        'endcmap',
        'CMapName currentdict /CMap defineresource pop',
        'end',
        'end',
      ].join('\n'))
      const encodedContent = toUnicodeData
      toUnicodeStream.dictionary.set('Length', PDFNumber.fromNumber(encodedContent.length))
      toUnicodeStream.content = encodedContent
      const size = toUnicodeStreamBytesSize()
      return size
    }

    const fontDict = PDFDictionary.from({
      Type: PDFName.from('Font'),
      Subtype: PDFName.from(embededFont.subtype),
      BaseFont: PDFName.from(embededFont.fontName),
      Encoding: PDFName.from(embededFont.encoding),
      DescendantFonts: PDFArray.fromArray([pdfDoc.register(descendantFontDict)], pdfDoc.index),
      ToUnicode: pdfDoc.register(toUnicodeStream),
    }, pdfDoc.index)
    return pdfDoc.register(
      fontDict,
    );
  }
}

export default PDFFontFactory;
