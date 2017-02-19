/**
 * 判断浏览器
 */
var Sys={};
var Gift_obj={};
var Gift_numobj={};
var ua=navigator.userAgent.toLowerCase();
Sys.ie=(s=ua.match(/msie ([\d.]+)/)) ? true : false;
Sys.ie6=(s=ua.match(/msie ([0-6]\.+)/)) ? s[1] : false;
Sys.ie7=(s=ua.match(/msie ([7]\.+)/)) ? s[1] : false;
Sys.ie8=(s=ua.match(/msie ([8]\.+)/)) ? s[1] : false;
Sys.firefox=(s=ua.match(/firefox\/([\d.]+)/)) ? true : false;
Sys.chrome=(s=ua.match(/chrome\/([\d.]+)/)) ? true : false;
Sys.opera=(s=ua.match(/opera.([\d.]+)/)) ? s[1] : false;
Sys.safari=(s=ua.match(/version\/([\d.]+).*safari/)) ? s[1] : false;
Sys.ie6&&document.execCommand("BackgroundImageCache",false,true);
Sys.ispro="";//是否推广url过来
String.prototype.hasString=function(a){
	if(typeof a=="object"){
		for(var b=0,c=a.length;b<c;b++)
		   if(!this.hasString(a[b]))
		   	  return false;
			return true
	}else if(this.indexOf(a)!=-1)
		return true
};

/**
 * 计算位置
 */
var dom=document.documentElement || document.body;
var oPos={
	width:function(a){return parseInt(a.offsetWidth)},
	height:function(a){return parseInt(a.offsetHeight)},
	pageWidth:function(){return document.body.scrollWidth||document.documentElement.scrollWidth},
	pageHeight:function(){return document.body.scrollHeight||document.documentElement.scrollHeight},
	windowWidth:function(){var a=document.documentElement;return self.innerWidth||a&&a.clientWidth||document.body.clientWidth},
	windowHeight:function(){var a=document.documentElement;return self.innerHeight||a&&a.clientHeight||document.body.clientHeight},
	scrollX:function(){
	  var b=document.documentElement;
	  return self.pageXOffset||b&&b.scrollLeft||document.body.scrollLeft
	}
	,scrollY:function(){
	  var b=document.documentElement;
	  return self.pageYOffset||b&&b.scrollTop||document.body.scrollTop
	},
	popW:function(){return Math.max(dom.clientWidth,dom.scrollWidth)},
	popH:function(){return Math.max(dom.clientHeight,dom.scrollHeight)}
}
var mousePosition=function(e){
  var e=e || window.event;
  return {x:e.clientX+oPos.scrollX(),y:e.clientY+oPos.scrollY()}
};

/**
 * 获取layer居中的位置
 */
var getMiddlePos=function(obj){
	this.objPop=obj;
	this.winW=oPos.windowWidth();  
    this.winH=oPos.windowHeight();  
	this.dScrollTop=oPos.scrollY();
	this.dScrollLeft=oPos.scrollX();
	this.dWidth=$('#'+this.objPop).width(),dHeight=$('#'+this.objPop).height();
	this.dLeft=(this.winW/2)-(this.dWidth)/2+this.dScrollLeft;
	this.dTop=(this.winH/2)-(this.dHeight/2)+this.dScrollTop;
	return {"pl":this.dLeft,'pt':this.dTop};
}

/**
 * read html ? param
 * @param strName:需要获取参数的名字
 * @return string
 */
function getParam(strName)
{
	var arg=arguments[1]?arguments[1]:"";
	var strHref=location.href;
	if(arg!=""){
		strHref=arg;	
	}
	var intPos=strHref.indexOf("?");
	var strRight=strHref.substr(intPos + 1);
	var arrTmp=strRight.split("&");
	for(var i=0;i<arrTmp.length;i++)
	{
		var arrTemp=arrTmp[i].split("=");
		if(arrTemp[0].toUpperCase()==strName.toUpperCase()) return arrTemp[1];
	}
	return "";
}
/**
 * jump location.href
 * @param urlfile:跳转URL
 */
var jump=function(urlfile)
{
	window.location.href=urlfile;
	return false;
}
/**
 * 将JSON字符串转换成object
 * @param evalJSON:json string
 * @return json object
 * */
function evalJSON(strJSON)
{
	if (typeof(strJSON)=='undefined'||strJSON=='')
		return false;

	return eval("("+ strJSON +")");
}

/**
 * 是否在数组内
 */
