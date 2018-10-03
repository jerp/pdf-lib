import { directory } from 'helpers/TTFTables/DirectoryTypes';
import { DataStream } from 'helpers/DataStream';
export class Table {
  protected sourceStream: DataStream
  protected doDecode: (directory?: directory) => void
  decode(stream: DataStream, directory: directory) {
    this.sourceStream = stream
    if (this.doDecode) this.doDecode(directory)
  }
  encode(stream: DataStream, subset?: number[]) {
    stream.setBytes(this.sourceStream.getBytes())
  }
  get hasData() {
    return !!this.sourceStream
  }
}