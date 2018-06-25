
$(function () {
    //设置返回顶部的函数
    $(window).scroll(function () {
    if ($(window).scrollTop() > 200) {
        $("#top").fadeIn(1000);
    }
    else {
        $("#top").fadeOut(1000);

    }
});
//设置导航栏的动画效果
(function () {
    var $thisnav = $(".current-menu-item").offset().left;
    $(".menu_item").hover(function () {
        var $left = $(this).offset().left - $thisnav;
        var $width = $(this).outerWidth();
        $(".wee").css({
            'left': $left,
            'width': $width
        })
    }, function () {
        var $initwidth = $('.current-menu-item').width();
        $('.wee').css({'left': '0', 'width': $initwidth});
    });
})();

//轮播图初始化
$('#pbSlider').pbTouchSlider({
    slider_Wrap: '#pbSliderWrap',
    slider_Threshold: 10,
    slider_Speed: 600,
    slider_Ease: 'ease-out',
    slider_Drag: true,
    slider_Arrows: {
        enabled: true
    },
    slider_Dots: {
        class: '.o-slider-pagination',
        enabled: true
    },
    slider_Breakpoints: {
        default: {
            height: 300
        },
        tablet: {
            height: 300,
            media: 1024
        },
        smartphone: {
            height: 300,
            media: 768
        }
    }
});
//设置定时器函数
var time;
function set_interval() {
    time = setInterval(function () {
        var $next = $("#pbSliderWrap").find("li.o-slider-next");
        if ($next.hasClass("isDisabled") == true) {
            $("#pbSliderWrap").find(".o-slider-pagination li:first").click();
        }
        else
            $next.click();
    }, 3000);
};
//实现轮播
set_interval();
//当用户鼠标在图片上时停止轮播
$("#pbSliderWrap").hover(function () {
    window.clearInterval(time);
}, function () {
    set_interval();
});

//点击轮播图
    $("#pbSliderWrap >div:first >div").click(function () {
        window.location.href="/AboutUs.html";

    })
    //鼠标在导航条上时触发
    $("nav div:first > ul:first >li:lt(6)").hover(function () {
        $(this).find("ul").toggle();
    }, function () {
        $(this).find("ul").toggle();
    });
    //初始化主页上的按钮函数
    function initIndexButton() {
     //点击公司介绍上的图片
        $("#Company_introduction > div:last-child >div:first-child img").click(function () {
        var href=$("#about_1 >a").attr("href");
        window.location.href=href;
        });
        //点击公司介绍上的和更多
        $("#Company_introduction > div:first-child a").click(function () {
            var href=$("#about_1 >a").attr("href");
            window.location.href=href;
        })

        //点击公司动态上的更多
        $("#index_CompanyDynamics >div:first >a").click(function () {
            var href=$("#Enterpriseconsulting1 >a").attr("href");
            window.location.href=href;
        })
        $("#index_CommonProblem >div:first >a").click(function () {
            var href=$("#Enterpriseconsulting2 >a").attr("href");
            window.location.href=href;
        })
        //点击产品中心的种类
     $("#Product_classification >ul:first >li").click(function () {
         var result=$(this).text().trim();
        var array=["蛙苗","成蛙","种蛙"];
        var index=array.indexOf(result);
        if(index!=-1){
           var href=$("#ProductCenter >ul >li:eq("+index+") a").attr("href");
            window.location.href=href;
        }
     })
        //点击产品中心的更多
        $("#Product_classification >div:first a").click(function () {
           var href=$("#ProductCenter >a:first").attr("href");
            window.location.href=href;
        });
        //点击产品图片的更多
        $("#Product_classification_img >div:first a").click(function () {
            var href= $("#ProductCenter >a:first").attr("href");
            window.location.href=href;
        });


    }


    var  ProductImgs_index={};

    //添加图片到主页的产品中心
    function addIndexProduct_classification_img() {
        for(var i in ProductImgs_index){
            if(i==2){
                for(var j in ProductImgs_index[i])
                {
                    if(j<=2)
                        $("#Product_classification_img >ul").append($("<li><img src="+ProductImgs_index[i][j]+" alt=\"蛙苗\"><a>蛙苗</a></li>"));
                }

            }else if(i==3){
                for(var j in ProductImgs_index[i])
                {     if(j<=1)
                    $("#Product_classification_img >ul").append($("<li><img src="+ProductImgs_index[i][j]+" alt=\"成蛙\"><a>成蛙</a></li>"));
                }

            }else{
                for(var j in ProductImgs_index[i])
                {     if(j<=1)
                    $("#Product_classification_img >ul").append($("<li><img src="+ProductImgs_index[i][j]+" alt=\"种蛙\"><a>种蛙</a></li>"));
                }
            }
        }

        //点击图片或下标
        var Imgtype=['蛙苗','成蛙','种蛙'];

        $("#Product_classification_img >ul >li img:first-child").click(function () {
            var type=$(this).next().text().trim();
            if(Imgtype.indexOf(type)!=-1){
                window.scrollTo(0, 0);
                var type1=Imgtype.indexOf(type);
             window.location.href="ProductContent.html?type="+type1;
            }

        });
        $("#Product_classification_img >ul >li img:first-child+a").click(function () {
            var type=$(this).text().trim();
            if(Imgtype.indexOf(type)!=-1){
                window.scrollTo(0, 0);
                var type1=Imgtype.indexOf(type);
                window.location.href="ProductContent.html?type="+type1;
            }
        });
    }

   // 获取产品图片
    function getIndexOneKindproductImgs(type){
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:type},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    ProductImgs_index[type]=data.data;
                    if(type==2){
                        getIndexOneKindproductImgs(3);
                    }
                    else if(type==3){
                        getIndexOneKindproductImgs(4);
                    }else if(type==4){//已经获取完了
                      addIndexProduct_classification_img();
                    }
                }
                else if (data.code == "1") {
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                }
                else {
                    //空的数据
                    if(type==2){
                        getIndexOneKindproductImgs(3);
                    }
                    else if(type==3){
                        getIndexOneKindproductImgs(4);
                    }else if(type==4) {//已经获取完了
                        addIndexProduct_classification_img();
                    }
                }
            }, error: function (XMLHttpRequest) {
                    layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })
    }

    //初始化主页内容
