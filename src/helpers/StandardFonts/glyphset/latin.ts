import { GlyphSet, glyphSetOptions, glyphList, GlyphMap, widths } from 'helpers/StandardFonts/glyphset/glyphset'
import { aglfn } from 'helpers/StandardFonts/glyphset/aglfn'

export type encodingScheme = (0|1|2|3)

export class LatinGlyphSet extends GlyphSet {
  static StandardEncoding: encodingScheme = 0
  static MacRomanEncoding: encodingScheme = 1
  static WinAnsiEncoding: encodingScheme = 2
  static PDFDocEncoding: encodingScheme = 3

  constructor(widths: widths, encodingScheme: encodingScheme, opts: glyphSetOptions = {aliases: aliases[encodingScheme] } ) {
    super(glyphMap, widths, charsets[encodingScheme], opts)
  }
}

const glyphList: glyphList = ([
  ['·', '.notdef']
] as glyphList)
.concat(aglfn)
.concat([
  ["ﬁ", "fi"],
  ["ﬂ", "fl"],
  ["¹", "onesuperior"],
  ["³", "threesuperior",],
  ["²", "twosuperior"],
  ["Ģ", "Gcommaaccent"],
  ["ģ", "gcommaaccent"],
  ["Ķ", "Kcommaaccent"],
  ["ķ", "kcommaaccent"],
  ["Ļ", "Lcommaaccent"],
  ["ļ", "lcommaaccent"],
  ["Ņ", "Ncommaaccent"],
  ["ņ", "ncommaaccent"],
  ["Ŗ", "Rcommaaccent"],
  ["ŗ", "rcommaaccent"],
  ["Ţ", "Tcommaaccent"],
  ["ţ", "tcommaaccent"],
  ["Ș", "Scommaaccent"],
  ["ș", "scommaaccent"],
  ["", "commaaccent"],
])

const glyphMap = new GlyphMap(glyphList)

const ascii = '\x00������������������������������� !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}(~)�'
const asciiStd = ascii.replace("'", '’')

const charsets = [
  // std
  asciiStd + '���������������������������������¡¢£⁄¥ƒ§¤\'“«‹›ﬁﬂ�–†‡·�¶•‚„”»…‰�¿�`´ˆ˜¯˘˙¨�˚¸�˝˛ˇ—����������������Æ�ª����ŁØŒº�����æ���ı��łøœß����',
  // mac
  ascii + 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨�ÆØ�±��¥µ�����ªº�æø¿¡¬�ƒ��«»…�ÀÃÕŒœ–—“”‘’÷�ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  // win
  ascii + '€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ�¡¢£¤¥¦§¨©ª«¬�®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
  // pdf
  ascii + '•†‡…—–ƒ⁄‹›−‰„“”‘’‚™ﬁﬂŁŒŠŸŽıłœšž�€¡¢£¤¥¦§¨©ª«¬�®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
]

// these chars when encoding a sequence will mapped to other code that are in the charset
const aliases: glyphSetOptions['aliases'][] = [
  [],
  [
    // 0o312 -> space - see PDF specs page 656 foot note 6
    '\xca ',
  ],
  [
    // bullets - see PDF specs page 656 foot note 3
    '\x81·', '\x8d·', '\x8f·', '\x90·', '\x9d·',
    // hyphen - see PDF specs page 656 foot note 5
    '\xad-',
    // 0o240 -> space - see PDF specs page 656 foot note 6
    '\xa0 ',
  ],
  [],
]

