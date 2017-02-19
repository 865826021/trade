<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 用于检测业务代码死循环或者长时间阻塞等问题
 * 如果发现业务卡死，可以将下面declare打开（去掉//注释），并执行php start.php reload
 * 然后观察一段时间workerman.log看是否有process_timeout异常
 */
//declare(ticks=1);

use \GatewayWorker\Lib\Gateway;
use \Workerman\Lib\Timer;
use \GatewayWorker\Lib\Db;
/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{
    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     * 
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {
      // 给所有客户端临时指定一个uid
      $user_info = array(
        'user_id'=> 0,
        'user_name'=>"游客_" . mt_rand(1,10000)
      );
      $_SESSION['user_'.$client_id]=$user_info;

    }
    
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $content 具体消息
    */
   public static function onMessage($client_id, $content)
   {
      $content_info = json_decode($content,true);
      if (!empty($content_info)) {
        print_r($content_info);echo "\n";
      }
      if (!empty($content_info)) {
        $message = array(
          'from_user_id'  => $_SESSION['user_'.$client_id]['user_id'],
          'from_user_name'  => $_SESSION['user_'.$client_id]['user_name']
        );
        switch ($content_info['type']) {
          case 'login':
          // 用户进入房间
            if (intval($content_info['user_id']) > 0) {
              $_SESSION['user_'.$client_id]['user_id'] = $content_info['user_id'];
              $_SESSION['user_'.$client_id]['user_name'] = $content_info['user_name'];

              $message['from_user_id'] = $content_info['user_id'];  
              $message['from_user_name'] = $content_info['user_name'];  
              Gateway::bindUid($client_id,$content_info['user_id']);
            }
            Gateway::joinGroup($client_id,$content_info['roomid']); 
            // 同一clitent_id 可能加入多个群组
            $_SESSION['group_'.$client_id][] = $content_info['roomid']; 
            $message['content'] = " 进入房间";

            $group_user = Gateway::getClientSessionsByGroup($content_info['roomid']);
            $user_list = array(
              'type'  =>  'user_list',
              'client'  =>  $content_info['client'],
              'message' =>  $group_user,
              'time'    => time()
            );
            GateWay::sendToGroup($content_info['roomid'],json_encode($user_list));
            break;
          case 'live_s':
            echo $_SESSION['user_'.$client_id]['user_id'] ." start live \n";
            $_SESSION['user_'.$client_id]['live'] = 1;
            break;
          case 'say':
          // 发送信息
            if (!empty($content_info['to_user_id'])) {
              $message['to_user_id'] = $content_info['to_user_id'];
              $message['to_user_name'] = $content_info['to_user_name'];
            }else{
              $message['to_user_id'] = '';
              $message['to_user_name'] = '';
            }
            $message['content'] = $content_info['content'];
            break;
          default:
            # code...
            break;
        }
        $send_data = array(
          'type'  => $content_info['type'],
          'client'  => $content_info['client'],
          'message' =>  $message,
          'time'  => time()
        );
        // 向所有人发送 
        Gateway::sendToGroup($content_info['roomid'],json_encode($send_data));
      }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id)
   {
      $db = Db::instance('db1');
      if (!empty($_SESSION['group_'.$client_id])) {
        foreach ($_SESSION['group_'.$client_id] as $key => $value) {
          $send_data = array(
            'type'  => 'logout',
            'message' => array('from_user_name'=>$_SESSION['user_'.$client_id]['user_name']),
            'time'  => time()
          );
          GateWay::sendToGroup($value,json_encode($send_data));

          $group_user = Gateway::getClientSessionsByGroup($value);
          $user_list = array(
            'type'  =>  'user_list',
            'message' =>  $group_user,
            'time'    => time()
          );
          GateWay::sendToGroup($value,json_encode($user_list));
          unset($_SESSION['group_'.$client_id][$key]);
          if (isset($_SESSION['user_'.$client_id]['live'])) {
            echo $value . " live close!\n";
            $db->update("sc_member_liveset")->cols(array("status"=>0))->where("userid=".$value)->query();
          }
          // if ($value == $_SESSION['user_'.$client_id]['user_id']) {
          //   $db->update("sc_member_liveset")->cols(array("status"=>0))->where("userid=".$value)->query();
          // }
        }
      }

      unset($_SESSION['user_'.$client_id]);
   }
}
