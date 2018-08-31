import { Buffer } from 'buffer/';
import fontkit from 'fontkit';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import range from 'lodash/range';

import PDFDocument from 'core/pdf-document/PDFDocument';
import {
  PDFArray,
  PDFDictionary,
  PDFIndirectReference,
  PDFName,
  PDFString,
  PDFNumber,
  PDFRawStream,
  PDFHexString,
} from 'core/pdf-objects';
import { or, setCharAt, not } from 'utils';
import { isInstance, validate } from 'utils/validate';

import PDFObjectIndex from 'core/pdf-document/PDFObjectIndex';

import PDFFontEncoder from 'core/pdf-structures/factories/PDFFontEncoder'
import EncodeStream from 'core/pdf-structures/factories/EncodeStream'

/** @hidden */
const unsigned32Bit = '00000000000000000000000000000000';

export interface IFontFlagOptions {
  FixedPitch?: boolean;
  Serif?: boolean;
  Symbolic?: boolean;
  Script?: boolean;
  Nonsymbolic?: boolean;
  Italic?: boolean;
  AllCap?: boolean;
  SmallCap?: boolean;
  ForceBold?: boolean;
}

// TODO: Make sure this works correctly. Setting any flag besides
//       Nonsymbolic to true seems to screw up the font...
/*
 * Doing this by bit-twiddling a string, and then parsing it, gets around
 * JavaScript converting the results of bit-shifting ops back into 64-bit integers.
 */
// prettier-ignore
/** @hidden */
const fontFlags = (options: IFontFlagOptions) => {
  let flags = unsigned32Bit;
  if (options.FixedPitch)  flags = setCharAt(flags, 32 - 1, '1');
  if (options.Serif)       flags = setCharAt(flags, 32 - 2, '1');
  if (options.Symbolic)    flags = setCharAt(flags, 32 - 3, '1');
  if (options.Script)      flags = setCharAt(flags, 32 - 4, '1');
  if (options.Nonsymbolic) flags = setCharAt(flags, 32 - 6, '1');
  if (options.Italic)      flags = setCharAt(flags, 32 - 7, '1');
  if (options.AllCap)      flags = setCharAt(flags, 32 - 17, '1');
  if (options.SmallCap)    flags = setCharAt(flags, 32 - 18, '1');
  if (options.ForceBold)   flags = setCharAt(flags, 32 - 19, '1');
  return parseInt(flags, 2);
};

function encodeSubset(font: PDFCIDFontFactory): Uint8Array {
  const s = new EncodeStream()
  font.subset.encode(s)
  const { buffer, byteOffset, byteLength } = s.getContent()
  return new Uint8Array(buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT)
}

/**
 * This Factory supports CID fonts.
 *
 * A note of thanks to the developers of https://github.com/devongovett/pdfkit,
 * as this class borrows heavily from:
 * https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/font/embedded.coffee
 */
class PDFCIDFontFactory implements PDFFontEncoder {
  static for = (fontData: Uint8Array, flagOptions: IFontFlagOptions) =>
    new PDFCIDFontFactory(fontData, flagOptions);

  font: any;
  scale: number;
  flagOptions: IFontFlagOptions;
  subset: any;
  widths: number[];
  unicode: number[];

  constructor(fontData: Uint8Array, flagOptions: IFontFlagOptions) {
    validate(
      fontData,
      isInstance(Uint8Array),
      '"fontData" must be a Uint8Array',
    );
    validate(flagOptions, isObject, '"flagOptions" must be an Object');

    // This has to work in browser & Node JS environments. And, unfortunately,
    // the "fontkit" package makes use of Node "Buffer" objects, instead of
    // standard JS typed arrays. So, for now we'll just use the "buffer" package
    // to convert the "data" to a "Buffer" object that "fontkit" can work with.
    const dataBuffer = Buffer.from(fontData as any);

    this.flagOptions = flagOptions;
    this.font = fontkit.create(dataBuffer);
    this.scale = 1000 / this.font.unitsPerEm;
    this.subset = this.font.createSubset()
    this.widths = []
    this.unicode = []
  }

