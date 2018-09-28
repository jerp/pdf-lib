// // Simplified Stream Encoder
// // inspiered by https://github.com/foliojs/restructure/blob/master/src/EncodeStream.coffee
// // fontkit (via restructure) implementation is asynchrounous... this one is synchronous

// // import { Buffer } from 'buffer/'; // why this fails test?

// class EncodeStream {
//   waLength: number
//   data: DataView
//   offset: number
//   chunks: ArrayBuffer[]

//   constructor(waLength?: number) {
//     this.waLength = waLength ? waLength : 65536;
//     this.data = new DataView(new ArrayBuffer(this.waLength))
//     this.offset = 0;
//     this.chunks = []
//   }

//   ensure(byteLength: number) {
//     if ((this.offset + byteLength) > this.waLength) {
//       this.flush();
//     }
//     this.offset += byteLength;
//   }
//   push(chunk: ArrayBuffer) { // second parameter encoding ignored for now
//     this.chunks.push(chunk)
//   }
//   flush() {
//     if (this.offset > 0) {
//       this.push(this.data.buffer.slice(0, this.offset));
//       this.offset = 0;
//     }
//   }
//   writeUInt8(value: number) {
//     this.ensure(1);
//     this.data.setUint8(this.offset, value);
//   }
//   writeUInt16LE(value: number) {
//     this.ensure(2);
//     this.data.setUint16(this.offset, value, true);
//   }
//   writeUInt16BE(value: number) {
//     this.ensure(2);
//     this.data.setUint16(this.offset, value, false);
//   }
//   writeUInt32LE(value: number) {
//     this.ensure(4);
//     this.data.setUint32(this.offset, value, true);
//   }
//   writeUInt32BE(value: number) {
//     this.ensure(4);
//     this.data.setUint32(this.offset, value, false);
//   }
//   writeInt8(value: number) {
//     this.ensure(1);
//     this.data.setInt8(this.offset, value);
//   }
//   writeInt16LE(value: number) {
//     this.ensure(2);
//     this.data.setInt16(this.offset, value, true);
//   }
//   writeInt16BE(value: number) {
//     this.ensure(2);
//     this.data.setInt16(this.offset, value, false);
//   }
//   writeInt32LE(value: number) {
//     this.ensure(4);
//     this.data.setInt32(this.offset, value, true);
//   }
//   writeInt32BE(value: number) {
//     this.ensure(4);
//     this.data.setInt32(this.offset, value, false);
//   }
//   writeFloatLE(value: number) {
//     this.ensure(4);
//     this.data.setFloat32(this.offset, value, true);
//   }
//   writeFloatBE(value: number) {
//     this.ensure(4);
//     this.data.setFloat32(this.offset, value, false);
//   }
//   writeDoubleLE(value: number) {
//     this.ensure(8);
//     this.data.setFloat64(this.offset, value, true);
//   }
//   writeDoubleBE(value: number) {
//     this.ensure(8);
//     this.data.setFloat64(this.offset, value, false);
//   }
//   writeBuffer(buffer: any) {
//     this.flush();
//     this.push(buffer);
//   }
//   writeString(string: string, encoding?: string) {
//     if (encoding == null) { encoding = 'ascii'; }
//     switch (encoding) {
//       case 'utf16le': case 'ucs2':
//         this.writeUtf16le(string)
//         break;
//       case 'utf8':
//         this.writeUtf8(string)
//         break;
//       case 'ascii':
//         this.writeAscii(string)
//         break;
//       case 'utf16be':
//         this.writeUtf16be(string);
//         break;
//       default:
//         // TODO: check whne this is required
//         // require('iconv-lite')
//         // ...
//         throw new Error('Install iconv-lite to enable additional string encodings.');
//     }
//   }
//   writeAscii(string: string) {
//     const stringLength = string.length
//     const buffer = new Uint8Array(stringLength)
//     for (var i = 0; i < stringLength; ++i) {
//       buffer[i] = string.charCodeAt(i) & 0xFF
//     }
//     this.writeBuffer(buffer)
//   }
//   writeUtf16le (string: string) {
//     const stringLength = string.length
//     const buffer = new Uint8Array(stringLength * 2)
//     for (var i = 0; i < stringLength; ++i) {
//       const charCode = string.charCodeAt(i)
//       buffer[i*2] = charCode >> 8
//       buffer[i*2+1] = charCode % 0x100
//     }
//     this.writeBuffer(buffer)
//   }
//   writeUtf16be (string: string) {
//     const stringLength = string.length
//     const buffer = new Uint8Array(stringLength * 2)
//     for (var i = 0; i < stringLength; ++i) {
//       const charCode = string.charCodeAt(i)
//       buffer[i*2+1] = charCode >> 8
//       buffer[i*2] = charCode % 0x100
//     }
//     this.writeBuffer(buffer)
//   }
//   writeUtf8(string: string) {
//     const stringLength = string.length;
//     const buffer = new Uint8Array(stringLength * 4);
//     let offset = 0
//     for (var ci = 0; ci != string.length; ci++) {
//       var c = string.charCodeAt(ci);
//       if (c < 128) {
//         buffer[offset++] = c;
//         continue;
//       }
//       if (c < 2048) {
//         buffer[offset++] = c >> 6 | 192;
//       } else {
//         if (c > 0xd7ff && c < 0xdc00) {
//           if (++ci >= string.length)
//             throw new Error('UTF-8 encode: incomplete surrogate pair');
//           var c2 = string.charCodeAt(ci);
//           if (c2 < 0xdc00 || c2 > 0xdfff)
//             throw new Error('UTF-8 encode: second surrogate character 0x' + c2.toString(16) + ' at index ' + ci + ' out of range');
//           c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
//           buffer[offset++] = c >> 18 | 240;
//           buffer[offset++] = c >> 12 & 63 | 128;
//         } else buffer[offset++] = c >> 12 | 224;
//         buffer[offset++] = c >> 6 & 63 | 128;
//       }
//       buffer[offset++] = c & 63 | 128;
//     }
//     this.writeBuffer(buffer.subarray(0, offset))
//   }
// // Unmarshals a string from an Uint8Array.
// // function decodeUTF8(bytes) {
// // 	var i = 0, s = '';
// // 	while (i < bytes.length) {
// // 		var c = bytes[i++];
// // 		if (c > 127) {
// // 			if (c > 191 && c < 224) {
// // 				if (i >= bytes.length)
// // 					throw new Error('UTF-8 decode: incomplete 2-byte sequence');
// // 				c = (c & 31) << 6 | bytes[i++] & 63;
// // 			} else if (c > 223 && c < 240) {
// // 				if (i + 1 >= bytes.length)
// // 					throw new Error('UTF-8 decode: incomplete 3-byte sequence');
// // 				c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
// // 			} else if (c > 239 && c < 248) {
// // 				if (i + 2 >= bytes.length)
// // 					throw new Error('UTF-8 decode: incomplete 4-byte sequence');
// // 				c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
// // 			} else throw new Error('UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1));
// // 		}
// // 		if (c <= 0xffff) s += String.fromCharCode(c);
// // 		else if (c <= 0x10ffff) {
// // 			c -= 0x10000;
// // 			s += String.fromCharCode(c >> 10 | 0xd800)
// // 			s += String.fromCharCode(c & 0x3FF | 0xdc00)
// // 		} else throw new Error('UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach');
// // 	}
// // 	return s;
// // }

