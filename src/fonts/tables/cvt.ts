/*
  
  ## 'cvt' Control Value Table
  
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6head.html)
  

*/

import { DataStream, Int16View } from 'fonts/DataStream'

import { Table } from 'fonts/tables/Table'

export class TableCvt extends Table {
  static tableName: string = 'cvt '
  public controlValues: Int16View
  decode(stream: DataStream, byteLength: number) {
    this.controlValues = stream.getTypedView(byteLength / 2, Int16View)
  }
  // encode(stream: DataStream) {
  //   stream.setBytes(this.controlValues)
  // }
}