  /*
  TODO: This is hardcoded for "Simple Fonts" with non-modified encodings, need
  to broaden support to other fonts.
  */
  embedFontIn = (
    pdfDoc: PDFDocument,
    name?: string,
  ): PDFIndirectReference<PDFDictionary> => {
    validate(
      pdfDoc,
      isInstance(PDFDocument),
      'PDFFontFactory.embedFontIn: "pdfDoc" must be an instance of PDFDocument',
    );
    validate(name, or(isString, isNil), '"name" must be a string or undefined');

    const randSuffix = `-rand_${Math.floor(Math.random() * 10000)}`;
    const fontName =
      name || this.font.postscriptName + randSuffix || 'Font' + randSuffix;
    const isCFF = this.subset.cff != null
    const fontStreamDict = PDFDictionary.from(isCFF ? { Subtype: PDFName.from('CIDFontType0C') } : {}, pdfDoc.index);
    const fontStream = PDFRawStream.from(fontStreamDict, new Uint8Array())
    // TODO: this is a hack so content access is delayed untill subset is done
    //       think about a better way to implement this
    //       maybe subclassing PDFRawStream
    Object.defineProperty(fontStream, 'content', {
      get: encodeSubset.bind(this)
    })
    const fontStreamRef = pdfDoc.register(fontStream);

    const {
      italicAngle,
      ascent,
      descent,
      capHeight,
      xHeight,
      bbox,
    } = this.font;

    const fontDescriptor = PDFDictionary.from(
      Object.assign({
        Type: PDFName.from('FontDescriptor'),
        FontName: PDFName.from(fontName),
        Flags: PDFNumber.fromNumber(fontFlags(this.flagOptions)),
        FontBBox: PDFArray.fromArray(
          [
            PDFNumber.fromNumber(bbox.minX * this.scale),
            PDFNumber.fromNumber(bbox.minY * this.scale),
            PDFNumber.fromNumber(bbox.maxX * this.scale),
            PDFNumber.fromNumber(bbox.maxY * this.scale),
          ],
          pdfDoc.index,
        ),
        ItalicAngle: PDFNumber.fromNumber(italicAngle),
        Ascent: PDFNumber.fromNumber(ascent * this.scale),
        Descent: PDFNumber.fromNumber(descent * this.scale),
        CapHeight: PDFNumber.fromNumber((capHeight || ascent) * this.scale),
        XHeight: PDFNumber.fromNumber((xHeight || 0) * this.scale),
        // Not sure how to compute/find this, nor is anybody else really:
        // https://stackoverflow.com/questions/35485179/stemv-value-of-the-truetype-font
        StemV: PDFNumber.fromNumber(0),
      }, isCFF ? {FontFile3: fontStreamRef} : {FontFile2: fontStreamRef}),
      pdfDoc.index,
    );
    const descendantFont = PDFDictionary.from(
      {
        Type: PDFName.from('Font'),
        Subtype: PDFName.from(isCFF ? 'CIDFontType0' : 'CIDFontType2'),
        BaseFont: PDFName.from(fontName),
        CIDSystemInfo: PDFDictionary.from({
          Registry: PDFString.fromString(''),
          Ordering: PDFString.fromString(''),
          Supplement: PDFNumber.fromNumber(0),
        }, pdfDoc.index),
        W: PDFArray.fromArray([
          PDFNumber.fromNumber(0),
          this.getWidths(pdfDoc.index)
        ], pdfDoc.index),
        FontDescriptor: pdfDoc.register(fontDescriptor),
      },
      pdfDoc.index,
    )
    return pdfDoc.register(
      PDFDictionary.from(
        {
          Type: PDFName.from('Font'),
          Subtype: PDFName.from('Type0'),
          BaseFont: PDFName.from(fontName),
          Encoding: PDFName.from('Identity-H'),
          DescendantFonts: PDFArray.fromArray([descendantFont], pdfDoc.index),
          ToUnicode: this.toUnicodeCmap(pdfDoc.index),
        },
        pdfDoc.index,
      ),
    );
  };
  private layout(text: string): [[any]] {
    const run = this.font.layout(text)
    // # Normalize position values
    // for position, i in run.positions
    //   for key of position
    //     position[key] *= @scale

    //   position.advanceWidth = run.glyphs[i].advanceWidth * @scale
    return [run.glyphs]
  }
  encode(text: string): [PDFHexString] {
    const [sourceGlyphs] = this.layout(text)
    const encodedText = PDFHexString.fromString(sourceGlyphs.map(glyph => {
      const gid = this.subset.includeGlyph(glyph.id)
      if (this.widths[gid] == null) this.widths[gid] = glyph.advanceWidth * this.scale
      if (this.unicode[gid] == null) this.unicode[gid] = glyph.codePoints
      return (`0000${gid.toString(16)}`).slice(-4)
    }).join(''))
    return [encodedText]
  };
  /** @hidden */
  getWidths(index: PDFObjectIndex): PDFArray {
    return PDFArray.fromArray(this.widths.map(PDFNumber.fromNumber), index)
  }
  /** @hidden */
  toUnicodeCmap(index: PDFObjectIndex): PDFArray {
    return PDFArray.fromArray(this.unicode.map(PDFNumber.fromNumber), index)
  }
}

export default PDFCIDFontFactory;