function in_array(searcher,sArray)
{
	for(var i=sArray.length;i--;)
	{
		if(searcher==sArray[i])// TODO 应该用===
		{
			return true;
		}
	}
	return false;
}

function jmsgPop(txt,showtime){
	var box=$('#giveBox');
	if(txt){$('#pop-text').html(txt);}
	var alertPop=getMiddlePos('giveBox');
	var vl=alertPop.pl;
	var vt=alertPop.pt;
	box.css({"left":vl+"px","top":vt-100+"px"}).show(); 
	$('#pop-close,#pop-btnclose').click(function(){
		box.hide();
	})
	if(isNaN(showtime)){
		box.hide();
	}else{
		window.setTimeout(function(){
			box.hide();					   
		},showtime*1000)
	}
}

function addEvent(obj,type,fn){
	if (obj.attachEvent){
		obj['e'+type+fn]=fn;
		obj[type+fn]=function(){
			obj['e'+type+fn](window.event);
		}
		obj.attachEvent('on'+type,obj[type+fn]);
	} else
	 obj.addEventListener(type,fn,false);
}
function removeEvent(obj,type,fn){
	if (obj.detachEvent){
		obj.detachEvent('on'+type,obj[type+fn]);
		obj[type+fn]=null;
	} else
	 obj.removeEventListener(type,fn,false);
}
/*
 * jQuery.JShowTip({centerTip:$('#signuplogin_tip')}); 居中显示POP Tip
 * $(document).trigger('close.JoyShowTip')
 * */
(function($){
		  $.JShowTip=function(data){$.JShowTip.loading(data);}
		  $.extend($.JShowTip,{
			  settings:{opacity:'0.2'},
			  loading:function(_tarwap){
							showOverlay();
						    _tarwap.centerTip.css({
								"left":$(window).width()/2-Math.ceil($('.poptip').width()/2),
								"top":oPos.scrollY()+(oPos.windowHeight()/3),
								"z-index":100
							}).show();
							if(_tarwap.param){
								var param_obj=_tarwap.param;
								for(var key in param_obj[0]){
									$('#'+key).html(param_obj[0][key]);
								}
							}
							$(document).bind('keydown',function(e){
								if(e.keyCode==27){//esc 关闭
									$(document).trigger('close.JShowTip');
								}
							});
					   }
		  });
		  function showOverlay(){
				$('body').append('<div id="face_overlay"></div>');
				$('#face_overlay').hide().addClass('face_overlayBG')
					.css({opacity:$.JShowTip.settings.opacity,height:oPos.popH()})
					.click(function(){
						$(document).trigger('close.JShowTip');
				}).fadeIn(200);
				$('.close').click(function(){
					$(document).trigger('close.JShowTip');						   
				})
		  }
		  function hideOverlay(){
				$this=$('.poptip,.p-Song');
				$this.fadeOut(200,function(){
					$('#face_overlay').remove();
				});
		  }
		  $(document).bind('close.JShowTip',function(){
				$(document).unbind('keydown');
				hideOverlay();
		  });
})(jQuery);

/**  
	标签
*/
function turn(n,m,x){
	for(i=1;i<=m;i++){
		if(i==n){
			jQuery('#lm'+x+'_'+i).addClass("on");
			jQuery('#content'+x+'_'+i).css("display","block");	
			 
		}else{
			jQuery('#lm'+x+'_'+i).removeClass("on");
			jQuery('#content'+x+'_'+i).css("display","none");
			
		}
	}

}

/**
 * 滚动
 * @name HtmlMove
 * @grammar HtmlMove("play_triger","cf","scrollLeft","play_pre","play_next");
 * @param {string} 	fid 		父容器节点
 * @param {string} 	fnodename 		要遍历的节点
 * @param {string} 	path 		滚动方向
 * @param {string} 	prebtn 		往上滚 按钮 ID
 * @param {string} 	nextbtn 	往下滚 按钮 ID
 */
