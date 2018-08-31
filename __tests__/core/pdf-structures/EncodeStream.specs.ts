import EncodeStream from 'core/pdf-structures/factories/EncodeStream'


describe('EncodeStream', function() {
  it('should write a buffer', function() {
    const stream = new EncodeStream;
    stream.writeBuffer(new Buffer([1,2,3]));
    expect(stream.getContent()).toMatchObject(new Buffer([1,2,3]))
  });
  it('should writeUInt16BE', function() {
    const stream = new EncodeStream;
    stream.writeUInt16BE(0xabcd);
    expect(stream.getContent()).toMatchObject(new Buffer([0xab, 0xcd]))
  });
  it('should writeUInt16LE', function() {
    const stream = new EncodeStream;
    stream.writeUInt16LE(0xcdab);
    expect(stream.getContent()).toMatchObject(new Buffer([0xab, 0xcd]))
  });
  it('should writeUInt24BE', function() {
    const stream = new EncodeStream;
    stream.writeUInt24BE(0xabcdef);
    expect(stream.getContent()).toMatchObject(new Buffer([0xab, 0xcd, 0xef]))
  });
  it('should writeUInt24LE', function() {
    const stream = new EncodeStream;
    stream.writeUInt24LE(0xabcdef);
    expect(stream.getContent()).toMatchObject(new Buffer([0xef, 0xcd, 0xab]))
  });
  it('should writeInt24BE', function() {
    const stream = new EncodeStream;
    stream.writeInt24BE(-21724);
    stream.writeInt24BE(0xabcdef);
    expect(stream.getContent()).toMatchObject(new Buffer([0xff, 0xab, 0x24, 0xab, 0xcd, 0xef]))
  });
  it('should writeInt24LE', function() {
    const stream = new EncodeStream;
    stream.writeInt24LE(-21724);
    stream.writeInt24LE(0xabcdef);
    expect(stream.getContent()).toMatchObject(new Buffer([0x24, 0xab, 0xff, 0xef, 0xcd, 0xab]))
  });

  it('should fill', function() {
    const stream = new EncodeStream;
    stream.fill(10, 5);
    expect(stream.getContent()).toMatchObject(new Buffer([10, 10, 10, 10, 10]))
  });
  it('should encode ascii by default', function() {
    const stream = new EncodeStream;
    stream.writeString('some text');
    expect(stream.getContent()).toMatchObject(new Buffer('some text', 'ascii'))
  });
  it('should encode ascii', function() {
    const stream = new EncodeStream;
    stream.writeString('some text', 'ascii');
    expect(stream.getContent()).toMatchObject(new Buffer('some text', 'ascii'))
  });
  it('should encode utf8', function() {
    const stream = new EncodeStream;
    stream.writeString('unicode! 👍', 'utf8');
    expect(stream.getContent()).toMatchObject(new Buffer('unicode! 👍', 'utf8'))
  });
  it('should encode utf16le', function() {
    const stream = new EncodeStream;
    stream.writeString('unicode! 👍', 'utf16le');
    expect(stream.getContent()).toMatchObject(new Buffer('unicode! 👍', 'utf16le'))
  });
  it('should encode ucs2', function() {
    const stream = new EncodeStream;
    stream.writeString('unicode! 👍', 'ucs2');
    expect(stream.getContent()).toMatchObject(new Buffer('unicode! 👍', 'ucs2'))
  });
  it('should encode utf16be', function() {
    const stream = new EncodeStream;
    stream.writeString('unicode! 👍', 'utf16be');
    expect(stream.getContent()).toMatchObject((new Buffer('unicode! 👍', 'utf16le')).swap16())
  });
  // // Install iconv-lite to enable additional string encodings
  // it('should encode macroman', function() {
  //   const stream = new EncodeStream;
  //   stream.writeString('äccented cháracters', 'mac');
  //   expect(stream.getContent()).toMatchObject(new Buffer([0x8a, 0x63, 0x63, 0x65, 0x6e, 0x74, 0x65, 0x64, 0x20, 0x63, 0x68, 0x87, 0x72, 0x61, 0x63, 0x74, 0x65, 0x72, 0x73]))
  // });

});
