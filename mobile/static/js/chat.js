var socket_url  = "192.168.1.10";
var SOCKET_DEBUG = false;
var show_err = true;
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
		$(".say_btn").attr('disabled','disabled');
		if (show_err) {
			str = '<li class="mui-table-view-cell f_red"><span class="chat_user">系统消息:</span>聊天服务器关闭</li>';
			add_chat(str);
			show_err = false;
		}
   		debuger("连接关闭，定时重连")
		setTimeout("connect()",3000);
   };
   ws.onerror = function() {
		$(".say_btn").attr('disabled','disabled');
		if (show_err) {
			str = '<li class="mui-table-view-cell f_red"><span class="chat_user">系统消息:</span>聊天服务器关闭</li>';
			add_chat(str);
			show_err = false;
		}
		debuger("出现错误");
   };
}
// 连接建立时发送登录信息
function onopen()
{

	show_err = true;
	$(".say_btn").removeAttr('disabled');
	str = '<li class="mui-table-view-cell f_red"><span class="chat_user">系统消息:</span>聊天服务器已连接</li>';
	add_chat(str);
    // 登录
	var login_data = '{"type":"login","client":"app","user_id":"'+userid+'","user_name":"'+usernickname+'","roomid":"'+roomid+'"}';
	debuger("websocket握手成功，发送登录数据:"+login_data);
	ws.send(login_data);
	// 发送心跳数据
	setInterval(function(){ws.send('{"type":"ping","client":"app,"roomid":"'+roomid+'"}');}, 3000);
}

// 服务端发来消息时
function onmessage(e)
{
    var data = eval("("+e.data+")");
    var message = data['message'];
    debuger(data);
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
        case 'user_list':
    		$("#user_select").empty();
    		$("#user_select").append('<option value="0">所有人</option>');
    		$("#vip_list").empty();
        	$.each(message,function(i,value){
        		if (value['user_' + i].user_id > 0 && value['user_' + i].user_id != userid) {
        			$("#user_select").append("<option value='"+value['user_' + i].user_id+"'>"+value['user_' + i].user_name+"</option>");
        		}
        		$("#vip_list").append('<li class="mui-table-view-cell">'+value['user_' + i].user_name+'</li>');
        	});
        	break;
        // 用户退出
        case 'logout':
            say(message['from_user_id'],message['from_user_name'], '','', '离开房间', true);
    }
}
function socket_say(to_user_id,to_user_name,content){
	// 未登录用户无法发言
	if (userid > 0) {
		var send_data = '{"type":"say","client":"app","roomid":'+roomid+',"to_user_id":"'+to_user_id+'","to_user_name":"'+to_user_name+'","content":"'+content.replace(/"/g, '\\"').replace(/\n/g,'\\n').replace(/\r/g, '\\r')+'"}';
		ws.send(send_data);
		$('#msg').val('');
		debuger(send_data);
	}else{
		str = '<li class="mui-table-view-cell f_red"><span class="chat_user">系统消息:</span>未登录用户无法发言，请点击登录或注册</li>';
		add_chat(str);

	}
}
function add_chat(str){
	$("#chat_hall").append(str);
	$("#scroll").animate({
		scrollTop:$("#scroll")[0].scrollHeight
	},1000);
}
// 发言
function say(from_user_id,from_user_name,to_user_id,to_user_name, content, is_system){
	var str = "";
	if (is_system) {
		str = '<li class="mui-table-view-cell f_gray"><span class="chat_user">系统消息:</span> <span class="chat_user f_green" data-id="'+from_user_id+'">'+decodeURIComponent(from_user_name) + "</span> " + content +' </li>';
	}else{
		var saydate = new Date();
		ftime = saydate.getHours() + ":" + saydate.getMinutes();
		if (to_user_id == "") {
			str = '<li class="mui-table-view-cell"><span class="chat_user f_green" data-id="'+from_user_id+'">'+from_user_name+'</span>：'+Face.de(content) +'(<span class="f_orange">'+ftime+'</span>)</li>';
		}else{
			str = '<li class="mui-table-view-cell"><span class="chat_user f_green" data-id="'+from_user_id+'">'+from_user_name+'</span>对<span class="chat_user f_green" data-id="'+to_user_id+'">'+to_user_name+'</span>：'+Face.de(content)+'(<span class="f_orange">'+ftime+'</span>)</li>';
		}
	}
	$(".mui-table-view-cell").on('click',".f_green",function(){
		var user_id = $(this).data('id'),user_name=$(this).html();
		alert(user_id);
	});
	add_chat(str);
}
function debuger(obj){
	if (SOCKET_DEBUG) {
		console.log(obj);
	}
}
/**
 * 聊天表情
 */
var Face={
	de:function(str){
		str=str.replace(/<br \/>/ig, '\n').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(\n)+/igm, "<br>").replace(/\[`(.*?)`\]/ig,"<img src=\"/member/face/$1.gif\"/>");
		return str;
	},
	showFace:function(){
		var objFace=$('#showFaceInfo'),chatR=$("#ChatFace"),facePos={'facel':objFace.offset().left,'facet':objFace.offset().top};
		if(chatR.is(':hidden')){
			chatR.css({"right":"0px","top":(facePos.facet-182-11)+"px"}).show();
		}else{
			chatR.hide();
		}
	},
	deimg:function(str){
		str=str.replace(/\[`(.*?)`\]/ig,"");
		return str;
	},
	addEmot:function(myValue) {
		var objEditor=$("#msg");
		objEditor.val(objEditor.val()+myValue);
		$('#ChatFace').hide();
		objEditor.focus();
	}
};