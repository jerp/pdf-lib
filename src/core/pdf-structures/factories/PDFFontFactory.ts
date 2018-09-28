import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { deflate } from 'pako';

import { IFont, EmbededFont, IFontFlagOptions } from 'fonts/EmbededFont'

import PDFDocument from 'core/pdf-document/PDFDocument';
import {
  PDFArray,
  PDFDictionary,
  PDFIndirectReference,
  PDFName, PDFString,
  PDFNumber,
  PDFRawStream,
  PDFHexString,
} from 'core/pdf-objects';
import { or, bytesToHex, byteToHex2, typedArrayFor } from 'utils';
import { isInstance, validate } from 'utils/validate';

import IPDFFontEncoder from 'core/pdf-structures/factories/PDFFontEncoder';
/**
 * This Factory supports TrueType and OpenType fonts. Note that the apparent
 * hardcoding of values for OpenType fonts does not actually affect TrueType
 * fonts.
 *
 * A note of thanks to the developers of https://github.com/devongovett/pdfkit,
 * as this class borrows heavily from:
 * https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/font/embedded.coffee
 */
class PDFFontFactory implements IPDFFontEncoder {
  static for = (font: IFont, flagOptions: IFontFlagOptions) =>
    new PDFFontFactory(font, flagOptions);

  embededFont: EmbededFont;
  scale: number;
  flagOptions: IFontFlagOptions;

  constructor(font: IFont, flagOptions: IFontFlagOptions) {
    // validate(
    //   font,
    //   isInstance(IFont),
    //   '"font" must be a Font instance',
    // );
    validate(flagOptions, isObject, '"flagOptions" must be an Object');

    this.flagOptions = flagOptions;
    this.embededFont = EmbededFont.for(font);
    this.scale = 1000 / this.embededFont.unitsPerEm;
  }
  
  encodeText = (text: string): PDFHexString => PDFHexString.fromBytes(this.embededFont.encodeText(text));
  /*
    Embed a subset of this font into a document
  */
  embedFontIn = (
    pdfDoc: PDFDocument,
    name?: string,
    subsetting: boolean = false
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
    const fontStream = PDFRawStream.from(PDFDictionary.from(
      {
        Length: PDFNumber.fromNumber(0),
      },
      pdfDoc.index,
    ), new Uint8Array(0))
    const embededFontDict = PDFDictionary.from(
      {
        Type: PDFName.from('FontDescriptor'),
        FontName: PDFName.from(this.embededFont.fontName),
        Flags: PDFNumber.fromNumber(4 || this.embededFont.flags), // 32 Nonsymboli 4 symbolic
        FontBBox: PDFArray.fromArray(this.embededFont.fontBBox.map((n: number) => PDFNumber.fromNumber(n*this.scale)), pdfDoc.index),
        ItalicAngle: PDFNumber.fromNumber(this.embededFont.italicAngle),
        Ascent: PDFNumber.fromNumber(this.embededFont.ascent*this.scale),
        Descent: PDFNumber.fromNumber(this.embededFont.descent*this.scale),
        CapHeight: PDFNumber.fromNumber(this.embededFont.capHeight*this.scale),
        XHeight: PDFNumber.fromNumber(this.embededFont.xHeight*this.scale),
        StemV: PDFNumber.fromNumber(0), // StemV
        FontFile2: pdfDoc.register(fontStream),
      },
      pdfDoc.index,
    );
    const widthArray = PDFArray.fromArray(<PDFNumber[]>[], pdfDoc.index)
    const descendantFontDict = PDFDictionary.from(
      {
        Type: PDFName.from('Font'),
        Subtype: PDFName.from('CIDFontType2'),
        BaseFont: PDFName.from(this.embededFont.fontName),
        CIDSystemInfo: PDFDictionary.from({
          Registry: PDFString.fromString('Adobe'),
          Ordering: PDFString.fromString('Identity'),
          Supplement: PDFNumber.fromNumber(0),
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
      this.embededFont.subsetData.widths.forEach((w,i) => widthArray.array[i] = PDFNumber.fromNumber(w*this.scale))
      return widthArrayBytesSize()
    }
    const fontStreamBytesSize = fontStream.bytesSize
    const toUnicodeStreamBytesSize = toUnicodeStream.bytesSize
    // const fontStreamCopyBytesInto = fontStream.copyBytesInto
    fontStream.bytesSize = ():number => {
      // TODO fix this uggly dirty piece
      // embededFontInfo.data should be calculated only just before writing the PDF
      fontStream.dictionary.set(PDFName.from('Filter'), PDFName.from('FlateDecode'));
      const encodedContent = deflate(this.embededFont.subsetData.data)
      fontStream.dictionary.set('Length', PDFNumber.fromNumber(encodedContent.byteLength))
      fontStream.content = encodedContent
      return fontStreamBytesSize()
    }

    toUnicodeStream.bytesSize = ():number => {
      // TODO fix this uggly dirty pieace
      // embededFontInfo.data should be calculated only just before writing the PDF
      const CMap = this.embededFont.subsetData.CMap
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
        '<< /Registry (Adobe)',
        '/Ordering (UCS)',
        '/Supplement 0',
        '>> def',
        '/CMapName /Adobe-Identity-UCS def',
        '/CMapType 2 def',
        '1 begincodespacerange',
        CMap.codespacerange.map((c: number) => `<${byteToHex2(c)}>`).join(' '),
        'endcodespacerange',
        '1 beginbfrange',
        // most compact form for our use case
        `<0000> <${byteToHex2(CMap.ranges.length)}> [<0000> ${CMap.ranges.map(codePoints => `<${codePoints.map(cp => byteToHex2(cp)).join('')}>`).join(' ')}]`,
        'endbfrange',
        // 1 beginbfchar
        // <3A51> <D840DC3E>
        // endbfchar
        'endcmap',
        'CMapName currentdict /CMap defineresource pop',
        'end',
        'end',
      ].join('\n'))
      // toUnicodeStream.dictionary.set(PDFName.from('Filter'), PDFName.from('FlateDecode'));
      // const encodedContent = deflate(toUnicodeData)
      const encodedContent = toUnicodeData
      toUnicodeStream.dictionary.set('Length', PDFNumber.fromNumber(encodedContent.length))
      toUnicodeStream.content = encodedContent
      const size = toUnicodeStreamBytesSize()
      // console.log(String.fromCharCode.apply(null, toUnicodeData))
      return size
    }

    const fontDict = PDFDictionary.from({
      Type: PDFName.from('Font'),
      Subtype: PDFName.from('Type0'),
      BaseFont: PDFName.from(this.embededFont.fontName),
      Encoding: PDFName.from('Identity-H'),
      DescendantFonts: PDFArray.fromArray([pdfDoc.register(descendantFontDict)], pdfDoc.index),
      ToUnicode: pdfDoc.register(toUnicodeStream),
    }, pdfDoc.index)
    return pdfDoc.register(
      fontDict,
    );
  }
}

export default PDFFontFactory;
