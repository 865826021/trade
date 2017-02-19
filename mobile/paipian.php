<?php
$moduleid = 2;
require 'common.inc.php';
if (empty($action)) {
	$action = 'index';
}
$_userid or dheader('login.php?forward='.urlencode('paipian.php?action='.$action));
switch($action) {
	case 'add':
		if(isset($_POST['ok'])) {
			require DT_ROOT.'/include/post.func.php';
			if ($post['starttime'] >= $post['endtime']) {
				mobile_msg('结束时间应大于开始时间');
			}
			$starttime = strtotime("1970-01-01".$post['starttime'].":0:0");
			$endtime = strtotime("1970-01-01".$post['endtime'].":0:0");
			// 查询是否存在记录开始时间比当前设置开始时间小的记录
			$r1 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and starttime > ".$starttime);
			if ($r1['num'] > 0) {
				// 查询开始时间比设置结束时间大的记录
				$r2 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and starttime < ".$endtime);
				if ($r2['num'] > 0) {
					mobile_msg('设置时间与排片时间冲突');
				}
			}else{
				// 查询是否存在记录结束时间比当前设置开始时间小的记录
				$r2 = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE userid='".$_userid."' and endtime > ".$starttime);
				if ($r2['num'] > 0) {
					mobile_msg('设置时间与排片时间冲突');
				}
			}
			$db->query("INSERT INTO {$db->pre}member_live (userid,starttime,endtime,title) VALUES ('$_userid','$starttime','$endtime','".$post['title']."')");
			mobile_msg($L['op_success'], $forward ? $forward : 'paipian.php?reload='.$DT_TIME);
		} else {
			$head_name = "添加排片";
			$head_title = $head_name.$DT['seo_delimiter'].$head_title;
		}
	break;
	case 'delete':
		if(!$itemid) mobile_msg('参数错误');
		$db->query("DELETE FROM {$db->pre}member_live WHERE userid={$_userid} and id=$itemid");
		mobile_msg('删除成功','paipian.php');
		break;
	default:
		$condition = "userid='$_userid'";
		$r = $db->get_one("SELECT COUNT(*) AS num FROM {$DT_PRE}member_live WHERE $condition");		
		$pages = mobile_pages($r['num'], $page, $pagesize);
		$lists = array();
		$result = $db->query("SELECT * FROM {$DT_PRE}member_live WHERE $condition ORDER BY starttime DESC,endtime DESC LIMIT $offset,$pagesize");
		$amount = 0;
		while($r = $db->fetch_array($result)) {
			$lists[] = $r;
		}
		$head_name = "排片管理";
		$head_title == $head_name.$DT['seo_delimiter'].$head_title;
	break;
}
$foot = 'my';
include template('paipian', 'mobile');
if(DT_CHARSET != 'UTF-8') toutf8();
?>