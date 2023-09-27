using A2.Data;
using A2.Dtos;
using A2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace A2.Controllers
{
    [Route("api")]
    [ApiController]
    public class A2Controller : Controller
    {
        private readonly IA2Repo _a2Repo;
        public A2Controller(IA2Repo a2Repo)
        {
            _a2Repo = a2Repo;
        }
        [HttpPost("Register")]
        public ActionResult Register(User user)
        {
            bool userAvailable = _a2Repo.reg(user);
            if (userAvailable)
            {
                return Ok("User successfully registered.");
            }
            else
            {
                return Ok("Username not available.");
            }

        }
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpGet("GetVersionA")]
        public ActionResult GetVersionA()
        {
            return Ok("1.0.0 (auth)");
        }
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpGet("PurchaseItem/{id}")]
        public ActionResult<Order> PurchaseItem(int id)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string name = c.Value;
            Order order = new Order { UserName = name, ProductId = id };


            return Ok(order);

        }
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpGet("PairMe")]
        public ActionResult PairMe()
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string name = c.Value;
            if (!_a2Repo.WaitReco())
            {
                GameRecord gameRecord = _a2Repo.NewRecord(name);
                GameRecordOut gameRecordOut = new GameRecordOut { gameId = gameRecord.GameId, state = gameRecord.State, player1 = gameRecord.Player1 };
                return Ok(gameRecordOut);
            }
            else
            {
                GameRecord gameRecord = _a2Repo.FindRecord();
                if (gameRecord.Player1 == name)
                {
                    GameRecordOut gameRecordOut = new GameRecordOut { gameId = gameRecord.GameId, state = gameRecord.State, player1 = gameRecord.Player1 };
                    return Ok(gameRecordOut);
                }
                else
                {
                    GameRecord startNewGame = _a2Repo.UpdateRecord(name);
                    GameRecordOut gameRecordOut = new GameRecordOut { gameId = startNewGame.GameId, state = startNewGame.State, player1 = startNewGame.Player1, player2 = startNewGame.Player2, lastMovePlayer1 = startNewGame.LastMovePlayer1, lastMovePlayer2 = startNewGame.LastMovePlayer2 };
                    return Ok(gameRecordOut);
                }

            }
        }
        
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpGet("TheirMove/{gameId}")]
        public ActionResult TheirMove(string gameId)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string name = c.Value;
            if (!_a2Repo.HaveGameRecord(gameId))
            {
                return Ok("no such game id");
            }
            GameRecord gameRecord = _a2Repo.FindGameRecord(gameId);
            if (gameRecord.Player2 != name && gameRecord.Player1 != name)
            {
                return Ok("not your game id");
            }
            else
            {
                if (gameRecord.State != "progress")
                {
                    return Ok("You do not have an opponent yet.");
                }
                else
                {
                    if ((gameRecord.Player1 == name && gameRecord.LastMovePlayer2 == null) || (gameRecord.Player2 == name && gameRecord.LastMovePlayer1 == null))
                    {
                        return Ok("Your opponent has not moved yet.");
                    }
                    if (gameRecord.Player1 == name)
                    {
                        return Ok(gameRecord.LastMovePlayer2);
                    }
                    return Ok(gameRecord.LastMovePlayer1);
                }
            }
        }
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpPost("MyMove")]
        public ActionResult MyMove(GameMove gameMove)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string name = c.Value;
            if (!_a2Repo.HaveGameRecord(gameMove.GameId))
            {
                return Ok("no such game id");
            }
            GameRecord gameRecord = _a2Repo.FindGameRecord(gameMove.GameId);
            if (gameRecord.Player2 != name && gameRecord.Player1 != name)
            {
                return Ok("not your game id");
            }
            else
            {
                if (gameRecord.State != "progress")
                {
                    return Ok("You do not have an opponent yet.");
                }
                else
                {
                    if ((gameRecord.LastMovePlayer2 != null && gameRecord.Player2 == name) || (gameRecord.LastMovePlayer1 != null && gameRecord.Player1 == name))
                    {
                        return Ok("It is not your turn.");
                    }
                    _a2Repo.RegisterMove(name, gameMove.Move, gameMove.GameId);
                    return Ok("move registered");
                }
            }
        }
        [Authorize(AuthenticationSchemes = "A2AuthHandler")]
        [HttpGet("QuitGame/{gameId}")]
        public ActionResult QuitGame(string gameId)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string name = c.Value;
            if (!_a2Repo.IsInGame(gameId, name))
            {
                return Ok("You have not started a game");
            }
            if (!_a2Repo.HaveGameRecord(gameId))
            {
                return Ok("no such gameId");
            }
            GameRecord gameRecord = _a2Repo.FindGameRecord(gameId);
            if (gameRecord.Player2 != name && gameRecord.Player1 != name)
            {
                return Ok("not your game id");
            }
            _a2Repo.QuitGame(gameId);
            return Ok("game over");
        }
    }
}