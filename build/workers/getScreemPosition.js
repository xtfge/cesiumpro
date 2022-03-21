(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    postMessage('hello worker');
    self.addEventListener('message', function (e) {
        self.postMessage('You said: ' + e.data);
    }, false);

}));
