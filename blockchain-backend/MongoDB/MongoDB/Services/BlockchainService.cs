using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Models;
using System.Collections.Generic;
using System.Linq;
using System;


namespace MongoDB.Services
    
{
    public class BlockchainService
    {

        private readonly IConfiguration _configuration;
        private readonly MongoClient dbclient;
        private IMongoCollection<Chain> collection;

        public BlockchainService(IConfiguration configuration)
        {
            _configuration = configuration;
            dbclient = new MongoClient(_configuration.GetConnectionString("BlockChainConection"));
            collection = dbclient.GetDatabase("BlockChain").GetCollection<Chain>("Chain");
        }

        public Chain Create(Chain newChain)
        {
            collection.InsertOneAsync(newChain);
            return newChain;
        }
        public List<Chain> GetChain(string Owner) => collection.Find(x=>x.Owner==Owner).ToList();
    }
}


