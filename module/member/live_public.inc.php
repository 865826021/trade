<?php 
defined('IN_DESTOON') or exit('Access Denied');
require DT_ROOT.'/module/'.$module.'/common.inc.php';
require DT_ROOT.'/include/post.func.php';
global $db;
// 判断当前房间
if ($_userid > 0 && $_userid == $roomid) {
	dheader("/member/mylive.php?action=liveonline&roomid=".$roomid);
}else{
	$userinfo = $db->get_one("SELECT username,truename FROM {$DT_PRE}member WHERE userid='".$roomid."'");
	$username = $userinfo['username'];
	$truename = $userinfo['truename'];
}
$online = $db->get_one("SELECT status from {$db->pre}member_liveset where userid=".$roomid);
$result = $db->query("select * from {$db->pre}member_live where userid=$roomid order by starttime asc");
$lists = array();
$time = time();
while($r = $db->fetch_array($result)) {
	$r['stime'] = date("H:i",$r['starttime']);
	$r['etime'] = date("H:i",$r['endtime']);
	if ($time >= strtotime($r['stime']) && $time <= strtotime($r['etime'])) {
		$r['turnon'] = true;
		if ($online['status']) {
			$r['status'] = 1;
		}else{
			$r['status'] = 2;
		}
	}elseif ($time < strtotime($r['stime'])) {
		$r['turnon'] = false;
		$r['status'] = 0;
	}else{
		$r['turnon'] = false;
		$r['status'] = 3;
	}
	$lists[] = $r;
}
$is_public = true;
include template('live_public', $module);
 ?>