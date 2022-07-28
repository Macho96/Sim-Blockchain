using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MongoDB.Models
{
    public class FilesU
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("Owner")]
        public string Owner { get; set; } = null!;
        public string Format { get; set; } = null!;
        public string Date { get; set; } = null!;
        public string Size { get; set; } = null!;
        public string File64 { get; set; } = null!;
         public string Name { get; set; } = null!;

        public override string ToString()
        {
            return string.Format("{0}${1}${2}${3}${4}${5}${6}",
                Id, Owner, Format, Date, Size, File64, Name
                );
        }

    }



}
