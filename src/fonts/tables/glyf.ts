/*
  
  ## The 'glyf' table: General table information
  
  The [glyf](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html) table
  The 'glyf' table contains the data that defines the appearance of the glyphs in the font.
  This includes specification of the points that describe the contours that make up a glyph outline
  and the instructions that grid-fit that glyph.
  The 'glyf' table supports the definition of simple glyphs and compound glyphs, that is,
  glyphs that are made up of other glyphs.

*/

import { DataStream, Int16View } from 'fonts/DataStream'
import { Table } from 'fonts/tables/Table'
import { loca } from 'fonts/tables'


type int16 = number

const shortVector = {
  x: Math.pow(2,1),
  y: Math.pow(2,2),
}
const sameVector = {
  x: Math.pow(2,4),
  y: Math.pow(2,5),
}

export class TableGlyf extends Table {
  static tableName: string = 'glyf'
  private sourceStream: DataStream
  private offsetStart: number
  private loca: loca
  decode(stream: DataStream, length: number, directory: any) {
    this.sourceStream = stream
    this.offsetStart = stream.offset
    this.loca = directory.getTable('loca')
  }
  // needed?
  // getGlyf(id: number): Glyf {
  //   return this.glyfs[id] || this.decodeGlyf(id)
  // }
  getGlyfData(id: number): Uint8Array {
    return this.readGlyfData(id)
  }
  get length() {
    return this.loca.length - 1
  }
  private readGlyfData(id: number): Uint8Array {
    // loca give start offset of glif data but need to scan end offset
    const stream = this.sourceStream
    const offsetStart = this.offsetStart + this.loca.get(id) * 2
    this.scanGlyfData(offsetStart)
    const offsetEnd = stream.offset
    stream.offset = offsetStart
    return stream.getBytes(offsetEnd - offsetStart)
  }
  private scanGlyfData(offset: number) {
    const stream = this.sourceStream
    stream.offset = offset
    const numberOfContours = stream.getInt16()
    stream.offset += 4 * 2 // xMin, yMin, xMax, yMax
    const glyfClass = numberOfContours > 0 ? SimpleGlyf : CompositeGlyf
    const glyf = new glyfClass(0,0,0,0)
    glyf.scanRemaningGlyfData(stream, numberOfContours)
  }
  // needed?
  // decodeGlyf(id: number): Glyf {
  //   const stream = this.sourceStream
  //   stream.offset = this.loca.get(id)
  //   const numberOfContours = stream.getInt16()
  //   const xMin = stream.getInt16()
  //   const yMin = stream.getInt16()
  //   const xMax = stream.getInt16()
  //   const yMax = stream.getInt16()
  //   const glyfClass = numberOfContours > 0 ? SimpleGlyf : CompositeGlyf
  //   const glyf = this.glyfs[id] = new glyfClass(xMin, xMax, yMin, yMax)
  //   glyf.decode(stream, numberOfContours)
  //   return glyf
  // }
  encode(stream: DataStream, subset: number[]) {
    subset.forEach(id => {
      this.loca.set(id, stream.offset)
      stream.setBytes(this.readGlyfData(id))
    })
  }
}
abstract class Glyf {
  /** Array of instructions for this glyph */
  public instructions: Uint8Array
  /** Array of flags */
  public flags: number[]
  /** encoded flags */
  public flagBuffer: Uint8Array
  /** Array of x-coordinates */
  public xCoordinates: Uint8Array
  /** Array of y-coordinates */
  public yCoordinates: Uint8Array
  constructor(
    /** Minimum x for coordinate data */
    public xMin: int16,
    /** Minimum y for coordinate data */
    public yMin: int16,
    /** Maximum x for coordinate data */
    public xMax: int16,
    /** Maximum y for coordinate data */
    public yMax: int16,
  ) {}
  // needed ?
// abstract decode(stream: DataStream, numberOfContours?: number): void
  // encode(stream: DataStream): void {
  //   stream.setInt16(this.xMin)
  //   stream.setInt16(this.yMin)
  //   stream.setInt16(this.xMax)
  //   stream.setInt16(this.yMax)
  // }
  abstract scanRemaningGlyfData(stream: DataStream, numberOfContours?: number): void
}
class SimpleGlyf extends Glyf {
  /** Array of last points of each contour */
  public endPtsOfContours: Uint16Array
  // instructionLength: int16, // Total number of bytes needed for instructions
  scanRemaningGlyfData(stream: DataStream, numberOfContours: number) {
    const endPtsOfContours = stream.getTypedView(numberOfContours, Int16View)
//    stream.offset += numberOfContours * 2 // endPtsOfContours
    const nbInstructions = stream.getInt16()
    stream.offset += nbInstructions
    const numberOfCoordinates = endPtsOfContours.get(endPtsOfContours.length - 1) + 1;
    this.scanFlags(stream, numberOfCoordinates)
  }
  private scanFlags(stream: DataStream, numberOfCoordinates: number) {
    let totalCoordByteLength = 0
    for (let i = 0; i < numberOfCoordinates; i++) {
      const flag = stream.getUint8()
      const coordXByteLength = ((flag & shortVector.x) > 0) ? 1 : ((flag & sameVector.x) === 0) ? 2 :0
      const coordYByteLength = ((flag & shortVector.y) > 0) ? 1 : ((flag & sameVector.y) === 0) ? 2 :0
      const coordByteLength  = coordXByteLength + coordYByteLength
      totalCoordByteLength += coordByteLength
      if ((flag & 0b1000) > 0) {
         // If bit 3 is set, repeat n times
        const repeat = stream.getUint8()
        i += repeat
        totalCoordByteLength += coordByteLength * repeat
      }
    }
    stream.offset += totalCoordByteLength
    // loca seams to give the number of byte pairs reserved for glyphs
    // so the actual number of bytes read by a glyph could be 1 byte
    // greater then the number of byte need to encode it (if odd number)
    // this is observed in both font-kit and pdf-js
    stream.offset = Math.ceil(stream.offset/2)*2
  }
  // needd?
  // decode(stream: DataStream, numberOfContours: number) {
  //   this.endPtsOfContours = <Uint16Array>stream.getTypedArray(numberOfContours, Uint16Array)
  //   this.instructions = stream.getBytes(stream.getInt16())
  //   const numberOfCoordinates = this.endPtsOfContours[this.endPtsOfContours.length - 1] + 1;
  //   this.flagBuffer = this.decodeFlags(stream, numberOfCoordinates)
  //   this.xCoordinates =  this.decodeCoordinates(stream, numberOfCoordinates, Math.pow(2,1), Math.pow(2,4))
  //   this.yCoordinates =  this.decodeCoordinates(stream, numberOfCoordinates, Math.pow(2,2), Math.pow(2,5))
  // }
  // private decodeFlags(stream: DataStream, numberOfCoordinates: number): Uint8Array {
  //   const flagOffset = stream.offset
  //   this.flags = [];
  //   while (this.flags.length < numberOfCoordinates) {
  //       const flag = stream.getUint8()
  //       this.flags.push(flag)
  //       // If bit 3 is set, we repeat this flag n times, where n is the next byte.
  //       if ((flag & 0b1000) > 0) {
  //           for (let repeat = stream.getUint8(); repeat > 0; repeat--) this.flags.push(flag)
  //       }
  //   }
  //   const byteLength = stream.offset - flagOffset
  //   stream.offset = flagOffset
  //   return stream.getBytes(byteLength)
  // }
  // private decodeCoordinates(stream: DataStream, numberOfCoordinates: number, shortVector: number, same: number): Uint8Array {
  //   let byteLength = 0
  //   for (let i = 0; i < numberOfCoordinates; i += 1) {
  //       const flag = this.flags[i];
  //       if ((flag & shortVector) > 0) {
  //         byteLength++
  //       } else if ((flag & same) === 0) {
  //         byteLength += 2
  //       }
  //   }
  //   return stream.getBytes(byteLength)
  // }
  // encode(stream: DataStream) {
  //   stream.setInt16(this.endPtsOfContours.length)
  //   super.encode(stream)
  //   // stream.setBytes(this.endPtsOfContours)
  //   // stream.setUint16(this.instructions.byteLength)
  //   // stream.setBytes(this.instructions)
  //   // stream.setBytes(this.flagBuffer)
  //   // stream.setBytes(this.xCoordinates)
  //   // stream.setBytes(this.yCoordinates)
  // }
}
class CompositeGlyf extends Glyf {
  decode(stream: DataStream, numberOfContours: number) {
    // needed?
  }
  scanRemaningGlyfData(stream: DataStream, numberOfContours: number) {
    // todo
  }
}