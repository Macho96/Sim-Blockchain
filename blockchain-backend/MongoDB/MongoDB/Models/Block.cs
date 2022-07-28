using System;
using System.Collections.Generic;

namespace MongoDB.Models
{
    public class Block
    {
        public string IdBlock;
        public string Time;
        public string Test;
        public string Milliseconds;
        public List<FilesU> Documents;
        public string PreviousHash;
        public string Hash;

        public Block(string IdBlock, string Time, string Test, string Milliseconds, List<FilesU> Documents, string PreviousHash, string Hash)
        {
            this.IdBlock = IdBlock;
            this.Time = Time;
            this.Test = Test;
            this.Milliseconds = Milliseconds;
            this.Documents = Documents;
            this.PreviousHash = PreviousHash;
            this.Hash = Hash;
        }
    }
}
