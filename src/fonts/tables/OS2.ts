/*
  
  ## 'OS/2' OS/2 and Windows Metrics Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/os2)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html)
  
  This table contains additional information needed to use TrueType or OpenType™ fonts on PostScript printers.
  This includes data for the FontInfo dictionary entry and the PostScript names of all the glyphs.

  Versions 1.0, 2.0, and 2.5 refer to TrueType fonts and OpenType fonts with TrueType data

*/

import { DataStream, Int8View, Int32View } from 'fonts/DataStream'

import { Table } from 'fonts/tables/Table'
//import { unicodeRanges } from 'fonts/encoding/unicodeRanges'

export class TableOS2 extends Table {
  static tableName: string = 'OS/2'
  public version: number
  public xAvgCharWidth: number
  public usWeightClass: number
  public usWidthClass: number
  public fsType: number
  public ySubscriptXSize: number
  public ySubscriptYSize: number
  public ySubscriptXOffset: number
  public ySubscriptYOffset: number
  public ySuperscriptXSize: number
  public ySuperscriptYSize: number
  public ySuperscriptXOffset: number
  public ySuperscriptYOffset: number
  public yStrikeoutSize: number
  public yStrikeoutPosition: number
  public sFamilyClass: number
  public panose: Int8View
  public ulUnicodeRange: Int32View
  public achVendID: string
  public fsSelection: number
  public usFirstCharIndex: number
  public usLastCharIndex: number
  public sTypoAscender: number
  public sTypoDescender: number
  public sTypoLineGap: number
  public usWinAscent: number
  public usWinDescent: number
  public ulCodePageRange: Int32View // version >= 1
  public sxHeight: number // version >= 2
  public sCapHeight: number
  public usDefaultChar: number
  public usBreakChar: number
  public usMaxContent: number
  public usLowerPointSize: number // version >= 5
  public usUpperPointSize: number
  decode(stream: DataStream, byteLength: number, directory: any) {
    this.version = stream.getUint16();
    this.xAvgCharWidth = stream.getInt16();
    this.usWeightClass = stream.getUint16();
    this.usWidthClass = stream.getUint16();
    this.fsType = stream.getUint16();
    this.ySubscriptXSize = stream.getInt16();
    this.ySubscriptYSize = stream.getInt16();
    this.ySubscriptXOffset = stream.getInt16();
    this.ySubscriptYOffset = stream.getInt16();
    this.ySuperscriptXSize = stream.getInt16();
    this.ySuperscriptYSize = stream.getInt16();
    this.ySuperscriptXOffset = stream.getInt16();
    this.ySuperscriptYOffset = stream.getInt16();
    this.yStrikeoutSize = stream.getInt16();
    this.yStrikeoutPosition = stream.getInt16();
    this.sFamilyClass = stream.getInt16();
    this.panose = stream.getTypedView(10, Int8View)
    this.ulUnicodeRange = stream.getTypedView(4, Int32View)
    this.achVendID = stream.getString(4)
    this.fsSelection = stream.getUint16();
    this.usFirstCharIndex = stream.getUint16();
    this.usLastCharIndex = stream.getUint16();
    this.sTypoAscender = stream.getInt16();
    this.sTypoDescender = stream.getInt16();
    this.sTypoLineGap = stream.getInt16();
    this.usWinAscent = stream.getUint16();
    this.usWinDescent = stream.getUint16();
    if (this.version >= 1) {
      this.ulCodePageRange = stream.getTypedView(2, Int32View)
    }
    if (this.version >= 2) {
        this.sxHeight = stream.getInt16();
        this.sCapHeight = stream.getInt16();
        this.usDefaultChar = stream.getUint16();
        this.usBreakChar = stream.getUint16();
        this.usMaxContent = stream.getUint16();
    }
    if (this.version >= 5) {
      this.usLowerPointSize = stream.getUint16()
      this.usUpperPointSize = stream.getUint16()
    }

  }
  encode(stream: DataStream) {
    throw new Error('Encoding OS/2 table not supported')
  }
}
