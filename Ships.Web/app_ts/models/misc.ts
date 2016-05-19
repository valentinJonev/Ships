module Ships.Web.Models.Misc {
    'use strict';

    export class ErrorModel {
        constructor(public message: string, public errorList: string[]) {
        }
    }
}

