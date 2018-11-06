let gulp = require("gulp");
let minifyJS = require("gulp-babel-minify");
let minifyCSS = require("gulp-clean-css");
let sass = require("gulp-sass");
let https = require("https");
let zlib = require("zlib");
var url = require("url");

//构建项目
gulp.task("build", function () {
    gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./dist"));
    gulp.src("./src/**/*.js")
        .pipe(minifyJS())
        .pipe(gulp.dest("./dist"));
    gulp.src("./src/**/*.css")
        .pipe(minifyCSS())
        .pipe(gulp.dest("./dist"));
    return gulp.src("./src/img/**/*.*")
        .pipe(gulp.dest("./dist/img"));
})

gulp.task("refreshHTML", function () {
    gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./dist"))
})

gulp.task("refreshJS", function () {
    gulp.src("./src/**/*.js")
        .pipe(minifyJS())
        .pipe(gulp.dest("./dist"));
})

gulp.task("refreshCSS", function () {
    gulp.src("./src/**/*.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .on("error", sass.logError)
        .pipe(gulp.dest("./src"))
        .pipe(minifyCSS())
        .pipe(gulp.dest("./dist"));
})



//代理服务器
gulp.task("proxyServer", function () {
    var express = require("express");
    var app = express();
    app.use(express.static("dist"));

    //获取商品类目
    app.use("/api/shop", function (req, res) {
        //注意这里使用了https发起请求，因为原网站是https的
        let proxy = https.request({
            hostname: "www.smartisan.com",
            path: "/product/shop_categories",
            method: "get"
        }, (response) => {
            response.pipe(res);
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();
    });

    //获取首页商品数据
    app.use("/api/home", function (req, res) {
        res.setHeader("Content-Type", "text/plain; charset=utf8");
        let proxy = https.request({
            hostname: "www.smartisan.com",
            path: "/product/home",
            method: "get"
        }, (response) => {
            //这里返回的数据之所以特殊处理是因为
            //原网站因为返回数据量过大，采用了压缩格式
            //因此对返回头进行判断，若是压缩数据，则进行解压操作
            if (response.headers["content-encoding"].indexOf("gzip") != -1) {
                response
                    .pipe(zlib.createGunzip())
                    .pipe(res);
            }
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();
    });

    //手机列表
    app.use("/api/phone", function (req, res) {
        res.setHeader("Content-Type", "text/plain; charset=utf8");
        let proxy = https.request({
            hostname: "www.smartisan.com",
            path: "/product/skus?ids=100051701,100046401,100040601,100047901,100035101&with_stock=true&with_spu=true",
            method: "get"
        }, (response) => {
            response.pipe(res);
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();

    });

    //商品列表
    app.use("/api/more", function (req, res) {
        var atg = url.parse(req.url)
        //console.log(atg.href);

        res.setHeader("Content-Type", "text/plain; charset=utf8");

        let proxy = https.request({
            hostname: "www.smartisan.com",
            path: "/product" + atg.href,
            method: "get"
        }, (response) => {
            response.pipe(res);
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();

    });


    //热搜词汇
    app.use("/api/hotWord", function (req, res) {

        let proxy = https.request({
            hostname: "shopapi.smartisan.com",
            path: "/v1/search/hot-words",
            method: "get"
        }, (response) => {
            response.pipe(res);
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();
    });

    //周边数码产品
    app.use("/api/tag", function (req, res) {
        res.setHeader("Content-Type", "text/plain; charset=utf8");
        let proxy = https.request({
            hostname: "www.smartisan.com",
            path: "/product/promotions?with_num=true",
            method: "get"
        }, (response) => {
            response.pipe(res);
        });
        proxy.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });
        proxy.end();
    });

    //启动服务
    var server = app.listen(8080, function () {
        console.log("http://localhost:8080");
        //监听文件变化
        gulp.watch("./src/**/*.html", ["refreshHTML"]);
        gulp.watch("./src/**/*.js", ["refreshJS", "refreshHTML"]);
        gulp.watch("./src/**/*.scss", ["refreshCSS", "refreshHTML"]);
    })
})