
import { Table } from 'fonts/tables/Table'
// required tables
import { TableHead } from 'fonts/tables/head'
import { TableName } from 'fonts/tables/name'
import { TableHhea } from 'fonts/tables/hhea'
import { TableMaxp } from 'fonts/tables/maxp'
import { TablePost } from 'fonts/tables/post'
import { TableCmap } from 'fonts/tables/cmap'
import { TableHmtx } from 'fonts/tables/hmtx'
import { TableOS2 } from 'fonts/tables/os2'
// optional tables
import { TableLoca } from 'fonts/tables/loca'
import { TableGlyf } from 'fonts/tables/glyf'
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