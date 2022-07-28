using MongoDB.Models;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Diagnostics;

namespace MongoDB.helpers
{
    public class BlockMethod
    {
        private const int REQUISITE = 4;
        private const string REQUISITE_STRING = "0000";

        public static Block createBlock(int id, string previousHash, List<FilesU> data) {
            var timer = new Stopwatch();
            var hash = "";
            var test = 0;
            var time = DateTime.Now.ToString("yyyyMMddTHHmmss");
            timer.Start();
            do { 
                test += 1;
                hash = toSHA256(id.ToString() +time+ test + data + previousHash);
                //Console.WriteLine(hash);
            } while ( hash.Substring(0, REQUISITE) != REQUISITE_STRING);
            timer.Stop();
            TimeSpan timeTaken = timer.Elapsed;
            string milliseconds = timeTaken.ToString(@"ffff");
            buildMessage(id,hash, milliseconds, test, time, previousHash);
            Block block = new Block(id.ToString(), time, test.ToString(),milliseconds,data,previousHash,hash);
            return block;
        }
        

        private static string toSHA256(string data )
        {
            var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));

            var sb = new StringBuilder();
            for (int x = 0; x < bytes.Length; x++)
            {
                sb.Append(bytes[x].ToString("x2"));
            }
            return sb.ToString();
        }

        private static void buildMessage(int id, string hash, string milliseconds, int test, string time, string previousHash) {
            Console.WriteLine("=============BLOQUE "+id+"====================");
            Console.WriteLine(" *test: "+test);
            Console.WriteLine(" *time: "+time);
            Console.WriteLine(" *miliseconds: "+milliseconds);
            Console.WriteLine(" *hash:         "+ hash);
            Console.WriteLine(" *Previoushash: "+ previousHash);
            Console.WriteLine("=================================");
        }
    }
}
