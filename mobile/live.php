<?php
$moduleid = 2;
require 'common.inc.php';
// if($action) {
// 	$_userid or dheader('login.php?forward='.urlencode('my.php?action='.$action));
// }

$head_name = "直播视频";
if ($action == "index") {
	$lists = array();
	$result = $db->query("select mls.*,m.username,m.truename from {$DT_PRE}member_liveset mls left join {$DT_PRE}member m on mls.userid=m.userid");
	while($r = $db->fetch_array($result)) {
		$paipian = $db->get_one("select title from {$DT_PRE}member_live where userid='".$r['userid']."' order by starttime>".strtotime("1970-01-01".date("H:i:s")).' asc');
		if (!empty($paipian)) {
			$r['title'] = $paipian['title'];
		}else{
			$r['title'] = "";
		}
		$lists[] = $r;
	}
}elseif ($action == 'viewlive') {
	$liveuser = $db->get_one("SELECT username,truename FROM {$DT_PRE}member WHERE userid=$roomid");
	$a = useravatar($liveuser['username'], 'small');

	$online = $db->get_one("SELECT status from {$db->pre}member_liveset where userid=".$roomid);
	$result = $db->query("select * from {$db->pre}member_live where userid=$roomid order by starttime asc");
	$lists = array();
	$time = time();
	$online_title = '(主播不在家)';
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
			$online_title = $r['title'];
		}elseif ($time < strtotime($r['stime'])) {
			$r['turnon'] = false;
			$r['status'] = 0;
		}else{
			$r['turnon'] = false;
			$r['status'] = 3;
		}
		$lists[] = $r;
	}
	// $query = $db->query("SELECT * FROM {$DT_PRE}member_live WHERE userid=$roomid");
	// $live_set = array();
	// while ($r = $db->fetch_array($query)) {
	// 	$live_set[] = $r;
	// }
}
$foot = false;
// var_dump($lists);die();
include template('live', 'mobile');
if(DT_CHARSET != 'UTF-8') toutf8();
?>