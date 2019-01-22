(function () {
    var lib = {
        ajax: function (url, data, success, method) {
            var params = data;
            if (typeof data === 'object') {
                var p = [];
                for (var k in data) {
                    if (data.hasOwnProperty(k) === true) {
                        p.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
                    }
                }
                params = p.join('&');
            }
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            url = (method === 'GET') ? url + '?' + params : url;
            xhr.open(method, url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState > 3 && xhr.status === 200) {
                    success(xhr.responseText);
                }
            };
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);
            return xhr;
        },
        parseQuery: function(qstr) {
            var query = {};
            var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
            for (var i = 0; i < a.length; i++) {
                var b = a[i].split('=');
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
            }
            return query;
        },
        parseToJson: function (sText) {
            try {
                return (typeof JSON === 'object') ? JSON.parse(sText) : false;
            } catch (e) {
                return false;
            }
        },
        loadDynamicJs: function (js) {
            if (typeof js !== 'string' || js.length === 0) {
                return false;
            }
            var oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            oScript.charset = 'utf-8';
            oScript.src = js;
            document.getElementsByTagName('head')[0].appendChild(oScript);
        }
    };

    var ga2 = {
        run: function (ga2_module_type) {
            var params = lib.parseQuery(location.search);
            params['ga2_module_type'] = ga2_module_type;
            lib.ajax('/cstore-api/googleanalytics2/load', params, function (sResponse) {
                var oResponse = lib.parseToJson(sResponse);

                if (!oResponse || oResponse.hasOwnProperty('Data') !== true) {
                    return false;
                }

                oResponse = oResponse['Data'];
                if (oResponse && oResponse.hasOwnProperty('config') === true) {
                    window._cstore_ga2 = oResponse['config'];
                }

                //dynamic js load
                if (oResponse && oResponse.hasOwnProperty('js') === true) {
                    var aJsList = oResponse['js'];
                    for (var iIdx = 0; iIdx < aJsList.length; iIdx++) {
                        lib.loadDynamicJs(aJsList[iIdx]);
                    }
                }
            }, 'GET');
        }
    };

    var ga2_module_type = (document.getElementById('_ga2_enhance')) ? 'enhance' : 'code';
    ga2.run(ga2_module_type);
})();
