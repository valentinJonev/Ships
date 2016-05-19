module Ships.Web.Directives {
    'use strict';

    export class ModalDirective {
        static $inject = ['shipsViewPaths'];

        constructor(shipsViewPaths: Constants.ShipsViewPaths) {
            var directive: angular.IDirective = <angular.IDirective>{};

            directive.restrict = 'E';
            directive.replace=  true;
            directive.transclude = true;
            directive.templateUrl = shipsViewPaths.shared.modal;
            directive.link = function postLink(scope: IModalScope, element: HTMLElement, attrs: IModalAttrs) {
                    scope.title = attrs.title;
            };

            return directive;
        }
    }

    export interface IModalScope extends angular.IScope {
        title: string;
    }

    export interface IModalAttrs {
        title: string;
    }
}