var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Directives;
        (function (Directives) {
            'use strict';
            var ModalDirective = (function () {
                function ModalDirective(shipsViewPaths) {
                    var directive = {};
                    directive.restrict = 'E';
                    directive.replace = true;
                    directive.transclude = true;
                    directive.templateUrl = shipsViewPaths.shared.modal;
                    directive.link = function postLink(scope, element, attrs) {
                        scope.title = attrs.title;
                    };
                    return directive;
                }
                ModalDirective.$inject = ['shipsViewPaths'];
                return ModalDirective;
            })();
            Directives.ModalDirective = ModalDirective;
        })(Directives = Web.Directives || (Web.Directives = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
