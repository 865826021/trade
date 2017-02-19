
/*聊天*/
var Chat={
	msgLen:0,
    scrollChatFlag:1,
	is_private:0, //是否私聊
	tempMsg:"",
	gift_swf:"",
	chat_max_text_len:200,
	fly_max_text_len:40,
	userlengthcontrol:10,
	toGiftInfo:"",
	arrGiftInfo:[],
	videoTimer:null,
	arrChatModel:["gift_model","gift-givenum","playerBox","playerBox1","gift_name","gift_num","gift_to","msg_to_all","ChatFace","showFaceInfo","get_sofa","user_sofa","hoverPerson","msgGb","scroll_lb","btnsubmit","guan","showFaceInfoGb","ChatFaceGb"],
	clearChat:function(flag){
		if(flag=='pulic'){
		   Chat.msgLen=0;
		   $("#chat_hall").empty();
		}else if(flag=='private'){
		   $('#chat_hall_private').find('p').remove();
		}
	},	
	
	closeTopBar:function(modelID){
		$('#'+modleID).hide();
	},
	richLevel:function(uid){
		var user=$('#online_'+uid);
		var rich=user.attr('richlevel');
		if(!rich){rich=0;}
		return rich;
	},
	scrollChat:function(){
		if(Chat.scrollChatFlag==1){
			Chat.scrollChatFlag=0;
			$("#scrollSign").attr('class','off');
		}else{
			Chat.scrollChatFlag=1;
			$("#scrollSign").attr('class','on');
		}
	},
	turnPrivateChat:function(){
		if(Chat.is_private==1){
			Chat.is_private=0;
			$("#privateSign").attr("class","off");
		}else{
			Chat.is_private=1;
			$("#privateSign").attr("class","on");
		}	
	},
	setDisabled: function(n) {
		$("#btnsay").attr("disabled","disabled");
		$("#btnsay").attr("class","say sayoff");
		setTimeout(function(){
			$("#btnsay").attr("disabled",false);
			$("#btnsay").attr("class","say sayon");
			$("#msg").focus();
		},n*80);
	},
    dosendFly:function(){//飞屏
		if(_show.userId<0){
			UAC.openUAC(0);
			return false;
		}
		if(_show.enterChat==0){//没有进入chat
			console.log("dosendFly");
			_alert('连接异常请等待！',3);
			return false;	
		}	
	 
		var touid=$("#to_user_id").val(),toname=$('#to_nickname').val(),fmsg=Face.deimg($("#msg").val()),eid=_show.emceeId;
		if(fmsg.length>this.fly_max_text_len){
			_alert('您的飞屏内容过长,请确保不超过40个汉字！',3);
			$("#msg").focus();	
			return false;
		}
		if(touid==""){touid=0;}
		if(!fmsg){
			_alert('请输入内容！',3);
			$("#msg").focus();
			return false;
		}
		$("#msg").focus();
		$("#msg").val('');
		if(confirm("请确认是否发送？")){
	       var url="/member/liveonline.php?action=dosendFly&eid="+eid+"&toid="+touid+"&toname="+encodeURIComponent(toname)+"&fmsg="+encodeURIComponent(fmsg)+"&t="+Math.random();
		   $.getJSON(url,function(data){
			   //alert(fmsg);
			  if(data && data.code==0){Dom.$swfId("flashCallChat")._chatToSocket(2,2,'{"_method_":"SendFlyMsg","touid":"'+touid+'","touname":"'+toname+'","ct":"'+fmsg+'"}');}else{_alert(data.info,5);}
		   });
		}
	},
	doSendMessage:function(){
		if(_show.userId<0){
			UAC.openUAC(0);
			return false;
		}
		if(_show.enterChat==0){//没有进入chat
			_alert('连接异常请等待！',3);
			return false;	
		}
		var w=$("#msg");
		var wval=$("#msg").val();
		var to_user_id=$("#to_user_id").val();
		var to_nickname=$("#to_nickname").val();
		var to_goodnum=$("#to_goodnum").val();
		var whisper=$("#whisper").prop("checked")?1:-1;
		wval=wval.substr(0,this.chat_max_text_len);
		if(to_user_id==_show.userId){
			_alert('自己不能给自己聊！',3);
			return false;
		}
		if(_show.is_public=="0" && whisper==-1){ //关闭私聊
			if(_show.emceeId!=_show.userId && _show.admin=="0"){ //是普通、游客类型的用户
				_alert('房间公聊已关闭！',3);
				return false;	
			}				
		}
		if(!wval){
			_alert('请输入内容！',3);
			$("#msg").focus();
			return false;
		}
		$("#msg").focus();
		$("#msg").val('');
		
		_vc = typeof(_vc)==undefined ? "" : _vc;
		// action  0:公聊  1 悄悄  2 私聊
		if(_vc==""){
			if(to_user_id=="" && to_nickname==""){ //公聊
				Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"SendPubMsg","ct":"'+wval+'","checksum":""}');
				socket_say('','',wval);
			}else{
				if(/*whisper*/Chat.is_private == 1){ // 别人看不到(私聊)
					Dom.$swfId("flashCallChat")._chatToSocket(2,2,'{"_method_":"SendPrvMsg","touid":"'+to_user_id+'","touname":"'+to_nickname+'","tougood":"'+to_goodnum+'","ct":"'+wval+'","pub":"0","checksum":""}');	
				}else{
					//在公聊区域显示 大家都能看到(悄悄)
					Dom.$swfId("flashCallChat")._chatToSocket(1,2,'{"_method_":"SendPrvMsg","touid":"'+to_user_id+'","touname":"'+to_nickname+'","tougood":"'+to_goodnum+'","ct":"'+wval+'","pub":"1","checksum":""}');
					socket_say(to_user_id,to_nickname,wval);
				}
			}
		}else{
            var cts = $("#ChatWrap").css({"top":"-114px","display":"block"});
			if(to_user_id=="" && to_nickname==""){ //公聊
				Dom.$swfId("flashCallChat").chatVerificationCode(0, 2, '{"_method_":"SendPubMsg","ct":"'+wval+'","checksum":""}', _vc);
			}else{
				if(whisper==1){ // 别人看不到(私聊)
					Dom.$swfId("flashCallChat").chatVerificationCode(2, 2, '{"_method_":"SendPrvMsg","touid":"'+to_user_id+'","touname":"'+to_nickname+'","ct":"'+wval+'","pub":"0","checksum":""}', _vc);
				}else{
					//在公聊区域显示 大家都能看到(悄悄)
					Dom.$swfId("flashCallChat").chatVerificationCode(1, 2, '{"_method_":"SendPrvMsg","touid":"'+to_user_id+'","touname":"'+to_nickname+'","ct":"'+wval+'","pub":"1","checksum":""}', _vc);
				}
			}
		}
	},
	//20141124
	doSendMessage2:function(){
		Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"SendPubMsg","ct":"I am alive","checksum":""}');
	},
	submitForm:function(evt){
		var evt=evt?evt:(window.event?window.event:null);
		if(evt.keyCode==13 || (evt.ctrlKey && evt.keyCode==13) || (evt.altKey && evt.keyCode==83)){
				if($("#btnsay").attr("disabled")!="disabled"){
					console.log("submitForm");
					Chat.doSendMessage();
				}
		}
	}
	,getUserBalance:function(){//用户币更新
	},
	getRankByShow:function(){ //更新本场排行榜
	},
	checkVideoLive:function(){ //client 检测是否在直播
	   if(_show.emceeId!=_show.userId){ //不是主播
	      if(_show.enterChat==0){ //未进入聊天
			  $.getJSON("/show_checkVideoLive_rid="+_show.emceeId+Sys.ispro+".htm?t="+Math.random(),function(json){
					if(json){
						var str="";
						if(json["data"]["showId"]>0){//正在直播状态
						   
						   JsInterface.beginLive(json["data"]);
						}else{ //结束直播状态
						   
						   JsInterface.endLive();
						}
					}
			   });
		  	}
		  	else{
		  		clearInterval(Chat.videoTimer);
		  	}
	   }
	  
	}
}

