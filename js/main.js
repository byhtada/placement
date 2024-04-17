console.log( "window loaded" );

$( window ).on( "load", function() {
    console.log( "window loaded" );
});

$( document ).ready(function() {
    console.log( "window ready" );
    let cookie_name_token = "token"
    let cookie_token = getCookie(cookie_name_token);


    var api_url = "http://127.0.0.1:3000/";
    //api_url = "http://0.0.0.0:3000/";
   // api_url = "https://ro-api-2-delicate-wind-6834.fly.dev/";
    //api_url = "https://ro-api-fly.fly.dev/"
    let work_mode = 'dev'



    if (window.location.href.includes("teremok")) {
        work_mode = 'prod'
    }
    if (work_mode == 'prod') {
       // api_url = "https:dd//intense-chamber-90745-66882628bd57.herokuapp.com/"
       // api_url = "https://cc1d-2a00-f940-1-1-2-00-650.ngrok-free.app/"
    }


    let main_data = {}
    let start_time = 0


    let figures = [
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "me"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "mother"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "father"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "fire"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "sun"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "lightning"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "heart"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "money"},
        {x: null, y: null, size: 25, color: "black", position: "stand", name: "problem"},
    ]

    let current_figure = null


    //login()



    setTimeout(() => {
        document.getElementById("page_load").style.display = 'none'
        login()
    }, 1000)

    let updater_interval = null
    function startUpdater(){
        if (updater_interval !== null){
            clearInterval(updater_interval)
        }

        updater_interval = setInterval(() => {
            sendRequest('post', 'get_figures', {})
                .then(data => {
                    figures = data.figures
                    drawTable()
                })
                .catch(err => console.log(err))

        }, 2000)
    }

    document.getElementById('btn_live').addEventListener('click', function(){
        startUpdater()
    })


    function login(){


        start_time = +new Date();
        console.log("start_time ", start_time)
        console.log("cookie_token ", cookie_token)

        document.getElementById("page_load").style.display = 'none'
        document.getElementById("page_main").style.display = 'flex'
        return;
        if (typeof cookie_token == 'undefined' || cookie_token == 'undefined' || cookie_token == '') {
            document.getElementById("page_load").style.display = 'none'
            document.getElementById("page_register").style.display = 'flex'

            showRegPage(1)
        } else {
            //openAdminPage()
            getAllData()

        }
    }

    createTable()
    function createTable(){
        let times  = 9

        let html = ''

        for(let y = 0; y < times; y++){
            html += '<div class="row">'
            for(let x = 0; x < times; x++){
                html += `<div class="cell" data-x="${x}" data-y="${y}"><div class="dot"></div></div>`
            }

            html += '</div>'
        }

        document.getElementById('table').innerHTML = html

        onCellClick()


    }

    function drawTable(){
        figures.forEach(f => {
            if (f.x !== null){
                const cell = document.querySelector(`.cell[data-x="${f.x}"][data-y="${f.y}"]`)
                cell.innerHTML = `<img src="images/figures/${f.name}/${f.color}.svg"
                                       data-type="${f.name}"
                                       class="${f.position}"
                                       style="width: ${f.size}px; height: ${f.size}px; position: absolute;"/>`
            }
        })

        Array.from(document.querySelectorAll(".cell img")).forEach(function(element) {
            element.addEventListener('click', clickCellImg  )
        })
        function clickCellImg(){
            current_figure = this.getAttribute("data-type")
            setCurrentFigure()
        }
    }

    function onCellClick(){
        Array.from(document.getElementsByClassName("cell")).forEach(function(element) {
            element.addEventListener('click',  clickCell )
        })
        function clickCell(){

            console.log("this ", this)
            console.log("childElementCount ", this.childNodes[0].classList.contains("dot"))


            if (this.childNodes[0].classList.contains("dot")){
                if (current_figure !== null){
                    let f = getCurrentFigure()
                    f.x = this.getAttribute("data-x")
                    f.y = this.getAttribute("data-y")
                    updateTable()
                    current_figure = null

                    document.getElementById('div_figures').style.display = "flex"
                    document.getElementById('div_settings').style.display = "none"
                }
            } else {
                current_figure = this.childNodes[0].getAttribute("data-type")
                setCurrentFigure()
            }
        }
    }

    function updateTable(){
        createTable()
        drawTable()


        sendRequest('post', 'update_figures', {figures: figures})
            .then(data => {

            })
            .catch(err => console.log(err))
    }

    Array.from(document.querySelectorAll("#div_figures .figure")).forEach(function(element) {
        element.addEventListener('click',  onFigureClick );
    })
    function onFigureClick(){


        if (this.classList.contains("active") === true) {
            this.classList.remove("active")
            current_figure = null
            //Array.from(document.querySelectorAll("#div_figures .figure")).forEach(function(element) {
            //    element.style.display = "flex"
            //})

            document.getElementById("div_settings").style.display = "none"
            document.getElementById("div_figures").style.display = "flex"
        }

        if (this.classList.contains("active") === false){
            this.classList.add("active")
            current_figure = this.getAttribute("data-type")
            //Array.from(document.querySelectorAll("#div_figures .figure")).forEach(function(element) {
            //    element.style.display = "none"
            //})
            //this.style.display = "flex"

            document.getElementById("div_settings").style.display = "block"
            document.getElementById("div_figures").style.display = "none"

            setCurrentFigure()
        }
    }

    function getCurrentFigure(){
        return figures.filter((item) => item.name == current_figure)[0]
    }

    function setCurrentFigure(){
        let f = getCurrentFigure()

        const img =  document.querySelector('.settings_main img')
        img.setAttribute("src", `images/figures/${f.name}/${f.color}.svg`)

        img.style.width  = `${f.size}px`
        img.style.height = `${f.size}px`

        img.classList.remove("lies")
        if (f.position === "lies") {
            img.classList.add("lies")
        }

        document.getElementById("div_settings").style.display = "block"
        document.getElementById("div_figures").style.display = "none"
    }


    Array.from(document.getElementsByClassName("figure_color")).forEach(function(element) {
        element.addEventListener('click', changeFigureColor )
    })
    function changeFigureColor(){
        let f = getCurrentFigure()
        f.color = this.getAttribute("data-color")

        setCurrentFigure()
        updateTable()
    }



    Array.from(document.getElementsByClassName("figure_size")).forEach(function(element) {
        element.addEventListener('click', changeFigureSize )
    })
    function changeFigureSize(){
        let f  = getCurrentFigure()
        if (this.getAttribute("data-type") === "minus") {
            f.size -= 5
        } else {
            f.size += 5
        }

        if (f.size > 70) { f.size = 70 }
        if (f.size < 5)  { f.size = 5 }

        setCurrentFigure()
        updateTable()
    }


    Array.from(document.getElementsByClassName("figure_position")).forEach(function(element) {
        element.addEventListener('click', changeFigurePosition )
    })
    function changeFigurePosition(){
        let f  = getCurrentFigure()
        f.position = this.getAttribute("data-type")

        setCurrentFigure()
        updateTable()
    }



    document.getElementById('btn_back').addEventListener('click', function(){
        document.getElementById('div_figures').style.display = "flex"
        document.getElementById('div_settings').style.display = "none"
    })
    document.getElementById('btn_clean').addEventListener('click', function(){
        let f = getCurrentFigure()
        f.x = null
        f.y = null
        updateTable()
    })
    document.getElementById('btn_clean_table').addEventListener('click', function(){

        figures.forEach(f => {
            f.x = null
            f.y = null
            f.size = 25
            f.color = "black"
            f.position = "stand"
        })

        updateTable()
    })



    function showMainPage(page){
        $('.parent_page').css('display', 'none')

        if (page == "") {
            page = "main";
        }

        if (page == "shop"){

        }

        $('.icon_main')    .addClass("inactive");
        $('#nav_icon_main')    .attr("src", "img/nav/no_active/icon_main.svg");
        $('#nav_icon_games').attr("src", "img/nav/no_active/icon_games.svg");
        $('#nav_icon_wisdom')   .attr("src", "img/nav/no_active/icon_wisdom.svg");
        $('#nav_icon_diary')    .attr("src", "img/nav/no_active/icon_diary.svg");
        $('#nav_icon_shop')      .attr("src", "img/nav/no_active/icon_shop.svg");


        var icon_id   = 'nav_icon_' + page;
        var icon_path = 'img/nav/active/icon_' + page + '.svg?v2.51';
        $('#' + icon_id)   .attr("src", icon_path);

        document.body.style.background = ` #0e0e0e  url("../img/page_back/${page}.png") no-repeat`

        $(`.parent_page[data-page="${page}"]`).css("display", "block")
        window.scrollTo(0,0);


        //let div = document.getElementById('div_progress')
        //div.classList.remove("animate__slideInDown")
        //div.classList.remove("animate__slideOutUp")
        //if (page == "main"){
        //    div.classList.add("animate__slideInDown")
        //}else {
        //    div.classList.add("animate__slideOutUp")
        //}

    }



    function parseTime(str){
        let date = str.split("T")[0].split("-")
        let time = str.split("T")[1].split(":")

        return time[0] + ":" + time[1] + " " + date[2] + "." + date[1] + "." + date[0]
    }




    function showAlert(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(2000).fadeOut(3000);
    }
    function showAlertLong(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(8000).fadeOut(3000);
    }



    function parse_query_string() {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

        return hashParams;

        // if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
//
        //     var key = false, res = {}, itm = null;
        //     // get the query string without the ?
        //     var qs = location.search.substring(1);
        //     // check for the key as an argument
        //     if (arguments.length > 0 && arguments[0].length > 1)
        //         key = arguments[0];
        //     // make a regex pattern to grab key/value
        //     var pattern = /([^&=]+)=([^&]*)/g;
        //     // loop the items in the query string, either
        //     // find a match to the argument, or build an object
        //     // with key/value pairs
        //     while (itm = pattern.exec(qs)) {
        //         if (key !== false && decodeURIComponent(itm[1]) === key)
        //             return decodeURIComponent(itm[2]);
        //         else if (key === false)
        //             res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
        //     }
//
        //     return key === false ? res : null;
        // } else {
//
        //     var url_string = window.location.href; //window.location.href
        //     var url = new URL(url_string);
        //     var query = url.hash.replace('#', '');
        //     var vars = query.split("&");
        //     var query_string = {};
        //     for (var i = 0; i < vars.length; i++) {
        //         var pair = vars[i].split("=");
        //         var key = decodeURIComponent(pair[0]);
        //         var value = decodeURIComponent(pair[1]);
        //         // If first entry with this name
        //         if (typeof query_string[key] === "undefined") {
        //             query_string[key] = decodeURIComponent(value);
        //             // If second entry with this name
        //         } else if (typeof query_string[key] === "string") {
        //             var arr = [query_string[key], decodeURIComponent(value)];
        //             query_string[key] = arr;
        //             // If third or later entry with this name
        //         } else {
        //             query_string[key].push(decodeURIComponent(value));
        //         }
        //     }
        //     return query_string;
        // }


    }



    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }



    function checkOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    function setCookie(name, value, days = 1600) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
    //window.addEventListener("hashchange", function(e) {
    //    if(e.oldURL.length > e.newURL.length)
    //        $('#logo').click();
    //});


    if (!navigator.cookieEnabled) {
        showAlert(alert_enable_cookies);
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }


    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
            os = 'ios';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'ios';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }


    function formatNum(num, empty_if_null = false){

        const string = num.toString()
        const array = string.split("").reverse()

        let new_array = []
        array.forEach((element, i) => {

            new_array.push(element)
            if ([2,5,8,11].includes(i)) {
                new_array.push(" ")
            }
        });

        if (empty_if_null && num == 0) {
            new_array = [""]
        }

        if (isNaN(num)) {
            new_array = [0]
        }

        return new_array.reverse().join("")
    }


    function sendRequest(type, url, body = null) {
        const headers = {
            'Authorization': 'Token token=' + cookie_token,
            'Content-type': 'application/json',
        }

        return fetch(`${api_url}${url}`, {
            method: type,
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            return response.json()
        })
    }

});
