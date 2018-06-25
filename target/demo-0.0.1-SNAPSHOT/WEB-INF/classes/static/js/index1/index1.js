//选择图片后执行的函数
function selectImg(file){
    if((file.files[0].type).indexOf("image")!=-1){//如果是图片
        if(file.files&&file.files[0]){
            var reader=new FileReader();
            reader.onload=function (ev) {
                $("#customerimg").attr("src",ev.target.result);
            }
            reader.readAsDataURL(file.files[0]);
        }
    }

}
$(function () {
    var page=0;//页码
//设置返回顶部的函数
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $("#top").fadeIn(1000);
        }
        else {
            $("#top").fadeOut(1000);

        }
    });

    //实现网页加载图标
    document.onreadystatechange = function () {
        if (document.readyState == 'complete')
            $('.loading').fadeOut();
    };
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
    //鼠标在导航条上时触发
    $("nav div:first > ul:first >li:lt(6)").hover(function () {
        $(this).find("ul").toggle();
    }, function () {
        $(this).find("ul").toggle();
    });

    //设置标签中标题的hover函数
    function set_tab_hover() {
        $("#forg_message").find("li:first").find("span:odd").hover(function () {
            $(this).css("color", "red");
        }, function () {
            $(this).css("color", "#555");
        });
        //点击标签中的标题
        $("#forg_message").find("li:first").find("span:odd").click(function () {
            var text = $(this).text().trim();
            if ($(this).prev().text().trim() == '>') {
                if ($(this).prev().prev().prev().text().trim() == '>') {
                    //二级标签
                    //  alert("二级标签");
                    $("nav div:first > ul:first >li:lt(6):gt(0)").find("ul>li").each(function () {
                        $(this).find("> a:contains('" + text + "')").click();
                        return;
                    });
                }
                else {
                    //一级标签
                    // alert("一级标签");
                    $("nav div:first > ul:first >li:lt(6):gt(0)").each(function () {
                        $(this).find("> a:contains(" + text + ")").click();
                        return;
                    });
                }

            } else {//首页
                $("nav div:first > ul:first >li:eq(0)").click();

            }


        });
    }

    // set_tab_hover();
    //导航条上的标签
    var array_nav = new Array("关于我们", "客户实例", "产品中心", "企业资讯", "联系我们");
    var array_content = new Array(5);
    array_content[0] = new Array("关于我们", "资格许可证", "基地展示");
    array_content[2] = new Array("蛙苗", "成蛙", "种蛙");
    array_content[3] = new Array("公司动态", "常见问题");

    //点击左边列表中的Button对应函数
    function nav_extend_click() {
        var parent_text = $("#nav_extend").find("span").text();
        var index1 = array_nav.indexOf(parent_text);
        var index2;
        index1 += 1;
        $("#nav_extend").find("div:gt(0)").click(function () {
            index2 = $(this).index();
            $("nav div:first > ul:first >li:eq(" + index1 + ")").find("> ul li:nth-child(" + index2 + ")").click();
        });
    };

    //点击产品中心图片函数
    function product_click() {
        var Imgtype=['蛙苗','成蛙','种蛙'];

        $("#product >li >div img:first-child+a").click(function () {
            var type=$(this).text().trim();
            if(Imgtype.indexOf(type)!=-1){
                index_hide();
                window.scrollTo(0, 0);
                $("#product_item_title").text(type);
                $.ajax({
                    url:"get_ProductCenterfile1",
                    type:"post",
                    dataType:"json",
                    data:{type:Imgtype.indexOf(type)},
                    success:function(data){
                        $("#product_item_content").empty();
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if(data.code==0){
                                var content=$("<div></div>").append(data.data);
                                $("#product_item_content").append(content);
                                $("#product_item").show();
                            }else if(data.code==2){//空的数据
                                layer.msg("没添加描述", {time: 1000, icon: 2});
                            }
                            else{
                                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });

                    },error:function(XMLHttpRquest){
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })

            }
        });
    }

//点击公司资讯
    function business_news_click() {
        var $node = $("#business_news >li");
        $node.click(function () {
            var type=$(this).attr("title").trim();
            var title = $(this).find("span:first").text().trim();
            var id = $(this).find("span:last").text().trim();
            $("#business_news_item_title").text(title);
            $("#business_news_item_content").empty();
            var url;
            if(type=="公司动态")
                url="get_CompanyDynamics_contentByID1";
            else if(type=="常见问题"){
                url="get_CommonProblem_contentByID1";
            }
            else{
                return ;
            }
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: {id: id},
                success: function (data) {
                    if (data.code == 0) {
                        var content =$("<div></div>").append(data.data);
                        $("#business_news_item_content").append(content);
                        show_id("business_news_item");
                    } else {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg(data.message, {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                    }
                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                }
            });
        });
    }

    //点击导航条上的函数
    function index_hide() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        $(".slider_one_big_picture").css("display", "none");
        $("#nav_extend").css("display", "none");
        $("#nav_content").css("display", "none");
        $("#jssor_1").css("display", "none");
        $("#customers").css("display", "none");
        $("#product").css("display", "none");
        $("#product_item").css("display", "none");
        $("#business_news_item").hide();
        $("#contact").hide();
        $("#business_news").hide();
        $("#CustomerEvaluation").hide();
        $("#CustomerInstance_success_after").hide();
    }

    function index_show() {
        $("#nav_content").css("display", "block");
        $("#nav_extend").css("display", "block");
    }
    //获取客户实例的数量
    function getNumberCustomerInstances() {
        $("#input_page").val("0");
        $("#customers .customer").remove();
        $("#ampaginationlg-bootstrap").hide();
        $("#page_skip").hide();
        $.ajax({
            url: "getCountCustomerInstancesByType1",
            type: "post",
            dataType: "json",
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var number = data.data;
                        getCustomerInstances(number);
                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }
        })

    }

