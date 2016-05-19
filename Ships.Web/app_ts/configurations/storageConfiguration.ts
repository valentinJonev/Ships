/// <reference path="../_all.ts" />

module Ships.Web.Configurations {
    'use strict';
    
    export function configureLocalStorage(localStorageServiceProvider: angular.local.storage.ILocalStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('ships-web')
            .setStorageType('localStorage');
    }
}