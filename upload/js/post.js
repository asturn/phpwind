/*
descript:贴子页js
*/
var count = 1;
var menushow = '';
var picpath = imgpath+"/post/smile/";

var header = document.getElementsByTagName("head")[0];
var script = document.createElement("script");
script.src = 'js/lang/zh_cn.js';
header.appendChild(script);

if (document.documentElement.addBehavior) {
	document.documentElement.addBehavior("#default#userdata");
}

var PwFace = {

	tabNum : 4,
	perpage : 0,
	tabObj : null,
	mainObj : null,

	init : function(tabid, mainid, tabnum, perpage) {
		PwFace.tabObj = getObj(tabid);
		PwFace.mainObj = getObj(mainid);
		if (typeof tabnum != 'undefined') PwFace.tabNum = tabnum;
		if (typeof perpage != 'undefined') PwFace.perpage = perpage;
		PwFace.initTab();
		PwFace.show(defaultface);
	},

	layout : function(o) {
		getObj(o).className = 'wy_menu';
		getObj(o).innerHTML = '<div class="wy_title cc" onmousedown="read.move(event)"><span class="adel" onclick="closep();document.body.onclick=null;" title="关闭">close.gif</span><b id="doleft" style="display:none" class="down_left fl" onclick="PwFace.showTab(-1)" title="上一个">上一个</b><b id="doright" style="display:none" class="down_right fr" onclick="PwFace.showTab(1)" title="下一个">下一个</b><ul id="face_tab"></ul></div><div class="face_main"><ul class="cc" id="face_main"></ul><div id="face_page" class="face_pages cc"></div></div>';
	},

	initTab : function() {
		var _html = '',i =0;
		for (var p in facedb) {
			if (p != 'event') _html += '<li id="ft_' + p + '" unselectable="on"' + (++i > PwFace.tabNum ? ' style="display:none"' : '') + '><a href="javascript://" hidefocus="true" onclick="PwFace.show(\''+p+'\');return false;">' + facedb[p] + '</a></li>';
		}
		PwFace.tabObj.innerHTML = _html;
	},

	showTab : function(p) {
		var index = -1;
		var menus = PwFace.tabObj.getElementsByTagName('li'),len = menus.length;
		for (var i = 0; i < len; i++) {
			if (menus[i].style.display != "none") {
				index = i;
				break;
			}
		}
		index += p;
		if (index < 0 || index + PwFace.tabNum > menus.length) return;
		for (i = 0; i < len; i++){
			if (i >= index && i < index + PwFace.tabNum){
				menus[i].style.display = "";
			} else{
				menus[i].style.display = "none";
			}
		}
	},

	selectTab : function(id) {
		var menus = PwFace.tabObj.getElementsByTagName('li');
		for (var i = 0,len = menus.length; i < len; i++) {
			menus[i].className = (menus[i].id.substr(3) == id) ? 'current' : '';
		}
	},

	show : function(id, p) {
		PwFace.selectTab(id);
		p = p || 1;
		var sublist = faces[id];
		if (PwFace.perpage > 0) {
			var l = sublist.length;
			if (is_ie) l -= 1;
			var page = Math.max(Math.ceil(l/PwFace.perpage),1);
			var _html = '';
			if (page > 1) {
				for (var i = 1; i <= page; i++) {
					_html += (i==p) ? '<b>' + i + '</b>' : '<a href="javascript:" onclick="PwFace.show(\''+id+'\','+i+');return false;">'+i+'</a>';
				}
			}
			getObj('face_page').innerHTML = _html;
			sublist = sublist.slice(PwFace.perpage * (p-1), Math.min(PwFace.perpage * p, sublist.length));
		}
		var _html = '';
		for (var i = 0; i < sublist.length; i++) {
			if (typeof sublist[i] != 'undefined')
				_html += '<li><a title="'+face[sublist[i]][1]+'" href="javascript:void(0)" onMousedown="PwFace.addsmile('+sublist[i]+');return false;"><img src="' + picpath + face[sublist[i]][0] + '" alt=" '+face[sublist[i]][1]+'" /></a></li>';
		}
		PwFace.mainObj.innerHTML = _html;
	},

	addsmile : function(NewCode) {
		if (typeof B != 'undefined' && typeof B.editor != 'undefined' && editor != null) {
			//editor.focus();
			editor.pasteHTML('<img src="' + imgpath + '/post/smile/' + face[NewCode][0] + '" emotion="' + NewCode + '" /> ');
			if(is_ie){
				setTimeout(function(){
				var rng = editor.getRng();
				rng.collapse(false);
				rng.select();
				}, 100);
			}

		} else if (typeof addsmile == 'function') {
			addsmile(NewCode);
		}
	}
}

