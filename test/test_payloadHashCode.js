{
    let sys_update_version_xml =  [ '<?xml version="1.0" encoding="UTF-8"?><record_update table="sys_embedded_help_role">',
  '    <sys_embedded_help_role action="INSERT_OR_UPDATE">',
  '        <order>10</order>',
  '        <role display_value="x_dete_emb.edded_content_admin" name="x_dete_emb.edded_content_admin">d3c89ea5db07330098cbde82ca9619ee</role>',
  '        <sys_class_name>sys_embedded_help_role</sys_class_name>',
  '        <sys_created_by>ray.ferguson</sys_created_by>',
  '        <sys_created_on>2019-08-03 20:56:39</sys_created_on>',
  '        <sys_id>446952e1db07330098cbde82ca9619fb</sys_id>',
  '        <sys_mod_count>0</sys_mod_count>',
  '        <sys_name>d3c89ea5db07330098cbde82ca9619ee</sys_name>',
  '        <sys_package display_value="Embedded Content" source="x_dete_emb">1b951ea1db07330098cbde82ca9619ac</sys_package>',
  '        <sys_policy/>',
  '        <sys_scope display_value="Embedded Content">1b951ea1db07330098cbde82ca9619ac</sys_scope>',
  '        <sys_update_name>sys_embedded_help_role_446952e1db07330098cbde82ca9619fb</sys_update_name>',
  '        <sys_updated_by>ray.ferguson</sys_updated_by>',
  '        <sys_updated_on>2019-08-03 20:56:39</sys_updated_on>',
  '    </sys_embedded_help_role>',
  '</record_update>'].join("\n");
    let hashCode = require('.').calculatePayloadHashCode(sys_update_version_xml);
    if (hashCode == 2078306678){
        console.log('passed');
        process.exit(0);
    } else {
        console.log(failed);
        process.exit(1);
    }

}
