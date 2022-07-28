using MongoDB.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MongoDB.Services
{
    public class UserService
    {
        private readonly IConfiguration _configuration;
        private readonly MongoClient dbclient;
        private IMongoCollection<Users> collection;
        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
            dbclient = new MongoClient(_configuration.GetConnectionString("BlockChainConection"));
            collection = dbclient.GetDatabase("BlockChain").GetCollection<Users>("User");
        }
        public List<Users> GetUsers() => collection.Find(user => true).ToList();

        public Users GetUser(string id) {
            var user = collection.Find(x => x.Id == id).FirstOrDefault();
            if (user != null)
            {
                return user;
            }
            return null;
        }

        public Users Create(Users newUser)
        {
            var user = collection.Find(x => x.Email == newUser.Email).FirstOrDefault();
            if (user != null) {
                return null;
            }
            collection.InsertOneAsync(newUser);
            return newUser;
        }

        public Users Update(string id, Users updatedUser)
        {
            var user = collection.Find(x => x.Id == id).FirstOrDefault();
            if (user != null)
            {
                collection.ReplaceOne(x => x.Id == id, updatedUser);
                return updatedUser;
            }
            
            return null;
        }

        public Users Remove(string id) {
            var user = collection.Find(x => x.Id == id).FirstOrDefault();
            if (user != null)
            {
                collection.DeleteOne(x => x.Id == id);
                return user;
            }
            return null;
            
    }

        public Users Auth(Login userIn)
        {
            var user = collection.Find(user => user.Email.Equals(userIn.email)).FirstOrDefault();
            if (user != null)
            {
                return user;
            }
            return null;
           
        }
    }

}
