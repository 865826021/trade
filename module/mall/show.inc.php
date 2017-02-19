<?php
defined('IN_DESTOON') or exit('Access Denied');
if ($_GET['videoid']){
	$videoid or die('视频参数错误');
	$video_table = 'video_14';
	$mallv = $db->get_one("SELECT * FROM {$DT_PRE}{$video_table} WHERE itemid=$videoid");
	$video_t = $mallv['title'];
	$video_thumb = $mallv['thumb'];
	$video_s = $mallv['video'];
	$video_w = $mallv['width'];
	$video_h = $mallv['height'];
	$video_p = $mallv['player'];
// 	$video_a = $MOD['autostart'] ? 'true' : 'false';
	$video_a = 'true';
	if(in_array(file_ext($video_s), array('flv', 'mp4')) && strpos($video_s, '?') === false) $video_p = -1;
	$UA = strtolower($_SERVER['HTTP_USER_AGENT']);
	$video_i = (strpos($UA, 'ipad') !== false || strpos($UA, 'ipod') !== false || strpos($UA, 'iphone') !== false || strpos($UA, 'android') !== false) ? 1 : 0;
	include template('mall_player','chip');
} else {
	$itemid or dheader($MOD['linkurl']);
	if(!check_group($_groupid, $MOD['group_show'])) include load('403.inc');
	require DT_ROOT.'/module/'.$module.'/common.inc.php';
	$item = $db->get_one("SELECT * FROM {$table} WHERE itemid=$itemid");
	if($item && $item['status'] > 2) {
		if($MOD['show_html'] && is_file(DT_ROOT.'/'.$MOD['moduledir'].'/'.$item['linkurl'])) d301($MOD['linkurl'].$item['linkurl']);
		extract($item);
	} else {
		include load('404.inc');
	}
	$CAT = get_cat($catid);
	$CAT_FIELDS = get_cat_fields($catid, $CAT);
// 	var_export($CAT);
// 	var_export($CAT_FIELDS);
	if(!check_group($_groupid, $CAT['group_show'])) include load('403.inc');
	$content_table = content_table($moduleid, $itemid, $MOD['split'], $table_data);
	$t = $db->get_one("SELECT content FROM {$content_table} WHERE itemid=$itemid");
// 	var_export($item);
	$content = $t['content'];
	if($lazy) $content = img_lazy($content);
	if($MOD['keylink']) $content = keylink($content, $moduleid);
	$CP = $MOD['cat_property'] && $CAT['property'];
	if($CP) {
		require DT_ROOT.'/include/property.func.php';
		$options = property_option($catid);
		$values = property_value($moduleid, $itemid);
	}
	$RL = $relate_id ? get_relate($item) : array();
	$P1 = get_nv($n1, $v1);
	$P2 = get_nv($n2, $v2);
	$P3 = get_nv($n3, $v3);
	if($step) {
		extract(unserialize($step));
	} else {
		$a1 = 1;
		$p1 = $item['price'];
		$a2 = $a3 = $p2 = $p3 = '';
	}
	$unit or $unit = $L['unit'];
	$adddate = timetodate($addtime, 3);
	$editdate = timetodate($edittime, 3);
	$linkurl = $MOD['linkurl'].$linkurl;
	$thumbs = get_albums($item);
	$albums =  get_albums($item, 2);
	$videoid = intval($item['videoid']);
	$amount = number_format($amount, 0, '.', '');
	$fee = get_fee($item['fee'], $MOD['fee_view']);
	$update = '';
	if(check_group($_groupid, $MOD['group_contact'])) {
		if($fee) {
			$user_status = 4;
			$destoon_task = "moduleid=$moduleid&html=show&itemid=$itemid";
		} else {
			$user_status = 3;
			$member = $item['username'] ? userinfo($item['username']) : array();
			if($member) {
				$update_user = update_user($member, $item);
				if($update_user) $db->query("UPDATE {$table} SET ".substr($update_user, 1)." WHERE username='$username'");
			}
		}
	} else {
		$user_status = $_userid ? 1 : 0;
		if($_username && $item['username'] == $_username) {
			$member = userinfo($item['username']);
			$user_status = 3;
		}
	}
	//处理自定义字段
	if ($CAT_FIELDS){
		$count = $CAT['has_price']?8:9;//如果显示价格，则调取9条自定义字段，否则调取10条
		$i = 0;
		$text_type = array('text', 'textarea', 'date');
		foreach ($CAT_FIELDS as $v){
			$i++;
			if ($v['showpage'] && $item[$v['name']]){
				if (in_array($v['html'], $text_type)){
					$fields_text[$v['name']] = array('title' => $v['title'], 'value' => $item[$v['name']]);
				} elseif ($v['html'] == 'editor'){
					$fields_editor[$v['name']] = array('title' => $v['title'], 'value' => $item[$v['name']]);
				}
			}
			if ($i > $count) break;
		}
	}
	//视频ID处理
	if ($videoid){
		$video_table = 'video_14';
		$mallv = $db->get_one("SELECT * FROM {$DT_PRE}{$video_table} WHERE itemid=$videoid");
		$video_t = $mallv['title'];
		$video_thumb = $mallv['thumb'];
		$video_s = $mallv['video'];
		$video_w = $mallv['width']+4;
		$video_h = $mallv['height']+47;
		$video_p = $mallv['player'];
		$video_a = $MOD['autostart'] ? 'true' : 'false';
		if(in_array(file_ext($video_s), array('flv', 'mp4')) && strpos($video_s, '?') === false) $video_p = -1;
		$UA = strtolower($_SERVER['HTTP_USER_AGENT']);
		$video_i = (strpos($UA, 'ipad') !== false || strpos($UA, 'ipod') !== false || strpos($UA, 'iphone') !== false || strpos($UA, 'android') !== false) ? 1 : 0;
	}
	
	include DT_ROOT.'/include/update.inc.php';
	$seo_file = 'show';
	include DT_ROOT.'/include/seo.inc.php';
	if($EXT['mobile_enable']) $head_mobile = $EXT['mobile_url'].mobileurl($moduleid, 0, $itemid, $page);
	$template = $item['template'] ? $item['template'] : ($CAT['show_template'] ? $CAT['show_template'] : 'show');
	include template($template, $module);
}
?>