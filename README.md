# Summary
Pure js module to reproduce the "hashcode" on sys_update_xml files within servicenow.

# Install
```shell
npm install @devendor/sn-payload-hashcode --save-dev
```
# Exports
## strHashCode and polyfill

strHashCode is a pure-js implimentation of the java String.hashCode Method
```shell
rferguson@mendota:~/code/sn-payload-hashcode$ nodejs
> require('.').strHashCode('Helo World');
840137394
> require('.').polyfill();
undefined
> 'Helo World'.hashCode();
840137394

```

Compare to Java
```shell
rferguson@mendota:~/code/sn-payload-hashcode/test$ cat Main.java
public class Main {
  public static void main(String[] args) {
    String myStr = "Helo World";
    System.out.println(myStr.hashCode());
  }
}
rferguson@mendota:~/code/sn-payload-hashcode/test$ javac Main.java
rferguson@mendota:~/code/sn-payload-hashcode/test$ java Main
840137394
```

## payloadHashCode
The payloadHashCode replicates the hashcode algorythem servicenow uses
for sys_update_xml records.  The <payload></payload> portion of these records
also makes up the xml files the Studio app checks into git. 

The method will work on either an isolated payload like the ones in git or the sys_update_xml files.

Note: This relies on consistent formatting which appears to include four space indentation, "\n"
line delimeters, no trailing line feed, and scrubbing of volatile metadata like sys_updated_on etc.

```shell
rferguson@mendota:~/code/sn-payload-hashcode$ nodejs <test/test_extractPayload.js test/test_payloadHashCode.js
passed
```

```js
{
    let sys_update_version_xml =  [ '<?xml version="1.0" encoding="UTF-8"?><record_update table="sys_embedd
ed_help_role">',
  '    <sys_embedded_help_role action="INSERT_OR_UPDATE">',
  '        <order>10</order>',
  '        <role display_value="x_dete_emb.edded_content_admin" name="x_dete_emb.edded_content_admin">d3c89
ea5db07330098cbde82ca9619ee</role>',
  '        <sys_class_name>sys_embedded_help_role</sys_class_name>',
  '        <sys_created_by>ray.ferguson</sys_created_by>',
  '        <sys_created_on>2019-08-03 20:56:39</sys_created_on>',
  '        <sys_id>446952e1db07330098cbde82ca9619fb</sys_id>',
  '        <sys_mod_count>0</sys_mod_count>',
  '        <sys_name>d3c89ea5db07330098cbde82ca9619ee</sys_name>',
  '        <sys_package display_value="Embedded Content" source="x_dete_emb">1b951ea1db07330098cbde82ca9619
ac</sys_package>',
  '        <sys_policy/>',
  '        <sys_scope display_value="Embedded Content">1b951ea1db07330098cbde82ca9619ac</sys_scope>',
  '        <sys_update_name>sys_embedded_help_role_446952e1db07330098cbde82ca9619fb</sys_update_name>',
  '        <sys_updated_by>ray.ferguson</sys_updated_by>',
  '        <sys_updated_on>2019-08-03 20:56:39</sys_updated_on>',
  '    </sys_embedded_help_role>',
  '</record_update>'].join("\n");
    let hashCode = require('.').calculatePayloadHashCode(sys_update_version_xml);
    if (hashCode == 2078306678){ // sys_update_xml.payload_hash from system.
        console.log('passed');
    } else {
        console.log(failed);
    }

}
```
# running with the cli utility

## help
```shell

# Note: ./cli.js gets install into ./node_modules/.bin/sn-payload-hashcode
rferguson@mendota:~/code/sn-payload-hashcode$ ./cli.js -h
Reading from STDIN
cli.js@1.0.0

CLI OPTIONS:
  -f, --file       Input file(s) (Pass '-' for stdin)
  -h, --help       Show this help
  -v, --version   Show package version
```

## STDIN
```shell

rferguson@mendota:~/code/sn-payload-hashcode$ ./cli.js <../x_dete_emb/xml/sys_app_1b951ea1db07330098cbde82ca9
619ac.xml
Reading from STDIN
{
  "-": 1902278309
}
```
## explicit
```shell

rferguson@mendota:~/code/sn-payload-hashcode$ ./cli.js -f ../x_dete_emb/xml/sys_app_1b951ea1db07330098cbde82
ca9619ac.xml
{
  "/home/rferguson/code/x_dete_emb/xml/sys_app_1b951ea1db07330098cbde82ca9619ac.xml": 1902278309
}
```

## Using shell globbing when glob param is not quoted. (unixes)
```shell
rferguson@mendota:~/code/sn-payload-hashcode$ ./cli.js -f ../x_dete_emb/xml/update/content_css_*
{
  "/home/rferguson/code/x_dete_emb/xml/update/content_css_7f5aa2d9db1ff7009c1a622dca961926.xml": -1709665871
,
  "/home/rferguson/code/x_dete_emb/xml/update/content_css_9befee5ddb1ff7009c1a622dca961916.xml": -268430420,
  "/home/rferguson/code/x_dete_emb/xml/update/content_css_f838463cdb57b7009c1a622dca9619bd.xml": 1226607513
}
```

## Using nodejs glob module when quoted glob pattern.
```
rferguson@mendota:~/code/sn-payload-hashcode$ ./cli.js -f '../x_dete_emb/xml/update/sys_{user_role,ui_view}_
*.xml'
{
  "/home/rferguson/code/x_dete_emb/xml/update/sys_ui_view_d4ad467cdb38a010862db298f496194a.xml": -24878458,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_a0a99ea5db07330098cbde82ca9619f2.xml": 565386732
,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_contains_be6a56e5db07330098cbde82ca96199f.xml":
-1785291525,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_d3c89ea5db07330098cbde82ca9619ee.xml": -20548678
}
```
## Debug logging
```
rferguson@mendota:~/code/sn-payload-hashcode$ DEBUG_SN_PAYLOAD_HASH=1 ./cli.js -f '../x_dete_emb/xml/update/
sys_{user_role,ui_view}_*.xml'
isTTY: true
checkFile-param /home/rferguson/code/x_dete_emb/xml/update/sys_{user_role,ui_view}_*.xml
using glob
{
  "/home/rferguson/code/x_dete_emb/xml/update/sys_ui_view_d4ad467cdb38a010862db298f496194a.xml": -24878458,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_a0a99ea5db07330098cbde82ca9619f2.xml": 565386732
,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_contains_be6a56e5db07330098cbde82ca96199f.xml":
-1785291525,
  "/home/rferguson/code/x_dete_emb/xml/update/sys_user_role_d3c89ea5db07330098cbde82ca9619ee.xml": -20548678
}
```
