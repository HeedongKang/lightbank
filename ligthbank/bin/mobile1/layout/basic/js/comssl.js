//https 로 이동
if (location.protocol === 'http:' && location.host.indexOf('cafe24.com') === -1) {
    var sUrl = 'https://' + location.host + location.pathname + location.search;

    window.location.replace(sUrl);
}