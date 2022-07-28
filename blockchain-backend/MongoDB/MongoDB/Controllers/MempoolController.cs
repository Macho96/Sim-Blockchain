using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Services;
using MongoDB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MongoDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MempoolController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly FileService services;

        public MempoolController(IConfiguration configuration)
        {
            _configuration = configuration;
            services = new FileService(_configuration);
        }

        [HttpGet("UserName/{owner}")]
        public ActionResult<List<FilesU>> Get(string owner) => services.GetFilesU(owner);


        [HttpPost]
        public ActionResult Post(FilesU newFilesU)
        {
            var response = services.Create(newFilesU);
            if (response is null)
            {
                return new ObjectResult(new { msg = "ya existe un archivo con ese id" });

            }

            return new ObjectResult(new { msg = "archivo creado correctamente" });
        }
        [Route("createMany")]
        [HttpPost]
        public ActionResult Create(List<FilesU> list)
        {
            var num = services.CreateMany(list);

            return new ObjectResult(new { msg = num + " archivos cargados correctamente" });
        }
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var filesU = services.Remove(id);

            if (filesU is null)
            {
                return new ObjectResult(new { msg = "No se ha encontrado un archivo con esa id" });
            }

            return new ObjectResult(new { msg = "archivo eliminado correctamente" });
        }
        [Route("deleteMany")]
        [HttpPost]
        public ActionResult DeleteMany(List<FilesU> list)
        {
            var num = services.RemoveMany(list);

            return new ObjectResult(new { msg = num + " archivos eliminados correctamente" });
        }
    }
}
