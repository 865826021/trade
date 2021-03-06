<?php
$moduleid = 3;
require '../common.inc.php';
require DT_ROOT.'/module/'.$module.'/common.inc.php';
$ck = get_cookie('mobile');
$url = $EXT['mobile_url'];
if($action == 'pc') {
	set_cookie('mobile', 'pc', $DT_TIME + 30*86400);
	dheader(DT_PATH);
} else if($action == 'screen') {
	$DT_MOB['os'] == 'ios' or exit;
	if($ck != 'screen') set_cookie('mobile', 'screen', $DT_TIME + 86400*30);
} else {
	if(strpos($DT_URL, 'action=sync&auth=') !== false && strpos($DT_URL, 'goto=') !== false) {
		if($DT_MOB['os'] == 'ios'||1) {
			isset($auth) or $auth = '';
			$auth = decrypt($auth);
			if($auth) {
				$arr = explode('|', $auth);
				if(check_name($arr[0]) && $_username != $arr[0] && $DT_IP == $arr[1] && $DT_TIME - $arr[2] < 600) {
					include load('member.lang');
					$MOD = cache_read('module-2.php');
					include DT_ROOT.'/module/member/member.class.php';
					$do = new member;
					$user = $do->login($arr[0], '', 0, true);
				}
			}
			$tmp = explode('goto=', $DT_URL);
			$goto = $tmp[1];
			if(preg_match("/^[a-z0-9_\.\?\&\=\-]{5,}$/", $goto)) {
				if(strpos($goto, '://') === false) $goto = $MODULE[2]['linkurl'].$goto;
				$url = $goto;
			}
		}
		dheader($url);
	}
	if($ck != 'pc') {
		if(preg_match("/(iPhone|iPod|Android)/i", $_SERVER['HTTP_USER_AGENT'])) dheader($url);
		if(preg_match("/(Phone|Mobile)/i", $_SERVER['HTTP_USER_AGENT'])) dheader($url);
	}
	$destoon_task = rand_task();
	$head_title = $L['mobile_title'];
	include template('mobile', $module);
}
?>