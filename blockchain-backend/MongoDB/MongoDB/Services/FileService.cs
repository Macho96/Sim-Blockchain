using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Models;
using System.Collections.Generic;
using System.Linq;

namespace MongoDB.Services
{
    public class FileService
    {
        private readonly IConfiguration _configuration;
        private readonly MongoClient dbclient;
        private IMongoCollection<FilesU> collection;
        public FileService(IConfiguration configuration)
        {
            _configuration = configuration;
            dbclient = new MongoClient(_configuration.GetConnectionString("BlockChainConection"));
            collection = dbclient.GetDatabase("BlockChain").GetCollection<FilesU>("Mempool");
        }
        public List<FilesU> GetFilesU(string Owner) => collection.Find(x=>x.Owner==Owner).ToList();


        public FilesU Create(FilesU newFilesU)
        {
            var filesU = collection.Find(x => x.Id == newFilesU.Id).FirstOrDefault();
            if (filesU != null)
            {
                return null;
            }
            collection.InsertOneAsync(newFilesU);
            return newFilesU;
        }

        public int CreateMany(List<FilesU> list)
        {
            collection.InsertMany(list);

            return list.Count;
        }


        public FilesU Remove(string id)
        {
            var filesU = collection.Find(x => x.Id == id).FirstOrDefault();
            if (filesU != null)
            {
                collection.DeleteOne(x => x.Id == id);
                return filesU;
            }
            return null;

        }

        public long RemoveMany(List<FilesU> list)
        {
            var listID = ListIDm(list);
            var deleted = 0;
            foreach (var l in listID)
            {
                var result = this.Remove(l);
                if (result is null)
                {
                }
                else {
                    deleted++;
                }
            }
            return deleted;
        }
        
        protected List<string> ListIDm(List<FilesU> list)
        {
            var vs = new List<string>();
            foreach (var l in list) {
                vs.Add(l.Id);
            }
            return vs;
        }
    }

}