//
var jumpAnchor=function(){
		var _time=1000;
		if(arguments.length == 2) _time =  arguments[1];
		if ($("."+arguments[0]).length > 0)
			$("html,body").animate({scrollTop: $("."+arguments[0]).offset().top}, {duration: _time,queue: false});
}

/*特权命令操作*/
var UserListCtrl={
	user_id:'',
	nickname:'',
	Tid:'', 
	level:'',//等级
	goodnum:'',
	chatPublic:function(){
		try{
			if (UserListCtrl.user_id){
				$("#to_user_id").val(UserListCtrl.user_id);
				$("#to_nickname").val(UserListCtrl.nickname);
				$("#to_goodnum").val(UserListCtrl.goodnum);
				$("#msg_to_one").html('<span>' + UserListCtrl.nickname + '</span>');
				$(".msg_to_all").hide();
				$("#msg_to_one").show();
				$("#whisper").attr("disabled",false);
				$("#whisper").removeAttr("checked");
				$("#msg").focus();
			}else{
				return false;
			}
		}catch(e){}
	},
	chatPrivate:function(){
		try{
			if(UserListCtrl.user_id){
				$("#to_user_id").val(UserListCtrl.user_id);
				$("#to_nickname").val(UserListCtrl.nickname);
				$("#to_goodnum").val(UserListCtrl.goodnum);
				$("#msg_to_one").html('<span>' + UserListCtrl.nickname + '</span>');
				$("#whisper").prop("checked",true);
				$(".msg_to_all").hide();
				$("#msg_to_one").show();
				$("#msg").focus();
			}else{
				return false;
			}
		}catch(e){}	
	}
}

