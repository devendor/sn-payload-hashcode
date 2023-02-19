/**
 * A pure-js implimentation of java.lang.String.hashCode method.
 * Returns a hash code for this string. The hash code for a String object is computed as
 *
 *  s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 *   
 * using int arithmetic, where s[i] is the ith character of the string, n is the length of the string, and ^ indicates exponentiation. (The hash value of the empty string is zero.
 * @parm {string_in)
 * @returns {int} The same hashCode java.lang.String.hashCode would generate for the same String value.
 */

function strHashCode(string_in) {
    "use strict";
    if (typeof string_in !== 'string')
        throw new TypeError("string_in must be type string");
    let hash = 0;
    if (string_in.length == 0) return hash;
    for (let i = 0; i < string_in.length; i++) {
        let char = string_in.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer                                             
    }
    return hash;
}

exports.strHashCode = strHashCode;
exports.polyfill = function() {
    if (!('hashCode' in String.prototype))
        String.prototype.hashCode = function() {
            return strHashCode(String(this));
        };
};