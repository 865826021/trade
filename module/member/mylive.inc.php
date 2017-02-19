<?php 
defined('IN_DESTOON') or exit('Access Denied');
login();
require DT_ROOT.'/module/'.$module.'/common.inc.php';
require DT_ROOT.'/include/post.func.php';
global $db;
switch($action) {
	case 'add':
		if($submit) {
			if ($post['s_hour'] >= $post['e_hour']) {
				dalert('结束时间应大于开始时间','goback');
			}else{
				if ($post['s_minute'] >= $post['e_minute']) {
					dalert('结束时间应大于开始时间','goback');
				}
			}
			$starttime = strtotime("1970-01-01".$post['s_hour'].":".$post['s_minute']);
			$endtime = strtotime("1970-01-01".$post['e_hour'].":".$post['e_minute']);
			// 查询是否存在记录开始时间比当前设置开始时间小的记录
			$r1 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and starttime > ".$starttime);
			if ($r1['num'] > 0) {
				// 查询开始时间比设置结束时间大的记录
				$r2 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and starttime < ".$endtime);
				if ($r2['num'] > 0) {
					dalert('设置时间与排片时间冲突','goback');
				}
			}else{
				// 查询是否存在记录结束时间比当前设置开始时间小的记录
				$r2 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and endtime > ".$starttime);
				if ($r2['num'] > 0) {
					dalert('设置时间与排片时间冲突','goback');
				}
			}
			$db->query("INSERT INTO {$db->pre}member_live (userid,starttime,endtime,title) VALUES ('$_userid','$starttime','$endtime','".$post['title']."')");
			dmsg($L['op_success'], '?action=index');
		} else {
			$head_title = "添加排片";
		}
	break;
	case 'delete':
		if(!$itemid) dmsg('参数错误');
		$db->query("DELETE FROM {$db->pre}member_live WHERE userid={$_userid} and id=$itemid");
		dmsg('删除成功','/member/mylive.php?action=index');
		break;
	case 'liveonline':
		$head_title = "开始直播";
		if ($roomid != $_userid) {
			dheader("/member/live_public.php?roomid=".$roomid);
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
				$r['status'] = 0;
			}
			$lists[] = $r;
		}
		$username = $_username;
		$truename = $_truename;
		break;
	default:
		$condition = "userid='$_userid'";
		$r = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE $condition");
		$pages = pages($r['num'], $page, $pagesize);		
		$lists = array();
		$result = $db->query("SELECT * FROM {$DT_PRE}member_live WHERE $condition ORDER BY starttime DESC,endtime DESC LIMIT $offset,$pagesize");
		$amount = 0;
		while($r = $db->fetch_array($result)) {
			$lists[] = $r;
		}
		$amount = number_format($amount, 2, '.', ',');
		$head_title = "排片列表";
	break;
}
include template('mylive', $module);
?>