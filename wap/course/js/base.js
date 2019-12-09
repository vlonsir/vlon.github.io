var vlon = {};
/**一个模态框，便于全系使用
 * 参数列表：
 * title: 标题,默认为空
 * content: 提示语主体,默认为空
 * align: 内容对齐方式,默认居中对齐
 * showCancel: 是否显示取消按钮,默认是false
 * cancelText: 取消按钮文字,默认是取消
 * cancelBgColor: 取消按钮背景色,默认是#ccc
 * cancelColor: 取消按钮字体颜色,默认是#eee
 * showConfirm: 是否显示确定按钮,默认是false
 * confirmText: 确定按钮文字,默认是确定
 * confirmBgColor: 确定按钮背景色,默认是#f90
 * confirmColor: 确定按钮字体颜色,默认是#fff
 * speed: 倒计时，以毫秒为单位，默认是1500
 * showCutDown: 是否显示倒计时，默认是false
 * cancelCallback: 点击取消按钮执行的方法
 * confirmCallback: 点击确定按钮执行的方法
 * bgOpacity: 1 弹窗背景透明度
 * type: loading  弹窗类型;  loading  alert  confrim  modal  pop
 * */
 /**一个公共loading方法 
 * 给showModal中content设置一个<img>loading，再给speed设置一个时间
 * 例如：content:'<img src="./images/loading.gif" alt="loading" />正在加载，请稍后',
 * 再给时间设置成需要的即可，如：speed:100000
 * vlon.showModal({
    content:'<span class="loading"></span>&nbsp;请稍等，正在加载...',
    speed:10000000
  });
 * */
vlon.showModal = function(a) {
  let bgOpacity = '';
  if(a.bgOpacity) {
    bgOpacity = ' style="background-color:rgba(255,255,255,'+a.bgOpacity+');"';
  }
  var modalType = '';
  if(a.type) {
    modalType = a.type;
  }
  //'+modalType+'
  var b = '<div class="vlon-modal-panel"'+bgOpacity+'><div class="vlon-modal ">';
  if(a.title) {
    b += '<div class="vlon-modal-title"><span>' + a.title + '</span><a href="javascript:;" class="vlon-modal-close" title="关闭">×</a></div>';
  }
  if(a.content) {
    var align = "";
    if(a.align) { align = 'style="text-align: '+a.align+';"' }
    var type = "";
    if(a.type) {
      if(a.type == "loading"){
        type = '<span class="loading"></span>';
      } else if(a.type == "success") {
        type = '<span class="success iconfont">&#xe703;</span>';
      }
    }
    b += '<div class="vlon-modal-content" ' + align + '>' + type + a.content + '</div>';
  }
  b += '<div class="vlon-modal-footer">';
  if(a.showCancel) {
    b += '<button class="vlon-modal-cancel" style="';
    if(a.cancelBgColor) {
      b += 'background-color:' + a.cancelBgColor + ';';
    }
    if(a.cancelColor) {
      b += 'color:' + a.cancelColor + ';';
    }
    b += '">' + (a.cancelText || '取消') + '</button>';
  }
  if(a.showConfirm) {
    b += '<button class="vlon-modal-confirm" style="';
    if(a.confirmBgColor) {
      b += 'background-color:' + a.confirmBgColor + ';';
    }
    if(a.confirmColor) {
      b += 'color:' + a.confirmColor + ';';
    }
    b += '">' + (a.confirmText || '确定') + '</button>';
  }
  b += '</div></div></div>';
  if($(".vlon-modal-panel").length == 0) {
    $("body").eq(0).prepend(b);
  }

  $(".vlon-modal-panel").fadeIn(300).css("display", "flex");
  $(".vlon-modal-panel .vlon-modal").addClass(a.type);
  if(!a.showCancel && !a.showConfirm) {
    //$(".vlon-modal").css({"width":"200px","margin-left":"-100px"});
    speed = 1500;
    if(a.speed) {
      speed = Number(a.speed);
    }
    if(a.showCutDown) {
      setInterval(function() {
        if(speed <= 0){
          vlon.hideModal();
        } else {
          $(".vlon-modal-footer").html('( ' + speed/1000 + ' ) 秒后关闭');
          speed -= 1000;
        }
      }, 1000);
    }else{
      $(".vlon-modal-footer").remove();
      setTimeout(function() {
        vlon.hideModal();
      }, speed);
    }
  }
  $(".vlon-modal-cancel").on("click", function(e) {
    if(a.cancelCallback) {
      a.cancelCallback(e);
    }
    vlon.hideModal();
  });
  $(".vlon-modal-confirm").on("click", function(e) {
    if(a.confirmCallback) {
      a.confirmCallback(e);
    }
    vlon.hideModal();
  });
  $(".vlon-modal-close").on("click", function(e) {
    vlon.hideModal();
  });
};
//关闭模态框
vlon.hideModal = function() {
  $(".vlon-modal-panel .vlon-modal").css({"transform":"scale(1.5)","transition":"all 0.3s"});
  setTimeout(function() {
    $(".vlon-modal-panel .vlon-modal").css({"transform":"scale(0)", "opacity":"0"});
  }, 100);
  //$(".vlon-modal-panel").delay(300).fadeOut(300);
  setTimeout(function() {
    $(".vlon-modal-panel").remove();
  }, 300);
};
vlon.now = Date.now();
vlon.SHA1 = function (msg) {

  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  function lsb_hex(val) {
    var str = "";
    var i;
    var vh;
    var vl;

    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };

  function cvt_hex(val) {
    var str = "";
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };


  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;

  msg = Utf8Encode(msg);

  var msg_len = msg.length;

  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
    msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
      break;

    case 2:
      i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
      break;

    case 3:
      i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
      break;
  }

  word_array.push(i);

  while ((word_array.length % 16) != 14) word_array.push(0);

  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);


  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;

  }

  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();

};
vlon.appId = "A6026804202434";
vlon.appKey = vlon.SHA1("A6026804202434"+"UZ"+"2D511068-9CD3-1A6E-3915-967441FDDCD7"+"UZ"+vlon.now)+"."+vlon.now
vlon.headers = {
	"X-APICloud-AppId": vlon.appId,
	"X-APICloud-AppKey": vlon.appKey
};
vlon.getValueByURI = function (key){
  var url=window.location.search;
  if(url.indexOf(key)!=-1){
    if(url.indexOf("?")!=-1){
      var rep=url.replace("?","");
      if(rep.indexOf("&")==-1){//只有1个参数 
        if(rep.indexOf("=")==11){
          return encodeURIComponent(rep.substring(12));
        }else{
          var arr=rep.split("=");
          if(arr[0]==key){
            return arr[1];
          }
        }
      }else if(rep.indexOf("&")>0){//有多个参数
        var arr=rep.split("&");
        for(var i=0;i<arr.length;i++){
          var spl=arr[i].split("=");
          if(spl[0]==key){
            return spl[1];
          }
        }
      }
    }else if(url.indexOf("?")==-1){
      return "";
    }
  }else if(url.indexOf(key)==-1){
    return "";
  }
};
document.onmousedown = function(){
  if(event.button == 2){
    //alert("当前页面不能使用右键！");
    return false;
  }
};
document.oncontextmenu = function () {
  //alert('禁止右键菜单!'); 
  return false;
};