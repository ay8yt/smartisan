console.log("common.js加载")


define(["jquery", "template"], function ($, template) {

    function __myScroll() {
       
        if( $(this).scrollTop() >= 130 && $(".banner").css("paddingTop")!="16px"){
          
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
                if(window.localStorage.shopcar){
                    $(".shop").hide();
                    $("#shop-has").show();
                }else{
                    $(".shop").show();
                    $("#shop-has").hide();
                }
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
    }
    return {

        getCookie(key){
            var list = document.cookie.split("; ");
            
            for(var i  in list){
                if(list[i].indexOf(key) != -1){
                    return list[i].split("=")[1];
                }
            }
            return null;
        },


        init(){
           
            $(".body").load("../com_template/common.html",function(){
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
                $(".shopcar").click(function(){
                    window.open("http://localhost:8080/pages/shopCar/shopCar.html")
                })
                $(".shopcar").hover(function () {
                    if(window.localStorage.shopcar){
                       
                        $("#shop-has").load("../com_template/shopCar.html",function(){
                            
                            var data = JSON.parse(window.localStorage.shopcar);
                            data.sum = 0;
                            data.money = 0;
                            for(var i in data){
                                if( typeof(data[i]) == "object"){
                                   
                                    data.sum += data[i].num;
                                    data.money += data[i].price * data[i].num;
                                }
                            }
                            window.localStorage.shopcar = JSON.stringify(data);
                            var temp = template("shopCar",{
                                data : data
                            })
                            $("#shop-has").html(temp);
                        })




                        $(".shop").hide();
                        $("#shop-has").show();
                    }else{
                        $(".shop").show();
                        $("#shop-has").hide();
                    }
                    $(".con_shop").show();
                }, function () {
                    $(".con_shop").hide();
                })
                $(".con_shop").hover(function () {
                    $(".con_shop").show();
                }, function () {
                    $(".con_shop").hide();
                })
                $("#shop-has").on("click",".del",function(){

                    $(this).parent().slideUp(1000,function(){
                       var lenth =  $(this).siblings().length
                        $(this).remove();
                       
                        
                      if($("#shop-has ul li").length == 0){
                         
                        $("#shop-has").hide();
                        $(".shop").show();
                        window.localStorage.removeItem("shopcar");
                      }else{
                        var data = JSON.parse(window.localStorage.shopcar);
                        
                        var id = $(this).attr("shopid");
                        data.sum -= data[id].num;
                        console.log(data.money)
                        data.money -= data[id].num * data[id].price;
                        console.log(data[id].num,data[id].price)
                        delete data[id];
                        $(".sum-left div:eq(0) span").text(data.sum);
                        $(".gongji span:eq(2)").text(data.money);
                        window.localStorage.shopcar = JSON.stringify(data);
                      }
                    })
                })





            });
            
    
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
                        $("#temp_ul").load("../com_template/banner.html", function () {
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
                        $(".ban-right").load("../com_template/hot-word.html",function(){
                            var temp = template("hot_word", {
                                data: json
                            })
                           
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
                        $("#container").load("../com_template/goodlist.html",function(){
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
            })
       

            $(document).on("scroll",__myScroll); 
        
        },

        __myOff (){
            console.log("__myOff");
            $(document).off("scroll",__myScroll); 
        }
    }
})