function showDefault(){
	if (!IsElement('face_tab')) {
		loadFaceCss();
		read.obj = getObj("td_face");
		read.guide();
		PwFace.layout('menu_face');
	}
	read.open('menu_face', 'td_face', '2');
	PwFace.init('face_tab', 'face_main');
	var menus = PwFace.tabObj.getElementsByTagName('li');
	if(menus){
		showTabBtn(menus.length);
	}
	getObj('pw_box').onmousedown=function(e){
		e = e||event;
		if (e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}

	};
	document.body.onmousedown = closePWBox;
}
function closePWBox(){
	closep();
	document.body.onmousedown = null;
	getObj('pw_box').onmousedown = null;
}
function showTabBtn(length){
	if(length <= 4){
		return false;
	}
	if(getObj("doleft") && getObj("doright")){
		getObj("doleft").style.display = "";
		getObj("doright").style.display = "";
	}
	return false;
}

function loadFaceCss() {
	if (IsElement('face_css'))
		return;
	var css = elementBind('link','face_css');
	css.setAttribute('id', 'face_css');
	css.setAttribute('href',imgpath + '/post/c_editor/face.css');
	css.setAttribute('rel','stylesheet');
	css.setAttribute('type','text/css');
	header.appendChild(css);
}

/**** myshow start****/
var myshow    = 'http://rs.phpwind.net/';
var showid    = "gb_0";
var subjectid = "200";

