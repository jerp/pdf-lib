


// Required Tables of TrueType Font file
import { TableCmap } from './cmap'; // character to glyph mapping
import { TableHead } from './head'; // font header
import { TableHhea } from './hhea'; // horizontal header
import { TableHtmx } from './hmtx'; // horizontal metrics
import { TableLoca } from './loca'; // index to location
import { TableMaxp } from './maxp'; // maximum profile
import { TableName } from './name'; // naming
import { TableOS2 } from './OS2'; // OS/2
import { TablePost } from './post'; // PostScript
import { TableFpgm } from './fpgm'; // Font Program
import { TablePrep } from './prep';
import { TableCvt } from './cvt'; // control value
import { TableGlyf } from './glyf'; // glyph data

export {
  TableCmap as cmap,
  TableHead as head,
  TableHhea as hhea,
  TableHtmx as hmtx,
  TableMaxp as maxp,
  TableName as name,
  TableOS2 as OS2,
  TablePost as post,
  TableFpgm as fpgm,
  TableLoca as loca,
  TablePrep as prep,
  TableCvt as cvt,
  TableGlyf as glyf,
}
