console.log("config加载")

requirejs.config({
    baseUrl : "http://localhost:8080",
    paths : {
        "jquery" : "https://cdn.bootcss.com/jquery/2.1.0/jquery.min",
        "Swiper" : "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/js/swiper",
        "template" : "/js/template-web",
        "common" : "/js/common/common",
        "register" : "pages/registerAndLand/register",
        "land" : "pages/registerAndLand/land"
    }
})