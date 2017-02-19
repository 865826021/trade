var socket = io("192.168.1.10:7130");
var online_num = 0; 
 
/********************* 聊天开始 ************************************/
//处理私聊信息		   
socket.on('pchat', function(data) {
	send_veiw(data.username, data.text, data.touserid, data.tousername, 1);
}); 

//处理公聊信息
socket.on('msg', function(data) {
/*Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"SendPubMsg","ct":"' + data.text + '","checksum":""}');*/
	/*var det = nodeFace.de(data.text);
	send_veiw(data.username, det, data.touserid, data.tousername, 0,data.u_roomid);*/
	showSendMsg(data);
});
 
//初始化房间ID
function init_roomid(uid, roomid, nickname,username,ucuid) {

	socket.emit('cnn', {
		uid: uid,
		roomnum:roomid,
		nickname: nickname,
		username:username,
		ucuid:ucuid
	});
}



//发送信息函数
/*
			uid:发送用户id
			roomid:房间id
			text:发送内容
			msgType:0公聊，1私聊，2，飞屏
			touid：发送至id
			tousername:发送人至用户名
			username:发送人
			sid :验证秘钥 
		  */
		// nodeSend(_show.emceeId, _show.roomId, wval, "0", touserid, tousernmae,$.cookie("nickname"), "4297f44b13955235245b2497399d7a93",$.cookie("u_roomid"),_show.roomId,0);
function nodeSend(uid, roomid, text, msgType, touid, tousername, username,nickname, sid,u_roomid,action) {
	socket.emit('msg', {
		uid: uid,
		roomid: roomid,
		text: text,
		msgType: msgType,
		touid: touid,
		tousername: tousername,
		username: username,
		sid: sid,
		u_roomid:u_roomid,
		action:action,
		nickname:nickname
	});
}



/*
 * 展示信息
 *
 * is_prive:0公聊，1私聊
 */
function send_veiw(username, text, touserid, tousername, is_prive,u_roomid) {
	$(document).ready(function() {
		var date = new Date();
		var h = date.getHours();
		var m = date.getMinutes();
		ftime = h + ":" + m;

		$("#chat_hall").append("<div style='margin:6px'> <font color='#A9A9A9'>" + username + "：<font color='#6C6C6C' style='font-size:20px'>" + text + "</font></div>");
	});
		} 

/********************* 聊天结束 **************************/


/*********************禁言开始****************************/

//禁言操作
function ShutUp(uid, roomid, username, time) {
	socket.emit('shutup', {
		uid: uid,
		roomid: roomid,
		username: username,
		time: time
	});
}

//监听禁言事件
socket.on('shutup', function(data) {
	alert("已被禁言");
})

//恢复发言
function ResumeUser(uid, roomid, username, time) {
	socket.emit('resumeuser', {
		uid: uid,
		roomid: roomid,
		username: username,
		time: time
	});
}

//监听恢复事件
socket.on('resumeuser', function(data) {
	alert(data);
})



/*******************禁言结束**************************/


/*************** 踢人开始 **************************/

//踢人操作
function KickUser(uid, roomid, username, time) {
	alert(username);
	socket.emit('kickuser', {
		uid: uid,
		roomid: roomid,
		username: username,
		time: time
	});
}

//监听踢人事件

socket.on('kickuser', function(data) {
	if(data=="1")
	{
		alert("操作成功！");
	}
	else if(data=="2")
	{
		alert('你已被踢出房间');
		window.location.href="index.html";
	}
})

/***************** 踢人结束 ***********************/




