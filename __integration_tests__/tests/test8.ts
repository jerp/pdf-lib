import {
  drawLinesOfText,
  PDFDocument,
  PDFDocumentFactory,
  PDFDocumentWriter,
} from '../../src';
import {
  PDFHexString,
} from '../../src/core/pdf-objects';

import { ITestAssets, ITestKernel } from '../models';

// Define the test kernel using the above content stream functions.
const kernel: ITestKernel = (assets: ITestAssets) => {
  const { ttf, otf } = assets.fonts;
  const pdfDoc = PDFDocumentFactory.create();
  const [FontCharisSIL, eFontCharisSIL] = pdfDoc.embedFont(ttf.CharisSIL_r)
  const [NotoSansCJKsc, eNotoSansCJKsc] = pdfDoc.embedFont(otf.NotoSansCJKsc_Medium)
  // Create pages:
  const pageSize = 750;
  const pageContentStream = pdfDoc.createContentStream(
    drawLinesOfText([
        'a à ặ', // composite glyphs with 2 and 3 components
        '€ ꝝ',   // encoding of euro
        'PŮVODNÍ ZPRÁVA', // Czeck
      ],
      {
        x: 25,
        y: pageSize - 100,
        font: 'CharisSIL_r',
        size: 25,
        colorRgb: [3/16, 3/16, 3/16],
        lineHeight: 48,
        embededFont: eFontCharisSIL,
      },
    ),
    drawLinesOfText([
        '쪚\uCAC6',
      ],
      {
        x: 25,
        y: pageSize - 300,
        font: 'NotoSansCJKsc',
        size: 25,
        colorRgb: [3/16, 3/16, 3/16],
        lineHeight: 48,
        embededFont: eNotoSansCJKsc,
      },
    ),
  )
  const pageContentStreamRef = pdfDoc.register(pageContentStream);
  const page = pdfDoc
    .createPage([pageSize, pageSize])
    .addFontDictionary('CharisSIL_r', FontCharisSIL)
    .addFontDictionary('NotoSansCJKsc', NotoSansCJKsc)
    .addContentStreams(pageContentStreamRef);
  pdfDoc.addPage(page);
  return PDFDocumentWriter.saveToBytes(pdfDoc, { useObjectStreams: false });
};

export default {
  kernel,
  title: 'PDF accented characters',
  description:
    'More than english',
  checklist: [
    '4 lines displayed:',
    'line 1 prints variations of a: "a à ặ"',
    'line 2 prints "€ ꝝ"',
    'line 3 prints Czeck text "PŮVODNÍ ZPRÁVA"',
    'line 3 prints Chinses text "쪚\uCAC6"'
  ],
};
