module Ships.Web.Constants {
    'use strict';

    export class UrlState {
        url: string;
        state: string;
    }

    export class ShipsWebPaths {
        accountLogin: UrlState;
        accountRegister: UrlState;
        home: UrlState;
        game: UrlState;

        constructor() {
            this.accountLogin = { url: '/login', state: 'login' };
            this.accountRegister = { url: '/register', state: 'register' };
            this.home = { url: '/home', state: 'home' };
            this.game = { url: '/game/{game_id:int}/{service_url}', state: 'game' };
        }
    }

    export class ShipsViewPaths {
        shared: SharedViewPaths;
        accountLogin: string;
        accountRegister: string;
        home: string
        error: string;
        invitationConfirm: string;
        gameCreate: string;
        game: string;

        constructor() {
            this.shared = { modal: './views/shared/modalTemplate.html' };
            this.accountLogin = './views/account/login.html';
            this.accountRegister = './views/account/register.html';
            this.home = './views/home.html';
            this.error = './views/error.html';
            this.invitationConfirm = './views/invitationConfirm.html';
            this.gameCreate = './views/gameCreate.html';
            this.game = './views/game.html';
        }
    }

    export class SharedViewPaths {
        modal: string
    }
}