// ==UserScript==
// @name            Fast TRA script, v1.0
// @namespace       http://dolphinwing.pixnet.net/blog
// @description     2009/06/11
// @include         http://railway.hinet.net/ct*
// @include         http://railway.hinet.net/cf*
// @include         http://railway.hinet.net/cc*
// @include         http://railway.hinet.net/coq*
// modified log:    
// 	v1.0: 2009-06-11, first release
//  v1.3.1: 2013-01-21, try to upload to Chrome Web Store
// author: dolphin

//console.log("fast_tra_script.user.js");

var PERSON_ID="";//Personal ID
var FROM_STATION="175";//starting station code
var TO_STATION="175";//destination station code
var PERSON_COUNT="1";//[1.2.0.0]dolphin++ person count
var START_TIME="12:00";//[1.2.0.0]dolphin++ booking start time
var END_TIME="23:59";//[1.2.0.0]dolphin++ booking end time
var GO_TRAIN_NO="";
var BACK_TRAIN_NO="";

var storage = chrome.storage.local;
storage.get('data', function(items) {
		// To avoid checking items.css we could specify storage.get({css: ''}) to
		// return a default value of '' if there is no css value yet.
		if (items.data) {
			PERSON_ID     = items.data.user_id;
			FROM_STATION  = items.data.station_home;
			TO_STATION    = items.data.station_away;
			START_TIME    = items.data.getin_start_dtime;
			END_TIME      = items.data.getin_end_dtime;
			PERSON_COUNT  = items.data.order_qty_str;
			GO_TRAIN_NO   = items.data.go_train_no;
			BACK_TRAIN_NO = items.data.back_train_no;
			//show_status('Options loaded.');
			console.log("Options loaded.");
			//[1.3.2]-- do_action();
		} else {
			console.log("default values loaded.");
		}
		do_action();
	});

var pageState = location.href.split('/')[3];//alert(pageState);
var bRegisterButtons=true;//[1.1.0.6]@2011-06-13
if(pageState=="check_csearch.jsp"){bRegisterButtons=false;}
if(pageState=="check_ctno1.jsp"){bRegisterButtons=false;}
if(!bRegisterButtons) {
	var embed = document.getElementById("nsRnSound");
	if(embed)// {
	try {
		//alert(pageState+"\n"+embed.outerHTML);
		//embed.outerHTML = "";//chrome can not process PronounceRandonNumber.do file
		embed.parentNode.removeChild(embed);
		embed = document.getElementById("ieRnSound");
		//alert(pageState+"\n"+embed.outerHTML);
		//embed.outerHTML = "";//chrome can not process PronounceRandonNumber.do file
		embed.parentNode.removeChild(embed);
	}
	catch(e) { }
	
	var button=document.getElementsByTagName("button");
	for(i=0;i<button.length;i++){
		if(button[i].type=="button"){
			button[i].parentNode.removeChild(button[i]);//break;
		}
		if(button[i].type=="submit"){//enlarge the submit button
			button[i].style.width="200px";
			button[i].style.height="50px";
			button[i].style.fontSize="30px";
			button[i].style.cursor="pointer";
			button[i].style.background="#9f9";
		}
	}
}
//alert(bRegisterButtons);

var bt_style="width:100px;font-size:16px;margin: 0 10px 0 10px;font-family:Arial;";
var pd_style="padding:10px;background:#ffc;border:solid 3px #fcc;width:250px;text-align:center;";
var pd_style_p1="position:absolute;top:100px;left:500px;";
var pd_style_p2="margin-top:0px;margin-left:50px;";
var pd_style_p3="margin-left:50px;";

var person_id=null,from_station=null,to_station=null;
var dtime_end=null,dtime_end2=null,train_type=null,train_type2=null;
var dtime_start=null,dtime_start2=null;//[1.1.0.7]@2011-06-13
var person_count=null,person_count2=null;//[1.2.0.0]dolphin++ //[1.2.0.3]dolphin++
var go_train_no=null,back_train_no=null;//[1.2.0.3]dolphin++

function get_id() {
	console.log("get_id");
	var i=0;
	var inputText=document.getElementsByTagName("input");
	for(i=0;i<inputText.length;i++){
		if(inputText[i].name=="person_id"||inputText[i].name=="personId"){
			person_id=inputText[i];//[1.2.0.3]dolphin-- break;
		}
		if(inputText[i].name=="train_no")go_train_no=inputText[i];
		if(inputText[i].name=="train_no2")back_train_no=inputText[i];
	}
	var selectOpt=document.getElementsByTagName("select");
	for(i=0;i<selectOpt.length;i++){
		if(selectOpt[i].name=="from_station")from_station=selectOpt[i];
		if(selectOpt[i].name=="to_station")to_station=selectOpt[i];
		if(selectOpt[i].name=="getin_end_dtime2")dtime_end2=selectOpt[i];
		if(selectOpt[i].name=="getin_end_dtime")dtime_end=selectOpt[i];
		if(selectOpt[i].name=="train_type2")train_type2=selectOpt[i];
		if(selectOpt[i].name=="train_type")train_type=selectOpt[i];
		if(selectOpt[i].name=="getin_start_dtime2")dtime_start2=selectOpt[i];//[1.1.0.7]@2011-06-13 
		if(selectOpt[i].name=="getin_start_dtime")dtime_start=selectOpt[i];//[1.1.0.7]@2011-06-13
		if(selectOpt[i].name=="order_qty_str2")person_count2=selectOpt[i];//[1.2.0.0]dolphin++
		if(selectOpt[i].name=="order_qty_str")person_count=selectOpt[i];//[1.2.0.0]dolphin++
	}
}