function addgeneralface(NewCode) {
	if (typeof WYSIWYD == 'function') {
		if (editor._editMode == 'textmode') {
			editor.focusEditor();
			AddText('[img]','');
			AddText(NewCode + '[/img]','');
		} else {
			editor.restoreRange();
			editor.insertHTML('<img src="' + NewCode + '" />');
		}
	} else {
		document.FORM.atc_content.value += ' [img]'+NewCode+'[/img] ';
	}
}
function showGeneral(){
	if (!IsElement('generalbuttons')) {
		read.obj = getObj("td_generalface");
		read.guide();
		ajax.send('pw_ajax.php?action=showsmile&type=general&subjectid=0','',initGeneralFace);
	} else {
		read.open('menu_generalface','td_generalface','2');
		showGeneralFace(showid,subjectid);
	}
}
function showGeneralFace(a,b){
	var s = getObj("showgeneralface");
	s.innerHTML = showLoading();
	showid    = a;
	subjectid = b;
	ajax.send('pw_ajax.php?action=showsmile&type=general&subjectid='+subjectid,'',initGeneralFaces);
}
function initGeneralFaces() {
	var response = ajax.XmlDocument();
	var generalfaceid   = [];
	var generalfacename = [];
	var generalfacetype = [];
	var generalfacecode = [];
	var node = response.getElementsByTagName('items')[0].childNodes;
	var j=0;
	for(var i=0,len = node.length;i < len;i++){
		try{
			generalfaceid[j]   = node[i].getAttribute('id');
			generalfacename[j] = node[i].getAttribute('name');
			generalfacetype[j] = node[i].getAttribute('type');
			generalfacecode[j] = node[i].getElementsByTagName('code').item(0).firstChild.nodeValue;
			j++;
		}catch(e){}
	}
	selectMenu("generalbuttons",showid);

	var s = document.getElementById("showgeneralface");

	for(i in generalfaceid){
		//兼容opera
		try{var sid = generalfaceid[i];
		var pic = document.createElement("img");
		pic.style.margin = "3px";
		pic.style.cursor = 'pointer';
		pic.id = sid;
		pic.title=generalfacename[i];
		pic.src = myshow+generalfacecode[i]+'G.gif';
		pic.onclick = function(){addgeneralface(this.src);closep();};
		s.appendChild(pic);}catch(e){}
	}
	getObj("loading").style.display = "none";
}
function initGeneralFace(){
	var response = ajax.XmlDocument();
	var generalfaceid   = [];
	var generalfacename = [];

	var node = response.getElementsByTagName('subject')[0].childNodes;
	var j=0;
	for(var i=0;i<node.length;i++){
		try{
			generalfaceid[j] = node[i].getAttribute('id');
			generalfacename[j] = node[i].getAttribute('name');
			j++;
		}catch(e){}
	}
	var num = 0;
	var b='<a href="javascript:;" class="B_menu_adel" style="margin-top:2px;" onclick="closep();">关闭</a>';
	for(var i = 0,j = generalfaceid.length;i < j; i++){
		//兼容opera
		try{b += '<ul class="B_fl"><li id="gb_'+num+'"><a href="javascript:;" unselectable="on" onclick="showGeneralFace(\'gb_'+num+'\','+generalfaceid[i]+');">'+generalfacename[i]+'</a></li></ul>';
		num++;}catch(e){}
	}
	var a = {id:'menu_generalface',bid:'generalbuttons',sid:'showgeneralface',width:'300',height:'200',bhtml:b,shtml:''};
	initMenuTab(a,"4","1");
	read.open('menu_generalface','td_generalface','2');
	subjectid = generalfaceid[0];
	showGeneralFace(showid,generalfaceid[0]);
}
/**** myshow end****/

