using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Services;
using MongoDB.helpers;
using MongoDB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MongoDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockchainController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly SystemService servicesSystem;
        private readonly FileService servicesFiles;
        private readonly BlockchainService servicesChain;
        private const int REQUISITE = 4;
        private const string REQUISITE_STRING = "0000";
        public BlockchainController(IConfiguration configuration)
        {
            _configuration = configuration;
            servicesSystem = new SystemService(_configuration);
            servicesFiles = new FileService(_configuration);
            servicesChain = new BlockchainService(_configuration);
        }

       [HttpGet("UserName/{owner}")]
        public ActionResult<List<Block>> Mine(string owner)
        {
            var quantity = servicesSystem.GetSystemOption("numero por bloque").Value;
            var files = servicesFiles.GetFilesU(owner);
            var actualBlock = 0;
            var previousHash = firstPreviousHash();
            var numberFile = 0;
            var owner2 = "";
            List<FilesU> listFilesInBlock = new List<FilesU>();
            Block block = null;
            List<Block> chain = new List<Block>();
            if (previousHash.Substring(0, REQUISITE) == REQUISITE_STRING)
            {
                foreach (var document in files)
                {
                    listFilesInBlock.Add(document);
                    if (numberFile == int.Parse(quantity)-1)
                    {
                        block = BlockMethod.createBlock(actualBlock, previousHash, listFilesInBlock);
                        chain.Add(block);
                        numberFile = 0;
                        actualBlock++;
                        previousHash = block.Hash;
                        listFilesInBlock = new List<FilesU>();
                    }
                    else if (document == files.Last())
                    {
                        block = BlockMethod.createBlock(actualBlock, previousHash, listFilesInBlock);
                        chain.Add(block);
                        owner2 = owner;
                        //owner = own;
                    }
                    else
                    {
                        Console.WriteLine(numberFile + "-)Añadido al bloque " + actualBlock + " = " + document.Name);
                        numberFile++;
                    }
                }
                Chain blockChain = new  Chain("",owner, chain);
                var response = servicesChain.Create(blockChain);
                if (response is null)
                {
                    return new ObjectResult(new { msg = blockChain = null });
                }
                return new ObjectResult(new { msg = blockChain });
            }
            else{

                return new ObjectResult(new { msg = chain = null });
            }

        }

        [HttpGet("Owner/{owner}")]
        public ActionResult<List<Chain>> GetChain(string owner)
        {
         var chain = servicesChain.GetChain(owner);

            if (chain is null)
            {
                new ObjectResult(new { msg = "la cadena no existe" });
            }

            return chain;
        }
        private static string firstPreviousHash()
        {
            return "0000000000000000000000000000000000000000000000000000000000000000";
        }

    }
}