function initIndex(){

    $("#Company_introduction > div:last-child >div:last-child >div").empty();

    //显示公司介绍的内容
    var $content1 =$("<div></div>");
    $.ajax({
        url:"get_about_first1",
        type:"post",
        dataType:"json",
        success:function(data){
            if (data.code == "0") {
                $content1.append(data.data.trim());
                $("#Company_introduction >div:nth-child(2) >div:nth-child(2)  span").css("font-size","14px");
                $("#Company_introduction >div:nth-child(2) >div:nth-child(2) >div").css("text-indent","-2em");
            }
            else if (data.code == "2") {
                    layer.msg("获取公司介绍内容失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            }
            else {
                //空的数据
            }
        }, error: function (XMLHttpRequest) {
                layer.msg("获取公司介绍内容失败", {time: 1000, icon: 2}, function () {

                });
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }
    })

    $("#Company_introduction > div:last-child >div:last-child >div").append($content1);
    //显示公司介绍的标题
    $.ajax({
        url:"getContact1",
        type:"post",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data==null){

                }else{
                    var content=data.data;
                    // alert(JSON.stringify(content));
                    // return;
                    var businessBoss=content.businessBoss.trim();
                    var bussinessName=content.bussinessName.trim();
                    var telPhone=content.telPhone.trim();
                    var spareTelPhone=content.spareTelPhone;
                    var address=content.provine.trim()+content.city.trim()+content.area.trim()+content.detailedAddress.trim();
                    var phone;
                    if(spareTelPhone==null)
                        phone=telPhone;
                    else{
                        phone=telPhone+"、"+spareTelPhone;
                    }
                    $("#Company_introduction > div:last-child >div:last-child >h3").empty();
                    $("#Company_introduction > div:last-child >div:last-child >h3").text(bussinessName);
                }

            }
        },error:function (XMLHttpRequest) {
                layer.msg("获取企业名字失败", {time: 1000, icon: 2}, function () {

                });
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }
    })
    //显示公司动态
    $("#index_CompanyDynamics >ul").empty();
        $.ajax({
            url: "get_all_CompanyDynamics_title1",
            type: "post",
            dataType: "json",
            success: function (da) {
                if(da.code=="0")
                { var data=da.data;
                    for (var i in data) {
                        if(i>3)
                            break;
                        var $li = $("<li title=\"公司动态\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                        $("#index_CompanyDynamics >ul").append($li);
                    }
                    //点击公司动态上的标题
                    $("#index_CompanyDynamics >ul >li").click(function () {
                        window.scrollTo(0, 0);
                        var type=$(this).attr("title").trim();
                        var title = $(this).find("span:first").text().trim();
                        var id = $(this).find("span:last").text().trim();
                      window.location.href="EnterpriseInformationContent.html?type=0&title="+title+"&id="+id;
                    });
                }

            },
            error: function (XMLHttpRequest) {
                    layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });
        //常见问题
    $("#index_CommonProblem >ul").empty();
        $.ajax({
            url: "get_all_CommonProblem_title1",
            type: "post",
            dataType: "json",
            success: function (da) {
                if(da.code=="0") {
                    var data = da.data;
                    for (var i in data) {
                        if(i>3)
                            break;
                        var $li = $("<li title='常见问题'><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                       $("#index_CommonProblem >ul").append($li);
                    }
//点击公司动态上的标题
                    $("#index_CommonProblem >ul >li").click(function () {
                        window.scrollTo(0, 0);
                        var type=$(this).attr("title").trim();
                        var title = $(this).find("span:first").text().trim();
                        var id = $(this).find("span:last").text().trim();
                        window.location.href="EnterpriseInformationContent.html?type=1&title="+title+"&id="+id;

                    });
                }
            },
            error: function (XMLHttpRequest) {
                    layer.msg("常见问题获取失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });
        //添加产品图片
    ProductImgs_index={};
    $("#Product_classification_img >ul").empty();
    getIndexOneKindproductImgs(2);
//页面底部显示联系
    $("#footer >div:first >p:first >span").text("");
    $("#footer >div:first >p:nth-child(2) >span").text("");
    $("#footer >div:first >p:nth-child(3) >span:first").text("");
    $("#footer >div:first >p:nth-child(3) >span:nth-child(2)").text("");
    $.ajax({
        url:"getContact1",
        type:"post",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data==null){
                }else{

                    var content=data.data;
                    var businessBoss=content.businessBoss.trim();
                    var bussinessName=content.bussinessName.trim();
                    var telPhone=content.telPhone.trim();
                    var spareTelPhone=content.spareTelPhone;
                    var address=content.provine.trim()+content.city.trim()+content.area.trim()+content.detailedAddress.trim();
                    var phone;
                    if(spareTelPhone==null)
                        phone=telPhone;
                    else{
                        phone=telPhone+"、"+spareTelPhone;
                    }
                    $("#footer >div:first >p:first >span").text(bussinessName);
                    $("#footer >div:first >p:nth-child(2) >span").text(address);
                    $("#footer >div:first >p:nth-child(3) >span:first").text(phone);
                    $("#footer >div:first >p:nth-child(3) >span:last").text(businessBoss);
                }

            }
        },error:function (XMLHttpRequest) {
                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                });
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }
    })

    //获取上传的视频
       $("#index_video >ul:first").empty();
        $.ajax({
            url:"get_upload_video1",
            type:"post",
            dataType:"json",
            success:function (data) {
                if(data.code==0){
                    var result=data.data;
                    for(var i in result){
                        var $li=$("<li><video src="+result[i]+" preload=\"none\"  controls=\"controls\"></video></li>");
                      if(i<5)
                      $("#index_video >ul:first").append($li);
                      else{
                          break;
                      }
                    }

                }else if(data.code==1){
                    //空的数据
                }
            },error:function (XMLHttpRequest) {
                    layer.msg("获取视频失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:"+XMLHttpRequest.status+",错误内容:"+XMLHttpRequest.statusText);
            }
        })
initIndexButton();
}
initIndex();

//点击在线咨询显示客服对话框
    $("#customer_service_small").click(function () {
        number = 0;
        $(this).find("span").text("");
        if ($("#customer_service").css("display") == "none") {
            $(this).find("span").empty();
            $("#customer_service").fadeIn();
        }
        else {
            $("#customer_service").fadeOut();
        }
    });
    $("#customer_sevice_head span img").click(function () {
        $("#customer_service").fadeOut();
    });

    function getCurrentTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var show_date = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
        return show_date;
    };

