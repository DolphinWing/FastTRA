
var storage = chrome.storage.local;

var submitButton = document.querySelector('button#btn_save');
submitButton.addEventListener('click', save_options);

// Saves options to localStorage.
function save_options() {
	show_status("儲存中...");
	var str = document.getElementById("station_home").value;
	if(str.trim() == "") {//[1.3.3]++ check no enter
		show_status("請輸入出發站");
		return false;
	} else {
	var stat = parseInt(str);
	if(stat <= 0 || stat >=1000) {
		show_status("出發站格式不正確");
		return false;
	}
	}
	str = document.getElementById("station_away").value;
	if(str.trim() == "") {//[1.3.3]++ check no enter
		show_status("請輸入到達站");
		return false;
	} else {
	stat = parseInt(str);
	if(stat <= 0 || stat >=1000) {
		show_status("到達站格式不正確");
		return false;
	}
	}
	var uid = document.getElementById("user_id").value;
	var regex = new RegExp("[\\D]{1}[\\d]{9}", "g");
	var m = uid.match(regex);
	if(m == null || m=="") {
		show_status("身分證字號格式不正確");
		return false;
	}
	stat = parseInt(document.getElementById("order_qty_str").value);
	if(stat <= 0 || stat > 6) {
		show_status("訂票數量不正確");
		return false;
	}
	
	var data = {};
	data.user_id           = document.getElementById("user_id").value;
	data.station_home      = document.getElementById("station_home").value;
	data.station_away      = document.getElementById("station_away").value;
	data.getin_start_dtime = document.getElementById("getin_start_dtime").value;
	data.getin_end_dtime   = document.getElementById("getin_end_dtime").value;
	data.order_qty_str     = document.getElementById("order_qty_str").value;
	data.go_train_no       = document.getElementById("go_train_no").value;
	data.back_train_no     = document.getElementById("back_train_no").value;
	
	storage.set({'data': data}, function() {
		// Notify that we saved.
		show_status('已儲存');
	});
/*	
	localStorage["user_id"] = document.getElementById("user_id").value;
	localStorage["station_home"] = document.getElementById("station_home").value;
	localStorage["station_away"] = document.getElementById("station_away").value;
	//alert(localStorage["station_away"]);
	localStorage["start_time"] = document.getElementById("getin_start_dtime").value;
	//alert(localStorage["start_time"]);
	localStorage["end_time"] = document.getElementById("getin_end_dtime").value;
	//alert(localStorage["end_time"]);
	localStorage["person_num"] = document.getElementById("order_qty_str").value;
	//alert(localStorage["person_num"]);
	localStorage["go_train_no"] = document.getElementById("go_train_no").value;
	localStorage["back_train_no"] = document.getElementById("back_train_no").value;

	show_status("Options Saved.");
*/
}

//var status_timer = 0;
function show_status(msg){
	//if(status_timer>0)window.clearTimeout(status_timer);
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerText = msg;
	setTimeout(function() {
		status.innerText = "";
	}, 2000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	show_status("載入中...");
	//var storage = chrome.storage.local;
	storage.get('data', function(items) {
		// To avoid checking items.css we could specify storage.get({css: ''}) to
		// return a default value of '' if there is no css value yet.
		if (items.data) {
			document.getElementById("user_id").value           = items.data.user_id;
			document.getElementById("station_home").value      = items.data.station_home;
			document.getElementById("station_away").value      = items.data.station_away;
			document.getElementById("getin_start_dtime").value = items.data.getin_start_dtime;
			document.getElementById("getin_end_dtime").value   = items.data.getin_end_dtime;
			document.getElementById("order_qty_str").value     = items.data.order_qty_str;
			document.getElementById("go_train_no").value       = items.data.go_train_no;
			document.getElementById("back_train_no").value     = items.data.back_train_no;
			show_status('載入完成');
		}
	});
/*
	if(!localStorage["person_num"]) {
		localStorage["person_num"] = "1";
	}
	if(!localStorage["start_time"]) {
		localStorage["start_time"] = "12:00";

	}
	if(!localStorage["end_time"]) {
		localStorage["end_time"] = "23:59";
	}
	document.getElementById("order_qty_str").value = localStorage["person_num"];
	document.getElementById("getin_start_dtime").value = localStorage["start_time"];
	document.getElementById("getin_end_dtime").value = localStorage["end_time"];
	
	var user_id = localStorage["user_id"];
	if (!user_id) {
		return;
	}

	document.getElementById("user_id").value = user_id;
	document.getElementById("station_home").value = localStorage["station_home"];
	document.getElementById("station_away").value = localStorage["station_away"];
	//document.getElementById("order_qty_str").value = localStorage["person_num"];
	//document.getElementById("getin_start_dtime").value = localStorage["start_time"];
	//document.getElementById("getin_end_dtime").value = localStorage["end_time"];
	if(localStorage["go_train_no"])//[1.2.0.3]dolphin++
		document.getElementById("go_train_no").value = localStorage["go_train_no"];
	if(localStorage["back_train_no"])//[1.2.0.3]dolphin++
		document.getElementById("back_train_no").value = localStorage["back_train_no"];
*/
}
/*
var focusedInput=null;
function set_focused(id){focusedInput=document.getElementById(id);}
function set_station(s){if(focusedInput!=null)focusedInput.value=s;}*/

restore_options();