//获取客户实例的信息
    function getCustomerInstances(number) {

        var size = 3;//jpa页码从0开始,每页默认展示3个客户实例

        if(page>=(Math.ceil(number/size)-1)){
            page=(Math.ceil(number/size)-1);
        }
        $.ajax({
            url: "GetCustomerInstancesBypage1",
            type: "post",
            dataType: "json",
            data: {page: page, size: size},
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var result1 = data.data;
                        //显示用户实例到页面
                        showCustomerInstances(result1);
                        //分页初始化
                        $("#input_page").val(page+1);
                        var pagerlg = jQuery('#ampaginationlg-bootstrap').pagination({
                            page: page+1,
                            totals: number,
                            pageSize: size,//一页显示几个
                            theme: 'bootstrap',
                            btnSize: 'lg'
                        })
                            .onChangePage(function (e) {
                                $("#input_page").val(e.page);
                                //分页跳转
                                $.ajax({
                                    url: "GetCustomerInstancesBypage1",
                                    type: "post",
                                    dataType: "json",
                                    data: {page: e.page - 1, size: size},
                                    success: function (data) {

                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            if (data.code == 0) {
                                                var result = data.data;
                                                //显示用户实例到页面
                                                showCustomerInstances(result);
                                            } else {
                                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            }

                                        });
                                    },
                                    error: function (XMLHttpRquest) {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                    }
                                })


                            });
                        //点击分页跳转确认按钮
                        $("#page_btn").click(function () {
                            var page = $("#input_page").val().trim();
                            if (page != "" && page > 0 && page <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {
                                var opts = {page: page};
                                pagerlg.render(opts);
                            }
                        });

                        //如果按下enter键就直接跳转
                        $("#input_page").keydown(function (event) {
                            var keyNum = (navigator.appName = "Netscape") ? event.which : window.event.keyCode;
                            if (keyNum == 13) {
                                var msg = $(this).val();
                                $("#page_btn").click();
                            }

                        });
                        //输入跳转页数的判断错误函数
                        $("#input_page").keyup(function () {
                            var content = $(this).val().trim();
                            if (isNaN(content)) {
                                var change_content = content.replace(/\D/, "");
                                $(this).val(change_content);
                            }
                            else {

                                if (content != "" && content > 0) {
                                    if (content <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {

                                    }
                                    else {
                                        var change_text = content.slice(0, content.length - 1);
                                        $(this).val(change_text);
                                    }
                                } else {
                                    $(this).val($("#ampaginationlg-bootstrap li[class='active']").find("a").text().trim());
                                }
                            }
                        });
                        $("#input_page").focusout(function () {
                            if ($(this).val() == "") {
                                $(this).val($("#ampaginationlg-bootstrap li[class='active']").find("a").text().trim());
                                //当前的页数
                            }
                        });
                        $("#ampaginationlg-bootstrap").show();
                        $("#page_skip").show();

                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }

        })
    }

    function GetShowTime(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var show_date = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
        return show_date;
    };


    //显示用户实例到页面
    function showCustomerInstances(result1) {
        $("#customers .customer").remove();
        for (var i in result1) {
            var result = result1[i];
            var id = result.id;
            var name = result.name;
            var telPhone = result.telPhone;
            var date = GetShowTime(new Date(result.date));
            var image = result.image;
            var path = result.path;
            if (telPhone == "" || telPhone == null)
                telPhone = "无";
            var $li = $("<li class=\"customer\">\n" +
                "                        <div style=\"float: left; margin-left: -17px;padding: 17px;\">\n" +
                "                            <img src=" + image + " href=\"#\" title=\"永泉农庄\" class=\"customer_img\" alt=\"图片\">\n" +
                "                        </div>\n" +
                "                        <div style=\"padding: 17px;line-height: 27px;\">\n" +
                "                            <div><span class=\"sr-only\">" + id + "</span><h4 style=\"font-weight: bold;font-size: 20px;float:left\">" + name + "</h4>\n" +
                "                                <span>联系电话:</span><label>" + telPhone + "</label><span>发布时间:</span>\n" +
                "                                <label style=\"font-family: initial;\">" + date + "</label>\n" +
                "                            </div>\n" +
                "                            <p style=\"max-height: 117px;overflow-y: auto;margin-top: 9px;word-break: break-all;width: 819px;\">客户评价:" + path + "\n" +
                "                        </div>\n" +
                "                    </li>");
            $("#ampaginationlg-bootstrap").before($li);
        }
    }
    function index_0() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("nav_content");
        $("#nav_extend").empty();
        $("#nav_span").empty();
        var $content = $("<div><span>关于我们</span></div>\n" +
            "                    <div>关于我们</div>\n" +
            "                    <div>资格许可证</div>\n" +
            "                    <div>基地展示</div>");
        $("#nav_extend").append($content);

        //显示关于我们的内容
        var $content1 =$("<div></div>");

        $.ajax({
            url:"get_about_first1",
            type:"post",
            dataType:"json",
            success:function(data){
                if (data.code == "0") {

                    $content1.append(data.data);
                }
                else if (data.code == "2") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })
        $("#nav_extend").css("margin-top", "-19px");
        $("#nav_span").append($content1);
        index_show();
        nav_extend_click();
    }

    function index_1() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("customers");
        $("#customers .customer").remove();
        getNumberCustomerInstances();//获取客户实例
        $("#customers").css("display", "block");
        $("#nav_all_extend").css("margin-top", "15px");


    }

    function index_2() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("product");
        $("#nav_extend").empty();
        var $content = $("<div><span>产品中心</span></div>\n" +
            "                    <div>蛙苗</div>\n" +
            "                    <div>成蛙</div>\n" +
            "                    <div>种蛙</div>");
        $("#nav_extend").append($content);
        $("#nav_extend").css("margin-top","-13px");
        getAllproductImgs();
        nav_extend_click();

    }

    function index_3() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        get_company_Enterprises(2);
        show_id("business_news");
        $("#nav_extend").empty();
        var $content = $("<div><span>企业资讯</span></div>\n" +
            "                    <div>公司动态</div>\n" +
            "                    <div>常见问题</div>\n");
        $("#nav_extend").append($content);
        $("#nav_extend").show();
        nav_extend_click();

    };

    function index_4() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("contact");
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
                        $("#bussiness_name span").text(bussinessName);
                        $("#business_address span").text(address);
                        $("#business_tel span").text(phone);
                        $("#business_boss span").text(businessBoss);
                        $("#contact").show();
                    }

                }
            },error:function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })


    };

    //设置许可证的图片轮播
    function slider_container_init(length) {
        $(".slider_one_big_picture").EasySlides({
            'autoplay': true,
            'timeout': 3000,
            'show': 1,
            'vertical': false,
            'reverse': false,
            'touchevents': true,
            'delayaftershow': 300,
            'stepbystep': false,
            'startslide': 0,
            'loop': true,
            'distancetochange': 10,
            'beforeshow': function () {},
            'aftershow': function () {},
            // 'autoplay': true,
            // 'stepbystep': false,
            // 'show': 1,
            // 'loop': true
        })
        $(".nav_indicators >ul >li").click(function () {
            var index=$(this).text().trim();
            $(".slider_one_big_picture >div.active").removeClass("active").addClass("hidden");
            $(".slider_one_big_picture >div:nth-child("+index+")").removeClass("hidden").addClass("active");
            $(".nav_indicators >ul >li").removeClass("active");
            $(this).addClass("active");
        })
    };
    //图片全屏
    Galleria.loadTheme('js/src/themes/lightbox/galleria.lightbox.js');
    function init_Galleria(id){
        var length=0;
        $(id).find("img").each(function () {
            length++;
        });

        //直到图片加载完成之后
        function img_load_complete(index){
            if(index==length){
                $("#galleria").empty();
                $(".galleria-overlay").remove();
                $(".galleria-popup").remove();
                $('#galleria').galleria({
                    data_source: id,
                    extend: function() {
                        this.bind(Galleria.LOADFINISH, function(e) {
                            $(e.imageTarget).click(this.proxy(function(e) {
                                e.preventDefault();
                                this.next();
                            }))
                        })
                    },
                    keep_source: true,
                    data_config: function(img) {
                        return {
                            description: $(img).next('.caption').html()
                        }
                    }
                });
                return;
            }
            var img= $(id).find('img:eq('+index+')')[0];
            if(img.complete)
            {
                img_load_complete(index+1);
            }
            else{
                img.onload=function () {
                    img_load_complete(index+1);
                };
            }
        };
        img_load_complete(0);

    }

    function index_0_1() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        $("#nav_extend").empty();
        var $content = $("<div><span>关于我们</span></div>\n" +
            "                    <div>关于我们</div>\n" +
            "                    <div>资格许可证</div>\n" +
            "                    <div>基地展示</div>");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        //清空图片
        $(".slider_one_big_picture >div.active").remove();
        $(".slider_one_big_picture >div.hidden").remove();
        $(".nav_indicators").empty();
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:0},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    var files=data.data;
                    for(var i in files)
                    {  var j=parseInt(i)+1;
                        var imgpath=files[i];
                        // imgpath=imgpath.replace("\\","/");
                        // var path="url(./"+imgpath+")";
                        var $img=$("<div><img src="+imgpath+" alt=\"许可证\" style=\"width: 864px;height: 422px;\"></div>");
                        $(".slider_one_big_picture .next_button").before($img);
                    }
                    slider_container_init(); //对许可证轮播图的初始化

                    init_Galleria(".slider_one_big_picture");
                    show_id("slider_one_big_picture");
                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    $("#nav_all_extend").css("margin-top","13px");
                    show_id("slider_one_big_picture");
                    $(".slider_one_big_picture").hide();
                    //空的数据
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })

        nav_extend_click();
    };

    function index_0_2() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("jssor_1");
        $("#nav_extend").empty();
        var $content = $("<div><span>关于我们</span></div>\n" +
            "                    <div>关于我们</div>\n" +
            "                    <div>资格许可证</div>\n" +
            "                    <div>基地展示</div>");
        $("#nav_extend").append($content);
        $("#jssor_1").empty();
        var path="../static/img/loading.gif";
        var $imgcontent=$("<div data-u=\"loading\" style=\"position: absolute; top: 0px; left: 0px;\">\n" +
            "                        <div style=\"filter: alpha(opacity=70); opacity: 0.7; position: absolute; display: block; top: 0px; left: 0px; width: 100%; height: 100%;\"></div>\n" +
            "                        <div style=\"position:absolute;display:block;background:url("+path+") no-repeat center center;top:0px;left:0px;width:100%;height:100%;\"></div>\n" +
            "                    </div>\n" +
            "                    <div data-u=\"slides\"\n" +
            "                         style=\"cursor: default; position: relative; top: 0px; left: 240px; width: 720px; height: 480px; overflow: hidden;\"\n" +
            "                        id=\"jssor_1_img\">\n" +
            // "                        <div data-p=\"150.00\">\n" +
            // "                            <img data-u=\"image\" src=\"img/1.jpg\"/>\n" +
            // "                            <img data-u=\"thumb\" src=\"img/1.jpg\"/>\n" +
            // "                        </div>\n" +
            // "                        <div data-p=\"150.00\" style=\"display: none;\">\n" +
            // "                            <img data-u=\"image\" src=\"img/2.jpg\"/>\n" +
            // "                            <img data-u=\"thumb\" src=\"img/2.jpg\"/>\n" +
            // "                        </div>\n" +
            // "                        <div data-p=\"150.00\" style=\"display: none;\">\n" +
            // "                            <img data-u=\"image\" src=\"img/3.jpg\"/>\n" +
            // "                            <img data-u=\"thumb\" src=\"img/3.jpg\"/>\n" +
            // "                        </div>\n" +
            "                        <!--<a data-u=\"any\" href=\"#\" style=\"display:none\">Image Gallery with Vertical Thumbnail</a>-->\n" +
            "                    </div>\n" +
            "                    <!-- Thumbnail Navigator -->\n" +
            "                    <div data-u=\"thumbnavigator\" class=\"jssort01-99-66\"\n" +
            "                         style=\"position:absolute;left:0px;top:0px;width:240px;height:480px;\" data-autocenter=\"2\">\n" +
            "                        <!-- Thumbnail Item Skin Begin -->\n" +
            "                        <div data-u=\"slides\" style=\"cursor: default;\">\n" +
            "                            <div data-u=\"prototype\" class=\"p\">\n" +
            "                                <div class=\"w\">\n" +
            "                                    <div data-u=\"thumbnailtemplate\" class=\"t\"></div>\n" +
            "                                </div>\n" +
            "                                <div class=\"c\"></div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <!-- Thumbnail Item Skin End -->\n" +
            "                    </div>\n" +
            "                    <!-- Arrow Navigator -->\n" +
            "                    <span data-u=\"arrowleft\" class=\"jssora05l\" style=\"top:0px;left:248px;width:40px;height:40px;\"\n" +
            "                          data-autocenter=\"2\"></span>\n" +
            "                    <span data-u=\"arrowright\" class=\"jssora05r\" style=\"top:0px;right:8px;width:40px;height:40px;\"\n" +
            "                          data-autocenter=\"2\"></span>");
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:1},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    $("#jssor_1").append($imgcontent);
                    var files=data.data;
                    for(var i in files)
                    {  var j=parseInt(i);
                        var $img=$("<div data-p=\"150.00\">\n" +
                            "                            <img data-u=\"image\" src="+files[i]+"/>\n" +
                            "                            <img data-u=\"thumb\" src="+files[i]+"/>\n" +
                            "                        </div>");
                        if(j!=0)
                        {$img.css("display","none");
                        }
                        $("#jssor_1_img").append($img);
                    }
                    $("#jssor_1").append($imgcontent);
                    initjssor_1();//初始化基地展示轮播图
                    init_Galleria("#jssor_1_img");
                    $("#jssor_1").css("display", "block");
                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据

                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })

        $("#nav_extend").css("margin-top", "13px");
        nav_extend_click();
    }
    //获取产品中心的图片(type=2,获取蛙苗的图片路径;type=3,获取成蛙的图片路径;type=4,获取种蛙的图片路径）
    function getproductImg(type) {
        $("#product").empty();
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:type},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    addImgIntoProduct(data.data,type);
                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })
    }
