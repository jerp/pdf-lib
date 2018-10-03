/*
  
  ## 'post' PostScript Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/post)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html)
  
  This table contains additional information needed to use TrueType or OpenType™ fonts on PostScript printers.
  This includes data for the FontInfo dictionary entry and the PostScript names of all the glyphs.

  Versions 1.0, 2.0, and 2.5 refer to TrueType fonts and OpenType fonts with TrueType data

*/


import { Table } from 'helpers/TTFTables/Table'

export class TablePost extends Table {
  public italicAngle: number
  public isFixedPitch: number
  doDecode = () => {
    const stream = this.sourceStream
    this.italicAngle = stream.skip(4).getFixed32()
    this.isFixedPitch = stream.skip(4).getUint32();
  }
}