// type encodingEntry = [string, string, number?, number?, number?, number?]
// type encodingMap = encodingEntry[]
//
// /** @hidden */
// export const latinCodeMap: encodingMap = latinCodeMap = [
//   // PDF Specification 1.7 - p 653-656
//   // unic, name           ,std  ,mac,  win  , pdf
//   ['A','A'             ,0o101,0o101,0o101,0o101],  ['Œ','OE'            ,0o352,0o316,0o214,0o226], // u0041 u0152
//   ['Æ','AE'            ,0o341,0o256,0o306,0o306],  ['Ó','Oacute'        ,     ,0o356,0o323,0o323], // u00c6 u00d3
//   ['Á','Aacute'        ,     ,0o347,0o301,0o301],  ['Ô','Ocircumflex'   ,     ,0o357,0o324,0o324], // u00c1 u00d4
//   ['Â','Acircumflex'   ,     ,0o345,0o302,0o302],  ['Ö','Odieresis'     ,     ,0o205,0o326,0o326], // u00c2 u00d6
//   ['Ä','Adieresis'     ,     ,0o200,0o304,0o304],  ['Ò','Ograve'        ,     ,0o361,0o322,0o322], // u00c4 u00d2
//   ['À','Agrave'        ,     ,0o313,0o300,0o300],  ['Ø','Oslash'        ,0o351,0o257,0o330,0o330], // u00c0 u00d8
//   ['Å','Aring'         ,     ,0o201,0o305,0o305],  ['Õ','Otilde'        ,     ,0o315,0o325,0o325], // u00c5 u00d5
//   ['Ã','Atilde'        ,     ,0o314,0o303,0o303],  ['P','P'             ,0o120,0o120,0o120,0o120], // u00c3 u0050
//   ['B','B'             ,0o102,0o102,0o102,0o102],  ['Q','Q'             ,0o121,0o121,0o121,0o121], // u0042 u0051
//   ['C','C'             ,0o103,0o103,0o103,0o103],  ['R','R'             ,0o122,0o122,0o122,0o122], // u0043 u0052
//   ['Ç','Ccedilla'      ,     ,0o202,0o307,0o307],  ['S','S'             ,0o123,0o123,0o123,0o123], // u00c7 u0053
//   ['D','D'             ,0o104,0o104,0o104,0o104],  ['Š','Scaron'        ,     ,     ,0o212,0o227], // u0044 u0160
//   ['E','E'             ,0o105,0o105,0o105,0o105],  ['T','T'             ,0o124,0o124,0o124,0o124], // u0045 u0054
//   ['É','Eacute'        ,     ,0o203,0o311,0o311],  ['Þ','Thorn'         ,     ,     ,0o336,0o336], // u00c9 u00de
//   ['Ê','Ecircumflex'   ,     ,0o346,0o312,0o312],  ['U','U'             ,0o125,0o125,0o125,0o125], // u00ca u0055
//   ['Ë','Edieresis'     ,     ,0o350,0o313,0o313],  ['Ú','Uacute'        ,     ,0o362,0o332,0o332], // u00cb u00da
//   ['È','Egrave'        ,     ,0o351,0o310,0o310],  ['Û','Ucircumflex'   ,     ,0o363,0o333,0o333], // u00c8 u00db
//   ['Ð','Eth'           ,     ,     ,0o320,0o320],  ['Ü','Udieresis'     ,     ,0o206,0o334,0o334], // u00d0 u00dc
//   ['€','Euro'          ,     ,     ,0o200,0o240],  ['Ù','Ugrave'        ,     ,0o364,0o331,0o331], // u20ac u00d9
//   ['F','F'             ,0o106,0o106,0o106,0o106],  ['V','V'             ,0o126,0o126,0o126,0o126], // u0046 u0056
//   ['G','G'             ,0o107,0o107,0o107,0o107],  ['W','W'             ,0o127,0o127,0o127,0o127], // u0047 u0057
//   ['H','H'             ,0o110,0o110,0o110,0o110],  ['X','X'             ,0o130,0o130,0o130,0o130], // u0048 u0058
//   ['I','I'             ,0o111,0o111,0o111,0o111],  ['Y','Y'             ,0o131,0o131,0o131,0o131], // u0049 u0059
//   ['Í','Iacute'        ,     ,0o352,0o315,0o315],  ['Ý','Yacute'        ,     ,     ,0o335,0o335], // u00cd u00dd
//   ['Î','Icircumflex'   ,     ,0o353,0o316,0o316],  ['Ÿ','Ydieresis'     ,     ,0o331,0o237,0o230], // u00ce u0178
//   ['Ï','Idieresis'     ,     ,0o354,0o317,0o317],  ['Z','Z'             ,0o132,0o132,0o132,0o132], // u00cf u005a
//   ['Ì','Igrave'        ,     ,0o355,0o314,0o314],  ['Ž','Zcaron'        ,     ,     ,0o216,0o231], // u00cc u017d
//   ['J','J'             ,0o112,0o112,0o112,0o112],  ['a','a'             ,0o141,0o141,0o141,0o141], // u004a u0061
//   ['K','K'             ,0o113,0o113,0o113,0o113],  ['á','aacute'        ,     ,0o207,0o341,0o341], // u004b u00e1
//   ['L','L'             ,0o114,0o114,0o114,0o114],  ['â','acircumflex'   ,     ,0o211,0o342,0o342], // u004c u00e2
//   ['Ł','Lslash'        ,0o350,     ,     ,0o225],  ['´','acute'         ,0o302,0o253,0o264,0o264], // u0141 u00b4
//   ['M','M'             ,0o115,0o115,0o115,0o115],  ['ä','adieresis'     ,     ,0o212,0o344,0o344], // u004d u00e4
//   ['N','N'             ,0o116,0o116,0o116,0o116],  ['æ','ae'            ,0o361,0o276,0o346,0o346], // u004e u00e6
//   ['Ñ','Ntilde'        ,     ,0o204,0o321,0o321],  ['à','agrave'        ,     ,0o210,0o340,0o340], // u00d1 u00e0
//   ['O','O'             ,0o117,0o117,0o117,0o117],  ['&','ampersand'     ,0o046,0o046,0o046,0o046], // u004f u0026
//   ['å','aring'         ,     ,0o214,0o345,0o345],  ['ê','ecircumflex'   ,     ,0o220,0o352,0o352], // u00e5 u00ea
//   ['^','asciicircum'   ,0o136,0o136,0o136,0o136],  ['ë','edieresis'     ,     ,0o221,0o353,0o353], // u005e u00eb
//   ['~','asciitilde'    ,0o176,0o176,0o176,0o176],  ['è','egrave'        ,     ,0o217,0o350,0o350], // u007e u00e8
//   ['*','asterisk'      ,0o052,0o052,0o052,0o052],  ['8','eight'         ,0o070,0o070,0o070,0o070], // u002a u0038
//   ['@','at'            ,0o100,0o100,0o100,0o100],  ['…','ellipsis'      ,0o274,0o311,0o205,0o203], // u0040 u2026
//   ['ã','atilde'        ,     ,0o213,0o343,0o343],  ['—','emdash'        ,0o320,0o321,0o227,0o204], // u00e3 u2014
//   ['b','b'             ,0o142,0o142,0o142,0o142],  ['–','endash'        ,0o261,0o320,0o226,0o205], // u0062 u2013
//   ['\\','backslash'    ,0o134,0o134,0o134,0o134],  ['=','equal'         ,0o075,0o075,0o075,0o075], // u005c u003d
//   ['|','bar'           ,0o174,0o174,0o174,0o174],  ['ð','eth'           ,     ,     ,0o360,0o360], // u007c u00f0
//   ['{','braceleft'     ,0o173,0o173,0o173,0o173],  ['!','exclam'        ,0o041,0o041,0o041,0o041], // u007b u0021
//   ['}','braceright'    ,0o175,0o175,0o175,0o175],  ['¡','exclamdown'    ,0o241,0o301,0o241,0o241], // u007d u00a1
//   ['[','bracketleft'   ,0o133,0o133,0o133,0o133],  ['f','f'             ,0o146,0o146,0o146,0o146], // u005b u0066
//   [']','bracketright'  ,0o135,0o135,0o135,0o135],  ['ﬁ','fi'            ,0o256,0o336,     ,0o223], // u005d ufb01
//   ['˘','breve'         ,0o306,0o371,     ,0o030],  ['5','five'          ,0o065,0o065,0o065,0o065], // u02d8 u0035
//   ['¦','brokenbar'     ,     ,     ,0o246,0o246],  ['ﬂ','fl'            ,0o257,0o337,     ,0o224], // u00a6 ufb02
//   ['•','bullet'        ,0o267,0o245,0o225,0o200],  ['ƒ','florin'        ,0o246,0o304,0o203,0o206], // u2022 u0192
//   ['c','c'             ,0o143,0o143,0o143,0o143],  ['4','four'          ,0o064,0o064,0o064,0o064], // u0063 u0034
//   ['ˇ','caron'         ,0o317,0o377,     ,0o031],  ['⁄','fraction'      ,0o244,0o332,     ,0o207], // u02c7 u2044
//   ['ç','ccedilla'      ,     ,0o215,0o347,0o347],  ['g','g'             ,0o147,0o147,0o147,0o147], // u00e7 u0067
//   ['¸','cedilla'       ,0o313,0o374,0o270,0o270],  ['ß','germandbls'    ,0o373,0o247,0o337,0o337], // u00b8 u00df
//   ['¢','cent'          ,0o242,0o242,0o242,0o242],  ['`','grave'         ,0o301,0o140,0o140,0o140], // u00a2 u0060
//   ['ˆ','circumflex'    ,0o303,0o366,0o210,0o032],  ['>','greater'       ,0o076,0o076,0o076,0o076], // u02c6 u003e
//   [':','colon'         ,0o072,0o072,0o072,0o072],  ['«','guillemotleft' ,0o253,0o307,0o253,0o253], // u003a u00ab
//   [',','comma'         ,0o054,0o054,0o054,0o054],  ['»','guillemotright',0o273,0o310,0o273,0o273], // u002c u00bb
//   ['©','copyright'     ,     ,0o251,0o251,0o251],  ['‹','guilsinglleft' ,0o254,0o334,0o213,0o210], // u00a9 u2039
//   ['¤','currency'      ,0o250,0o333,0o244,0o244],  ['›','guilsinglright',0o255,0o335,0o233,0o211], // u00a4 u203a
//   ['d','d'             ,0o144,0o144,0o144,0o144],  ['h','h'             ,0o150,0o150,0o150,0o150], // u0064 u0068
//   ['†','dagger'        ,0o262,0o240,0o206,0o201],  ['˝','hungarumlaut'  ,0o315,0o375,     ,0o034], // u2020 u02dd
//   ['‡','daggerdbl'     ,0o263,0o340,0o207,0o202],  ['-','hyphen'        ,0o055,0o055,0o055,0o055], // u2021 u002d
//   ['°','degree'        ,     ,0o241,0o260,0o260],  ['i','i'             ,0o151,0o151,0o151,0o151], // u00b0 u0069
//   ['¨','dieresis'      ,0o310,0o254,0o250,0o250],  ['í','iacute'        ,     ,0o222,0o355,0o355], // u00a8 u00ed
//   ['÷','divide'        ,     ,0o326,0o367,0o367],  ['î','icircumflex'   ,     ,0o224,0o356,0o356], // u00f7 u00ee
//   ['$','dollar'        ,0o044,0o044,0o044,0o044],  ['ï','idieresis'     ,     ,0o225,0o357,0o357], // u0024 u00ef
//   ['˙','dotaccent'     ,0o307,0o372,     ,0o033],  ['ì','igrave'        ,     ,0o223,0o354,0o354], // u02d9 u00ec
//   ['ı','dotlessi'      ,0o365,0o365,     ,0o232],  ['j','j'             ,0o152,0o152,0o152,0o152], // u0131 u006a
//   ['e','e'             ,0o145,0o145,0o145,0o145],  ['k','k'             ,0o153,0o153,0o153,0o153], // u0065 u006b
//   ['é','eacute'        ,     ,0o216,0o351,0o351],  ['l','l'             ,0o154,0o154,0o154,0o154], // u00e9 u006c
//   ['<','less'          ,0o074,0o074,0o074,0o074],  ['q','q'             ,0o161,0o161,0o161,0o161], // u003c u0071
//   ['¬','logicalnot'    ,     ,0o302,0o254,0o254],  ['?','question'      ,0o077,0o077,0o077,0o077], // u00ac u003f
//   ['ł','lslash'        ,0o370,     ,     ,0o233],  ['¿','questiondown'  ,0o277,0o300,0o277,0o277], // u0142 u00bf
//   ['m','m'             ,0o155,0o155,0o155,0o155],  ['"','quotedbl'      ,0o042,0o042,0o042,0o042], // u006d u0022
//   ['¯','macron'        ,0o305,0o370,0o257,0o257],  ['„','quotedblbase'  ,0o271,0o343,0o204,0o214], // u00af u201e
//   ['−','minus'         ,     ,     ,     ,0o212],  ['“','quotedblleft'  ,0o252,0o322,0o223,0o215], // u2212 u201c
//   ['µ','mu'            ,     ,0o265,0o265,0o265],  ['”','quotedblright' ,0o272,0o323,0o224,0o216], // u00b5 u201d
//   ['×','multiply'      ,     ,     ,0o327,0o327],  ['‘','quoteleft'     ,0o140,0o324,0o221,0o217], // u00d7 u2018
//   ['n','n'             ,0o156,0o156,0o156,0o156],  ['’','quoteright'    ,0o047,0o325,0o222,0o220], // u006e u2019
//   ['9','nine'          ,0o071,0o071,0o071,0o071],  ['‚','quotesinglbase',0o270,0o342,0o202,0o221], // u0039 u201a
//   ['ñ','ntilde'        ,     ,0o226,0o361,0o361],  ["'",'quotesingle'   ,0o251,0o047,0o047,0o047], // u00f1 u0027
//   ['#','numbersign'    ,0o043,0o043,0o043,0o043],  ['r','r'             ,0o162,0o162,0o162,0o162], // u0023 u0072
//   ['o','o'             ,0o157,0o157,0o157,0o157],  ['®','registered'    ,     ,0o250,0o256,0o256], // u006f u00ae
//   ['ó','oacute'        ,     ,0o227,0o363,0o363],  ['˚','ring'          ,0o312,0o373,     ,0o036], // u00f3 u02da
//   ['ô','ocircumflex'   ,     ,0o231,0o364,0o364],  ['s','s'             ,0o163,0o163,0o163,0o163], // u00f4 u0073
//   ['ö','odieresis'     ,     ,0o232,0o366,0o366],  ['š','scaron'        ,     ,     ,0o232,0o235], // u00f6 u0161
//   ['œ','oe'            ,0o372,0o317,0o234,0o234],  ['§','section'       ,0o247,0o244,0o247,0o247], // u0153 u00a7
//   ['˛','ogonek'   ,0o316,0o376,     ,0o035],  [';','semicolon'     ,0o073,0o073,0o073,0o073], // u0731 u003b
//   ['ò','ograve'        ,     ,0o230,0o362,0o362],  ['7','seven'         ,0o067,0o067,0o067,0o067], // u00f2 u0037
//   ['1','one'           ,0o061,0o061,0o061,0o061],  ['6','six'           ,0o066,0o066,0o066,0o066], // u0031 u0036
//   ['½','onehalf'       ,     ,     ,0o275,0o275],  ['/','slash'         ,0o057,0o057,0o057,0o057], // u00bd u002f
//   ['¼','onequarter'    ,     ,     ,0o274,0o274],  [' ','space'         ,0o040,0o040,0o040,0o040], // u00bc u0020
//   ['¹','onesuperior'   ,     ,     ,0o271,0o271],  ['£','sterling'      ,0o243,0o243,0o243,0o243], // u00b9 u00a3
//   ['ª','ordfeminine'   ,0o343,0o273,0o252,0o252],  ['t','t'             ,0o164,0o164,0o164,0o164], // u00aa u0074
//   ['º','ordmasculine'  ,0o353,0o274,0o272,0o272],  ['þ','thorn'         ,     ,     ,0o376,0o376], // u00ba u00fe
//   ['ø','oslash'        ,0o371,0o277,0o370,0o370],  ['3','three'         ,0o063,0o063,0o063,0o063], // u00f8 u0033
//   ['õ','otilde'        ,     ,0o233,0o365,0o365],  ['¾','threequarters' ,     ,     ,0o276,0o276], // u00f5 u00be
//   ['p','p'             ,0o160,0o160,0o160,0o160],  ['³','threesuperior' ,     ,     ,0o263,0o263], // u0070 u00b3
//   ['¶','paragraph'     ,0o266,0o246,0o266,0o266],  ['˜','tilde'         ,0o304,0o367,0o230,0o037], // u00b6 u02dc
//   ['(','parenleft'     ,0o050,0o050,0o050,0o050],  ['™','trademark'     ,     ,0o252,0o231,0o222], // u0028 u2122
//   [')','parenright'    ,0o051,0o051,0o051,0o051],  ['2','two'           ,0o062,0o062,0o062,0o062], // u0029 u0032
//   ['%','percent'       ,0o045,0o045,0o045,0o045],  ['²','twosuperior'   ,     ,     ,0o262,0o262], // u0025 u00b2
//   ['.','period'        ,0o056,0o056,0o056,0o056],  ['u','u'             ,0o165,0o165,0o165,0o165], // u002e u0075
//   ['·','periodcentered',0o264,0o341,0o267,0o267],  ['ú','uacute'        ,     ,0o234,0o372,0o372], // u00b7 u00fa
//   ['‰','perthousand'   ,0o275,0o344,0o211,0o213],  ['û','ucircumflex'   ,     ,0o236,0o373,0o373], // u2030 u00fb
//   ['+','plus'          ,0o053,0o053,0o053,0o053],  ['ü','udieresis'     ,     ,0o237,0o374,0o374], // u002b u00fc
//   ['±','plusminus'     ,     ,0o261,0o261,0o261],  ['ù','ugrave'        ,     ,0o235,0o371,0o371], // u00b1 u00f9
//   ['_','underscore'    ,0o137,0o137,0o137,0o137],  ['ÿ','ydieresis'     ,     ,0o330,0o377,0o377], // u005f u00ff
//   ['v','v'             ,0o166,0o166,0o166,0o166],  ['¥','yen'           ,0o245,0o264,0o245,0o245], // u0076 u00a5
//   ['w','w'             ,0o167,0o167,0o167,0o167],  ['z','z'             ,0o172,0o172,0o172,0o172], // u0077 u007a
//   ['x','x'             ,0o170,0o170,0o170,0o170],  ['ž','zcaron'        ,     ,     ,0o236,0o236], // u0078 u017e
//   ['y','y'             ,0o171,0o171,0o171,0o171],  ['0','zero'          ,0o060,0o060,0o060,0o060], // u0079 u0030
//   ['ý','yacute'        ,     ,     ,0o375,0o375 ], // u00fd
//   // not in std, mac, win or pdf but in Standard Font
//   ['Ā','Amacron'], ['ā','amacron'],['Ă','Abreve'], ['ă','abreve'], ['Ą','Aogonek'], ['ą','aogonek'],
//   ['Ć','Cacute'], ['ć','cacute'], ['Č','Ccaron'], ['č','ccaron'],
//   ['Ď','Dcaron'], ['ď','dcaron'], ['Đ','Dcroat'], ['đ','dcroat'],
//   ['Ē','Emacron'], ['ē','emacron'], ['Ė','Edotaccent'], ['ė','edotaccent'], ['Ę','Eogonek'], ['ę','eogonek'], ['Ě','Ecaron'], ['ě','ecaron'],
//   ['Ğ','Gbreve'], ['ğ','gbreve'], ['Ģ','Gcommaaccent'], ['ģ','gcommaaccent'],
//   ['Ī','Imacron'], ['ī','imacron'], ['Į','Iogonek'], ['į','iogonek'], ['İ','Idotaccent'],
//   ['Ķ','Kcommaaccent'], ['ķ','kcommaaccent'],
//   ['Ĺ','Lacute'], ['ĺ','lacute'], ['Ļ','Lcommaaccent'], ['ļ','lcommaaccent'], ['Ľ','Lcaron'], ['ľ','lcaron'],
//   ['Ń','Nacute'], ['ń','nacute'], ['Ņ','Ncommaaccent'], ['ņ','ncommaaccent'], ['Ň','Ncaron'], ['ň','ncaron'],
//   ['Ō','Omacron'], ['ō','omacron'], ['Ő','Ohungarumlaut'], ['ő','ohungarumlaut'],
//   ['Ŕ','Racute'], ['ŕ','racute'], ['Ŗ','Rcommaaccent'], ['ŗ','rcommaaccent'], ['Ř','Rcaron'], ['ř','rcaron'],
//   ['Ś','Sacute'], ['ś','sacute'], ['Ş','Scedilla'], ['ş','scedilla'],
//   ['Ţ','Tcommaaccent'], ['ţ','tcommaaccent'], ['Ť','Tcaron'], ['ť','tcaron'],
//   ['Ū','Umacron'], ['ū','umacron'], ['Ů','Uring'], ['ů','uring'], ['Ű','Uhungarumlaut'], ['ű','uhungarumlaut'], ['Ų','Uogonek'], ['ų','uogonek'],
//   ['Ź','Zacute'], ['ź','zacute'], ['Ż','Zdotaccent'], ['ż','zdotaccent'],
//   ['Ș','Scommaaccent'], ['ș','scommaaccent'],
//   ['∂','partialdiff'], ['∆','Delta'], ['∑','summation'], ['√','radical'], ['≠','notequal'], ['≤','lessequal'], ['≥','greaterequal'], ['◊','lozenge'],
//   ['','commaaccent'],
// ]

