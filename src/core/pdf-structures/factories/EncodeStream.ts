// Simplified Stream Encoder
// inspiered by https://github.com/foliojs/restructure/blob/master/src/EncodeStream.coffee
// fontkit (via restructure) implementation is asynchrounous... this one is synchronous

// import { Buffer } from 'buffer/'; // why this fails test?

class EncodeStream {
  buffer: any
  bufferOffset: number
  pos: number
  chunks: Buffer[]

  constructor(bufferSize?: number) {
    if (bufferSize == null) { bufferSize = 65536; }
    this.buffer = new Buffer(bufferSize);
    this.bufferOffset = 0;
    this.pos = 0;
    this.chunks = []
  }

  _read() {
    // do nothing, required by node
  }

  ensure(byteLength: number) {
    if ((this.bufferOffset + byteLength) > this.buffer.length) {
      this.flush();
    }
  }
  push(chunk: Buffer) { // second parameter encoding ignored for now
    this.chunks.push(chunk)
  }
  flush() {
    if (this.bufferOffset > 0) {
      this.push(new Buffer(this.buffer.slice(0, this.bufferOffset)));
      this.bufferOffset = 0;
    }
  }
  writeUInt8(value: number) {
    const byteLength = 1;
    this.ensure(byteLength);
    this.buffer.writeUInt8(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeUInt16LE(value: number) {
    const byteLength = 2;
    this.ensure(byteLength);
    this.buffer.writeUInt16LE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeUInt16BE(value: number) {
    const byteLength = 2;
    this.ensure(byteLength);
    this.buffer.writeUInt16BE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeUInt32LE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeUInt32LE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeUInt32BE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeUInt32BE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeInt8(value: number) {
    const byteLength = 1;
    this.ensure(byteLength);
    this.buffer.writeInt8(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeInt16LE(value: number) {
    const byteLength = 2;
    this.ensure(byteLength);
    this.buffer.writeInt16LE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeInt16BE(value: number) {
    const byteLength = 2;
    this.ensure(byteLength);
    this.buffer.writeInt16BE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeInt32LE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeInt32LE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeInt32BE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeInt32BE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeFloatLE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeFloatLE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeFloatBE(value: number) {
    const byteLength = 4;
    this.ensure(byteLength);
    this.buffer.writeFloatBE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeDoubleLE(value: number) {
    const byteLength = 8;
    this.ensure(byteLength);
    this.buffer.writeDoubleLE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeDoubleBE(value: number) {
    const byteLength = 8;
    this.ensure(byteLength);
    this.buffer.writeDoubleBE(value, this.bufferOffset);
    this.bufferOffset += byteLength;
    this.pos += byteLength;
  }
  writeBuffer(buffer: any) {
    this.flush();
    this.push(buffer);
    this.pos += buffer.length;
  }
  writeString(string: string, encoding?: string) {
    if (encoding == null) { encoding = 'ascii'; }
    switch (encoding) {
      case 'utf16le': case 'ucs2': case 'utf8': case 'ascii':
        this.writeBuffer(new Buffer(string, encoding));
        break;
      case 'utf16be':
        var bufUtf16le = new Buffer(string, 'utf16le');
        // swap the bytes
        this.writeBuffer(bufUtf16le.swap16());
        break;
      default:
        // TODO: check whne this is required
        // require('iconv-lite')
        //this.writeBuffer(iconv.encode(string, encoding));
        throw new Error('Install iconv-lite to enable additional string encodings.');
    }
  }

  writeUInt24BE(val: any) {
    this.ensure(3);
    this.buffer[this.bufferOffset++] = (val >>> 16) & 0xff;
    this.buffer[this.bufferOffset++] = (val >>> 8)  & 0xff;
    this.buffer[this.bufferOffset++] = val & 0xff;
    this.pos += 3;
  }

  writeUInt24LE(val: any) {
    this.ensure(3);
    this.buffer[this.bufferOffset++] = val & 0xff;
    this.buffer[this.bufferOffset++] = (val >>> 8) & 0xff;
    this.buffer[this.bufferOffset++] = (val >>> 16) & 0xff;
    this.pos += 3;
  }

  writeInt24BE(val: any) {
    if (val >= 0) {
      this.writeUInt24BE(val);
    } else {
      this.writeUInt24BE(val + 0xffffff + 1);
    }
  }

  writeInt24LE(val: any) {
    if (val >= 0) {
      this.writeUInt24LE(val);
    } else {
      this.writeUInt24LE(val + 0xffffff + 1);
    }
  }

  fill(val: any, length: number) {
    if (length < this.buffer.length) {
      this.ensure(length);
      this.buffer.fill(val, this.bufferOffset, this.bufferOffset + length);
      this.bufferOffset += length;
      this.pos += length;
    } else {
      const buf = new Buffer(length);
      buf.fill(val);
      this.writeBuffer(buf);
    }
  }

  end() {
    // TODO: needed?
    this.flush();
  }
  getContent(): Buffer {
    this.flush();
    return Buffer.concat(this.chunks)
  }
}


export default EncodeStream