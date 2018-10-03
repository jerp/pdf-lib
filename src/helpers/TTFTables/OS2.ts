/*
  
  ## 'OS/2' OS/2 and Windows Metrics Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/os2)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html)
  
  This table contains additional information needed to use TrueType or OpenType™ fonts on PostScript printers.
  This includes data for the FontInfo dictionary entry and the PostScript names of all the glyphs.

  Versions 1.0, 2.0, and 2.5 refer to TrueType fonts and OpenType fonts with TrueType data

*/

import { Table } from 'helpers/TTFTables/Table'

export class TableOS2 extends Table {
  public sFamilyClass: number
  public sxHeight: number // version >= 2
  public sCapHeight: number
  doDecode = () => {
    const stream = this.sourceStream
    const version = stream.getUint16();
    this.sFamilyClass = stream.skip(14*2).getInt16();
    if (version >= 2) {
        this.sxHeight = stream.skip(10+ 4*4 + 4 + 2*4 + 8*2).getInt16();
        this.sCapHeight = stream.getInt16();
    }
  }
}