/*命令接口 白少鹏*/
var ChatApp={
	serverID:"",
	/**
	* 根据rid uid 取出 管理员列表
	* @param rid 房间ID,uid 用户ID
	* @return json
	*/
	GetManagerList:function(){}
	,
	/**
	* 根据uidlist 踢出指定的多个用户
	* @param rid 房间ID,uid 用户ID/uidlist 被踢的用户列表 
	*/
	Kick:function(){
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能踢自己啊！",3);
			return false;
		}else{
			$.getJSON("/index.php/Show/kick/",{
					rid:_show.emceeId,
					uidlist:UserListCtrl.user_id,
					t:Math.random()
				},function(json){
						if(json){
							if(json["code"]!=0){
								_alert(json["info"],3);
								return false;
							}
							else
								Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"KickUser","tougood":"' + UserListCtrl.goodnum + '","touid":"' + UserListCtrl.user_id + '","touname":"' + UserListCtrl.nickname + '"}');
								_alert("操作成功！",3);
						}
					}
			);
		}	
	},
	/**
	* 根据uidlist 将指定的多个用户禁言
	* @param rid 房间ID,uid 用户ID/uidlist 被禁言的用户列表  timeout(禁言时间) 
	*/
	ShutUp:function(){
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能给自己禁言！",3);
			return false;
		}else{
			$.getJSON("/member/liveonline.php?action=shutup",{
					rid:_show.emceeId,
					uidlist:UserListCtrl.user_id,
					timeout:5,
					t:Math.random()
				},function(json){
						if(json){
							if(json["code"]!=0){
								_alert(json["info"],3);
								return false;
							}
							else
								Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"ShutUpUser","tougood":"' + UserListCtrl.goodnum + '","touid":"' + UserListCtrl.user_id + '","touname":"' + UserListCtrl.nickname + '"}');
								_alert("操作成功！",3);
						}
					}
			);
		}
	},
	/**
	* 根据uidlist 将指定的多个用户恢复发言
	* @param rid 房间ID,uid 用户ID/uidlist 被恢复发言的用户列表
	*/
	Resume:function(){
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能恢复自己的发言！", 3);
			return false;
		}else{
			Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"ResumeUser","tougood":"' + UserListCtrl.goodnum + '","touid":"' + UserListCtrl.user_id + '","touname":"' + UserListCtrl.nickname + '"}');
			_alert("操作成功！",3);
		}
	}
	,
	setManager:function(){ //设为管理员
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能对自己操作！",3);
			return false;
		}else{
			$.getJSON("/index.php/Show/toggleShowAdmin/",{
					eid:_show.emceeId,
					state:1,
					userid:UserListCtrl.user_id,
					t:Math.random()
				},function(json){
						if(json){
							if(json["code"]==0){
								Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"setManager","tougood":"' + UserListCtrl.goodnum + '","touid":"' + UserListCtrl.user_id + '","touname":"' + UserListCtrl.nickname + '"}');
								_alert('操作成功！',3);	
							}
							else{
								_alert(json["info"],3);
							}
						}
					}
			);
		}
	},
	setBlack:function(){ //黑名单操作
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能对自己操作！",3);
			return false;
		}else{
			$.getJSON("bl.do",{
					eid:_show.emceeId,
					m:"setBlack",
					userid:UserListCtrl.user_id,
					t:Math.random()
				},function(json){
						if(json){
							if(json.code==0){
								_alert(json.info,3);
							}
							else{
								_alert(json.info,3);
							}
						}
					}
			);
		}
	},
	delManager:function(){ //删除管理员
		if(UserListCtrl.user_id==_show.userId){
			_alert("不能对自己操作！",3);
			return false;
		}else{
			$.getJSON("/index.php/Show/toggleShowAdmin/",{
				eid:_show.emceeId,
				state:0,
				userid:UserListCtrl.user_id,
				t:Math.random()
			},
			function(json){
				if(json){
					if(json["code"]==0){
						Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"delManager","tougood":"' + UserListCtrl.goodnum + '","touid":"' + UserListCtrl.user_id + '","touname":"' + UserListCtrl.nickname + '"}');
						_alert('操作成功！',3);	
					}
					else{
						_alert(json["info"],3);
					}
				}
			});
		}
	}
}

