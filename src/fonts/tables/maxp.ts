/*
  
  ## The 'maxp' table: General table information
  
  The [maxp](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6maxp.html) table
  ...

*/

import { DataStream } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'

export class TableMaxp extends Table {
  static tableName: string = 'maxp'
  public version: number
  /** The number of glyphs in the font */
  public numGlyphs: number
  /** Maximum points in a non-composite glyph */
  public maxPoints: number
  /** Maximum contours in a non-composite glyph */
  public maxContours: number
  /** Maximum points in a composite glyph */
  public maxComponentPoints: number
  /** Maximum contours in a composite glyph */
  public maxComponentContours: number
  /** 1 if instructions do not use the twilight zone, 2 otherwise */
  public maxZones: number
  /** Maximum points used in Z0 */
  public maxTwilightPoints: number
  /** Number of Storage Area locations */
  public maxStorage: number
  /** Number of FDEFs */
  public maxFunctionDefs: number
  /** Number of IDEFs */
  public maxInstructionDefs: number
  /** Maximum stack depth */
  public maxStackElements: number
  /** Maximum byte count for glyph instructions */
  public maxSizeOfInstructions: number
  /** Maximum number of components referenced at “top level” for any composite glyph */
  public maxComponentElements: number
  /** Maximum levels of recursion; 1 for simple components */
  public maxComponentDepth: number
//  size: number = (32 + 14 * 16 )
  decode(stream: DataStream) {
    this.version = stream.getFixed32()
    this.numGlyphs = stream.getUint16()
    this.maxPoints = stream.getUint16()
    this.maxContours = stream.getUint16()
    this.maxComponentPoints = stream.getUint16()
    this.maxComponentContours = stream.getUint16()
    this.maxZones = stream.getUint16()
    this.maxTwilightPoints = stream.getUint16()
    this.maxStorage = stream.getUint16()
    this.maxFunctionDefs = stream.getUint16()
    this.maxInstructionDefs = stream.getUint16()
    this.maxStackElements = stream.getUint16()
    this.maxSizeOfInstructions = stream.getUint16()
    this.maxComponentElements = stream.getUint16()
    this.maxComponentDepth = stream.getUint16()
  }
  // encode(stream: DataStream) {
  //   stream.setFixed32(this.version)
  //   stream.setUint16(this.numGlyphs)
  //   stream.setUint16(this.maxPoints)
  //   stream.setUint16(this.maxContours)
  //   stream.setUint16(this.maxComponentPoints)
  //   stream.setUint16(this.maxComponentContours)
  //   stream.setUint16(this.maxZones)
  //   stream.setUint16(this.maxTwilightPoints)
  //   stream.setUint16(this.maxStorage)
  //   stream.setUint16(this.maxFunctionDefs)
  //   stream.setUint16(this.maxInstructionDefs)
  //   stream.setUint16(this.maxStackElements)
  //   stream.setUint16(this.maxSizeOfInstructions)
  //   stream.setUint16(this.maxComponentElements)
  //   stream.setUint16(this.maxComponentDepth)
  // }
}
