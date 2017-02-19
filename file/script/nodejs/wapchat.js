var socket_url  = "192.168.1.10";
var SOCKET_DEBUG = true;
var ws;

// 连接服务端
function connect() {
   // 创建websocket
   ws = new WebSocket("ws://"+socket_url+":7130");
   // 当socket连接打开时，输入用户名
   ws.onopen = onopen;
   // 当有消息时根据消息类型显示不同信息
   ws.onmessage = onmessage; 
   ws.onclose = function() {
   		debuger("连接关闭，定时重连")
		setTimeout("connect()",3000);
   };
   ws.onerror = function() {
		debuger("出现错误");
   };
}
// 连接建立时发送登录信息
function onopen()
{
    // 登录
	var login_data = '{"type":"login","client":"pc","user_id":"'+_show.userId+'","user_name":"'+_show.usernickname+'","roomid":"'+roomid+'"}';
	debuger("websocket握手成功，发送登录数据:"+login_data);
	ws.send(login_data);
	// 发送心跳数据
	setInterval(function(){ws.send('{"type":"ping","client":"pc,"roomid":"'+roomid+'"}');}, 3000);
}

// 服务端发来消息时
function onmessage(e)
{
    var data = eval("("+e.data+")");
    var message = data['message'];
    debuger(data);
    if (data['client'] == "app") {
	    switch(data['type']){
	        // 登录 更新用户列表
	        case 'login':
	            say(message['from_user_id'],message['from_user_name'], "","", '进入房间',true);
	            debuger(message['from_user_name']+"登录成功");
	            break;
	        // 发言
	        case 'say':
	            say(message['from_user_id'],message['from_user_name'], message['to_user_id'],message['to_user_name'],message['content'], false);
	            break;
	        // 用户退出
	        case 'logout':
	            say(message['from_user_id'],message['from_user_name'], '','', '离开房间', true);
	    }
    }
}
function system_send(type,content){
	var send_data = '{"type":"'+type+'","client":"pc","roomid":'+roomid+',"to_user_id":"","to_user_name":"","content":"'+content.replace(/"/g, '\\"').replace(/\n/g,'\\n').replace(/\r/g, '\\r')+'"}';
	debuger(send_data);
	ws.send(send_data);
}
function socket_say(to_user_id,to_user_name,content){
	var send_data = '{"type":"say","client":"pc","roomid":'+roomid+',"to_user_id":"'+to_user_id+'","to_user_name":"'+to_user_name+'","content":"'+content.replace(/"/g, '\\"').replace(/\n/g,'\\n').replace(/\r/g, '\\r')+'"}';
	debuger(send_data);
	ws.send(send_data);
}

// 发言
function say(from_user_id,from_user_name,to_user_id,to_user_name, content, is_system){
	var str = "";
	if (is_system) {
		str="<p class=\"tx_focus\">系统消息:"+decodeURIComponent(from_user_name)+ content +"</p>";
	}else{
		var date = new Date();
		var h = date.getHours();
		var m = date.getMinutes();
		ftime = h + ":" + m;
		if (to_user_id == "") {
			str = '<p><span>'+ftime+'</span><a class="chatuser" id='+from_user_id+' href="javascript:void(0);">'+from_user_name+'</a>: <span class="m u">'+Face.de(content)+'</span></p>';
		}else{
			str = '<p><span>'+ftime+'</span><a class="chatuser" id='+from_user_id+' href="javascript:void(0);">'+from_user_name+'</a> 对 <a href="javascript:void(0);" class="chatuser" id='+to_user_id+'>'+to_user_name+'</a> 说: <span class="m u">'+Face.de(content)+'</span></p>';
		}
	}
	$("#chat_hall").append(str);
	JsInterface.isScroll("chat_hall"); 
}
function debuger(obj){
	if (SOCKET_DEBUG) {
		console.log(obj);
	}
}
connect();