function put_values(){
	if(person_count!=null)person_count.value=PERSON_COUNT;//[1.2.0.0]dolphin++
	if(person_count2!=null)person_count2.value=PERSON_COUNT;//[1.2.0.3]dolphin++
	if(dtime_end!=null)dtime_end.value=END_TIME;//"23:59";
	if(dtime_end2!=null)dtime_end2.value=END_TIME;//"23:59";
	if(train_type!=null)train_type.value="*1";
	if(train_type2!=null)train_type2.value="*1";
	if(dtime_start!=null)dtime_start.value=START_TIME;//"12:00";//[1.1.0.7]@2011-06-13
	if(dtime_start2!=null)dtime_start2.value=START_TIME;//"12:00";//[1.1.0.7]@2011-06-13
	
	if(go_train_no!=null)//[1.2.0.3]dolphin++
	//	chrome.extension.sendRequest({method: "go_train_no"}, function(response) { 
			go_train_no.value=GO_TRAIN_NO;//response.data;
	//	});
	if(back_train_no!=null)//[1.2.0.3]dolphin++
	//	chrome.extension.sendRequest({method: "back_train_no"}, function(response) { 
			back_train_no.value=BACK_TRAIN_NO;//response.data;
	//	});
}

function do_action() {
	if(person_id==null) {
		get_id();
		if(person_id==null || person_id=="undefined")
			return false;
	}
	var mydiv = document.createElement('div');
	mydiv.style.cssText=pd_style+pd_style_p1;
	if(pageState=="csearch.htm")mydiv.style.cssText=pd_style+pd_style_p2;
	else if(pageState=="ccancel.htm")mydiv.style.cssText=pd_style+pd_style_p3;
	//if(pageState!="check_csearch.jsp") {//[1.1.0.0]jimmy++ add check
	if(pageState.substring(0,5) == "check") {//[1.1.0.3]jimmy++ fix check condition
		return false;//not to proceed
	}
	else {
		document.body.appendChild(mydiv);
	}
	var mytitle = document.createElement('div');//[1.3.2]dolphin++ add title to helper panel
	mytitle.innerText="台鐵訂票小幫手 by dolphin";
	mydiv.appendChild(mytitle);
	
	var mybt = document.createElement('input');
	mybt.type="button";
	mybt.style.cssText=bt_style;
	mybt.value="快速去程";//"Fast Home";
	mybt.addEventListener('click', function(){
			person_id.value=PERSON_ID;
			if(from_station!=null)//from_station.value=TO_STATION;
			//	chrome.extension.sendRequest({method: "station_home"}, function(response) { 
			//		FROM_STATION = response.data;
					from_station.value=FROM_STATION;
			//	});
			if(to_station!=null)//to_station.value=FROM_STATION;
			//	chrome.extension.sendRequest({method: "station_away"}, function(response) { 
			//		TO_STATION = response.data;
					to_station.value=TO_STATION;
			//	});
			put_values();
		}, false);
	mydiv.appendChild(mybt);
	
	mybt = document.createElement('input');
	mybt.type="button";
	mybt.style.cssText=bt_style;
	mybt.value="快速回程";//"Fast Back";
	mybt.addEventListener('click', function(){
			person_id.value=PERSON_ID;
			if(to_station!=null)//to_station.value=FROM_STATION;
			//	chrome.extension.sendRequest({method: "station_home"}, function(response) { 
			//		FROM_STATION = response.data;
					to_station.value=FROM_STATION;
			//	});
			if(from_station!=null)//from_station.value=TO_STATION;
			//	chrome.extension.sendRequest({method: "station_away"}, function(response) { 
			//		TO_STATION = response.data;
					from_station.value=TO_STATION;
			//	});
			put_values();
		}, false);
	mydiv.appendChild(mybt);
}

/*
//options, contentscript.js, background.html, asynchronous, localStorage, and race condition
//https://groups.google.com/a/chromium.org/group/chromium-extensions/browse_thread/thread/d738257374b50dbc
chrome.extension.sendRequest({method: "user_id"}, function(response) { 
	//alert('ALERT: ' + response.data); 
	if(response.data) PERSON_ID = response.data;
	if(PERSON_ID) 
		chrome.extension.sendRequest({method: "start_time"}, function(response) { 
			START_TIME = response.data;
			
			chrome.extension.sendRequest({method: "end_time"}, function(response) { 
				END_TIME = response.data;
				
				chrome.extension.sendRequest({method: "person_num"}, function(response) { 
					PERSON_COUNT = response.data;
					
					do_action();
				}); 
			}); 
		}); 
}); 
*/

//if(pageState=="check_csearch.jsp" || pagetState=="check_ctno1.jsp") {
//	
// /*
//	var tmp = document.body.innerHTML;
////	alert(navigator.appName);
//	//alert(pageState+"\n"+tmp.substring(750, 1250));
//	var tmp1 = document.createElement('div');
//	tmp1.innerText = tmp;
//	document.body.appendChild(tmp1);
// */
//	
////	chrome.windows.onFocusChanged.addListener(function(windowId) {
////		alert("!");
////	});
//}
//else {
//alert(bRegisterButtons);
/*
if(bRegisterButtons) {//[1.1.0.6]@2011-06-13
	//[1.1.0.6]-- 
	//if(pageState.length>10) {
	//	var tmp = pageState.substring(0,10);//alert(tmp);
	//	if(tmp == "check_ctno") {//[1.1.0.2]jimmy++
	//		//alert("!!");
	//	}
	//	else {
	//		window.addEventListener('load', function() { get_id(); }, false);
	//	}
	//}
	//else {
		window.addEventListener('load', function() { 
			console.log("onload");
			get_id(); 
		}, false);
	//}
}*/
//get_id();