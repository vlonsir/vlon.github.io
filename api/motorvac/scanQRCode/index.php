<?php

	function curlHttp($url) {
        $curl = curl_init(); //初始化一个CURL对象 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true ); // 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
        curl_setopt($curl, CURLOPT_TIMEOUT, 500 );
        curl_setopt($curl, CURLOPT_URL, $url );
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,false);
        $res = curl_exec($curl); //运行curl,请求网页。
        curl_close($curl); // 关闭URL请求
        return $res;
    }

    // 创建随机字符串
    function createNoncestr() {
        $length = 16;
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for($i = 0; $i < $length; $i ++) {
            $str .= substr ( $chars, mt_rand ( 0, strlen ( $chars ) - 1 ), 1 );
        }
        return $str;
    }

    //生成、获取签名
    function getSignPackage() { 
    	$appId = "wxf401d1de153c94ad";
    	$secret = "e952b661a4f3c58adf2d793e1bd1b27a";
    	$token = "";
    	$ticket = "";

    	if (isset($_COOKIE["token"])){
        	$token = $_COOKIE["token"];
	    }else{
	    	$tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appId&secret=$secret";
	    	$returnTokenData = json_decode(curlHttp($tokenUrl));
	    	$token = $returnTokenData->access_token;
	    	setcookie("token", $token, time()+7200);
    	}

    	if (isset($_COOKIE["ticket"])){
        	$ticket = $_COOKIE["ticket"];
	    }else{
	    	$ticketUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=$token&type=jsapi";
	    	$returnTicketData = json_decode(curlHttp($ticketUrl));
	    	$ticket = $returnTicketData->ticket;
	    	setcookie("ticket", $ticket, time()+7200);
    	}

    	$jssdkUrl = 'https://vlon.cn/api/motorvac/scanQRCode/index.html';
    	$timestamp = time();
    	$noncestr = createNoncestr();

    	$string = "jsapi_ticket=$ticket&noncestr=$noncestr&timestamp=$timestamp&url=$jssdkUrl";

    	$signature = sha1($string);

    	$signPackage = array (
            "appId" => $appId,
            "noncestr" => $noncestr,
            "timestamp" => $timestamp,
            "signature" => $signature
        );

        echo json_encode($signPackage);
    }	

    getSignPackage();

?>