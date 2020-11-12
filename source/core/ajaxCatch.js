/**
 * 捕获ajax异常
 *
 * @exports ajaxCatch
 * @param {Any} e ajax抛出的错误
 * @param {function} [callback=console.error] 回调函数
 *
 * @example
 *
 * axios.get('url')
 * .then(res=>{
 *    do(res)
 * }).catch(e=>{
 *    CesiumPro.ajaxCatch(e,console.log);
 * })
 */
const errorCatch = function (e, callback = console.error) {
  if (e.response) {
    callback(e.status, e.response.data);
  } else if (e.request) {
    callback(e.status, e.request);
  } else if (e.message) {
    callback(e.status, e.message);
  } else if (e.statusText) {
    callback(e.status, e.statusText);
  } else {
    callback(e);
  }
};

export default errorCatch;
