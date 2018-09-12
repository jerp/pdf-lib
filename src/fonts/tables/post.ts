/*
  
  ## 'post' PostScript Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/post)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html)
  
  This table contains additional information needed to use TrueType or OpenType™ fonts on PostScript printers.
  This includes data for the FontInfo dictionary entry and the PostScript names of all the glyphs.

  Versions 1.0, 2.0, and 2.5 refer to TrueType fonts and OpenType fonts with TrueType data

*/

import { DataStream, Uint16View, Int8View, Uint32View } from 'fonts/DataStream'

import { Table } from 'fonts/tables/Table'
import { standardNames } from 'fonts/encoding/standardNames'

export class TablePost extends Table {
  static tableName: string = 'post'
  public version: number
  public italicAngle: number
  public underlinePosition: number
  public underlineThickness: number
  public isFixedPitch: number
  public minMemType42: number
  public maxMemType42: number
  public minMemType1: number
  public maxMemType1: number
  public names: string[] = []
  public glyphNameIndex?: Uint16View // version 2
  public offset?: Int8View // version 2.5
  public map?: Uint32View // version 4
  decode(stream: DataStream, byteLength: number, directory: any) {
    const end = stream.offset - byteLength
    this.version = stream.getFixed32()
    this.italicAngle = stream.getFixed32()
    this.underlinePosition = stream.getInt16();
    this.underlineThickness = stream.getInt16();
    this.isFixedPitch = stream.getUint32();
    this.minMemType42 = stream.getUint32();
    this.maxMemType42 = stream.getUint32();
    this.minMemType1 = stream.getUint32();
    this.maxMemType1 = stream.getUint32();
    switch (this.version) {
      case 1: {
        this.names = standardNames.slice();
        break
      }
      // Format 2 is used for fonts that contain some glyphs not in the standard set or whose glyph ordering is non-standard
      case 2: {
        this.names = standardNames.slice()
        const numberOfGlyphs = stream.getUint16()
        this.glyphNameIndex = stream.getTypedView(numberOfGlyphs, Uint16View)
        while (stream.offset < end) this.names.push(stream.getString(stream.getUint8()))
        break
      }
      // As of February 2000, use the 'post' format 2.5 is deprecated
      case 2.5: {
        const numberOfGlyphs = stream.getUint16()
        this.offset = stream.getTypedView(numberOfGlyphs, Int8View)
        break
      }
      //Apple recommends against using 'post' table format 3 under most circumstances
      case 3: {}
      // As a rule, format 4 'post' tables are no longer necessary and should be avoided
      case 4: {
        this.map = stream.getTypedView(directory.maxp.numGlyphs, Uint32View)
      }
    }
  }
  encode(stream: DataStream) {
    throw new Error('Encoding post table not supported')
  }
}
