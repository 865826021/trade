<?php
defined('DT_ADMIN') or exit('Access Denied');
require MD_ROOT.'/member.class.php';
$do = new member;
$menus = array (
    array('直播会员', '?moduleid='.$moduleid.'&file=live'),
    array('排片表', '?moduleid='.$moduleid.'&file=live&action=paipian'),
);
isset($userid) or $userid = 0;
if($_catids || $_areaids) {
	if(isset($userid)) $itemid = $userid;
	if(isset($member['areaid'])) $post['areaid'] = $member['areaid'];
	require DT_ROOT.'/admin/admin_check.inc.php';
}
// if ($action == '') {
	$sfields = array('按条件', '公司名', '会员名', '昵称','姓名', '手机号码', '部门', '职位', 'Email', 'QQ', 'MSN', '阿里旺旺', 'Skype', '注册IP', '登录IP', '客服专员', '开户银行', '银行帐号', $DT['trade_nm'], '推荐人', '备注');
	$dfields = array('username', 'company', 'username', 'passport', 'truename', 'mobile', 'department', 'career', 'email', 'qq', 'msn', 'ali', 'skype', 'regip', 'loginip', 'support', 'bank', 'account', 'trade', 'inviter', 'note');
	$sorder  = array('结果排序方式', '注册时间降序', '注册时间升序', '修改时间降序', '修改时间升序', '登录时间降序', '登录时间升序', '登录次数降序', '登录次数升序', '账户'.$DT['money_name'].'降序', '账户'.$DT['money_name'].'升序', '会员'.$DT['credit_name'].'降序', '会员'.$DT['credit_name'].'升序', '短信余额降序', '短信余额升序');
	$dorder  = array('userid DESC', 'regtime DESC', 'regtime ASC', 'edittime DESC', 'edittime ASC', 'logintime DESC', 'logintime ASC', 'logintimes DESC', 'logintimes ASC', 'money DESC', 'money ASC', 'credit DESC', 'credit ASC', 'sms DESC', 'sms ASC');
	$sgender = array('性别', '先生' , '女士');
	isset($fields) && isset($dfields[$fields]) or $fields = 0;
	isset($order) && isset($dorder[$order]) or $order = 0;
	$groupid = isset($groupid) ? intval($groupid) : 0;
	$gender = isset($gender) ? intval($gender) : 0;

	$fields_select = dselect($sfields, 'fields', '', $fields);
	$order_select  = dselect($sorder, 'order', '', $order);
	$gender_select = dselect($sgender, 'gender', '', $gender);
	$condition = 'groupid!=4 and islive=1';
	if($_areaids) $condition .= " AND areaid IN (".$_areaids.")";//CITY
	if($keyword) $condition .= " AND $dfields[$fields] LIKE '%$keyword%'";
	if($gender) $condition .= " AND gender=$gender";
// }

switch($action) {
	case 'paipian':
		$condition = "1";
		$members = $do->get_paipian($condition);
		include tpl('member_paipian', $module);
	break;
	default:
		$members = $do->get_list($condition, $dorder[$order]);
		include tpl('member_live', $module);
	break;
}
?>