var HtmlMove=function(fid,fnodename,path,prebtn,nextbtn){
	var h=$('#'+fid),pre=$('#'+prebtn),next=$('#'+nextbtn),pageCount=h.find('.'+fnodename).size(),intIndex,scrollW=0,scrollval;
	pre.addClass('dis');
	intIndex=0;
	if(path=='scrollLeft'){
		var oneset=parseInt(h.find('.'+fnodename).eq(0).width());
	}else{
		var oneset=parseInt(h.find('.'+fnodename).eq(0).height());
	}
	if(pageCount==1){
		pre.addClass('dis');next.addClass('dis');
	}else{
		pre.addClass('dis');next.removeClass('dis');
	}
	var dur=300;
	pre.click(function(){
		if(intIndex>0){changePage(intIndex-1);}
	})
	next.click(function(){
		if(intIndex<pageCount-1){changePage(intIndex+1);}
	})
	function changePage(pageNum){
		intIndex=pageNum;
		if(intIndex>0 && intIndex<pageCount-1){
			pre.removeClass('dis');
			next.removeClass('dis');
		}else if(intIndex==0){
			pre.addClass('dis');
			next.removeClass('dis')	
		}else{
			next.addClass('dis');pre.
			removeClass('dis');	
		}
		scrollval=parseInt(intIndex*oneset);
		if(path=='scrollLeft'){
			h.stop().animate({'scrollLeft':scrollval},dur,'linear');
		}else{
			h.stop().animate({'scrollTop':scrollval},dur,"linear");
		}
		
	}
}

/*
  图片滚动
 */	
//滚动/切屏效果，参数说明:[id,子容器/孙容器,方向,速度,上按钮,下按钮,分页切换时间,每次切屏的条数]
function HtmlMove2(id,tag,path,upbt,downbt,pgtime,lis){
		var c,mous=false,fg=tag.split('/'),o=$('#'+id),as=o.find(fg[1]),fx=(path=='scrollRight'||path=='scrollLeft')?'scrollLeft':'scrollTop',
		ow=fx=='scrollTop'?as.eq(0).get(0).offsetHeight:as.eq(0).get(0).offsetWidth;
		o.hover(function(){mous=true;},function(){mous=false;})
		var pgsize=as.size();
		var pw=fx=='scrollTop'?o.height():o.width(),pgli=lis||Math.floor((pw+ow/2)/ow),pg=Math.floor((pgsize+(pgli-1))/pgli),pgmx=ow*pgli,now=0,mx,d;
		var os=o.find(fg[0]).eq(0),dur=600;	
		o.find(fg[0]).append(os.html());	
		if(pgtime==null){$('#'+upbt).click(function(){go_to(true);});$('#'+downbt).click(function(){go_to(false);});}else{d=setInterval(function(){go_to((path=="scrollTop"||path=="scrollLeft")?true:false);},pgtime);$('#'+upbt).click(function(){clearInterval(d);go_to(true);d=setInterval(function(){go_to(true);},pgtime);});$('#'+downbt).click(function(){clearInterval(d);go_to(false);d=setInterval(function(){go_to(false);},pgtime);});}	
		 function go_to(fxs){
			 	if(mous){return;};
				if(fxs){
						if(now<pg){
							now++;
						}else{
							now=1;
							if(fx=='scrollTop'){
								o.scrollTop(0);
							}else{
								o.scrollLeft(0);	
							}
						}
						mx=now*pgmx;
						if(fx=='scrollTop'){
							o.stop().animate({'scrollTop':mx},dur,'linear');
						}else{
							o.stop().animate({'scrollLeft':mx},dur,'linear');
						}
						
				}else{
					if(now>0){
						now--;
					}else{
						now=pg-1;
						if(fx=='scrollTop'){
								o.scrollTop(pg*pgmx);
						}else{
								o.scrollLeft(pg*pgmx);	
						}
					}
					mx=now*pgmx;
					if(fx=='scrollTop'){
						o.stop().animate({'scrollTop':mx},dur,'linear');
					}else{
						o.stop().animate({'scrollLeft':mx},dur,'linear');
					}
				}
			}
}
/*===========================chat Menu begin=======================================*/
$(document).on("click", ".chatuser", function() {
	 var that=$(this);
	 // var chatmenu=$('#hoverPerson');
	 var uid=that.attr("id");
	 if(uid!=0 && uid>0){
		 if($("#setMike")){ $("#setMike").hide(); }
		 var gnum=that.attr('gn'),title=that.html();
		 if(gnum==""){gnum=uid}
		 var objuser=uid+"@@@"+title+"@@@"+gnum;
		 var arrchat=objuser.split("@@@"),userid=arrchat[0],username=arrchat[1],gnum=arrchat[2],t=that.offset().top,l=that.offset().left;
		 // chatmenu.css({top:t+18,left:l-26}).show();
		 if(_show.emceeId==_show.userId || _show.admin==1){$('.tdeal').show();}
		 $('#person_title').html(username.substr(0,7)+".");
		 $('.enterroom').attr({'href':'/member/live_public.php?roomid='+uid,'title':username});
		 UserListCtrl.user_id=userid;
		 UserListCtrl.nickname=username;
		 UserListCtrl.level=0;
		 UserListCtrl.goodnum=that.attr('gn');
		 UserListCtrl.chatPublic();
	 }
});
$(document).on('mouseleave','#hoverPerson',function(){
	$(this).hide();
})
/*===========================chat Menu end=========================================*/
function _closePop(){
	var box=$('#alertBox');
	box.hide();
	return false;
}
/** 
 * 调用各种提示层 信息 Demo: onclick="_alert('请输入内容!',5,1,[Song.attion,Song.disattion])
 */
