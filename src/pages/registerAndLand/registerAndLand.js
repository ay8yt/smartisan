require(["../../js/config.js"],function(){
    require(["jquery"],function($,common){
        $(function(){
            var str = location.href.split("=")[1];
         
            console.log(str);
            if(str == "land"){
                var _link = $("<link>");
                _link.attr("href","../../css/pages/registerAndLand/register.css");
                _link.attr("rel","stylesheet");
                _link.attr("type","text/css")
                _link.appendTo("head");
                
                $(".form").load("template/register.html",function(){
                    require(["register"],function(run){
                        run.run();
                    })
                })
                console.log(1);
            }else{
                var _link = $("<link>");
                _link.attr("href","../../css/pages/registerAndLand/land.css");
                _link.attr("rel","stylesheet");
                _link.attr("type","text/css")
                _link.appendTo("head");
                $(".form").load("template/land.html",function(){
                    require(["land"],function(run){
                        run.run();
                    })
                })
              
            }

        })
    })
})