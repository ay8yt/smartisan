console.log("t.js加载")

require(["config"], function () {
    require(["jquery", "Swiper", "template"], function ($, Swiper, template) {

        $(function () {
            $(".body").load("template/common.html",function(){
                console.log(1)
            });

            $("#serch").blur(function () {
                $(this).attr("placeholder", "");
            })

            $("#serch").bind("focus", function () {
                $(this).attr("placeholder", "请输入搜索的商品");
            })
            $(".user").hover(function () {
                $(".con_use").show();
            }, function () {
                $(".con_use").hide();
            })
            $(".con_use").hover(function () {
                $(".con_use").show();
            }, function () {
                $(".con_use").hide();
            })
            $(".shopcar").hover(function () {
                $(".con_shop").show();
            }, function () {
                $(".con_shop").hide();
            })
            $(".con_shop").hover(function () {
                $(".con_shop").show();
            }, function () {
                $(".con_shop").hide();
            })

            init();
            function init() {
                $(".center").css("min-height", $(window).height()-45);
            }
            new Promise(function (resolve) {
                $.ajax({
                    timeout: 5000,
                    url: "http://localhost:8080/api/shop",
                    dataType: "json",
                    success: function (json) {
                        $("#temp_ul").load("template/banner.html", function () {
                            var temp = template("banner", {
                                data: json.data.list
                            })
                            $("#temp_ul").html(temp);
                            if (location.href == "http://localhost:8080/") {
                                $("#temp_ul").find("li").eq(0).find("a").css({
                                    "font-weight": "bold",
                                    "color": "#333"
                                });
                            } 
                        })
                        resolve();
                    }
                })

                $.ajax({
                    url : "http://localhost:8080/api/hotWord",
                    timeout: 5000,
                    dataType :"json",
                    success : function(json){
                        $(".ban-right").load("template/hot-word.html",function(){
                            var temp = template("hot_word", {
                                data: json
                            })
                            console.log(json);
                            $(".ban-right").html(temp);
                        })
                    }
                })
            }).then(function () {
               
                $.ajax({
                    timeout: 10000,
                    url: "http://localhost:8080/api/phone",
                    dataType: "json",
                    success : function(json){
                        $("#container").load("template/goodlist.html",function(){
                            var temp = template("goodlistTemp", {
                                data: json.data.list
                            })
                            $("#container").html(temp);
                            $("#temp_ul").find("li").eq(1).mouseover(function () {
                                $(".goodlist").stop().show().css("top",$(".banner").outerHeight()).animate({ height: 300 }, 500);
                            })
                            var  tempTimer =null;
                            $("#temp_ul").find("li").eq(1).mouseleave(function () {
                              tempTimer =  setTimeout(function(){
                                    $(".goodlist").stop().animate({ height: -0 }, 500,function(){
                                        $(".goodlist").hide();
                                    })
                              },100)
                            })
                            $(".goodlist").mouseenter(function(){
                                clearTimeout( tempTimer);
                                console.log(616)
                                $(".goodlist").stop().show().animate({ height: 300 }, 500);
                            })
                        })
                    }
                })
                var mySwiper = new Swiper('.swiper-container', {
                    noSwiping: true,
                    autoplay: {
                        delay: 1000
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

            // var _css=   $("<link>");
            // _css.attr("rel","stylesheet");
            // _css.attr("href","css/a.css");
            // _css.attr("type","text/css");
            // _css.appendTo(document.head);

            $(document).scroll(function(){
                if( $(this).scrollTop() >= 130 && $(".banner").css("paddingTop")!="16px"){
                    console.log(1)
                    $(".banner").hide().css({
                        position : "fixed",
                        top : -60,
                        paddingTop : 16 ,
                        paddingBottom : 16 
                    }).show().animate({top:0},500);
                    $(".ban-right").hide();
                    $(".head").find(".right").clone().appendTo(".ban");
                    $(".user").hover(function () {
                        $(this).parent().find(".con_use").show();
                    }, function () {
                        $(".con_use").hide();
                    })
                    $(".con_use").hover(function () {
                        $(this).show();
                    }, function () {
                        $(".con_use").hide();
                    })
                    $(".shopcar").hover(function () {
                        $(this).parent().find(".con_shop").show();
                    }, function () {
                        $(".con_shop").hide();
                    })
                    $(".con_shop").hover(function () {
                        $(this).show();
                    }, function () {
                        $(".con_shop").hide();
                    })
                }
                else if( $(this).scrollTop() <= 130 && $(".banner").css("paddingTop")=="16px"){
                    $(".banner").css({
                        position : "absolute",
                        top : 45,
                        paddingTop : 23 ,
                        paddingBottom : 23 
                    });
                    $(".ban-right").show();
                    $(".banner").find(".right").remove();
                }
               
                
            })
        })
    })
})