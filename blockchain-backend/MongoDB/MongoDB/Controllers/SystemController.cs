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
    public class SystemController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly SystemService services;

        public SystemController(IConfiguration configuration)
        {
            _configuration = configuration;
            services = new SystemService(_configuration);
        }


        [HttpGet]
        public ActionResult<List<SystemOption>> Get() => services.GetSystemOptions();


        [HttpGet("{option}")]
        public ActionResult<SystemOption> Get(string option)
        {
            var systemOption = services.GetSystemOption(option);

            if (systemOption is null)
            {
                new ObjectResult(new { msg = "la configuracion no existe" });
            }

            return systemOption;
        }

        [HttpPost]
        public ActionResult Post(SystemOption newSystemOption)
        {
            var response = services.Create(newSystemOption);
            if (response is null)
            {
                return new ObjectResult(new { msg = "ya existe una configuracion con esa option" });

            }

            return new ObjectResult(new { msg = "configuracion creada correctamente" });
        }
         [HttpPut("{option}")]
        public ActionResult Update(string option, SystemOption updatedSystemOption)
        {
            var systemOption = services.Update(option, updatedSystemOption);

            if (systemOption is null)
            {
                return new ObjectResult(new { msg = "la configuracion no existe" });
            }

             return new ObjectResult(new { msg = "configuracion actualizada correctamente" });
        }
        [HttpDelete("{option}")]
        public ActionResult Delete(string option)
        {
            var systemOption = services.Remove(option);

            if (systemOption is null)
            {
                return new ObjectResult(new { msg = "No se ha encontrado un configuracion con esa option" });
            }

            return new ObjectResult(new { msg = "configuracion eliminada correctamente" });
        }
    }
}
