using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Models;
using MongoDB.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MongoDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService services;

        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
            services = new UserService(_configuration);
        }
   
        [HttpGet]
        public ActionResult <List<Users>> Get() =>services.GetUsers();

      
        [HttpGet("{id:length(24)}")]
        public ActionResult<Users> Get(string id)
        {
            var user = services.GetUser(id);

            if (user is null)
            {
                new ObjectResult(new { msg = "el usuario no existe" });
            }

            return user;
        }

        [HttpPost]
        public ActionResult Post(Users newUser)
        {
            var response= services.Create(newUser);
            if (response is null) {
                return new ObjectResult(new { msg = "ya existe un usuario con ese correo" });

            }

            return new ObjectResult(new { msg = "usuario creado correctamente" });
        }

        [HttpPut("{id:length(24)}")]
        public ActionResult Update(string id, Users updatedUser)
        {
            var user = services.Update(id, updatedUser);

            if (user is null)
            {
                return new ObjectResult(new { msg = "el usuario no existe" });
            }

             return new ObjectResult(new { msg = "usuario actualizado correctamente" });
        }

        [HttpDelete("{id:length(24)}")]
        public ActionResult Delete(string id)
        {
            var user = services.Remove(id);

            if (user is null)
            {
                return new ObjectResult(new {msg="No se ha encontrado un usuario con ese id"});
            }
           
            return new ObjectResult(new { msg = "Usuario eliminado correctamente" });
        }
        [Route("login")]
        [HttpPost]
        public ActionResult<Users> Authenticate(Login userIn) {

            var user =  services.Auth(userIn);

            if (user is null)
            {
                return  new ObjectResult(new { msg = "usuario no existe" });
            }
            else {

                if (user.Password.Equals(userIn.password))
                {
                    return user;
                    
                }
                else {
                    return new ObjectResult(new { msg = "contraseña incorrecta" });
                }

                
            }
        }

    }   
}