// const glyphsNotInAglgn = [
//   ["ﬁ", "fi"],
//   ["ﬂ", "fl"],
//   ["¹", "onesuperior"],
//   ["³", "threesuperior",],
//   ["²", "twosuperior"],
//   ["Ģ", "Gcommaaccent"],
//   ["ģ", "gcommaaccent"],
//   ["Ķ", "Kcommaaccent"],
//   ["ķ", "kcommaaccent"],
//   ["Ļ", "Lcommaaccent"],
//   ["ļ", "lcommaaccent"],
//   ["Ņ", "Ncommaaccent"],
//   ["ņ", "ncommaaccent"],
//   ["Ŗ", "Rcommaaccent"],
//   ["ŗ", "rcommaaccent"],
//   ["Ţ", "Tcommaaccent"],
//   ["ţ", "tcommaaccent"],
//   ["Ș", "Scommaaccent"],
//   ["ș", "scommaaccent"],
//   ["", "commaaccent"],
// ]

/** Non ASCII chars per languages, for now, just EU languages */
export const latinLanguagesCharMaps = {
  ces: 'ÁáČčĎďÉéĚěÍíŇňÓóŘřŠšŤťÚúŮůÝýŽž', // Czech
  dan: 'ÁáÅåǺǻÆæǼǽÉéÍíÓóØøǾǿÚúÝý', // Danish !!missing!! ǺǻǼǽǾǿ
  deu: 'ÄäÖöẞßÜüÀàÉé', // German ẞ
  eng: 'ÆæÇçÏïÔôŒœÁáÈèÉéËëÊêÑñÖö', // English
  est: 'ÄäÕõÖöŠšÜüŽž', // Estonian
  fin: 'ÄäÅåÆæÖöÕõØøŠšÜüŽž', // Finnish
  fra: 'ÀàÂâÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜüŸÿÆæ', // French
  gle: 'ÀàÁáÈèÉéÌìÍíÒòÓóÚúÙù', // Irish
  hrv: 'ĆćČčĐđŠšŽž', // Croatian
  hun: 'ÁáÉéÍíÓóÖöŐőÚúÜüŰű', // Hungarian
  isl: 'ÁáÆæÐðÉéÍíÓóÖöÞþÚúÝýǼǽǾǿ', // Icelandic !!missing!! ǼǽǾǿ
  ita: 'ÀàÈèÉéÌìÒòÓóÙùÁáÍíÎîÏïÚú', // Italian
  lav: 'ĀāČčĒēĢģĪīĶķĻļŅņŠšŪūŽžŌōŖŗ', // Latvian
  lit: 'ĄąČčĘęĖėĮįŠšŲųŪūŽž', // Lithuanian
  mlt: 'ÀàÁáÂâĊċÈèÉéÊêĠġĦħÌìÍíÎîÒòÓóÔôÙùÚúÛûŻż', // Maltese !!missing!! ĊċĠġĦħ
  nld: 'ÁáÂâÄäÈèÉéÊêËëÍíÏïÓóÔôÖöÚúÛûÜüĲĳ', // Dutch !!missing!! Ĳĳ
  mol: 'ÂâĂăÎîȘșȚț', // Moldovan !!missing!! ȘșȚț
  nor: 'ÆæØøÅåÀàÉéÊêÓóÒòÔôÄäÖöÜü', // Norwegian
  pol: 'ĄąĆćĘęŁłŃńÓóŚśŹźŻż', // Polish
  por: 'ÀàÁáÂâÃãÇçÉéÊêÍíÓóÔôÕõÚúÜüÈèÒò', // Portuguese
  ron: 'ÂâĂăÎîȘșȚț', // Romanian !!missing!! ȘșȚț
  slk: 'ÁáÄäČčĎďÉéÍíĹĺĽľŇňÓóÔôŔŕŠšŤťÚúÝýŽž', // Slovak
  slv: 'ČčŠšŽžĆćĐđÄäÖöÜü', // Slovenian
  spa: 'ÁáÉéÍíÑñÓóÚúÜü', // Spanish
  swe: 'ÄäÅåÉéÖöÁáÀàËëÜü', // Swedish
  math: '∂∆∑√≠≤≥◊' // math symbol
}