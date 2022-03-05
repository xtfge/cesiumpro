/**
 * 时间数据格式的扩展方法
 *
 * @exports dateFormat
 * @param  {String} fmt  时间格式
 * @param  {Date} date 时间
 * @return {String}     格式化后的时间
 *
 * @example
 * const date=new Date();
 * dateFormat('yy-mm-dd HH:MM:SS',date)
 * dateFormat('HH:MM:SS',date)
 * date.format('yy-mm-dd HH:MM:SS)
 */
 function dateFormat(fmt, date) {
    let ret;
    const opt = {
      'y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    const keys = Object.keys(opt);
    for (const k of keys) {
      ret = new RegExp(`(${k})`).exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length === 1)
          ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
      }
    }
    return fmt;
  }
  window.Date.prototype.format = function (format) {
    dateFormat(format, this);
  };
  export default dateFormat;
  