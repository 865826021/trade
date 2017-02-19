<?php 
require 'config.inc.php';
require '../common.inc.php';
if(!$_userid){
	$_userid = - rand(1000,9999);
}
$action = strtolower($action);
switch ($action) {
	case 'showdata':
		$json_data = array(
			'code'	=> -1,
			);
		$userinfo = $db->get_one("SELECT * FROM {$DT_PRE}member_liveset WHERE userid=".$_GET["rid"]);
		if($userinfo){
			$json_data = array(
				'data'=>array(
					'showInfo'=>array(
						'isPublicChat'	=> $userinfo['ispublic'],
						'showPrice'		=> 0,
						'showId'		=> $userinfo['userid'],
						'closed'		=> !$userinfo['status'],
						'showTime'		=> '开播时间：'.date('H:i'),
						),
					'userInfo'	=>	array(
						'admin'		=>	($_userid == $userinfo['userid'])?1:0,
						'userId'	=> $_userid,
						'emceeId'	=> $_GET["rid"]
						),
					'nodeInfo'	=>	array(
						'chat'		=> $DT['nodejs'],
						'down'		=> 0,
						'up'		=> 0,
						'fmsPort'	=> $DT['nodejsport']
						),
					'version'		=> 20161215
				),
				'code' => 0,
				'info' => ''
			);
		}
		exit(json_encode($json_data));
		break;
	case 'getroominfo':
		header('Content-Type: text/xml');
		$roominfo = $db->get_one("SELECT * FROM {$DT_PRE}member_liveset WHERE userid=".$_GET["roomnum"]);
		if($roominfo){
			if($roominfo['status'] == '0'){
					echo '<?xml version="1.0" encoding="UTF-8"?>';
					echo '<ROOT>';
					echo '<broadcasting>n</broadcasting>';
					echo '<offlinevideo></offlinevideo>';
					echo '</ROOT>';
			}else{
				echo '<?xml version="1.0" encoding="UTF-8"?>';
				echo '<ROOT>';
				echo '<broadcasting>'.$roominfo['broadcasting'].'</broadcasting>';
				if($roominfo['broadcasting'] == 'y'){
					$roomtype = 0;
					echo '<roomtype>'.$roomtype.'</roomtype>';
				}else{
					echo '<offlinevideo></offlinevideo>';
					// echo '<offlinevideo>'.$roominfo[0]['offlinevideo'].'</offlinevideo>';
				}
				echo '</ROOT>';
			}
		}
		else{
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '</ROOT>';
		}
		break;
	case 'inituserinfo':
		if($_userid <= 0){
			$_userid = -rand(1000,9999);
		}

		$roominfo =  $db->get_one("SELECT * FROM {$DT_PRE}member_liveset WHERE userid=".$_GET["roomnum"]);
		$user_str = '{';
		if($_userid <= 0){
			$user_str .= "err:'no',userBadge:'',familyname:'',goodnum:'{$_GET['roomnum']}',h:0,level:0,richlevel:0,spendcoin:0,sellm:0,sortnum:'',userid:{$_userid},username:'游客{$_userid}',vip:0";
			
			$user_str .=",fakeroom:'n'";
			$user_str .=",virtualguest:0";
			$user_str .=",virtualusers_str:''";
			echo $user_str .='}';
		
		}else{
			$userinfo = $db->get_one("SELECT * FROM {$DT_PRE}member WHERE userid=".$_userid);			
			$user_str .= "err:'no',userBadge:'',familyname:'',goodnum:'{$_GET['roomnum']}',sortnum:'',userid:'{$_userid}',username:'游客{$_userid}',vip:0";			
			if($_userid == $_GET['roomnum']){
				$user_str .=",sortnum:''";
				$user_str .=",userType:50";	
				
			}else{
				$user_str .=",sortnum:''";		
				$user_str .=",userType:30";	
			}
			$user_str .=",userid:{$_userid}";	
			$user_str .=",username:'{$userinfo['truename']}'";
			$user_str .=",vip:0";
			$user_str .=",fakeroom:'n'";
			$user_str .=",virtualguest:0";
			$user_str .=",virtualusers_str:''";
			echo $user_str .='}';
		}
		break;
	case 'getuserinfo':	
		header('Content-Type: text/xml');
		$roominfo = $db->get_one("SELECT * FROM {$DT_PRE}member_liveset WHERE userid=".$_GET["roomnum"]);
		$roomrichlevel = 18;//等级
		$roomemceelevel = 17;//主播等级
		if($_userid < 0){
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '<err>no</err>';
			echo '<Badge></Badge>';
			echo '<familyname></familyname>';
			echo '<goodnum></goodnum>';
			echo '<h>0</h>';
			echo '<level>0</level>';
			echo '<richlevel>0</richlevel>';
			echo '<spendcoin>0</spendcoin>';
			echo '<sellm>0</sellm>';
			echo '<sortnum></sortnum>';
			echo '<userType>20</userType>';
			echo '<userid>'.$_userid.'</userid>';
			echo '<username>游客'.$_userid.'</username>';
			echo '<vip>0</vip>';
			echo '<fakeroom>n</fakeroom>';
			echo '</ROOT>';

		}else{
			$richlevel = 18;//等级
			$emceelevel = 17;//主播等级
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '<err>no</err>';
			echo '<Badge></Badge>';
			echo '<familyname></familyname>';
			echo '<goodnum>'.$_GET["roomnum"].'</goodnum>';
			echo '<h>0</h>';
			echo '<level>'.$emceelevel.'</level>';
			echo '<richlevel>'.$richlevel.'</richlevel>';
			echo '<spendcoin>0</spendcoin>';
			echo '<sellm>0</sellm>';
			if($_userid == $_GET['roomnum']){
				echo '<sortnum></sortnum>';
				echo '<userType>50</userType>';
			}else{
				echo '<sortnum></sortnum>';
				echo '<userType>30</userType>';
			}
			echo '<userid>'.$_userid.'</userid>';
			echo '<username>'.$_username.'</username>';
			echo '<vip>0</vip>';
			echo '<fakeroom>n</fakeroom>';
			echo '</ROOT>';
		}
		break;
	case 'createroom':
		header('Content-Type: text/xml');
		if(!$_userid){
			$err = "您尚未登录，请登录后重试";
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '<err>yes</err>';
			echo '<msg>'.$err.'</msg>';
			echo '</ROOT>';
			exit;
		}
		if(!$_islive){
			$err = "您暂时没有直播权限";
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '<err>yes</err>';
			echo '<msg>'.$err.'</msg>';
			echo '</ROOT>';
			exit;
		}	
		$db->query("update {$DT_PRE}member_liveset set status=1,broadcasting='y' WHERE userid=".$_userid);
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<ROOT>';
		echo '<err>no</err>';
		echo '<showId>'.time().'</showId>';
		echo '</ROOT>';
		break;
	case 'enterroom':
		break;
	case 'exitroom':
		break;
	case 'exitroom2':
		// 直播结束

		if($_userid < 0){
			$err = "您尚未登录，请登录后重试";
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<ROOT>';
			echo '<err>yes</err>';
			echo '<msg>'.$err.'</msg>';
			echo '</ROOT>';
			exit;
		}
		if ($_userid == $_GET['roomnum']) {
			$db->query("update {$DT_PRE}member_liveset set status=0,broadcasting='n' WHERE userid=".$_userid);
		}
		break;
	case 'makesnap2':
		// 直播封面拍照
		if($_userid <= 0){
			echo '&err=nologin';
			exit;
		}
		$prefix = date('Y-m');
		$uploadPath = '/file/snap/'.$prefix.'/';
		if(!is_dir(DT_ROOT.$uploadPath)){
        	mkdirs(DT_ROOT.$uploadPath);
		}
		$filename = md5($_userid).'.jpg';
		if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))  
		{  
			$png = gzuncompress($GLOBALS["HTTP_RAW_POST_DATA"]);   
			$file = fopen(DT_ROOT.$uploadPath.$filename,"w");//打开文件准备写入  
			fwrite($file,$png);  
			fclose($file);
			$db->query("update {$DT_PRE}member_liveset set photo='".$uploadPath.$filename."' WHERE userid=".$_userid);
			echo "ok";
		}
		break;
	case 'setpublicchat':
		// 公聊设置
		if ($_userid <= 0) {
			echo '{"state":"3","info":"您尚未登录"}';
			exit;
		}
		if ($_userid != $eid) {
			echo '{"state":"3","info":"您不是该房间主人"}';
			exit;
		}
		$db->query("update {$DT_PRE}member_liveset set ispublic='".$flag."' WHERE userid=".$_userid);
		echo '{"state":"'.$_REQUEST['flag'].'"}';
		exit;
	case 'dosendFly':
		// 发送飞屏
		if(!$_userid < 0){
			echo '{"code":"1","info":"您尚未登录"}';
			exit;
		}
		$emceeinfo = $db->get_one("SELECT * FROM {$DT_PRE}member_liveset where userid=".$_REQUEST['eid']);
		if($emceeinfo){
			// if($_REQUEST['toid'] == 0){
			// 	$besenduinfo = $emceeinfo;
			// }else{
			// 	$besenduinfo = $db->get_one("SELECT * FROM {$DT_PRE}member where userid=".$_REQUEST['toid']);
			// }
			if($emceeinfo['broadcasting'] != 'y'){
				echo '{"code":"1","info":"房间广播未开启"}';
				exit;
			}
			echo '{"code":"0"}';
			exit;
		}
		else{
			echo '{"code":"1","info":"主播信息有误"}';
			exit;
		}
	case 'shutup':
		//获取用户信息
		$userinfo =  $db->get_one("SELECT * FROM {$DT_PRE}member where userid=".$_REQUEST['uidlist']);
		if($userinfo){
			if($_REQUEST['uidlist'] == $_REQUEST['rid']){
				echo '{"code":"1","info":"对方是主播不能禁言"}';
				exit;
			}
			echo '{"code":"0"}';
			exit;
		}
		else{
			echo '{"code":"1","info":"找不到该用户"}';
			exit;
		}
		break;
	default:
		# code...
		break;
}

function mkdirs($dir)
{
    static $_dir; // 记录需要建立的目录
    if (!is_dir($dir)) {
        if (empty($_dir))
            $_dir = $dir;
        if (!is_dir(dirname($dir))) {
            mkdirs(dirname($dir));
        } else {
            mkdir($dir);
            if (!is_dir($_dir)) {
                mkdirs($_dir);
            } else {
                $_dir = "";
            }
        }
    }
}
?>