import internal from "stream";
import IFile from "../types/fileU.type"

export interface Block {
    ID?: any | null,
    IdBlock
    Time: string,
    Test: string,
    Milliseconds: string,
    Documents: IFile[],
    PreviousHash:string,
    Hash:string
  }
  export default Block;