<?php

defined('DT_ADMIN') or exit('Access Denied');
$install = file_get(DT_CACHE.'/install.lock');
$url = decrypt('ZAsvAQdwX3kqF24QUS9iQnNUZUdcJRZ3DWxuQWwXTCVmDioeW3Z8SVoyc09zDUVxYl5jXysZVzx6CnIABnlFK2QTLzEHQV9a', 'DESTOON').'?action='.$action.'&product=b2b&version='.DT_VERSION.'&release='.DT_RELEASE.'&lang='.DT_LANG.'&charset='.DT_CHARSET.'&install='.$install.'&os='.PHP_OS.'&soft='.urlencode($_SERVER['SERVER_SOFTWARE']).'&php='.urlencode(phpversion()).'&mysql='.urlencode(mysql_get_server_info()).'&url='.urlencode($DT_URL).'&site='.urlencode($DT['sitename']).'&auth='.strtoupper(md5($DT_URL.$install.$_SERVER['SERVER_SOFTWARE']));
if(isset($mfa)) $url .= '&mfa='.$mfa;
dheader($url);
?>