function _alert(txt,showtime){
	var box=$('#alertBox');
	var type=type || 1;
	if(txt){$('#msg_text').html(txt);}
	var alertPop=getMiddlePos('alertBox');
	var vl=alertPop.pl;
	var vt=alertPop.pt;
	$('#poptype1').show();
	$('#poptype2').hide();
	$('#poptype3').hide();
	box.css({"left":vl+"px","top":vt+"px","z-index": "1000"}).show(); 
	$('#close_msg,#data-confirm').click(function(){
		_closePop();
	});
	var timeSong=window.setTimeout(_closePop,showtime*1000);
}

function _alert2(txt,func){
	$('#btnAgree,#btnDisgree').unbind("click");
	var box=$('#alertBox');
	if(txt){$('#msg_text').html(txt);}
	var alertPop=getMiddlePos('alertBox');
	var vl=alertPop.pl;
	var vt=alertPop.pt;
	$('#poptype1').hide();	
	$('#poptype2').show();
	$('#poptype3').hide();
	if(func[0]){$('#btnAgree').click(function(){func[0]();})}
	if(func[1]){$('#btnDisgree').click(function(){func[1]();})}
	box.css({"left":vl+"px","top":vt+"px"}).show(); 
	$('#close_msg,#data-confirm').click(function(){
		_closePop();
	});
}
function _alert3(txt){
	var box=$('#alertBox');
	if(txt){$('#msg_text').html(txt);}
	var alertPop=getMiddlePos('alertBox');
	var vl=alertPop.pl;
	var vt=alertPop.pt;
	$('#poptype1').hide();	
	$('#poptype2').hide();	
	$('#poptype3').show();
	box.css({"left":vl+"px","top":vt+"px"}).show(); 
	$('#close_msg,#data-confirm').click(function(){
		_closePop();
		window.location.href='/';
	});
	$('#btnConfirm').click(function(){
		window.location.href='/';
	});
}

function _alert4(txt){
	var box=$('#alertBox');
	if(txt){$('#msg_text').html(txt);}
	var alertPop=getMiddlePos('alertBox');
	var vl=alertPop.pl;
	var vt=alertPop.pt;
	$('#poptype1').hide();	
	$('#poptype2').hide();	
	$('#poptype3').show();
	box.css({"left":vl+"px","top":vt+"px"}).show(); 
	$('#close_msg,#data-confirm').click(function(){
		_closePop();
		window.location.href='/';
	});
	$('#btnConfirm').click(function(){
		window.location.href='/';
	});
	var kicktimer=setTimeout(function(){window.location.href='/';},5000);
}

function chatPop(){
	var box=getMiddlePos('chatOff');
	var vl=box.pl;
	var vt=box.pt;
	$('#chatOff').css({"left":vl+"px","top":vt+"px"}).show(); 
	$('#chat_button').click(function(){window.location.reload();})
	var chatTime=setTimeout(function(){window.location.reload();},5000);
}

