{

    require("./strHashCode").polyfill();
    const PAYLOAD_PATTERN_STRING = [

        "<sys_updated_by[^<]*?>[^<]*?<\\/sys_updated_by>|<sys_updated_by\\/>",
        "<sys_updated_on[^<]*?>[^<]*?<\\/sys_updated_on>|<sys_updated_on\\/>",
        "<sys_created_by[^<]*?>[^<]*?<\\/sys_created_by>|<sys_created_by\\/>",
        "<sys_created_on[^<]*?>[^<]*?<\\/sys_created_on>|<sys_created_on\\/>",
        "<sys_mod_count[^<]*?>[^<]*?<\\/sys_mod_count>|<sys_mod_count\\/>",
        "<sys_id[^<]*?>[^<]*?<\\/sys_id>|<sys_id\\/>",
        "<sys_code[^<]*?>[^<]*?<\\/sys_code>|<sys_code\\/>",
        "<sys_path[^<]*?>[^<]*?<\\/sys_path>|<sys_path\\/>",
        "<sys_source_id[^<]*?>[^<]*?<\\/sys_source_id>|<sys_source_id\\/>",
        "<sys_parent[^<]*?>[^<]*?<\\/sys_parent>|<sys_parent\\/>",
        "<sys_update_name[^<]*?>[^<]*?<\\/sys_update_name>|<sys_update_name\\/>",
        "<customer_update[^<]*?>[^<]*?<\\/customer_update>|<customer_update\\/>",
        "<sys_customer_update[^<]*?>[^<]*?<\\/sys_customer_update>|<sys_customer_update\\/>",
        "<sys_app_file[^<]+<[^<]+sys_app_file>",
        "<sys_package[^<]+<[^<]+sys_package>",
        "<[^<]*?action=\"delete_multiple\"[^<]*?\\/>",
        "<sys_attachment[^<]*?>[^<]*?<\\/sys_attachment>|<sys_attachment\\/>",
        "<unload[^<]*?>"
        //"<sys_mod_count[^<]*?>[^<]*?<\\/sys_mod_count>|<sys_sys_mod_count\\/>",
        //"<type>local</type>",
        //"<type>remote</type>",
        //"<url[^<]*?>[^<]*?<\\/url>|<url\\/>",
    ].join("|");

    const PAYLOAD_PATTERN = new RegExp(PAYLOAD_PATTERN_STRING, 'g');
    const extractPayload = (string_in) => String(string_in)
        .split(/<\/?payload>/)[1]
        .replace('<![CDATA[', '')
        .replace(']]>', '');
    /*
            .replace(/&&lt;/gi, "<")
            .replace(/&&gt;/gi, '>')
            .replace(/&&amp;/gi, '&')
            .replace(/&&37;/g, "'")
            */


    /**
     * @param {string} string_in A string containing a payload
     * @returns {int} hashCode
     */
    const calculatePayloadHashCode = function(string_in) {
        let payload_string = (string_in.includes("<payload>")) ? extractPayload(string_in) : string_in.trimEnd();
        let normalized_payload = payload_string.replace(PAYLOAD_PATTERN, "");
        return normalized_payload.hashCode();
    };

    exports.extractPayload = extractPayload;
    exports.calculatePayloadHashCode = calculatePayloadHashCode;
    exports.PAYLOAD_PATTERN = PAYLOAD_PATTERN;
    exports.PAYLOAD_PATTERN_STRING = PAYLOAD_PATTERN_STRING;
}