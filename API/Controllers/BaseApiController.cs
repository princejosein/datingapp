using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("Api/[Controller]")]
    public class BaseApiController : ControllerBase
    {

    }
}