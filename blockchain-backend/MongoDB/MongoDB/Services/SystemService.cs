using MongoDB.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MongoDB.Services
{
    public class SystemService
    {
        private readonly IConfiguration _configuration;
        private readonly MongoClient dbclient;
        private IMongoCollection<SystemOption> collection;
        public SystemService(IConfiguration configuration)
        {
            _configuration = configuration;
            dbclient = new MongoClient(_configuration.GetConnectionString("BlockChainConection"));
            collection = dbclient.GetDatabase("BlockChain").GetCollection<SystemOption>("System");
        }
        public List<SystemOption> GetSystemOptions() => collection.Find(systemOption => true).ToList();

        public SystemOption GetSystemOption(string option) {
            var systemOption = collection.Find(x => x.Option == option).FirstOrDefault();
            if (systemOption != null)
            {
                return systemOption;
            }
            return null;
        }

        public SystemOption Create(SystemOption newSystemOption)
        {
            var systemOption = collection.Find(x => x.Option == newSystemOption.Option).FirstOrDefault();
            if (systemOption != null) {
                return null;
            }
            collection.InsertOneAsync(newSystemOption);
            return newSystemOption;
        }

       public SystemOption Update(string option, SystemOption newSystemOption)
        {
            var systemOption = collection.Find(x => x.Option == option).FirstOrDefault();
            if (systemOption != null)
            {
                collection.ReplaceOne(x => x.Option == option, newSystemOption);
                return newSystemOption;
            }
            
            return null;
        }

        public SystemOption Remove(string option) {
            var systemOption = collection.Find(x => x.Option == option).FirstOrDefault();
            if (systemOption != null)
            {
                collection.DeleteOne(x => x.Option == option);
                return systemOption;
            }
            return null;
            
    }
    }

}
