
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MongoDB.Models
{
    public class Chain
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("Owner")]
        public string Owner { get; set; } = null!;
        public List<Block> Blockchain { get; set; } = null!;


        public Chain(string id, string Owner, List<Block> Blockchain) {
            this.Id = id;
            this.Owner = Owner;
            this.Blockchain = Blockchain;
        }

    }
}
