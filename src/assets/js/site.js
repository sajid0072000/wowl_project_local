function apiCall(url, args, cache) {
    return new Promise((resolve, reject) => {
        if (cache && cache[url]) {
            resolve(cache[url]);
        } else {
            var fullURL = url + '?';
            for (var obj in args) {
                fullURL += obj + '=' + encodeURIComponent(args[obj]) + '&';
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', fullURL);
            xhr.responseType = "json";
            xhr.onload = (e) => {
                if (cache) {
                    cache[url] = xhr.response;
                }
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                reject(e);
            };
            xhr.onabort = (e) => {
                reject(e);
            };
            xhr.send();
        }
    });
}

function apiCallPostJson(url, data, cache) {
    return new Promise((resolve, reject) => {
        if (cache && cache[url]) {
            resolve(cache[url]);
        } else {
            var fullURL = url + '?';
            //for (var obj in args) {
            //    fullURL += obj + '=' + encodeURIComponent(args[obj]) + '&';
            //}
            var xhr = new XMLHttpRequest();
            xhr.open('POST', fullURL);
            xhr.responseType = "json";
            xhr.onload = (e) => {
                if (cache) {
                    cache[url] = xhr.response;
                }
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                reject(e);
            };
            xhr.onabort = (e) => {
                reject(e);
            };
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(data));
        }
    });
}

