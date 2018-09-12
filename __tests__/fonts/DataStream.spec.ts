import { DataStream, Uint16View } from 'fonts/DataStream'

const data = {
  xabcdef: {
    BE: new Uint8Array([0xab, 0xcd, 0xef]),
    LE: new Uint8Array([0xef, 0xcd, 0xab]),
    value: 0xabcdef
  }
}

describe('DataStream', () => {
  describe('Decode DataStream', () => {
    it('interface', () => {
      expect(typeof DataStream).toEqual('function');
    });
    it('should read a buffer', () => {
      const stream = new DataStream(new Uint8Array([1, 2, 3]))
      expect(stream.getBytes(3)).toMatchObject(new Uint8Array([1, 2, 3]))
      expect(stream.offset).toEqual(3)
    })
    it('should read a typed array', () => {
      const stream = new DataStream(new Uint8Array([1, 1, 2, 1, 3, 1, 4, 1]))
      expect(stream.offset).toEqual(0)
      const view = stream.getTypedView(4, Uint16View)
      expect(view.get(0)).toBe(0x0101)
      expect(view.get(1)).toBe(0x0201)
      expect(view.get(2)).toBe(0x0301)
      expect(view.get(3)).toBe(0x0401)
      expect(stream.offset).toEqual(4 * 2)
    })
    it('should read Uint16 big endian', () => {
      const stream = new DataStream(new Uint8Array([0xab, 0xcd]))
      expect(stream.getUint16()).toEqual(0xabcd)
      expect(stream.offset).toEqual(2)
    })
    it('should read Uint16 little endian', () => {
      const stream = new DataStream(new Uint8Array([0xab, 0xcd]))
      expect(stream.getUint16(true)).toEqual(0xcdab)
      expect(stream.offset).toEqual(2)
    })
    it('should read Int16 little endian', () => {
      const stream1 = new DataStream(new Uint8Array([0xff, 0xff]))
      expect(stream1.getInt16(true)).toEqual(-1)
      const stream2 = new DataStream(new Uint8Array([0xff, 0x7f]))
      expect(stream2.getInt16(true)).toEqual(0x7fff)
      expect(stream2.offset).toEqual(2)
    })
    // 3 bytes
    it('should read UInt24 big endian', () => {
      const stream = new DataStream(data.xabcdef.BE)
      expect(stream.getUint24()).toEqual(data.xabcdef.value)
      expect(stream.offset).toEqual(3)
    })
    it('should read UInt24 little endian', () => {
      const buffer = new Uint8Array([0xab, 0xcd, 0xef])
      const stream = new DataStream(buffer)
      expect(stream.getUint24(true)).toEqual(0xefcdab)
      expect(stream.offset).toEqual(3)
    })
    it('should read Int24 big endian', () => {
      const buffer = new Uint8Array([0xff, 0xab, 0x24])
      const stream = new DataStream(buffer)
      expect(stream.getInt24()).toEqual(-21724)
      expect(stream.offset).toEqual(3)
    })
    it('should read Int24 little endian', () => {
      const buffer = new Uint8Array([0x24, 0xab, 0xff])
      const stream = new DataStream(buffer)
      expect(stream.getInt24(true)).toEqual(-21724)
      expect(stream.offset).toEqual(3)
    })
    // 4 bytes
    it('should read Uint32 big endian', () => {
      const buffer = new Uint8Array([0xff, 0xab, 0x24, 0xbf])
      const stream = new DataStream(buffer)
      expect(stream.getUint32()).toEqual(0xffab24bf)
      expect(stream.offset).toEqual(4)
    })
    it('should read Uint32 little endian', () => {
      const buffer = new Uint8Array([0xbf, 0x24, 0xab, 0xff])
      const stream = new DataStream(buffer)
      expect(stream.getUint32(true)).toEqual(0xffab24bf)
      expect(stream.offset).toEqual(4)
    })
    it('should read Int32 big endian', () => {
      const buffer = new Uint8Array([0xff, 0xab, 0x24, 0xbf])
      const stream = new DataStream(buffer)
      expect(stream.getInt32()).toEqual(-5561153)
      expect(stream.offset).toEqual(4)
    })
    it('should read Int32 little endian', () => {
      const buffer = new Uint8Array([0xbf, 0x24, 0xab, 0xff])
      const stream = new DataStream(buffer)
      expect(stream.getInt32(true)).toEqual(-5561153)
      expect(stream.offset).toEqual(4)
    })
    it('should read Float32 big endian', () => {
      const buffer = new Uint8Array([0x43, 0x7a, 0x8c, 0xcd])
      const stream = new DataStream(buffer)
      expect(stream.getFloat32()).toBeCloseTo(250.55, 2);
      expect(stream.offset).toEqual(4)
    })
    it('should read Float32 little endian', () => {
      const buffer = new Uint8Array([0x43, 0x7a, 0x8c, 0xcd].reverse())
      const stream = new DataStream(buffer)
      expect(stream.getFloat32(true)).toBeCloseTo(250.55, 2);
      expect(stream.offset).toEqual(4)
    })
    it('should read Int16 little endian', () => {
      const stream = new DataStream(new Uint8Array([0x00, 0xfa, 0x8c, 0xcc]))
      expect(stream.getFixed32()).toBeCloseTo(250.55, 2)
      expect(stream.offset).toEqual(4)
    })
    // 8 bytes
    it('should read Float64 little endian', () => {
      const buffer = new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a].reverse())
      const stream = new DataStream(buffer)
      expect(stream.getFloat64(true)).toBeCloseTo(1234.56, 2);
      expect(stream.offset).toEqual(8)
    })
    it('should write Float64 big endian', () => {
      const stream = new DataStream;
      stream.setFloat64(1234.56);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a]));
      expect(stream.offset).toEqual(8)
    })

    // string
    it('should should decode ascii', () => {
      const buffer = new Uint8Array(new Buffer('some text', 'ascii'))
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length, 'ascii')).toEqual('some text')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should should decode ascii by default', () => {
      const buffer = new Uint8Array(new Buffer('some text', 'ascii'))
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length)).toEqual('some text')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should should decode utf16le', () => {
      const buffer = new Uint8Array(new Buffer('unicode! 👍', 'utf16le'))
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length, 'utf16le')).toEqual('unicode! 👍')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should should decode ucs2', () => {
      const buffer = new Uint8Array(new Buffer('unicode! 👍', 'ucs2'))
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length, 'ucs2')).toEqual('unicode! 👍')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should should decode utf16be', () => {
      const buffer = new Uint8Array(new Buffer('unicode! 👍', 'utf16le').swap16())
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length, 'utf16be')).toEqual('unicode! 👍')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should decode utf8', () => {
      const buffer = new Uint8Array(new Buffer('unicode! 👍', 'utf8'))
      const stream = new DataStream(buffer)
      expect(stream.getString(buffer.length, 'utf8')).toEqual('unicode! 👍')
      expect(stream.offset).toEqual(buffer.length)
    })
    it('should throw an error for unsupported encodings', () => {
      const buffer = new Uint8Array([1, 2, 3])
      const stream = new DataStream(buffer)
      expect(() => stream.getString(buffer.length, 'unknown')).toThrowError()
    })
  })
  describe('Encode DataStream', () => {
    it('interface', () => {
      expect(typeof DataStream).toEqual('function');
    });
    it('should write a buffer', function () {
      const stream = new DataStream;
      stream.setBytes(new Uint8Array([1, 2, 3]));
      expect(stream.getBytes()).toMatchObject(new Uint8Array([1, 2, 3]))
      expect(stream.offset).toEqual(3)
    });
    it('should write a 2 byte buffer', function () {
      const stream = new DataStream;
      stream.setBytes(new Uint16Array([1, 2, 3]));
      expect(stream.getBytes()).toMatchObject(new Uint8Array([1, 0, 2, 0, 3, 0]))
      expect(stream.offset).toEqual(6)
    });
    it('should write a buffer even when no more room', function () {
      const stream = new DataStream(4);
      stream.setBytes(new Buffer([1, 2, 3, 4]));
      stream.setBytes(new Buffer([5, 6, 7, 8]));
      expect(stream.getBytes()).toMatchObject(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
      stream.setBytes(new Buffer([9, 10, 11, 12, 13, 14]));
      expect(stream.getBytes()).toMatchObject(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]))
      expect(stream.offset).toEqual(14)
    });
    // 1 bytes
    it('should write UInt8', function () {
      const stream = new DataStream;
      stream.setUint8(0xab);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xab]))
      expect(stream.offset).toEqual(1)
    });
    it('should write Int8', function () {
      const stream = new DataStream;
      stream.setInt8(-1);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([255]))
      expect(stream.offset).toEqual(1)
    });
    // 2 bytes
    it('should write Int16 little endian', function () {
      const stream = new DataStream;
      stream.setInt16(-2, true);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xfe, 0xff]))
      expect(stream.offset).toEqual(2)
    });
    it('should write Int16 big endian', function () {
      const stream = new DataStream;
      stream.setInt16(-2);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xff, 0xfe]))
      expect(stream.offset).toEqual(2)
    });
    it('should write Uint16 big endian', function () {
      const stream = new DataStream;
      stream.setUint16(0xabcd);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xab, 0xcd]))
      expect(stream.offset).toEqual(2)
    });
    it('should write Uint16 little endian', function () {
      const stream = new DataStream;
      stream.setUint16(0xcdab, true);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xab, 0xcd]))
      expect(stream.offset).toEqual(2)
    });
    // 3 bytes
    it('should write UInt24 big endian', function () {
      const stream = new DataStream;
      stream.setUint24(0xabcdef);
      expect(stream.getBytes()).toMatchObject(data.xabcdef.BE)
      expect(stream.offset).toEqual(3)
    });
    it('should write UInt24 little endian', function () {
      const stream = new DataStream;
      stream.setUint24(0xabcdef, true);
      expect(stream.getBytes()).toMatchObject(data.xabcdef.LE)
      expect(stream.offset).toEqual(3)
    });
    it('should write Int24 big endian', function () {
      const stream = new DataStream;
      stream.setInt24(-21724);
      stream.setInt24(0xabcdef);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0xff, 0xab, 0x24, 0xab, 0xcd, 0xef]))
      expect(stream.offset).toEqual(3 * 2)
    });
    it('should write Int24 little endian', function () {
      const stream = new DataStream;
      stream.setInt24(-21724, true);
      stream.setInt24(0xabcdef, true);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x24, 0xab, 0xff, 0xef, 0xcd, 0xab]))
      expect(stream.offset).toEqual(3 * 2)
    });
    // 4 bytes
    it('should write Float32 little endian', () => {
      const stream = new DataStream;
      stream.setFloat32(250.55, true);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x43, 0x7a, 0x8c, 0xcd].reverse()));
      expect(stream.offset).toEqual(4)
    })
    it('should write Float32 big endian', () => {
      const stream = new DataStream;
      stream.setFloat32(250.55);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x43, 0x7a, 0x8c, 0xcd]));
      expect(stream.offset).toEqual(4)
    })
    // 8 bytes
    it('should write Float64 little endian', () => {
      const stream = new DataStream;
      stream.setFloat64(1234.56, true);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a].reverse()));
      expect(stream.offset).toEqual(8)
    })
    it('should write Float64 big endian', () => {
      const stream = new DataStream;
      stream.setFloat64(1234.56);
      expect(stream.getBytes()).toMatchObject(new Uint8Array([0x40, 0x93, 0x4a, 0x3d, 0x70, 0xa3, 0xd7, 0x0a]));
      expect(stream.offset).toEqual(8)
    })
    // string
    it('should encode ascii by default', function () {
      const stream = new DataStream;
      stream.setString('some text');
      expect(stream.getBytes()).toMatchObject(new Uint8Array(new Buffer('some text', 'ascii')))
      expect(stream.offset).toEqual(9)
    });
    it('should encode ascii', function () {
      const stream = new DataStream;
      stream.setString('some text', 'ascii');
      expect(stream.getBytes()).toMatchObject(new Uint8Array(new Buffer('some text', 'ascii')))
      expect(stream.offset).toEqual(9)
    });
    it('should encode utf8', function () {
      const stream = new DataStream;
      stream.setString('unicode! 👍', 'utf8');
      expect(stream.getBytes()).toMatchObject(new Uint8Array(new Buffer('unicode! 👍', 'utf8')))
      expect(stream.offset).toBeGreaterThanOrEqual(9)
      expect(stream.offset).toBeLessThanOrEqual(22)
    });
    it('should encode utf16le', function () {
      const stream = new DataStream;
      stream.setString('unicode! 👍', 'utf16le');
      expect(stream.getBytes()).toMatchObject(new Uint8Array(new Buffer('unicode! 👍', 'utf16le')))
      expect(stream.offset).toEqual(22)
    });
    it('should encode ucs2', function () {
      const stream = new DataStream;
      stream.setString('unicode! 👍', 'ucs2');
      expect(stream.getBytes()).toMatchObject(new Uint8Array(new Buffer('unicode! 👍', 'ucs2')))
      expect(stream.offset).toEqual(22)
    });
    it('should encode utf16be', function () {
      const stream = new DataStream;
      stream.setString('unicode! 👍', 'utf16be');
      expect(stream.getBytes()).toMatchObject(new Uint8Array((new Buffer('unicode! 👍', 'utf16le').swap16())))
      expect(stream.offset).toEqual(22)
    });
  })
  // Needed?
  describe('Additional Test on utf8', () => {
    // source: http://www.columbia.edu/~fdc/utf8/
    const toBytes = (string) => {
      const nbytes = string.length
      const bytes = new Uint8Array(nbytes)
      for (let i = 0; i < nbytes; i++) bytes[i] = string.charCodeAt(i)
      return bytes
    }
    const cases = [
      [
        "runes",
        'ᚠᛇᚻ᛫ᛒᛦᚦ',
        toBytes('\xe1\x9a\xa0\xe1\x9b\x87\xe1\x9a\xbb\xe1\x9b\xab\xe1\x9b\x92\xe1\x9b\xa6\xe1\x9a\xa6')
      ],
      [
        "monotonic Greek",
        'Τη γλώσσα',
        toBytes('\xce\xa4\xce\xb7\x20\xce\xb3\xce\xbb\xcf\x8e\xcf\x83\xcf\x83\xce\xb1')
      ],
      [
        "polytonic Greek",
        'Τὴ γλῶσσα',
        toBytes('\xce\xa4\xe1\xbd\xb4\x20\xce\xb3\xce\xbb\xe1\xbf\xb6\xcf\x83\xcf\x83\xce\xb1')
      ],
      [
        "Georgian",
        'ვეპხის ტყაოსანი',
        toBytes('\xe1\x83\x95\xe1\x83\x94\xe1\x83\x9e\xe1\x83\xae\xe1\x83\x98\xe1\x83\xa1\x20\xe1\x83\xa2\xe1\x83\xa7\xe1\x83\x90\xe1\x83\x9d\xe1\x83\xa1\xe1\x83\x90\xe1\x83\x9c\xe1\x83\x98')
      ],
      [
        "Georgian",
        'யாமறிந்த மொழிகளிலே',
        toBytes('\xe0\xae\xaf\xe0\xae\xbe\xe0\xae\xae\xe0\xae\xb1\xe0\xae\xbf\xe0\xae\xa8\xe0\xaf\x8d\xe0\xae\xa4\x20\xe0\xae\xae\xe0\xaf\x8a\xe0\xae\xb4\xe0\xae\xbf\xe0\xae\x95\xe0\xae\xb3\xe0\xae\xbf\xe0\xae\xb2\xe0\xaf\x87')
      ],
      [
        "chinese (simplified)",
        '我能吞下玻璃而不伤身体。',
        toBytes('\xe6\x88\x91\xe8\x83\xbd\xe5\x90\x9e\xe4\xb8\x8b\xe7\x8e\xbb\xe7\x92\x83\xe8\x80\x8c\xe4\xb8\x8d\xe4\xbc\xa4\xe8\xba\xab\xe4\xbd\x93\xe3\x80\x82')
      ],
    ]
    cases.forEach(([name, string, expectedbytes]) => {
      it(`should encode ${name} to utf8`, function () {
        const stream = new DataStream;
        stream.setString(<string>string, 'utf8');
        expect(stream.getBytes()).toMatchObject(expectedbytes)
      });
      it(`should encode ${name} to utf8`, function () {
        const stream = new DataStream(<Uint8Array>expectedbytes);
        expect(stream.getString(expectedbytes.length, 'utf8')).toEqual(string)
      });
    })
  })
  // describe('Special Encodgin', () => {
  //   // Install iconv-lite to enable additional string encodings
  //   it('should encode macroman', function() {
  //     const stream = new DataStream;
  //     stream.setString('äccented cháracters', 'mac');
  //     expect(stream.getBytes()).toMatchObject(new Uint8Array([0x8a, 0x63, 0x63, 0x65, 0x6e, 0x74, 0x65, 0x64, 0x20, 0x63, 0x68, 0x87, 0x72, 0x61, 0x63, 0x74, 0x65, 0x72, 0x73]))
  //   });
  //   it('should should decode macroman', () => {
  //     const buffer = new Uint8Array([0x8a, 0x63, 0x63, 0x65, 0x6e, 0x74, 0x65, 0x64, 0x20, 0x63, 0x68, 0x87, 0x72, 0x61, 0x63, 0x74, 0x65, 0x72, 0x73])
  //     const stream = new DataStream(buffer)
  //     expect(stream.getString(buffer.length, 'mac')).toEqual('unicode! 👍')
  //   })
  // })
})