/**
 * 主播Menu SetTing
 */
var playerMenu={
	bulletin:function(t){
		var ot="#b"+t+"t";
		var ou="#b"+t+"u";
		var text=$("#b"+t+"t").val();
		var link=$("#b"+t+"u").val();
		if(text.length>40 || text.trim()=="" || text.trim()=="请输入文字,不超过40个..."){
			_alert("请输入文字,不超过40个...",5);
			return;
		}
		if(link=="请输入链接地址")
			link="";
		
		$.post("/index.php/User/setBulletin/",{
				m:"setBulletin",
				eid:_show.emceeId,
				bt:t,
				t:text,
				u:link,
				r:Math.random()
			},function(data){
				if(data.code==0){
					$(ot).val("");
					$(ou).val("");
					_alert("操作成功！",3);
					$("#notice-modle").hide();
					Dom.$swfId("flashCallChat")._chatToSocket(0, 2, '{"_method_":"setBulletin","bt":"' + t + '","t":"' + text + '","u":"' + link + '"}');
				}
				else
					_alert(data.info,5);
			},"json"
		);
	},
	enter:function(){
		var url="/index.php/Show/enterspeshow/eid/"+_show.emceeId+"/type/"+_show.deny;
		if(_show.deny==2)
			url+="/password/"+$("#room_pwd").val();
		url+="/t/"+Math.random();
		$.getJSON(url,function(json){
			if(json){
				if(json.code==0){
					window.location.reload();
				}
				else{
					_alert(json.info,5);
				}		
			}
		});
	},
	sel:function(i){
		$("#bg1").removeClass();
		$("#bg2").removeClass();
		$("#bg"+i).addClass("on");
		var file=$("#bg3");
		file.after(file.clone().val(""));
		file.remove(); 
		$("#bgh").val(i);	
	}
}

/*送礼物接口 */

var GiftCtrl={
	gift_to_id:'',
	gift_id:'', 
	setUser:function(user_id,user_nick){
		$('#msg_to_all,#playerBox1').hide();
		$('#msg_to_one').show();
		// $('#whisper').get(0).disabled=false;
		$('#msg_to_one').find('span').html(Face.de(user_nick));
		$('#to_user_id').val(user_id);
		GiftCtrl.gift_to_id=user_id;
		$('#to_nickname').val(user_nick);
	},
	closeToWho:function(){
		$("#to_user_id").val("");
		$("#to_nickname").val("");
		// $('#whisper').get(0).disabled = true;
		$("#whisper").prop("checked",false);
		
		$("#msg_to_all").show();
		$("#msg_to_one").hide();
		$("#msg").focus();
	}
}