//   writeUInt24BE(val: any) {
//     this.ensure(3);
//     this.data.setUint8(this.offset++, = (val >>> 16) & 0xff;
//     this.data.setUint8(this.offset++, = (val >>> 8)  & 0xff;
//     this.data.setUint8(this.offset++, = val & 0xff;
//     this.pos += 3;
//   }

//   writeUInt24LE(val: any) {
//     this.ensure(3);
//     this.data.setUint8(this.offset++, = val & 0xff;
//     this.data.setUint8(this.offset++, = (val >>> 8) & 0xff;
//     this.data.setUint8(this.offset++, = (val >>> 16) & 0xff;
//     this.pos += 3;
//   }

//   writeInt24BE(val: any) {
//     if (val >= 0) {
//       this.writeUInt24BE(val);
//     } else {
//       this.writeUInt24BE(val + 0xffffff + 1);
//     }
//   }

//   writeInt24LE(val: any) {
//     if (val >= 0) {
//       this.writeUInt24LE(val);
//     } else {
//       this.writeUInt24LE(val + 0xffffff + 1);
//     }
//   }

//   fill(val: any, length: number) {
//     if (length < this.data.setUint8(length) {
//       this.ensure(length);
//       this.data.setUint8(fill(val, this.offset, this.offset + length);
//       this.offset += length;
//       this.pos += length;
//     } else {
//       const buf = new Buffer(length);
//       buf.fill(val);
//       this.writeBuffer(buf);
//     }
//   }

//   end() {
//     // TODO: needed?
//     this.flush();
//   }
//   getContent(): Buffer {
//     this.flush();
//     return Buffer.concat(this.chunks)
//   }
// }


// export default EncodeStream