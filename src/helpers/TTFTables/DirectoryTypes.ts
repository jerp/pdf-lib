
import { Table } from 'helpers/TTFTables/Table'
// required tables
import { TableHead } from 'helpers/TTFTables/head'
import { TableName } from 'helpers/TTFTables/name'
import { TableHhea } from 'helpers/TTFTables/hhea'
import { TableMaxp } from 'helpers/TTFTables/maxp'
import { TablePost } from 'helpers/TTFTables/post'
import { TableCmap } from 'helpers/TTFTables/cmap'
import { TableHmtx } from 'helpers/TTFTables/hmtx'
import { TableOS2 } from 'helpers/TTFTables/os2'
// optional tables
import { TableLoca } from 'helpers/TTFTables/loca'
import { TableGlyf } from 'helpers/TTFTables/glyf'
export type directory = {
  head: TableHead
  hhea: TableHhea
  maxp: TableMaxp
  hmtx: TableHmtx
  fpgm: Table
  loca: TableLoca
  cvt: Table
  glyf: TableGlyf
  prep: Table
  name: TableName
  post: TablePost
  cmap: TableCmap
  os2: TableOS2
}

export { TableHead, TableName, TableHhea, TableMaxp, TablePost, TableCmap, TableHmtx, TableOS2, TableLoca, TableGlyf }