/*加载函数*/
$(function(){
	$.fn.extend({
		Discover:function(){
			var scrtime;
			$("#discover").hover(function(){
				clearInterval(scrtime);
			},function(){
				scrtime=setInterval(function() {
					var allMsg=$("#discover");
					var $ul=allMsg.find('ul.bigimg');
					var last=$ul.last();
					var liHeight=last.height();
					allMsg.animate({marginTop:(liHeight)},1000,function(){
						last.hide();
						last.prependTo(allMsg);
						allMsg.css({marginTop:0});
						last.fadeIn(300);
					});
				},5000);
			});
		},
		ClearRoom:function(){
			var that=$(this);
			that.blur(function(){
				if($(this).val()==''){$(this).val($(this).attr('pro-msg'));}
			})
			that.focus(function(){
				if($(this).val()==$(this).attr('pro-msg')){$(this).val('');}
			})	
		},
		setMyTab:function(){ //管理中心 tab导航
			var strCenterUrl=location.href;
			var arrNav=[
						{"tag":"bookmark","name":"我的收藏","loc":0},
						{"tag":"interestToList","name":"我的偶像","loc":1},
						{"tag":"myNos","name":"我的靓号","loc":2},
						{"tag":"tool","name":"我的道具","loc":3},
						//{"tag":"wishing","name":"我的许愿","loc":4},
						{"tag":"showadmin","name":"我的房管","loc":4},
						//{"tag":"family","name":"我的家族","loc":6},
						{"tag":"interestByList","name":"我的粉丝","loc":5},
						{"tag":"info","name":"我的个人设置","loc":6},
						{"tag":"get","name":"我的账单","loc":7},
						{"tag":"listAward","name":"我的账单","loc":7},
						{"tag":"exchange","name":"我的兑换","loc":10},
						{"tag":"settlement","name":"我的结算","loc":11}
						
						
						//{"tag":"bl","name":"我的黑名单","loc":9}
					   ];
			var loc=0,stitle="我的收藏";
			for(var i=0;i<arrNav.length;i++){
				var json=arrNav[i];
				if(strCenterUrl.hasString(json["tag"])){
				   loc=json["loc"];
				   stitle=json["name"];
				}
			}
			$(this).eq(loc).addClass('on').html('<span>'+stitle+'</span>');
		}
		,
		OverChange:function(){
			$(this).hover(function(){$(this).addClass("hover")},function(){$(this).removeClass("hover")});	
		}
	});
	$('.mycenter').on("mouseenter",function(){
		$(this).find('.mysetting').show();
	}).on("mouseleave",function(){
		$(this).find('.mysetting').hide();
	})
	if(document.all){
		$("a[href='javascript:void(0);']").on("click",function(e){e.preventDefault();});
	}
	$(".chat_room").mouseover(function(){
		// $(this).find('.chat_btn').show();
	});
	$(".chat_room").mouseout(function() {
		$(this).find('.chat_btn').hide();
	});
	$('.dh').click(function(){
		$(".dh_table").show();
	});
	$('#gift_name').click(function(){
		Gift_obj.left=$('#gift_name').offset().left;
		Gift_obj.top=$('#gift_name').offset().top;
		$('#gift_model').css({"left":(Gift_obj.left-56)+"px","top":((Gift_obj.top)-234)+"px"});
		if($("#gift_model").is(":hidden")){
			$('#gift_model').show();	
			$('#choose_btn').attr('class','btn_up');
		}else{
			$('#gift_model').hide();	
			$('#choose_btn').attr('class','btn_down');	
		}
		
	});
	$('#show_num_btn').click(function(){
		Gift_numobj.left=$('#gift_num').offset().left;
		Gift_numobj.top=$('#gift_num').offset().top;
		$('#gift-givenum').css({"left":(Gift_numobj.left)+"px","top":((Gift_numobj.top)-120)+"px"});
		if($("#gift-givenum").is(":hidden")){
			$('#gift-givenum').show();
			$('#show_num_btn').attr("class","btn_up");
		}else{
			$('#gift-givenum').hide();
			$('#show_num_btn').attr("class","btn_down");	
		}
	});

	$("#hb_btn").mouseover(function(){
		Gift_numobj.left=$('#gift_num').offset().left;
		Gift_numobj.top=$('#gift_num').offset().top;
		$('#redBagBox').css({"left":(Gift_numobj.left+180)+"px","top":((Gift_numobj.top)-40)+"px"});
		//if($("#redBagBox").is(":hidden")){
			$('#redBagBox').show();
		//}else{
			//$('#redBagBox').hide();
		//}
	});
	$("#hb_btn").mouseout(function(){
		$('#redBagBox').hide();
	});
	$("#redBagBox").mouseover(function(){
		$('#redBagBox').show();
	});
	$("#redBagBox").mouseout(function(){
		$('#redBagBox').hide();
	});

	$('#gift_to').click(function(){
		var gift_to=$(this).offset();
	
		$('#playerBox').css({"left":(gift_to.left)+"px","top":((gift_to.top)-124)+"px"});
		if($("#playerBox").is(":hidden")){
			$('#playerBox').show();
			$('#show_gift_user_list_btn').attr("class","btn_up");
		}else{
			$('#playerBox').hide();
			$('#show_gift_user_list_btn').attr("class","btn_down");	
			
		}
	});
	$('#msg_to_all').click(function(){
	    var msg_to=$(this).offset();
		$('#playerBox1').css({"left":(msg_to.left)+"px","top":((msg_to.top)-130)+"px"});
		if($("#playerBox1").is(":hidden")){
			$('#playerBox1').show();
		}else{
			$('#playerBox1').hide();
		}
		$('#whisper').get(0).disabled=true;
	});
	$('.gift-v li').mouseover(function(e){
						   
		var obj_gift=$(this).position();
		$(this).find('div').css({"left":(obj_gift.left)+"px","top":((obj_gift.top))+"px"}).show();
	});
	$('.gift-v li').mouseout(function(e){
		$('.gift-v li').find('div').hide();					   

	});
	$('.gift_close').click(function(){
		$("#gift_model").hide();		
		$('#choose_btn').attr("class","");
	});
	//$('.p-Song .close').click(function(){
		//var that=$(this);	
		//that.parent().parent().hide();
	//});
	$("input[name=accounttype]").click(function(){
		var that=$(this);
		$('.paymethod').hide();
		$('.paymethod').eq(that.attr("value")-1).show();
	});
	$('#username').keydown(function(e){
		var keyCode=e.keyCode?e.keyCode:e.which?e.which:e.charCode;
		if(keyCode==13){
			e.preventDefault();
			$('#password')[0].focus();
		}
	});
	$('#password').keydown(function(e){
		var keyCode=e.keyCode?e.keyCode:e.which?e.which:e.charCode;
		if(keyCode==13){
			e.preventDefault();
			$('.btn_login').click();
			return false;
		}
	});
	
	
	
	
});

