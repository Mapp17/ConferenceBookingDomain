using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ConferenceBookingDomain.api.DTOs;
using System.ComponentModel.DataAnnotations;


namespace api.Controllers
{
   
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || 
                !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new { token });
        }
    }
}