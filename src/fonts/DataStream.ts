export class DataStream {
  private extendBy: number = 65536
  private view: DataView
  offset: number = 0
  private buffer: ArrayBuffer
  private data: Uint8Array

  constructor(dataOrLength?: number | Uint8Array) {
    if (dataOrLength instanceof Uint8Array) {
      this.extendBy = 0
      this.data = <Uint8Array>dataOrLength
      this.view = new DataView(this.data.buffer)
    } else if (typeof dataOrLength === 'number' || dataOrLength === undefined) {
      if (dataOrLength) this.extendBy = dataOrLength
      this.initBuffer(this.extendBy)
    } else {
      throw new Error('Invalid DataStream initialisation')
    }
  }
  private initBuffer(byteLength: number) {
    this.buffer = new ArrayBuffer(byteLength)
    this.data = new Uint8Array(this.buffer)
    this.view = new DataView(this.buffer)
  }
  private ensure(byteLength: number) {
    if ((this.offset + byteLength) > this.buffer.byteLength) {
      const currData = this.data
      // makes sure there is enough room for this and a bit more
      this.initBuffer(this.data.byteLength + this.extendBy + byteLength)
      this.data.set(currData, 0)
    }
  }
  // Uint8
  getUint8() {
    return this.view.getUint8(this.offset++)
  }
  setUint8(value: number) {
    this.ensure(1);
    this.view.setUint8(this.offset, value);
    this.offset += 1;
  }
  // Int8
  getInt8() {
    return this.view.getInt8(this.offset++)
  }
  setInt8(value: number) {
    this.ensure(1);
    this.view.setInt8(this.offset, value);
    this.offset += 1
  }
  // Uint16
  getUint16(littleEndian?: boolean) {
    const value = this.view.getUint16(this.offset, littleEndian)
    this.offset += 2
    return value
  }
  setUint16(value: number, littleEndian: boolean = false) {
    this.ensure(2);
    this.view.setUint16(this.offset, value, littleEndian);
    this.offset += 2
  }
  // Int16
  getInt16(littleEndian?: boolean) {
    const value = this.view.getInt16(this.offset, littleEndian)
    this.offset += 2
    return value
  }
  setInt16(value: number, littleEndian: boolean = false) {
    this.ensure(2);
    this.view.setInt16(this.offset, value, littleEndian);
    this.offset += 2
  }
  // Uint32
  getUint32(littleEndian?: boolean) {
    const value = this.view.getUint32(this.offset, littleEndian)
    this.offset += 4
    return value
  }
  setUint32(value: number, littleEndian: boolean = false) {
    this.ensure(4);
    this.view.setUint32(this.offset, value, littleEndian);
    this.offset += 4
  }
  // Int32
  getInt32(littleEndian?: boolean) {
    const value = this.view.getInt32(this.offset, littleEndian)
    this.offset += 4
    return value
  }
  setInt32(value: number, littleEndian: boolean = false) {
    this.ensure(4);
    this.view.setInt32(this.offset, value, littleEndian);
    this.offset += 4
  }
  // Int32 with fixed decimal
  getFixed32() {
    return this.getInt32() / 0x10000
  }
  setFixed32(value: number, littleEndian: boolean = false) {
    this.view.setInt32(this.offset, (value * 0x10000) | 0, littleEndian);
    this.offset += 4
  }
  // UInt24
  getUint24(littleEndian?: boolean) {
    const value = littleEndian ? this.getUint16(true) + (this.getUint8() << 16) : (this.getUint16() << 8) + this.getUint8()
    return value
  }
  setUint24(val: number, littleEndian: boolean = false) {
    this.ensure(3);
    this.view.setUint8(this.offset++, littleEndian ? val & 0xff : (val >>> 16) & 0xff);
    this.view.setUint8(this.offset++, (val >>> 8) & 0xff);
    this.view.setUint8(this.offset++, littleEndian ? (val >>> 16) & 0xff : val & 0xff);
  }
  // Int24
  getInt24(littleEndian?: boolean) {
    // const value = littleEndian ?  this.getInt16(true) + (this.getInt8() << 16) : (this.getInt16() << 8) + this.getInt8()
    // this.offset += 3
    const uInt24 = this.getUint24(littleEndian)
    return uInt24 < 0x800000 ? uInt24 : (uInt24 - 0xffffff -1)
  }
  setInt24(val: number, littleEndian: boolean = false) {
    if (val >= 0) {
      this.setUint24(val, littleEndian);
    } else {
      this.setUint24(val + 0xffffff + 1, littleEndian);
    }
  }
  // Float32
  getFloat32(littleEndian?: boolean) {
    const value = this.view.getFloat32(this.offset, littleEndian)
    this.offset += 4
    return value
  }
  setFloat32(value: number, littleEndian: boolean = false) {
    this.ensure(4);
    this.view.setFloat32(this.offset, value, littleEndian);
    this.offset += 4
  }
  // Float64
  getFloat64(littleEndian?: boolean) {
    const value = this.view.getFloat64(this.offset, littleEndian)
    this.offset += 8
    return value
  }
  setFloat64(value: number, littleEndian: boolean = false) {
    this.ensure(8);
    this.view.setFloat64(this.offset, value, littleEndian);
    this.offset += 8
  }
  getString(byteLength: number, encoding: string | void = 'ascii') {
    switch (encoding) {
      case 'utf16le': case 'ucs2':
        return this.getUtf16(byteLength, true);
      case 'utf8':
        return this.getUtf8(byteLength);
      case 'ascii':
        return this.getAscii(byteLength);
      case 'utf16be':
        return this.getUtf16(byteLength)
      default:
        // TODO: check whne this is required
        // require('iconv-lite')
        // ...
        throw new Error('Install iconv-lite to enable additional string decodings.');
    }
  }
  setString(string: string, encoding: string | void = 'ascii') {
    switch (encoding) {
      case 'utf16le': case 'ucs2':
        this.setUtf16(string, true)
        break;
      case 'utf8':
        this.setUtf8(string)
        break;
      case 'ascii':
        this.setAscii(string)
        break;
      case 'utf16be':
        this.setUtf16(string);
        break;
      default:
        // TODO: check whne this is required
        // require('iconv-lite')
        // ...
        throw new Error('Install iconv-lite to enable additional string encodings.');
    }
  }
  private getAscii(byteLength: number) {
    const chars: string[] = []
    const end = this.offset + byteLength
    for (let i = this.offset; i < end; ++i) {
      chars.push(String.fromCharCode(this.view.getUint8(i)))
    }
    this.offset += byteLength
    return chars.join('')
  }
  private setAscii(string: string) {
    const stringLength = string.length
    const buffer = new ArrayBuffer(stringLength)
    const array = new Uint8Array(buffer)
    for (let i = 0; i < stringLength; ++i) {
      array[i] = string.charCodeAt(i) & 0xFF
    }
    this.setBytes(array)
  }
  private getUtf16(byteLength: number, littleEndian?: boolean) {
    const chars: string[] = []
    const end = this.offset + byteLength
    for (let i = this.offset; i < end; i += 2) {
      chars.push(String.fromCharCode(this.view.getUint16(i, littleEndian)))
    }
    this.offset += byteLength
    return chars.join('')
  }
  private setUtf16(string: string, littleEndian: boolean = false) {
    const stringLength = string.length
    const buffer = new ArrayBuffer(stringLength * 2)
    const data = new DataView(buffer)
    for (let i = 0; i < stringLength; i++) {
      data.setUint16(i*2, string.charCodeAt(i), littleEndian)
    }
    this.setBytes(new Uint8Array(buffer))
  }
  private getUtf8(byteLength: number) {
    const chars: string[] = []
    let i = this.offset
    const end = this.offset + byteLength
    let c: number
    while (i < end) {
      c = this.view.getUint8(i++);
      if (c > 127) {
        if (c > 191 && c < 224) {
          if (i >= end)
            throw new Error('UTF-8 decode: incomplete 2-byte sequence');
          c = (c & 31) << 6 | this.view.getUint8(i++) & 63;
        } else if (c > 223 && c < 240) {
          if (i + 1 >= end)
            throw new Error('UTF-8 decode: incomplete 3-byte sequence');
          c = (c & 15) << 12 | (this.view.getUint8(i++) & 63) << 6 | this.view.getUint8(i++) & 63;
        } else if (c > 239 && c < 248) {
          if (i + 2 >= end)
            throw new Error('UTF-8 decode: incomplete 4-byte sequence');
          c = (c & 7) << 18 | (this.view.getUint8(i++) & 63) << 12 | (this.view.getUint8(i++) & 63) << 6 | this.view.getUint8(i++) & 63;
        } else throw new Error('UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1));
      }
      if (c <= 0xffff) chars.push(String.fromCharCode(c));
      else if (c <= 0x10ffff) {
        c -= 0x10000;
        chars.push(String.fromCharCode(c >> 10 | 0xd800))
        chars.push(String.fromCharCode(c & 0x3FF | 0xdc00))
      } else {
        throw new Error('UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach')
      };
    }
    this.offset += byteLength
    return chars.join('');
  }
  private setUtf8(string: string) {
    const stringLength = string.length;
    const buffer = new ArrayBuffer(stringLength * 4);
    const array = new Uint8Array(buffer);
    let offset = 0
    for (var ci = 0; ci != string.length; ci++) {
      var c = string.charCodeAt(ci);
      if (c < 128) {
        array[offset++] = c;
        continue;
      }
      if (c < 2048) {
        array[offset++] = c >> 6 | 192;
      } else {
        if (c > 0xd7ff && c < 0xdc00) {
          if (++ci >= string.length)
            throw new Error('UTF-8 encode: incomplete surrogate pair');
          var c2 = string.charCodeAt(ci);
          if (c2 < 0xdc00 || c2 > 0xdfff)
            throw new Error('UTF-8 encode: second surrogate character 0x' + c2.toString(16) + ' at index ' + ci + ' out of range');
          c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
          array[offset++] = c >> 18 | 240;
          array[offset++] = c >> 12 & 63 | 128;
        } else array[offset++] = c >> 12 | 224;
        array[offset++] = c >> 6 & 63 | 128;
      }
      array[offset++] = c & 63 | 128;
    }
    this.setBytes(array.subarray(0, offset))
  }
  // bytes
  getBytes(byteLength?: number) {
    return byteLength !== undefined ? this.data.subarray(this.offset, this.offset += byteLength) : this.data.subarray(0, this.offset)
  }
  setBytes(typedArray: (Uint16Array | Int16Array | Int8Array | Uint8Array | Uint32Array | Int32Array)) {
    const uInt8Array = typedArray instanceof Uint8Array ? typedArray : new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
    this.ensure(uInt8Array.byteLength)
    this.data.set(uInt8Array, this.offset)
    this.offset += uInt8Array.byteLength
  }
  // views
  setTypedView(length: number, viewClass: any, littleEndian?: boolean) {
    this.ensure(TypedView.byteLengthOf(viewClass, length))
    return this.getTypedView(length, viewClass, littleEndian)
  }
  getTypedView(length: number, viewClass: any, littleEndian?: boolean) {
    return new viewClass(this, length, littleEndian)
  }
  // getInt8View(length: number) {
  //   return this.getTypedView(length, Int8View)
  // }
  // getUint16View(length: number, littleEndian?: boolean) {
  //   return this.getTypedView(length, Uint16View, littleEndian)
  // }
  // getInt16View(length: number, littleEndian?: boolean) {
  //   return this.getTypedView(length, Int16View, littleEndian)
  // }
  // getUint32View(length: number, littleEndian?: boolean) {
  //   return this.getTypedView(length, Uint32View, littleEndian)
  // }
  // getInt32View(length: number, littleEndian?: boolean) {
  //   return new Int32View(this, length, littleEndian)
  // }
  getDataView(byteLength: number) {
    const dataView = new DataView(this.data.buffer, this.offset, byteLength)
    this.offset += byteLength
    return dataView
  }
  
}

export abstract class TypedView {
  static elemByteLength: number
  protected view: DataView
  static byteLengthOf(viewClass: any, length: number) {
    return viewClass.elemByteLength * length
  }
  constructor(stream: DataStream, protected elemByteLength: number, length: number) {
    this.view = stream.getDataView(length * this.elemByteLength)
  }
  get length() {
    return this.view.byteLength / this.elemByteLength
  }
  get bytes() {
    return new Uint8Array(this.view.buffer, this.view.byteOffset, this.view.byteLength)
  }
  abstract get(idx: number): number
  abstract set(idx: number, value: number): void
}
export class Int8View extends TypedView {
  static elemByteLength = 1
  constructor(stream: DataStream, length: number) {
    super(stream, Int8View.elemByteLength, length)
  }
  get(idx: number) {
    return this.view.getInt8(idx)
  }
  set(idx: number, value: number) {
    this.view.setInt8(idx, value)
  }
}
export class Uint16View extends TypedView {
  static elemByteLength = 2
  constructor(stream: DataStream, length: number, private littleEndian?: boolean) {
    super(stream, Uint16View.elemByteLength, length)
  }
  get(idx: number) {
    return this.view.getUint16(idx * this.elemByteLength, this.littleEndian)
  }
  set(idx: number, value: number) {
    this.view.setUint16(idx, value, this.littleEndian)
  }
}
export class Int16View extends TypedView {
  static elemByteLength = 2
  constructor(stream: DataStream, length: number, private littleEndian?: boolean) {
    super(stream, Int16View.elemByteLength, length)
  }
  get(idx: number) {
    return this.view.getInt16(idx * this.elemByteLength, this.littleEndian)
  }
  set(idx: number, value: number) {
    this.view.setInt16(idx, value, this.littleEndian)
  }
}
export class Uint32View extends TypedView {
  static elemByteLength = 4
  constructor(stream: DataStream, length: number, private littleEndian?: boolean) {
    super(stream, Uint32View.elemByteLength, length)
  }
  get(idx: number) {
    return this.view.getUint32(idx * this.elemByteLength, this.littleEndian)
  }
  set(idx: number, value: number) {
    this.view.setUint32(idx, value, this.littleEndian)
  }
}
export class Int32View extends TypedView {
  static elemByteLength = 4
  constructor(stream: DataStream, length: number, private littleEndian?: boolean) {
    super(stream, Int32View.elemByteLength, length)
  }
  get(idx: number) {
    return this.view.getInt32(idx * this.elemByteLength, this.littleEndian)
  }
  set(idx: number, value: number) {
    this.view.setInt32(idx, value, this.littleEndian)
  }
}
