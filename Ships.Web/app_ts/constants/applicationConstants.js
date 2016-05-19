var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Constants;
        (function (Constants) {
            'use strict';
            var UrlState = (function () {
                function UrlState() {
                }
                return UrlState;
            })();
            Constants.UrlState = UrlState;
            var ShipsWebPaths = (function () {
                function ShipsWebPaths() {
                    this.accountLogin = { url: '/login', state: 'login' };
                    this.accountRegister = { url: '/register', state: 'register' };
                    this.home = { url: '/home', state: 'home' };
                    this.game = { url: '/game/{game_id:int}/{service_url}', state: 'game' };
                }
                return ShipsWebPaths;
            })();
            Constants.ShipsWebPaths = ShipsWebPaths;
            var ShipsViewPaths = (function () {
                function ShipsViewPaths() {
                    this.shared = { modal: './views/shared/modalTemplate.html' };
                    this.accountLogin = './views/account/login.html';
                    this.accountRegister = './views/account/register.html';
                    this.home = './views/home.html';
                    this.error = './views/error.html';
                    this.invitationConfirm = './views/invitationConfirm.html';
                    this.gameCreate = './views/gameCreate.html';
                    this.game = './views/game.html';
                }
                return ShipsViewPaths;
            })();
            Constants.ShipsViewPaths = ShipsViewPaths;
            var SharedViewPaths = (function () {
                function SharedViewPaths() {
                }
                return SharedViewPaths;
            })();
            Constants.SharedViewPaths = SharedViewPaths;
        })(Constants = Web.Constants || (Web.Constants = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
