export as namespace fontkit;

export interface FontkitFont {
  postscriptName: string
  unitsPerEm: number
  ascent: number
  descent: number
  xHeight: number
  capHeight: number
  lineGap: number
  bbox: {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  }
  isFixedPitch: number
  italicAngle: number
  post: { isFixedPitch: number }
  head: { macStyle: { italic: number } }
  'OS/2': { sFamilyClass: number }
  'CFF ': { topDict: { Private: { Subrs: any[] } } }
  createSubset(): any
  layout(text: string, options?: any): any
  widthOfText(text: string, options?: any): number
}
export function create(a: any): FontkitFont;