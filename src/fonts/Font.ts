import { DataStream } from 'fonts/DataStream';
import { Table } from 'fonts/tables/Table';
import { Directory } from 'fonts/tables/Directory';
import { cmap, head, hhea, hmtx, maxp, name, fpgm, loca, prep, cvt, glyf, post, OS2 } from 'fonts/tables'

export abstract class Font {
  private subset: number[] = [0]
  private subsetIndex: {[index: number] :number} = [0]
  protected directory: Directory
  public head: head
  public name: name
  public hhea: hhea
  public maxp: maxp
  public post: post
  public cmap: cmap
  public hmtx: hmtx
  public fpgm: fpgm
  public loca: loca
  public prep: prep
  public cvt: cvt
  public glyf: glyf
  public os2: OS2
  constructor(data: Uint8Array) {
    this.directory = Directory.decode(new DataStream(data))
    this.getRequiredTables()
  }
  private getRequiredTables() {
    this.head = <head>this.directory.decodeTable(head)
    this.name = <name>this.directory.decodeTable(name)
    this.hhea = <hhea>this.directory.decodeTable(hhea)
    this.maxp = <maxp>this.directory.decodeTable(maxp)
    this.post = <post>this.directory.decodeTable(post)
    this.cmap = <cmap>this.directory.decodeTable(cmap)
    this.hmtx = <hmtx>this.directory.decodeTable(hmtx)
    this.fpgm = <fpgm>this.directory.decodeTable(fpgm)
    this.loca = <loca>this.directory.decodeTable(loca)
    this.prep = <prep>this.directory.decodeTable(prep)
    this.cvt = <cvt>this.directory.decodeTable(cvt)
    this.glyf = <glyf>this.directory.decodeTable(glyf)
    this.os2 = <OS2>this.directory.decodeTable(OS2)
  }
  abstract encode(): Uint8Array
  protected doEncode(tables: Table[]) {
    const stream = new DataStream()
    this.directory.encode(stream, tables, this.subset)
    return stream.getBytes()
  }
  useGlyf(id: number): number {
    return this.subsetIndex[id] || (this.subsetIndex[id] = this.subset.push(id) -1)
  }
}