/*******        2015-09-25 *****************/
//pc 端聊天展示
//发送信息

 function showSendMsg(data){  
		var str="";
		var date = new Date();
		var h = date.getHours()<10 ? h = '0'+date.getHours() : date.getHours();
		var m = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
		ftime = h + ":" + m;
		if(data){
			console.log(data);
			var tempMsg=Face.de(data.text),time=ftime,ugood=data["roomid"],uid=data["uid"],uname=decodeURIComponent(data["uname"]),cugood=chatgnum(data["roomid"]),tougood=data["tougood"],touid=data["touid"],touname=decodeURIComponent(data["touname"]),ctougood=this.chatgnum(data["roomid"]),icon="";
			
			//20141124
			//20141124

			//color 主播：#ff34ff  本场皇冠：#ff0101 超级皇冠：#0166ff
			if(uid==_show.emceeId && uid==_show.local && uid==_show.supper){
				tempMsg='<span class="m u">'+tempMsg+'</span>';	
				icon="<img src='/member/image/local.gif'/>";	
			}else if(uid==_show.emceeId && uid==_show.local){
				tempMsg='<span class="m u">'+tempMsg+'</span>';	
				icon="<img src='/member/image/local.gif'/>";	
			}else if(uid==_show.emceeId && uid==_show.supper){
				tempMsg='<span class="m u">'+tempMsg+'</span>';	
				icon="<img src='/member/image/supper.gif'/>";	
			}else if(uid==_show.local && uid==_show.supper){
				tempMsg='<span class="m l">'+tempMsg+'</span>';	
				icon="<img src='/member/image/local.gif'/>";	
			}else if(uid==_show.emceeId){
				tempMsg='<span class="m u">'+tempMsg+'</span>';	
			}else if(uid==_show.local){
				tempMsg='<span class="m l">'+tempMsg+'</span>';	
				icon="<img src='/member/image/local.gif'/>";
			}else if(uid==_show.supper){
				tempMsg='<span class="m s">'+tempMsg+'</span>';	
				icon="<img src='/member/image/supper.gif'/>";		
			}

			if(data["action"]==0){ //公聊
			
				var toAllSay='<p><span>'+time+'</span>'+icon+'<a class=\"chatuser\" gn="'+ugood+'" id='+uid+' href="javascript:void(0);">'+data['nickname']+'</a>'+cugood+': '+tempMsg+'</p>';
			    str=toAllSay;
			}else if(data["action"]==1){ //悄悄
				var toOneSay='<p><span>'+time+'</span>'+icon+'<a class=\"chatuser\" gn="'+ugood+'" id='+uid+' href="javascript:void(0);">'+uname+'</a>'+cugood+' 对 <a href="javascript:void(0);" class=\"chatuser\" gn="'+tougood+'" id='+touid+'>'+touname+'</a>'+ctougood+' 说: '+tempMsg+'</p>';
				str=toOneSay;
			}else if(data["action"]==2){ //私聊
				if(Chat.is_private==0){//无关闭私聊
					if(data["uid"]==_show.userId){								
						str='<p><span>'+time+'</span> 你对 <a href="javascript:void(0);" class=\"chatuser\" gn="'+tougood+'" id='+touid+'>' + touname + '</a>'+ctougood+' 说: ' +tempMsg+ '</p>';
					}else if(_show.admin==1){//巡官
						str='<p>'+icon+' <a href="javascript:void(0);" gn='+ugood+' class=\"chatuser\" id='+uid+'>' + uname + '</a>'+cugood+' 对 <a href="javascript:void(0);" gn="'+tougood+'" class=\"chatuser\" id='+touid+'>' + touname + '</a>'+ctougood+' 说: ' +tempMsg+ '<span>(' + time + ')</span> </p>';
					}else{
						if(data["touid"]==_show.userId){
							str='<p><span>'+time+'</span> '+icon+' <a href="javascript:void(0);" gn="'+ugood+'" class=\"chatuser\" id='+uid+'>' + uname + '</a>'+cugood+' 对你说: ' +tempMsg+ '</p>';
						}else{
							//str='<p><span>' + time + '</span>'+icon+' <a href="javascript:void(0);" gn='+ugood+' class=\"chatuser\" id='+uid+'>' + uname + '</a>'+cugood+' 对 <a href="javascript:void(0);" gn="'+tougood+'" class=\"chatuser\" id='+touid+'>' + touname + '</a>'+ctougood+' 说: ' +tempMsg+ '</p>';
						}
					}
					$("#chat_hall_private").append(str);
					this.isScroll("chat_hall_private");
					return;
				}
			}
		}
		$("#chat_hall").append(str);
				
	}

	function chatgnum(gn){
		
		var goodnum=gn;
		var gnbuy="";
		if(goodnum!="" && goodnum.length<10){ //is buy goodnum
		   gnbuy="(<span class=\"ugood\">"+goodnum+"</span>)";
		}
		return gnbuy;
	}

	//pc 礼物

	function showSendGift(data)
	{
		var str="";
		var date = new Date();
		var h = date.getHours()<10 ? h = '0'+date.getHours() : date.getHours();
		var m = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
		var imgstr = "";
		for(var i = 0;i<data.giftCount;i++)
		{
			imgstr+='<img src ="'+data.giftPath+'" />';
		}
		var giftstr='<p><span>'+h+':'+m+'</span><a href="javascript:void(0);" class=\"chatuser\" gn='+data.userNo+' id='+data.userId+'>'+data.userName+'</a> 送给 <a href="javascript:void(0);" gn='+data.roomid+' class=\"chatuser\" id='+data.toUserId+'>' +data.toUserName+ '</a>:'+data.giftCount+imgstr+'个</p>';
		$("#chat_hall").append(giftstr);

	}


	function showFlash(data){//礼物展示
		if(data['giftCount'] >= 1314){
			var giftIcon = data['giftIcon'];
			var effectId = 8;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}
		else if(data['giftCount'] >= 520){
			var giftIcon = data['giftIcon'];
			var effectId = 7;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else if(data['giftCount'] >= 300){
			var giftIcon = data['giftIcon'];
			var effectId = 5;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else if(data['giftCount'] >= 99){
			var giftIcon = data['giftIcon'];
			var effectId = 3;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else if(data['giftCount'] >= 66){
			var giftIcon = data['giftIcon'];
			var effectId = 2;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else if(data['giftCount'] >= 11){
			var giftIcon = data['giftIcon'];
			var effectId = 0;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else if(data['giftCount'] > 1){
			var giftIcon = data['giftIcon'];
			var effectId = 0;
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}else{
			var giftIcon = data['giftIcon'];
			var effectId = -1;
			var left = parseInt(Math.random()*(100-48)+48) + '%';
			var top = parseInt(Math.random()*(633-273)+273) + 'px';
			var top2 = parseInt(Math.random()*(594-234)+234) + 'px';
		}

			if(data['giftSwf'] != ''){
			var giftIcon = data['giftSwf'];
			var effectId = -1;
 
			var left = '48.2%';
			var top = '203px';
			var top2 = '164px';
		}

				if($(".my_tab").css("display")=="block"){
					$('#flashCallGift').css({"left":left,"top":top,"width":"1080px","height":"800px"});
				}else{
					$('#flashCallGift').css({"left":left,"top":top2,"width":"1080px","height":"800px"});
				}
				Dom.$swfId("flashCallGift").playEffect(giftIcon, effectId, 200);
				//-1一个 0三角形 1不显示 2六字形 3嘴形 4元宝 5心形 7 ILOVEYOU 8一生一世 9海枯石烂
						if(data['giftSwf'] != '')
						{
								setTimeout(
										function(){
												Dom.$swfId("flashCallGift").clearEffect();
												Dom.$swfId("flashCallGift").playEffect("", "", 200);
												$('#flashCallGift').css({"width":"1px","height":"1px"});
													},20000
											);
							
						}else{
									setTimeout(
					                      function(){
					                    	Dom.$swfId("flashCallGift").clearEffect();
						                    $('#flashCallGift').css({"width":"1px","height":"1px"});
					                              },5000
				                              );
							
						}
	}



