window['adrum-start-time'] = new Date().getTime();
(function (config) {
    function isRunningInProd() {
        return (window.location.href.indexOf("//nav.no") > -1) || (window.location.href.indexOf("//www.nav.no") > -1);
    }
    if (isRunningInProd()) {
        config.adrumExtUrlHttps = 'https://jsagent.nav.no';
        config.beaconUrlHttps = 'https://eumgw.nav.no';
        config.appKey = 'EUM-AAB-AXG';
    } else {
        config.adrumExtUrlHttps = 'https://jsagent.adeo.no';
        config.beaconUrlHttps = 'https://eumgw.adeo.no';
        config.appKey = 'EUM-AAB-AXH';
    }
    config.xd = {enable: false};
    config.spa = {"spa2": true};
})(window['adrum-config'] || (window['adrum-config'] = {}));
