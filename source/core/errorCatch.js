/*
 * 捕获ajax异常
 */
/**
 * @private
 * 捕获ajax异常
 * @param {Any} e ajax抛出的错误
 * @param {*} callback 回调函数
 */
const errorCatch = function (e, callback) {
  if (e.response) {
    callback(e.response.data);
  } else if (e.request) {
    callback(e.request);
  } else {
    callback(e.message);
  }
};

export default errorCatch;