function initMenuTab(arr,n,Y) {
	var m = getObj(arr["id"]);
	m.className			= "B_menu B_p10 B_magic";

	var b = elementBind('div',arr["bid"],'B_menu_nav B_cc B_menu_navB','width:'+arr["width"]+'px');

	var s = elementBind('div',arr["sid"],'','background:#fff;width:'+(parseInt(arr["width"])+8)+'px;height:'+arr["height"]+'px;');
	if(Y)s.style.overflowY	= "auto";
	s.innerHTML	= arr["shtml"];

	var c = elementBind('div');
	c.style.cssText	= "clear:both";

	m.appendChild(b);
	m.appendChild(c);
	m.appendChild(s);
	b.innerHTML = '<a href="javascript:;" class="B_menu_adel" onclick="clearp(\'magiclist\');closep();showDefaultMagic();return false;" title="关闭">关闭</a><div class="B_menu_pre" style="margin-right:10px;" title="上一套" onclick="showTab(\''+arr["bid"]+'\',-1,'+n+');">上一套</div><div class="B_menu_next" style="float:right;" onclick="showTab(\''+arr["bid"]+'\',1,'+n+');" class="mr10" title="下一套">下一套</div>' + arr["bhtml"] + '';

	b.style.cursor		= 'move';
	showTab(arr["bid"],0,n);
}
function showTab(id,p,n){
	var o = getObj(id);
	var f = o.getElementsByTagName("li");
	var s = 0;
	for(var i=0,len = f.length;i < len;i++)
		if(f[i].style.display != "none"){s = i;break;}
	s += p;
	if(s < 0 || s + n > len) return;
	for(var i = 0;i < len; i++){
		if(i >= s && i< s + n){
			f[i].style.display = "inline";
		} else{
			f[i].style.display = "none";
		}
	}
	return;
}
function selectMenu(id,sid){
	var b = getObj(id);
	b.onmousedown = read.move;
	var f = b.getElementsByTagName("li");
	for (var i=0,len=f.length; i < len; i++) {
		f[i].className = f[i].id==sid ? "current" : '';
	}
}
function showLoading(){
	return "<div id=\"loading\" style=\"padding:80px 0 0;text-align:center\"><img src=\""+imgpath+"/loading.gif\" align=\"absmiddle\" class=\"B_mr10\" />正在加载数据...</div>";
}
function strlen(str){
	var len = 0;
	var s_len = str.length = (is_ie && str.indexOf('\n')!=-1) ? str.replace(/\r?\n/g, '_').length : str.length;
	var c_len = charset == 'utf-8' ? 3 : 2;
	for(var i=0;i<s_len;i++){
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? c_len : 1;
	}
	return len;
}
function quickpost(event){
	var keyDownCode = (event.which != undefined) ? event.which : event.keyCode;
	if ((event.ctrlKey && keyDownCode == 13) || (event.altKey && keyDownCode == 83)) {
		document.FORM.Submit.click();
	}
}
var PwStorage = {
	save : function(key, value, force) {
		if (!value && typeof force == 'undefined') return false;
		if (window.ActiveXObject) {
			with(document.documentElement) try {
				load(key);
				setAttribute("value", value);
				save(key);
			} catch(e) {return false;}
		} else if (window.sessionStorage) {
			try {
				sessionStorage.setItem(key,value);
			} catch(e) {return false;}
		}
		return true;
	},
	load : function(key) {
		var msg = '';
		if (window.ActiveXObject) {
			with (document.documentElement) try {
				load(key);
				msg = getAttribute("value");
			} catch(e) {}
		} else if (window.sessionStorage) {
			try {
				msg = sessionStorage.getItem(key);
			} catch(e) {}
		} else {
			return false;
		}
		return msg;
	}
}
function saveData(key, value){
	PwStorage.save(key, value);
}
function loadData(key){
	var msg = PwStorage.load(key);
	if (msg === false) {
		alert(I18N['loaddata_error']);
		return false;
	}
	if (!msg) {
		alert(I18N['loaddata_msg_none']);
		return false;
	} else if (typeof WYSIWYD == 'undefined' && document.FORM.atc_content.value != '' || typeof WYSIWYD == 'function' && editor.getHTML() != '') {
		showDialog({type:'confirm',message:I18N['loaddata_confirm'],okText:'确认',onOk:function(){
			setEditorContent(msg);
		}})
	}
}
/*
 * 设置编辑器的内容
 *
 */
function setEditorContent(msg) {
	msg=msg||"";
	if (editor && editor.currentMode == 'default') {
		editor.textarea.value = msg;
		editor.setHTML(editor.getHtmlFromUBB());
	} else {
		document.FORM.atc_content.value = msg;
	}
}
function savedraft() {
	var msg;
	if ( editor && editor.getUBB ){
		msg = editor.getUBB();
	} else {
		msg = document.FORM.atc_content.value;
	}
	ajax.send('pw_ajax.php','action=draft&step=2&atc_content='+ajax.convert(msg), ajax.guide);
}
function opendraft(id) {
	if (typeof draft == 'object') {
		sendmsg('pw_ajax.php','action=draft',id);
	} else {
		loadjs('js/pw_draft.js', '', '', function() {
			opendraft(id);
		});
	}
	event && (event.returnValue = false);
	return false;
}

//贴子附件hover处理
function postAttImgHover(menuid,tdid){
	var menu = getObj(menuid);
	var td = getObj(menuid);
	menu.style.display = '';
	td.parentNode.onmouseout = menu.onmmouseout = function(e) {
		menu.style.display = 'none';
	};
	menu.onmouseover = function() {this.style.display = '';}
}