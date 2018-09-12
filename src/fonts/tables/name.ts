/*
  
  ## 'name' Naming Table
  
  [msf](https://docs.microsoft.com/en-us/typography/opentype/spec/name)
  [osx](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6name.html)

*/

import { DataStream } from 'fonts/DataStream'

import { Table } from 'fonts/tables/Table'
import { nameTableNames, macLanguages, macLanguageToScript, windowsLanguages, utf16, macScriptEncodings, macLanguageEncodings } from 'fonts/tables/nameConstants'

const getLanguageCode = (platformID: number, languageID: number, ltag?: any) => {
  switch (platformID) {
    case 0:  // Unicode
      if (languageID === 0xFFFF) {
        return 'und';
      } else if (ltag) {
        return ltag[languageID];
      }
      break;
    case 1:  // Macintosh
      return macLanguages[languageID];
    case 3:  // Windows
      return windowsLanguages[languageID];
  }

  return undefined;
}
const getEncoding = (platformID: number, encodingID: number, languageID: number) => {
  switch (platformID) {
    case 0:  // Unicode
      return utf16;
    case 1:  // Apple Macintosh
      return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];
    case 3:  // Microsoft Windows
      if (encodingID === 1 || encodingID === 10) {
        return utf16;
      }
      break;
  }
  return undefined;
}


export class TableName extends Table {
  static tableName: string = 'name'
  private stream: DataStream
  public propertyIndex: { [index: string]: {
    offset: number,
    byteLength: number,
    language: string,
    encoding: string,
  } } = {}
  decode(stream: DataStream, _byteLength: number, directory: any) {
    this.stream = stream
    const offsetStart = stream.offset
    const format = stream.getUint16();
    const count = stream.getUint16();
    const stringOffsetStart = offsetStart + stream.getUint16();
    for (let i = 0; i < count; i++) {
      const platformID = stream.getUint16();
      const encodingID = stream.getUint16();
      const languageID = stream.getUint16();
      const nameID = stream.getUint16();
      const property = nameTableNames[nameID] || nameID;
      const byteLength = stream.getUint16();
      const offset = stream.getUint16() + stringOffsetStart;
      const language = getLanguageCode(platformID, languageID, directory.ltag)
      const encoding = getEncoding(platformID, encodingID, languageID);
      const existingLanguage = this.propertyIndex[property] ? this.propertyIndex[property].language : ''
      if (encoding !== undefined && language !== undefined) {
        if (language === 'en' || existingLanguage.slice(2) !== 'en') {
          this.propertyIndex[property] = {
            offset,
            byteLength,
            language,
            encoding
          }
        }
      }
    }
    // TODO: Microsoft's 'name' table format 1...  
  }
  encode(stream: DataStream) {
    throw new Error('Encoding name table not supported')
  }
  get(propertyName: string) {
    const property = this.propertyIndex[propertyName]
    this.stream.offset = property.offset
    return this.stream.getString(property.byteLength, property.encoding === utf16 ? 'utf16be' : 'ascii')
  }
  getNames(): string[] {
    return Object.keys(this.propertyIndex)
  }
}

