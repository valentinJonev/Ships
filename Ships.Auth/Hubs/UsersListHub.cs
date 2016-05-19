using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Ships.Auth.ConnectionManagers;

namespace Ships.Auth
{
    [HubName("UsersListHub")]
    [Authorize]
    public class UsersListHub : Hub
    {
        private static readonly UserConnectionManager manager = new UserConnectionManager();

        public override Task OnConnected()
        {
            manager.AddConnection(Context.Request.User.Identity as ClaimsIdentity, Context.ConnectionId);
            SetUsersList(Context.ConnectionId);

            return base.OnConnected();
        }

        public override Task OnReconnected()
        {
            manager.AddConnection(Context.Request.User.Identity as ClaimsIdentity, Context.ConnectionId);
            SetUsersList(Context.ConnectionId);

            return base.OnReconnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            manager.RemoveConnection(Context.Request.User.Identity as ClaimsIdentity, Context.ConnectionId);
            SetUsersList(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }

        public void InvitePlayer(string playerId, int firstLocaleId)
        {
            UserConnection firstConn = manager.GetConnection(Context.Request.User.Identity as ClaimsIdentity);
            UserConnection secondConn = manager.GetConnection(playerId);

            Clients.Clients(secondConn.ConnectionIds.ToList()).handleInvitation(firstConn.User, firstLocaleId);
        }

        public void AcceptInvitation(UserModel firstUser, int gameId, int firstLocaleId, int secondLocaleId)
        {
            StartGame(firstUser.Id, gameId, firstLocaleId, secondLocaleId);
        }

        public void RejectInvitation(UserModel firstUser)
        {
            RejectGame(firstUser.Id);
        }

        private void StartGame(string firstPlayerId, int gameId, int firstLocaleId, int secondLocaleId)
        {
            UserConnection firstConn = manager.GetConnection(firstPlayerId);
            UserConnection secondConn = manager.GetConnection(Context.Request.User.Identity as ClaimsIdentity);

            string setviceUrl = new RedirectManager(firstLocaleId, secondLocaleId).GetCommonUrl();

            Clients.Clients(firstConn.ConnectionIds.ToList()).startGame(gameId, secondConn.User, setviceUrl);
            Clients.Clients(secondConn.ConnectionIds.ToList()).startGame(gameId, firstConn.User, setviceUrl);
        }

        private void RejectGame(string playerId)
        {
            UserConnection conn = manager.GetConnection(playerId);
            Clients.Clients(conn.ConnectionIds.ToList()).handleRejection(conn.User);
        }

        private void SetUsersList(string connectionId)
        {
            List<UserModel> allUsers = manager.Connections.Values
                .Select(x => x.User).ToList();

            Clients.All.setUsersList(allUsers);
        }
    }
}