//添加图片到产品中心
    function addImgIntoProduct($imgPath,type) {
        //流加载
        var Imgtype=['蛙苗','成蛙','种蛙'];
        var imgpage=0;
        if($imgPath=="") {
            $("#product").css("display", "none");
        }
        else{
            layui.use('flow',function () {
                var flow=layui.flow;
                flow.load({
                    elem:'#product',
                    scrollElem:'#product',
                    isAuto:true,
                    isLazyimg:true,
                    done:function(page,next){
                        setTimeout(function () {
                            var lis =[];
                            var img="<li style='display: flow-root;'>";
                            var length=($imgPath.length-imgpage)>=9?9:($imgPath.length-imgpage);
                            for(var j=0;j<length;j++){

                                var imgcontent="<div><img lay-src="+$imgPath[imgpage+j]+"><a>"+Imgtype[type-2]+"</a></div>";
                                img+=imgcontent;
                            }
                            img+="</li>";
                            lis.push(img);
                            imgpage=imgpage+9;
                            next(lis.join(''),page<Math.ceil($imgPath.length/9));
                            product_click();
                            var time=setTimeout(function () {
                                init_Galleria("#product");
                            },3000);

                        },500);
                    }
                });
            });
            $("#product").css("display", "block");
        }
    }


//添加图片到产品中心
    function addImgIntoProduct1() {
        //流加载
        var Imgtype=['蛙苗','成蛙','种蛙'];
        var imgpage=0;
        var $imgPath=new Array();//存储所有的产品中心的图片
        var number=new Array();//存储产品中心每个种类的图片的最大位置
        for(var i in ProductImgs){
            var index=parseInt(i);
            var imgs=ProductImgs[i];
            for(var n=0;n<imgs.length;n++){
                $imgPath[$imgPath.length]=imgs[n];
            }
            if(number.length==0)
                number[number.length]=imgs.length;
            else
            {
                number[number.length]=number[number.length-1]+imgs.length;
            }
        }

        if($imgPath.length==0) {
            $("#product").css("display", "none");
        }
        else{
            layui.use('flow',function () {
                var flow=layui.flow;
                flow.load({
                    elem:'#product',
                    scrollElem:'#product',
                    isAuto:true,
                    isLazyimg:true,
                    done:function(page,next){
                        setTimeout(function () {
                            var lis =[];
                            var img="<li style='display: flow-root;'>";
                            var length=($imgPath.length-imgpage)>=9?9:($imgPath.length-imgpage);
                            for(var j=0;j<length;j++){
                                var currentType="";
                                var currentImgPage=imgpage+j;
                                for(var m=0;m<number.length;m++){
                                    if(currentImgPage<number[m]){
                                        currentType=Imgtype[m];
                                        break;
                                    }
                                }
                                var imgcontent="<div><img lay-src="+$imgPath[imgpage+j]+"><a>"+currentType+"</a></div>";
                                img+=imgcontent;
                            }
                            img+="</li>";
                            lis.push(img);
                            imgpage=imgpage+9;
                            next(lis.join(''),page<Math.ceil($imgPath.length/9));
                            product_click();
                            init_Galleria("#product");
                        },500);
                    }
                });
            });
            $("#product").css("display", "block");

        }

    }
