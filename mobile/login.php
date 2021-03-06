<?php
$moduleid = 2;
require 'common.inc.php';
require DT_ROOT.'/module/'.$module.'/common.inc.php';
require DT_ROOT.'/include/post.func.php';
isset($auth) or $auth = '';
if(isset($_POST['ok'])) {
	include load('member.lang');
	$msg = captcha($captcha, $MOD['captcha_login'], true);
	if($msg) mobile_msg($msg);
	require DT_ROOT.'/module/member/member.class.php';
	$do = new member;
	$username = input_trim($username);
	if(!$username) mobile_msg($L['type_username']);
	if(!$password) mobile_msg($L['type_password']);
	if(is_email($username)) {
		$r = $db->get_one("SELECT username FROM {$DT_PRE}member WHERE email='$username'");
		$r or mobile_msg($L['not_email']);
		$username = $r['username'];
	} else if(is_mobile($username)) {
		$r = $db->get_one("SELECT username,vmobile FROM {$DT_PRE}member WHERE mobile='$username'");
		if($r && $r['vmobile']) $username = $r['username'];
	}
	$user = $do->login($username, $password, 86400*365);
	if($user) {
		if(get_cookie('weixin_openid')) {
			set_cookie('weixin_url', $forward);
			mobile_msg('', 'weixin.php?action=bind');
		}
		mobile_msg('', $forward ? $forward : 'my.php');
	} else {
		mobile_msg($do->errmsg);
	}
} else {
	isset($username) or $username = $_username;
	$username or $username = get_cookie('username');
	(check_name($username) || is_email($username) || is_mobile($username)) or $username = '';
	$OAUTH = cache_read('oauth.php');
	$oa = 0;
	foreach($OAUTH as $v) {
		if($v['enable']) {
			$oa = 1;
			break;
		}
	}
	if(strpos($forward, '://') === false) $forward = $EXT['mobile_url'].$forward;
	$head_title = $L['member_login'].$DT['seo_delimiter'].$head_title;
	$foot =  'my';
	include template('login', 'mobile');
}
if(DT_CHARSET != 'UTF-8') toutf8();
?>