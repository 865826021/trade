<?php
require 'common.inc.php';
$username = $domain = '';
if($DT['safe_domain']) {
	$safe_domain = explode('|', $DT['safe_domain']);
	$pass_domain = false;
	foreach($safe_domain as $v) {
		if(strpos($DT_URL, $v) !== false) { $pass_domain = true; break; }
	}
	$pass_domain or dhttp(404);
}
if($DT['index_html']) {
	$html_file = $CFG['com_dir'] ? DT_ROOT.'/'.$DT['index'].'.'.$DT['file_ext'] : DT_CACHE.'/index.inc.html';
	if(!is_file($html_file)) tohtml('index');		
	if(is_file($html_file)) exit(include($html_file));
}
$AREA or $AREA = cache_read('area.php');
$lists = array();
$result = $db->query("select mls.*,m.truename from {$DT_PRE}member_liveset mls left join {$DT_PRE}member m on mls.userid=m.userid");
while($r = $db->fetch_array($result)) {
	$paipian = $db->get_one("select title from {$DT_PRE}member_live where userid='".$r['userid']."' order by starttime>".strtotime("1970-01-01".date("H:i:s")).' asc');
	if (!empty($paipian)) {
		$r['title'] = $paipian['title'];
	}else{
		$r['title'] = "";
	}
	$lists[] = $r;
}
if($EXT['mobile_enable']) $head_mobile = $EXT['mobile_url'];
$seo_title = $DT['seo_title'];
$head_keywords = $DT['seo_keywords'];
$head_description = $DT['seo_description'];
include template('live_list');
?>