//获取产品中心的所有图片

    //获取产品中心的图片(type=2,获取蛙苗的图片路径;type=3,获取成蛙的图片路径;type=4,获取种蛙的图片路径）
    var ProductImgs={};
    function getproductImg1(type) {//没删除原来存在的图片
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:type},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    ProductImgs[type]=data.data;
                    if(type==2){//已经获取完了
                        getproductImg1(3);
                    }
                    else if(type==3){
                        getproductImg1(4);
                    }else if(type==4){
                        addImgIntoProduct1(ProductImgs);
                    }
                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据
                    if(type==2){//已经获取完了
                        getproductImg1(3);
                    }
                    else if(type==3){
                        getproductImg1(4);
                    }else if(type==4){
                        addImgIntoProduct1(ProductImgs);
                    }
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })

    }
    //显示产品中心的所有图片
    function getAllproductImgs() {
        ProductImgs={};
        $("#product").empty();
        getproductImg1(2);
        init_Galleria("#product");

    }

    function index_2_0() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("product");
        $("#nav_extend").empty();
        var $content = $("<div><span>产品中心</span></div>\n" +
            "                    <div>蛙苗</div>\n" +
            "                    <div>成蛙</div>\n" +
            "                    <div>种蛙</div>");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        getproductImg(2);
        nav_extend_click();
    }

    function index_2_1() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("product");
        $("#nav_extend").empty();
        var $content = $("<div><span>产品中心</span></div>\n" +
            "                    <div>蛙苗</div>\n" +
            "                    <div>成蛙</div>\n" +
            "                    <div>种蛙</div>");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        getproductImg(3);
        nav_extend_click();
    }

    function index_2_2() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("product");
        $("#nav_extend").empty();
        var $content = $("<div><span>产品中心</span></div>\n" +
            "                    <div>蛙苗</div>\n" +
            "                    <div>成蛙</div>\n" +
            "                    <div>种蛙</div>");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        getproductImg(4);
        nav_extend_click();
    }
    //获取公司动态(type=0)或常见问题(type=1)或企业资讯(type=2)的所有标题id
    function get_company_Enterprises(type) {

        $("#business_news").empty();
        if (type == 0) {
            $.ajax({
                url: "get_all_CompanyDynamics_title1",
                type: "post",
                dataType: "json",
                success: function (da) {
                    if(da.code=="0")
                    { var data=da.data;
                        for (var i in data) {
                            var $li = $("<li title=\"公司动态\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                            $("#business_news").append($li);
                        }
                        $("#business_news").show();
                        business_news_click();
                    }

                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        } else if (type == 1) {
            $.ajax({
                url: "get_all_CommonProblem_title1",
                type: "post",
                dataType: "json",
                success: function (da) {
                    if(da.code=="0") {
                        var data = da.data;
                        for (var i in data) {
                            var $li = $("<li title='常见问题'><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                            $("#business_news").append($li);
                        }
                        $("#business_news").show();
                        business_news_click();
                    }
                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("常见问题获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        }
        else if(type==2){

            $.ajax({
                url: "get_all_CompanyDynamics_title1",
                type: "post",
                dataType: "json",
                success: function (da){
                    if(da.code=="0")
                    {
                        var data = da.data;
                        for (var i in data) {
                            var $li = $("<li title=\"公司动态\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                            $("#business_news").append($li);
                        }
                    }
                    $.ajax({
                        url: "get_all_CommonProblem_title1",
                        type: "post",
                        dataType: "json",
                        success: function (da) {
                            if(da.code=="0") {
                                var data = da.data;
                                for (var i in data) {
                                    var $li = $("<li title='常见问题'><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                                    $("#business_news").append($li);
                                }
                                business_news_click();
                                $("#business_news").show();
                            }
                        },
                        error: function (XMLHttpRequest) {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("常见问题获取失败", {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                        }
                    });

                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });



        }else {
            alert("type=0|1,不能为其他");
        }

    }
    function index_3_0() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("business_news");
        $("#nav_extend").empty();
        var $content = $("<div><span>企业资讯</span></div>\n" +
            "                    <div>公司动态</div>\n" +
            "                    <div>常见问题</div>\n");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        nav_extend_click();
        get_company_Enterprises(0);

    }

    function index_3_1() {
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("business_news");
        $("#nav_extend").empty();
        var $content = $("<div><span>企业资讯</span></div>\n" +
            "                    <div>公司动态</div>\n" +
            "                    <div>常见问题</div>\n");
        $("#nav_extend").append($content);
        $("#nav_extend").css("display", "block");
        nav_extend_click();

        get_company_Enterprises(1);
    }

    //点击导航条时触发
    $("nav div:first > ul:first >li:lt(6):gt(0)").click(function () {
        var text = $(this).find("a:first").text();
        var $message = $("#forg_message").find("li:first");
        $message.empty();
        var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span><span> > </span><span>" + text + "</span></a>");
        $message.append(content);
        set_tab_hover();
        var index = array_nav.indexOf(text);
        switch (index) {
            case 0:
                index_0();
                break;
            case 1:
                index_1();
                break;
            case 2:
                index_2();
                break;
            case 3:
                index_3();
                break;
            case 4:
                index_4();
                break;
        }
    });





    // $("#customerimg").next().next().bind("change",selectImg());
    //初始化客户评价
    function init_CustomerEvaluation(){
        $("#customerimg +span").click(function () {
            var file=$(this).next();
            file.click();
        });
    }
    init_CustomerEvaluation();
    //显示客户评价
    $("#Feedback").click(function () {
        var text = $(this).find("a:first").text();
        var $message = $("#forg_message").find("li:first");
        $message.empty();
        var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span><span> > </span><span>" + text + "</span></a>");
        $message.append(content);
        set_tab_hover();
        $("#nav_extend").removeAttr("style");
        $("#nav_all_extend").removeAttr("style");
        show_id("CustomerEvaluation");
        $("#CustomerEvaluation").show();
        $("#CustomerEvaluationForm").show();

    });
//自定义手机号码验证
    $.validator.addMethod("IsTelNumber", function () {
        var value = arguments[0];
        var element = arguments[1];
        var length = value.length;
        var mobile = /^1[0-9]{10}$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码,开头为1,位数为11位");
    //客户评价表单验证
    $("#CustomerEvaluationForm").validate({
        rules:{
            customername:{
                required:true,
                rangelength:[1,40]
            },
            telPhone:{
                IsTelNumber:$("#telPhone").val().trim()
            },
            customerevaluate:{
                required:true
            }
        },
        messages:{
            customername:{
                required:"客户名称必须填写",
                rangelength:"客户名称的长度最大为40"
            },
            customerevaluate:{
                required:"客户评价不能为空"
            }
        }
    })
    //点击返回
    $("#CustomerInstance_success_after a:first").click(function () {
        $("#CustomerInstance_success_after").hide();
        $(".navbar .container .nav >li:last").click();
    });
    //客户评价提交
    $("#CustomerEvaluationForm input:nth-last-child(2)").click(function () {
        if($("#CustomerEvaluationForm").valid()==false)
        {
            return false;
        }else{
            var customername=$("#customername").val().trim();
            var telPhone=$("#telPhone").val().trim();
            var customerimg=$("#customerimg").attr("src").trim();
            var customerevaluate=$("#customerevaluate").val().trim();
            var date=new Date(getCurrentTime());
            var data;
            if(telPhone==""){
                data={name:customername,date:date,"image":customerimg,"path":customerevaluate};
            }else{
                data={"name":customername,"telPhone":telPhone,"date":date,"image":customerimg,"path":customerevaluate};
            }
            $.ajax({
                url:"addOneCustomerInstance",
                type:"post",
                dataType:"json",
                data:data,
                success:function(data){
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        if(data.code==0){
                            $("#CustomerEvaluation").find("input:last").click();
                            $("#CustomerEvaluationForm").hide();
                            $("#CustomerInstance_success_after").show();
                            layer.msg("提交成功", {time: 2000, icon: 1}, function () {

                                $("#CustomerInstance_success_after a").click();

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                        }else
                        {
                            layer.msg(data.message, {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        }

                    });
                },error:function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("提交失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:"+XMLHttpRequest.status+",错误内容:"+XMLHttpRequest.statusText);
                }
            })

        }
        return false;
    });



    $("nav div:first > ul:first >li:lt(6):gt(0)").find("ul>li").click(function (e) {
        var text = $(this).find("a").text();
        var parent_text = $(this).closest(".menu_item").find("a:first").text();//不冒泡，找到就结束
        var event = e || window.event;
        event.stopPropagation();//w3c取消冒泡
        var $message = $("#forg_message").find("li:first");
        $message.empty();
        var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
            "<span> > </span><span>" + parent_text + "</span><span> > </span><span>" + text + "</span></a>");
        $message.append(content);
        set_tab_hover();
        var index1 = array_nav.indexOf(parent_text);
        var index2 = array_content[index1].indexOf(text);
        switch (index1) {
            case 0:
                switch (index2) {
                    case 0:
                        index_0();
                        break;
                    case 1:
                        index_0_1();
                        break;
                    case 2:
                        index_0_2();
                        break;
                }
                ;
                break;
            case 2:
                switch (index2) {
                    case 0:
                        index_2_0();
                        break;
                    case 1:
                        index_2_1();
                        break;
                    case 2:
                        index_2_2();
                        break;
                }
                ;
                break;
            case 3:
                switch (index2) {
                    case 0:
                        index_3_0();
                        break;
                    case 1:
                        index_3_1();
                        break;
                }
                ;
                break;
        }
    });

    //改正用户名不自动验证的函数
    (function () {
        var radio = $("#form_register input:radio:lt(2)");
        $.each(radio, function () {
            $(this).change(function () {
                var username = $("#username").val();
                var change = username + " ";
                $("#username").val(change);
                $("#username").focus();
                $("#username").blur();
                $("#username").val(change.trim());

                $("#username").focus();
            });
        });

    })()

    // 搜索框中图标变化
    $("#search_li").focusin(function () {
        $(this).find(".glyphicon").css("color", "#1abc9c");

    });
    $("#search_li").focusout(function () {
        $(this).find(".glyphicon").css("color", " #64834a");
    });

    //按下回车搜索(event.keyCode如果是 13 ，那么按下的是enter)
    $("#search").keydown(function (event) {
        var keyNum = (navigator.appName = "Netscape") ? event.which : window.event.keyCode;
        if (keyNum == 13) {
            var search_msg = $("#search").val();
            if (search_msg != "")
                alert(search_msg);
        }
    });
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



//公司的宣传信息
    $('#slidorion').slidorion({
        interval: 6000,
        speed: 1000,
        effect: 'fade',//'overLeft',overRight,fade
        hoverPause: true
    });
//设置slider图片的样式
    $("#slider img").css("padding", "0 0");





    //设置基地图片轮播
    function initjssor_1() {


        var jssor_1_SlideshowTransitions = [
            {$Duration: 1200, $Zoom: 1, $Easing: {$Zoom: $Jease$.$InCubic, $Opacity: $Jease$.$OutQuad}, $Opacity: 2},
            {
                $Duration: 1000,
                $Zoom: 11,
                $SlideOut: true,
                $Easing: {$Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {$Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$InExpo},
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: 0.5,
                $Cols: 2,
                $Zoom: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {$Left: $Jease$.$InCubic, $Zoom: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 4,
                $Cols: 2,
                $Zoom: 11,
                $SlideOut: true,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {$Left: $Jease$.$InExpo, $Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.6,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Left: [0.2, 0.8], $Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Left: $Jease$.$Swing, $Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                x: -4,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: -0.6,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Left: [0.2, 0.8], $Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Left: $Jease$.$Swing, $Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                x: 4,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: 0.5,
                y: 0.3,
                $Cols: 2,
                $Zoom: 1,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1000,
                x: 0.5,
                y: 0.3,
                $Cols: 2,
                $Zoom: 1,
                $Rotate: 1,
                $SlideOut: true,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Top: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1200,
                x: -4,
                y: 2,
                $Rows: 2,
                $Zoom: 11,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Row: 28},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1200,
                x: 1,
                y: 2,
                $Cols: 2,
                $Zoom: 11,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 19},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            }
        ];

        var jssor_1_options = {
            $AutoPlay: true,
            $SlideshowOptions: {
                $Class: $JssorSlideshowRunner$,
                $Transitions: jssor_1_SlideshowTransitions,
                $TransitionsOrder: 1
            },
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
            $ThumbnailNavigatorOptions: {
                $Class: $JssorThumbnailNavigator$,
                $Rows: 2,
                $Cols: 6,
                $SpacingX: 14,
                $SpacingY: 12,
                $Orientation: 2,
                $Align: 156
            }
        };

        var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

        /*responsive code begin*/

        /*you can remove responsive code if you don't want the slider scales while window resizing*/
        function ScaleSlider() {
            var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
            if (refSize) {
                refSize = Math.min(refSize, 960);
                refSize = Math.max(refSize, 300);
                jssor_1_slider.$ScaleWidth(refSize);
            }
            else {
                window.setTimeout(ScaleSlider, 30);
            }
        }

        ScaleSlider();
        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", ScaleSlider);
    };
//分页
//
//     var pagerOpts={
//         maxSize: 7, // Limit number for pagination size.      default:7
//         totals: 100, //Total number of items in all pages.
//         page: 1,  //select page index  1....total page
//         pageSize: 10, //Maximum number of items per page. A value less than one indicates all items on one page.  default :10
//         lastText: '»»', //Text for Last button.    default: '»»'
//         firstText: '««', //Text for First button. default: '««'
//         prevText: '«',//« //Text for Previous  button.  default:'«'
//         nextText: '»', //Text for next button.   default:'»'
//         rotate: true,//Whether to keep current page in the middle of  the visible ones   default:true
//         directionLinks: true,// Whether to display Previous / Next buttons.  default:true
//         boundaryLinks: true,// Whether to display first / last buttons.      default:true
//         theme:'', // 'bootstrap' or 'amazeui'   defalut:''   default ui  only modify background color from bootstrap pagination
//         btnSize:'' // 'sm'  or 'lg'  defalut : ''
//     };
//     jQuery('.rderch').on('click',function(){
//         var rdrOpts={
//             totals:100,/*optional*/  //default:current totals
//             pageSize:10,/*optional*/ //default:current pageSize
//             page:2/*optional*/ //default:current selected page
//         }
//         pger.render(rdrOpts);
//     });
//     jQuery('.newch').on('click',function(){
//         jQuery('#ampager').pagination({
//             page:5
//         });
//     });



    var content_array=["nav_content","slider","jssor_1","customers","product","product_item","business_news"
        ,"business_news_item","contact","CustomerEvaluation","index","nav_extend"];
    //显示某个id
    function show_id(id) {
        if(id.trim()=="slider_one_big_picture"){
            for (var i in content_array) {
                $("#" + content_array[i]).hide();
            }
            $(".slider_one_big_picture").show();
        }
        else{
            $("#" + id).show();
            for (var i in content_array) {
                if (content_array[i] != id) {
                    $("#" + content_array[i]).hide();
                }

            }
            $(".slider_one_big_picture").hide();
        }
        $("#nav_extend").show();
        if(id=="customers"||id=="contact"||id=="CustomerEvaluation")
            $("#nav_extend").hide();


        if(id!="index")
            $("#nav_menu").show();
        else{
            $("#nav_menu").hide();
        }
    };
    //初始化左边的导航栏


    function init_left_nav(){
        //1 公司动态
        $("#nav_all_extend >div:nth-child(2) li").remove();
        $("#nav_all_extend >div:nth-child(3) >div:gt(0)").remove();
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
                        $("#nav_all_extend >div:nth-child(2)").append($li);
                    }

                    $("#nav_all_extend >div:nth-child(2) >li").click(function () {
                        window.scrollTo(0, 0);
                        var type=$(this).attr("title").trim();
                        var title = $(this).find("span:first").text().trim();
                        var id = $(this).find("span:last").text().trim();
                        $("#business_news_item_title").text(title);
                        $("#business_news_item_content").empty();
                        var url;
                        if(type=="公司动态")
                            url="get_CompanyDynamics_contentByID1";
                        else if(type=="常见问题"){
                            url="get_CommonProblem_contentByID1";
                        }
                        else{
                            return ;
                        }
                        $.ajax({
                            url: url,
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {
                                if (data.code == 0) {
                                    $("#nav_extend").empty();
                                    var $content = $("<div><span>企业资讯</span></div>\n" +
                                        "                    <div>公司动态</div>\n" +
                                        "                    <div>常见问题</div>\n");
                                    $("#nav_extend").append($content);
                                    $("#nav_extend").css("display", "block");
                                    nav_extend_click();
                                    var $message = $("#forg_message").find("li:first");
                                    $message.empty();
                                    var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                                        "<span> > </span><span>企业资讯</span><span> > </span><span>公司动态</span></a>");
                                    $message.append(content);
                                    set_tab_hover();
                                    var content =$("<div></div>").append(data.data);
                                    $("#business_news_item_content").append(content);
                                    show_id("business_news_item");
                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }
                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        });
                    });


                }

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {
                        //$("#nav_all_extend >div:nth-child(2)").hide();
                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });

        //推荐产品
        ProductImgs={};
        $("#product").empty();
        getOneKindproductImg(2);

    }
    init_left_nav();
    function addImgIntoLeftNav(){
        if(JSON.stringify(ProductImgs)=="{}"){
            return;
        }
        for(var i in ProductImgs){
            if(i==2){
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"蛙苗\"><a>蛙苗</a></div>"));
            }else if(i==3){
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"成蛙\"><a>成蛙</a></div>"));
            }else{
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"种蛙\"><a>种蛙</a></div>"));
            }
        }


//点击图片或下标
        var Imgtype=['蛙苗','成蛙','种蛙'];

        $("#nav_all_extend >div:nth-child(3) >div:gt(0) img:first-child").click(function () {

            var type=$(this).next().text().trim();
            if(Imgtype.indexOf(type)!=-1){
                var $message = $("#forg_message").find("li:first");
                $message.empty();
                var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                    "<span> > </span><span>产品中心</span><span> > </span><span>"+type+"</span></a>");
                $message.append(content);
                set_tab_hover();
                index_hide();
                window.scrollTo(0, 0);
                $("#product_item_title").text(type);
                $.ajax({
                    url:"get_ProductCenterfile1",
                    type:"post",
                    dataType:"json",
                    data:{type:Imgtype.indexOf(type)},
                    success:function(data){
                        $("#product_item_content").empty();
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if(data.code==0){
                                var content=$("<div></div>").append(data.data);
                                $("#product_item_content").append(content);
                                $("#product_item").show();
                            }else if(data.code==2){//空的数据
                                layer.msg("没添加描述", {time: 1000, icon: 2});
                            }
                            else{
                                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });

                    },error:function(XMLHttpRquest){
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })

            }

        });
        $("#nav_all_extend >div:nth-child(3) >div:gt(0) img:first-child+a").click(function () {
            var type=$(this).text().trim();
            if(Imgtype.indexOf(type)!=-1){
                var $message = $("#forg_message").find("li:first");
                $message.empty();
                var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                    "<span> > </span><span>产品中心</span><span> > </span><span>"+type+"</span></a>");
                $message.append(content);
                set_tab_hover();
                index_hide();
                window.scrollTo(0, 0);
                $("#product_item_title").text(type);
                $.ajax({
                    url:"get_ProductCenterfile1",
                    type:"post",
                    dataType:"json",
                    data:{type:Imgtype.indexOf(type)},
                    success:function(data){
                        $("#product_item_content").empty();
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if(data.code==0){
                                var content=$("<div></div>").append(data.data);
                                $("#product_item_content").append(content);
                                $("#product_item").show();
                            }else if(data.code==2){//空的数据
                                layer.msg("没添加描述", {time: 1000, icon: 2});
                            }
                            else{
                                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });

                    },error:function(XMLHttpRquest){
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })

            }
        });
    }
    function getOneKindproductImg(type){
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:type},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    ProductImgs[type]=data.data[0];
                    if(type==2){
                        getOneKindproductImg(3);
                    }
                    else if(type==3){
                        getOneKindproductImg(4);
                    }else if(type==4){//已经获取完了
                        addImgIntoLeftNav();
                    }
                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据
                    if(type==2){
                        getOneKindproductImg(3);
                    }
                    else if(type==3){
                        getOneKindproductImg(4);
                    }else if(type==4) {//已经获取完了
                        addImgIntoLeftNav();
                    }
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })
    }

//点击主页
    $("nav div:first > ul:first >li:eq(0)").click(function () {
        show_id("index");
    })
    //初始化主页上的按钮函数
    function initIndexButton() {
        //点击公司介绍上的图片
        $("#Company_introduction > div:last-child >div:first-child img").click(function () {
            $("#about_1").click();
        });
        //点击公司介绍上的和更多
        $("#Company_introduction > div:first-child a").click(function () {
            $("#about_1").click();
        })

        //点击公司动态上的更多
        $("#index_CompanyDynamics >div:first >a").click(function () {
            $("#Enterpriseconsulting1").click();
        })
        $("#index_CommonProblem >div:first >a").click(function () {
            $("#Enterpriseconsulting2").click();
        })
        //点击产品中心的种类
        $("#Product_classification >ul:first >li").click(function () {
            var result=$(this).text().trim();
            var array=["蛙苗","成蛙","种蛙"];
            var index=array.indexOf(result);
            if(index!=-1){
                $("#ProductCenter >ul >li:eq("+index+")").click();
            }
        })
        //点击产品中心的更多
        $("#Product_classification >div:first a").click(function () {
            $("#ProductCenter >a:first").click();
        });
        //点击产品图片的更多
        $("#Product_classification_img >div:first a").click(function () {
            $("#ProductCenter >a:first").click();
        });


    }


    ProductImgs_index={};

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
                var $message = $("#forg_message").find("li:first");
                $message.empty();
                var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                    "<span> > </span><span>产品中心</span><span> > </span><span>"+type+"</span></a>");
                $message.append(content);
                set_tab_hover();
                window.scrollTo(0, 0);
                $("#product_item_title").text(type);
                $.ajax({
                    url:"get_ProductCenterfile1",
                    type:"post",
                    dataType:"json",
                    data:{type:Imgtype.indexOf(type)},
                    success:function(data){
                        $("#product_item_content").empty();
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if(data.code==0){
                                var content=$("<div></div>").append(data.data);
                                $("#product_item_content").append(content);
                                show_id("product_item");
                            }else if(data.code==2){//空的数据
                                layer.msg("没添加描述", {time: 1000, icon: 2});
                            }
                            else{
                                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });

                    },error:function(XMLHttpRquest){
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })

            }

        });
        $("#Product_classification_img >ul >li img:first-child+a").click(function () {
            var type=$(this).text().trim();
            if(Imgtype.indexOf(type)!=-1){
                var $message = $("#forg_message").find("li:first");
                $message.empty();
                var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                    "<span> > </span><span>产品中心</span><span> > </span><span>"+type+"</span></a>");
                $message.append(content);
                set_tab_hover();
                window.scrollTo(0, 0);
                $("#product_item_title").text(type);
                $.ajax({
                    url:"get_ProductCenterfile1",
                    type:"post",
                    dataType:"json",
                    data:{type:Imgtype.indexOf(type)},
                    success:function(data){
                        $("#product_item_content").empty();
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if(data.code==0){
                                var content=$("<div></div>").append(data.data);
                                $("#product_item_content").append(content);
                                show_id("product_item");
                            }else if(data.code==2){//空的数据
                                layer.msg("没添加描述", {time: 1000, icon: 2});
                            }
                            else{
                                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });

                    },error:function(XMLHttpRquest){
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })

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
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
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
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("获取公司介绍内容失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                }
                else {
                    //空的数据
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取公司介绍内容失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取企业名字失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                        $("#business_news_item_title").text(title);
                        $("#business_news_item_content").empty();
                        var url;
                        if(type=="公司动态")
                            url="get_CompanyDynamics_contentByID1";
                        else if(type=="常见问题"){
                            url="get_CommonProblem_contentByID1";
                        }
                        else{
                            return ;
                        }
                        $.ajax({
                            url: url,
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {
                                if (data.code == 0) {
                                    $("#nav_extend").empty();
                                    var $content = $("<div><span>企业资讯</span></div>\n" +
                                        "                    <div>公司动态</div>\n" +
                                        "                    <div>常见问题</div>\n");
                                    $("#nav_extend").append($content);
                                    $("#nav_extend").css("display", "block");
                                    nav_extend_click();
                                    var $message = $("#forg_message").find("li:first");
                                    $message.empty();
                                    var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                                        "<span> > </span><span>企业资讯</span><span> > </span><span>公司动态</span></a>");
                                    $message.append(content);
                                    set_tab_hover();
                                    var content =$("<div></div>").append(data.data);
                                    $("#business_news_item_content").append(content);
                                    show_id("business_news_item");
                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }
                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        });
                    });
                }

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                        $("#business_news_item_title").text(title);
                        $("#business_news_item_content").empty();
                        var url;
                        if(type=="公司动态")
                            url="get_CompanyDynamics_contentByID1";
                        else if(type=="常见问题"){
                            url="get_CommonProblem_contentByID1";
                        }
                        else{
                            return ;
                        }
                        $.ajax({
                            url: url,
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {
                                if (data.code == 0) {
                                    $("#nav_extend").empty();
                                    var $content = $("<div><span>企业资讯</span></div>\n" +
                                        "                    <div>公司动态</div>\n" +
                                        "                    <div>常见问题</div>\n");
                                    $("#nav_extend").append($content);
                                    $("#nav_extend").css("display", "block");
                                    nav_extend_click();
                                    var $message = $("#forg_message").find("li:first");
                                    $message.empty();
                                    var content = $("<a><span class='glyphicon glyphicon-home'></span><span> 首页</span>" +
                                        "<span> > </span><span>企业资讯</span><span> > </span><span>常见问题</span></a>");
                                    $message.append(content);
                                    set_tab_hover();
                                    var content =$("<div></div>").append(data.data);
                                    $("#business_news_item_content").append(content);
                                    show_id("business_news_item");
                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }
                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        });
                    });
                }
            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("常见问题获取失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取视频失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
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