/*
  
  ## 'name' Naming Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/name)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6name.html)

*/

import { Table } from 'helpers/TTFTables/Table'

const nameIds: {[index: string]: number} = {
  copyright: 0,
  fontFamily: 1,
  fontSubfamily: 2,
  uniqueID: 3,
  fullName: 4,
  version: 5,
  postScriptName: 6,
  trademark: 7,
  manufacturer: 8,
  designer: 9,
  description: 10,
  manufacturerURL: 11,
  designerURL: 12,
  license: 13,
  licenseURL: 14,
  reserved: 15,
  preferredFamily: 16,
  preferredSubfamily: 17,
  compatibleFullName: 18,
  sampleText: 19,
  postScriptFindFontName: 20,
  wwsFamily: 21,
  wwsSubfamily: 22,
}

const wEnglishCode: {[index: number]: number} = {
  0x0C09: 1, // 'en-AU',
  0x2809: 1, // 'en-BZ',
  0x1009: 1, // 'en-CA',
  0x2409: 1, // 'en-029',
  0x4009: 1, // 'en-IN',
  0x1809: 1, // 'en-IE',
  0x2009: 1, // 'en-JM',
  0x4409: 1, // 'en-MY',
  0x1409: 1, // 'en-NZ',
  0x3409: 1, // 'en-PH',
  0x4809: 1, // 'en-SG',
  0x1C09: 1, // 'en-ZA',
  0x2C09: 1, // 'en-TT',
  0x0809: 1, // 'en-GB',
  0x0409: 2, // 'en',
  0x3009: 1, // 'en-ZW',
}
// prefers english and Windows
const getPriority = (platformID: number, encodingID: number, languageID: number) => {
   return platformID == 0 ? 0 // Unicode
    : platformID == 1 ? (languageID === 0 ? 2 : 1) // Apple Macintosh
    : platformID == 3 && (encodingID === 1 || encodingID === 10) ? (wEnglishCode[languageID] || 0) // Windows
    : 0
}

export class TableName extends Table {
  private count: number
  private stringOffsetStart: number
  doDecode = () => {
    const stream = this.sourceStream
    // Support for ltag table needed? (unicode languages)
    // TODO: Microsoft's 'name' table format 1... only support for format 0
    this.count = stream.skip(2).getUint16(); // skipping format
    this.stringOffsetStart = stream.getUint16();
  }
  get(propertyName: string) {
    const nameId = nameIds[propertyName]
    if (nameId != null) return this.scanName(nameId)
  }
  // scan for the best encoding/language for this nameId
  private scanName(id: number): string | void {
    const stream = this.sourceStream.at(6)
    const found = {
      platformID: -1,
      encoding: 'ascii',
      priority: -1,
      byteLength: 0,
      offset: 0,
    }
    // scan all until prio 2 is found
    for (let i = 0; i < this.count; i++) {
      // should search for platform id 0 and 'en' or closest
      const platformID = stream.getUint16();
      const encodingID = stream.getUint16();
      const languageID = stream.getUint16();
      const priority = getPriority(platformID, encodingID, languageID)
      if (stream.getUint16() === id && priority > found.priority) {
        found.priority = priority
        found.platformID = platformID
        if (platformID == 0 || (platformID == 3 && (encodingID === 1 || encodingID === 10))) found.encoding = 'utf16be'
        found.byteLength = stream.getUint16()
        found.offset = stream.getUint16()
        if (priority === 2) break;
      } else {
        stream.skip(4)
      }
    }
    if (found.priority !== -1) {
      return stream.at(this.stringOffsetStart + found.offset).getString(found.byteLength, found.encoding )
    }
  }
  
}