var $cookie={
	getCookie:function(a){
		var b=a+"=";
		a=document.cookie.indexOf(b);
		if(a!=-1){
			a+=b.length;
			b=document.cookie.indexOf(";",a);
			if(b==-1)b=document.cookie.length;
			return unescape(document.cookie.substring(a,b))
		}else return""
	},
	_getCookie:function(a){
		return document.cookie.match(RegExp("(^"+a+"| "+a+")=([^;]*)"))==null?"":decodeURIComponent(RegExp.$2);
	},
	setCookie:function(a,b,c){
		c=new Date((new Date).getTime()+c*36E5);
		document.cookie=a+"="+escape(b)+"; path=/; domain=" + window.location.host + "; expires="+c.toGMTString();
	},
	delCookie:function(a){
		var b=new Date((new Date).getTime());
		document.cookie=a+"= ; path=/; domain=" + window.location.host + "; expires="+b.toGMTString()
	}
}
//message
function showMessages(){
	var url="/show_listMessage"+Sys.ispro+".htm?t="+Math.random();
	$.getJSON(url,function(json){
		if(json && json.code==0){
			var total=json.data.count;
			$("#msgnum").html(total);
			if(total>0){
				var msgArray=new Array();
				$.each(json.data.messages,function(i,item){
					msgArray.push("<li mid=\""+item.userMsgId+"\" class=\""+(item.status==1?"read":"")+"\">");
					msgArray.push("<span>【系统】："+item.title+"</span>");
					msgArray.push("<p>"+item.content+"</p>");
					msgArray.push("</li>");
				});
				$("#message").html(msgArray.join(""));
			}
		}
		$('.mesage-tip li span').click(function(){
			var parentobj=$(this).parent();
			var p_obj=parentobj.find('p');
			var messageid=parentobj.attr('mid');
			var mestate=parentobj.attr('class');
			if(mestate!='read'){
				$.getJSON("show_readMessage_umid_"+messageid+Sys.ispro+".htm?t="+Math.random(),function(json){});
			}
			if(p_obj.is(':hidden')){
				p_obj.show();
			}else{
				p_obj.hide();
			}
			$(this).parent().addClass('read');
		})
		$('.mesage-tip li').hover(function(){
		    if($(this).attr('class')==''){
		    	$(this).addClass("hover");
			}
		},function(){
			$(this).removeClass("hover");
		})
	});
	setTimeout("showMessages()",5*60*1000);
}

var WlTools = {
	
	FormatNowDate:function(){
		var mDate = new Date();
		var H = mDate.getHours();
		var i = mDate.getMinutes();
		var s = mDate.getSeconds();
		return H + ':' + i + ':' + s;
	}
}