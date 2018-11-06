console.log("t.js加载")

require(["../../js/config"], function () {
    require(["jquery", "Swiper", "template","common"], function ($, Swiper, template,init) {
        $(function () {
           
            //idnex页面数据
            let homeMap = new Map();

            //tag数据
            let jList = null;
            let contTag = [];

            //页面top ,bottom 初始化
            init.init();
            
            let p1 = new Promise(function(resolve){
                $.ajax({
                    url : "http://localhost:8080/api/home",
                    dataType : "json",
                    timeout:10000,
                    success : function(json){
                        for(var i in json.data){
                            homeMap.set(i,json.data[i])
                        }
                        resolve();
                    }
                })
            })

            let p2 = new Promise(function(resolve){
                $.ajax({
                    url : "http://localhost:8080/api/tag",
                    dataType : "json",
                    timeout:10000,
                    success:function(json){
                        jList = json.data.list;
                        resolve();
                    }
                })
            })
           
            Promise.all([p1,p2]).then(function(){
                // 轮播图
                $(".con-swiper").load("template/swiper.html",function(){
                  
                    var temp = template("swiper_cen",{
                        data : homeMap.get("home_carousel")
                    });
                    $(".con-swiper").html(temp);

                    var mySwiper = new Swiper('.swiper-container', {
                        noSwiping: true,
                        autoplay: {
                            delay: 5000
                        },
                        preventInteractionOnTransition: true,
                        effect: 'fade',
        
                        fadeEffect: {
                            crossFade: false,
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true
                        }
                    })
                })

                //home-box 4格图
                $(".home-box").load("template/home_box.html",function(){
                    var temp = template("home-box",{
                        data : homeMap.get("home_activities")
                    });
                    $(".home-box").html(temp);
                    if($(".home-box").offset().top>=$(window).height()){
                        $(".home-box").find("a").css("opacity","0");
                    }
                })

                //热卖商品数据整理
                let homeHot = homeMap.get("home_hot");
                for(var i in homeHot){
                    var flag = true;
                    for(var j in jList ){
                        if(jList[j].rule.condition.main_skus.indexOf(Number(homeHot[i].sku_id)) != -1 ){
                            var temp = homeHot.sku_id;
                            flag = false;
                            contTag.push({
                                temp : [homeHot[i],jList[j]]
                            })
                            break;
                        }
                    }
                    if(flag){
                        contTag.push({
                            temp : [homeHot[i]]
                        })
                    }
                }
                
                //热卖商品
                $(".home-hot-shop").load("template/home_hot_shop.html",function(){
                    var temp = template("home-hot-shop",{
                        data : contTag
                    });
                    $(".home-hot-shop").html(temp);

                    if($(".home-hot-shop").find(".con-ul").children("ul").css("left") == "0px"){
                        $(".for-left").addClass("a-disabled");
                    }
                    $('.home-page').on("click","a",function(){
                        $('.home-page').children("a").removeClass("a-disabled");
                        $(this).addClass("a-disabled");
                        if(($(this).attr("class")+"").indexOf("right") != "-1"){
                           $(".home-hot-shop").find(".con-ul").children("ul").animate({left:-1220},500);
                        }
                        else{
                            $(".home-hot-shop").find(".con-ul").children("ul").animate({left:0},500);
                        }
                    })
                    //图片按钮切换 li_hover_hot_shop li_hover
                    $(".li_hover_hot_shop").hover(function() {
                        $(this).find('h6').eq(0).hide().end().eq(1).show();
                        $(this).find(".money").hide();
                        $(this).find("button").css("display","block");
                    },function() {
                        $(this).find('h6').eq(0).show().end().eq(1).hide();
                        $(this).find(".money").show();
                        $(this).find("button").hide();
                    })
                    //切换图片 e.stoppropagation
                    $(".li_hover_hot_shop").on("click",".ck_li",function(e){
                       
                        e.stopPropagation();
                        $(this).siblings().removeClass("li-active");
                        $(this).addClass("li-active");
                        var _j = $(this).attr("id");
                        var _i = $(this).attr("dataI");
                        var _image = contTag[_i].temp[0].spu.sku_info[_j].ali_image;
                        var _price = contTag[_i].temp[0].spu.sku_info[_j].price;
                        $(this).parent().parent().parent().parent().attr("href","http://localhost:8080/pages/detail/detail.html?spu="+contTag[_i].temp[0].spu.sku_info[_j].sku_id)
                        $(this).parent().parent().parent().find(".money").find("span").eq(1).text(_price)
                        $(this).parent().parent().parent().find(".com-img").find("img").attr("src",_image+"?x-oss-process=image/resize,w_216/format,webp");
                        
                    })
                    $(".li_hover_hot_shop").click(function(e){
                        window.open($(this).attr("href"));
                    })
                    if($(".home-hot-shop").offset().top>=$(window).height()){
                        $(".home-hot-shop").find(".box-item").css("opacity","0");
                    }
                }) 

                function h_box_item(){
                    if($(window).scrollTop()+$(window).height() >= $(".home-hot-shop").offset().top){
                        $(".home-hot-shop").find(".box-item").stop().animate({opacity:1},1500)
                    }
                    if( $(".home-hot-shop").find(".box-item").css("opacity")==1){
                        $(window).off("scroll",h_box_item);
                    }
                }
                $(window).on("scroll",h_box_item);
               
                //home-floor整理
                let homeFloors = homeMap.get("home_floors");
                for(var i in homeFloors){
                    for(var tab =0; tab<homeFloors[i].tabs.length;tab++){
                        for(var item = 1;item<homeFloors[i].tabs[tab].tab_items.length;item++){
                            var flag = true;
                            for(var j in jList ){
                                if(jList[j].rule.condition.main_skus.indexOf(Number(homeFloors[i].tabs[tab].tab_items[item].sku_id)) != -1 ){
                                    flag = false;
                                    // var temp = homeFloors[i].tabs[tab].tab_items[item].sku_id;
                                    homeFloors[i].tabs[tab].tab_items[item].tag = jList[j];
                                    break;
                                }
                            }
                            if(flag){
                                homeFloors[i].tabs[tab].tab_items[item].tag = "null";
                            }
                        }
                    }
                }

                //homer-floor生成
                $(".con-floor").load("template/home_floor.html",function(){
                    var temp = template("home_floor",{
                        data : homeFloors
                    });
                    $(".con-floor").html(temp);
                     //图片按钮切换
                     $(".li_hover").hover(function() {
                        $(this).find('h6').eq(0).hide().end().eq(1).show();
                        $(this).find(".money").hide();
                        $(this).find("button").css("display","block");
                    },function() {
                        $(this).find('h6').eq(0).show().end().eq(1).hide();
                        $(this).find(".money").show();
                        $(this).find("button").hide();
                    })
                    //切换图片 e.stoppropagation
                    $(".li_hover").on("click",".ck_li",function(e){
                       
                        e.stopPropagation();
                        $(this).siblings().removeClass("li-active");
                        $(this).addClass("li-active");
                        var _id = $(this).attr("id");
                        var _item = $(this).attr("item");
                        var _data = $(this).attr("data");
                        var _tabs = $(this).attr("tabs");

                        console.log(homeFloors)
                        var _image = homeFloors[_data].tabs[_tabs].tab_items[_item].spu.sku_info[_id].ali_image;
                        var _price = homeFloors[_data].tabs[_tabs].tab_items[_item].spu.sku_info[_id].price;
                        $(this).parent().parent().parent().parent().attr("href","http://localhost:8080/pages/detail/detail.html?spu="+homeFloors[_data].tabs[_tabs].tab_items[_item].spu.sku_info[_id].sku_id)
                        $(this).parent().parent().parent().find(".money").find("span").eq(1).text(_price)
                        $(this).parent().parent().parent().find(".com-img").find("img").attr("src",_image+"?x-oss-process=image/resize,w_216/format,webp");
                        
                    })
                    $(".li_hover").click(function(e){
                        // console.log($(this).attr("href"))
                         window.open($(this).attr("href"));
                    })

                    $(".home_floors").each(function(keys,values){
                        if($(values).find(".floors-page").length > 0){
                            $(values).find(".floors-page").find("a").eq(0).addClass("a_hover");
                        
                            $(values).find(".floors-page").find("a").hover(function(e){
                               
                                $(this).siblings().removeClass("a_hover");
                                $(this).addClass("a_hover");
                                if($(this).index()==0){
                                  
                               
                                    $(this).parent().parent().siblings().children("ul").eq(0).css("display","none");
                                    $(this).parent().parent().siblings().children("ul").eq(1).css("display","block");
                                }else{
                                
                                    $(this).parent().parent().siblings().children("ul").eq(0).css("display","block");
                                    $(this).parent().parent().siblings().children("ul").eq(1).css("display","none");
                                    
                                }
                            })
                        }
                        if($(values).offset().top>=$(window).height()){
                            $(values).find(".box-item").children().css("opacity","0");
                            $(values).find("li").eq(0).find("img").css("opacity","0");
                        }
                    })
                    
                   
                })
                
                console.log(homeMap)

                //底部四格图 home-box4格图
                $(".floot-box").load("template/home_box.html",function(){
                    var temp = template("home-box",{
                        data : homeMap.get("home_dynamic")
                    });
                    $(".floot-box").html(temp);
                    if($(".floot-box").offset().top>=$(window).height()){
                        $(".floot-box").find("a").css("opacity","0");
                    }
                })

                function flootScroll(){
                    if($(window).scrollTop()+$(window).height() >=  $(".floot-box").offset().top){
                        $(".floot-box").find("a").stop().animate({opacity:1},500)
                    }
                    if( $(".floot-box").find("a").css("opacity") == 1){
                        $(window).off("scroll",flootScroll);
                    }
                }
                $(window).on("scroll",flootScroll);

                //锤子应用
                $(".yy").load("template/t_yingtong.html",function(){
                    if($(".yy").offset().top>=$(window).height()){
                        $(".yy").find("li").css("opacity","0");
                    }
                })

                function yyScroll(){
                    if($(window).scrollTop()+$(window).height() >=  $(".yy").offset().top){
                        $(".yy").find("li").stop().animate({opacity:1},500)
                    }
                    if($(".yy").find("li").css("opacity") == 1){
                        $(window).off("scroll",yyScroll);
                    }
                }
                $(window).on("scroll",yyScroll);

                //论坛
                $(".lt").load("template/lt.html",function(){
                    var temp = template("lt",{
                        data : homeMap.get("home_forum")
                    })
                    $(".lt").html(temp);
                    if($("#parviteScroll").offset().top>=$(window).height()){
                        $("#parviteScroll").find(".cont").css("opacity","0");
                    }
                })

                function ltScroll(){
                    if($(window).scrollTop()+$(window).height() >=   $(".lt").offset().top){
                        $("#parviteScroll").find(".cont").stop().animate({opacity:1},500)
                    }
                    if( $("#parviteScroll").find(".cont").css("opacity") == 1){
                        $(window).off("scroll",ltScroll);
                    }
                }
                $(window).on("scroll",ltScroll);

                //4格小框
                function homeBox(){
                    $(".home-box").each(function(key,value){
                        if($(window).scrollTop()+$(window).height() >= $(value).offset().top){
                            $(value).find("a").stop().animate({opacity:1},500)
                        }
                    })
                    if($(".home-box").eq($(".home-box").length-1).find("a").css("opacity")==1){
                        $(window).off("scroll",homeBox)
                    }
                }
                $(window).on("scroll",homeBox);

                //home-floor
                function home_floor(){
                    $(".home_floors").each(function(keys,values){
                        if($(window).scrollTop()+$(window).height() >= $(values).offset().top){
                            $(values).find(".box-item").children().stop().animate({opacity:1},500);
                            $(values).find("li").eq(0).find("img").stop().animate({opacity:1},500);
                        }
                    })
                    if($(".home_floors").eq($(".home_floors").length-1).find("li").eq(0).find("img").css("opacity")==1){
                        $(window).off("scroll",home_floor)
                    }
                }
                $(window).on("scroll", home_floor);
            })  
        })
    })
})