//发送消息的对象

    function set_message(id, date, type, content) {
        var customer = {
            "receive_id": "",
            "id": id,
            "date": date,
            "type": type,
            "content": content
        }
        return customer;
    };

//添加客服发送的消息
    function add_message(date, content) {
        var text = $("<div class=\"customer_service\">\n" +
            "                            <img src=\"img/customer.png\" alt=\"客服\" class=\"service_head_img\">\n" +
            "                            <div class=\"service_time\"><span>" + date + "</span><span>客服</span></div>\n" +
            "\n" +
            "                            <div class=\"service_input_content\">\n" +
            "                                <p>" + content + "</p>\n" +
            "                            </div>\n" +
            "                        </div>");
        $("#customer_service_content").append(text);
    }

    //连接服务器的相关函数
    var userId;//用户的id
    var stompClient = null;
    var service = false;
    var number = 0;//客户未看的信息条数
    function connect() {
        var socket = new SockJS("/endpointWisely"); //1连接SockJS的endpoint是“endpointWisely”，与后台代码中注册的endpoint要一样。
        stompClient = Stomp.over(socket);//创建STOMP协议的webSocket客户端。
        stompClient.connect({}, function (frame) {//连接webSocket的服务端。
            console.log("开始进行连接Connected:" + frame);

            //通过stompClient.subscribe（）订阅服务器的目标是'/user/' + userId + '/msg'
            // 接收一对一的推送消息,其中userId由服务端传递过来,用于表示唯一的用户,通过此值将消息精确推送给一个用户
            userId = getCurrentTime();
            stompClient.subscribe('/user/' + userId + '/msg', function (respnose) {
                service = true;
                var data = JSON.parse(respnose.body);
                add_message(data.date, data.content);//添加客服发送的消息
                if ($("#customer_service").css("display") == "none") {
                    number = number + 1;
                } else
                    number = 0;
                if (number > 0)
                    $("#customer_service_small span").text(number);
                else
                    $("#customer_service_small span").text("");

            });
            //通过stompClient.subscribe（）订阅服务器的目标是'/topic/getResponse'发送过来的地址，与@SendTo中的地址对应。
            stompClient.subscribe('/topic/getResponse', function (respnose) {
                var data = JSON.parse(respnose.body);
                var type = data.type;
                if (type == "1" && service == false) {
                    service = true;
                    layer.msg('客服上线了', {time: 1000, icon: 1}, function () {
                        var online = $("<div class=\"online\">\n" +
                            "                            <span>客服在线</span>\n" +
                            "                        </div>");
                        $("#customer_service_content").append(online);

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                }
                if (type == "2" && data.content == "客服" && service == true) {
                    service = false;
                    layer.msg('客服下线了', {time: 1000, icon: 1}, function () {
                        var unonline = $("<div class='tip'><span>当前客服不在线，请电话联系</span></div>");
                        $("#customer_service_content").append(unonline);

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                }
            });
            var message = set_message(userId, userId, "0", "");//注册session
            sendName(message);
        })

    }

    connect();

    function sendName(message) {
        //通过stompClient.send（）向地址为"/welcome"的服务器地址发起请求，与@MessageMapping里的地址对应。因为我们配置了registry.setApplicationDestinationPrefixes(Constant.WEBSOCKETPATHPERFIX);所以需要增加前缀/ws-push/
        stompClient.send("/ws-push/welcome", {}, JSON.stringify(message));
    }

//点击发送按钮
    $("#customer_service_foot").find("button:last").click(function () {
        if (service == false) {
            var unonline = $("<div class='tip'><span>当前客服不在线，请电话联系</span></div>");
            $("#customer_service_content").append(unonline);
            return;
        }
        var text = $("#customer_service_input").val();
        if (text.trim() == "")
            return;
        var show_date = getCurrentTime();
        var message = set_message(userId, show_date, "访客", text);
        sendName(message);//发送消息
        var content = $("<div class=\"visitor\">\n" +
            "                            <img src=\"img/客户.png\" alt=\"访客\" class=\"visitor_head_img\">\n" +
            "                            <div class=\"visitor_time\"><span>" + show_date + "</span><span>访客</span></div>\n" +
            "                            <div class=\"visitor_input_content\">\n" +
            "                                 " + text + "\n" +
            "                            </div>\n" +
            "                        </div>");
        $("#customer_service_content").append(content);
        $("#customer_service_input").val("");
        var scroll_top = $("#customer_service_content").scrollTop();
        $("#customer_service_content").scrollTop(10000 + scroll_top);

    });

    //关闭服务
    function disconnect() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    //关闭页面是关闭服务
    window.onbeforeunload = function () {
        var message = set_message(userId, getCurrentTime(), "2", "访客");//注销session
        sendName(message);
        disconnect();
    }
});