/**
 * 创建全局唯一标识，长度128 bit，可以确保时间和空间上的唯一性。
 *
 * @exports createGuid
 *
 * @returns {String} guid
 *
 *
 * @example
 * this.guid = CesiumPro.createGuid();
 *
 * @see {@link http://www.ietf.org/rfc/rfc4122.txt|RFC 4122 A Universally Unique IDentifier (UUID) URN Namespace}
 */
function createGuid() {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export default createGuid;
