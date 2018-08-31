import {
  PDFHexString,
} from 'core/pdf-objects';
interface PDFFontEncoder {
	encode(text: string): [PDFHexString];
}
export default PDFFontEncoder