console.log( "window loaded" );

$( window ).on( "load", function() {
    console.log( "window loaded" );
});

$( document ).ready(function() {
    console.log( "window ready" );
    let cookie_name_token = "token"
    let cookie_token = getCookie(cookie_name_token);


    var api_url = "http://127.0.0.1:3000/";
    api_url = "https://roapi2-production.up.railway.app/";
//    //api_url = "https://cc1d-2a00-f940-1-1-2-00-650.ngrok-free.app/"
    let work_mode = 'dev'
    if (window.location.href.includes("teremok")) {
        work_mode = 'prod'
    }
    if (work_mode == 'prod') {
        api_url = "https://intense-chamber-90745-66882628bd57.herokuapp.com/"
       // api_url = "https://cc1d-2a00-f940-1-1-2-00-650.ngrok-free.app/"
    }


    let main_data = {}
    let start_time = 0


    //login()



    setTimeout(() => {
        document.getElementById("page_load").style.display = 'none'
        login()
    }, 1000)



    function login(){
        start_time = +new Date();
        console.log("start_time ", start_time)
        console.log("cookie_token ", cookie_token)

        if (typeof cookie_token == 'undefined' || cookie_token == 'undefined') {
            document.getElementById("page_load").style.display = 'none'
            document.getElementById("page_register").style.display = 'flex'
            document.querySelector(".reg_pages[data-page='1']").style.display = 'block'
        } else {
            document.getElementById("page_load").style.display = 'none'
            document.getElementById("page_register").style.display = 'flex'
            document.querySelector(".reg_pages[data-page='3']").style.display = 'block'
        }
    }


    Array.from(document.getElementsByClassName("btn_register")).forEach(function(element) {
        element.addEventListener('click', clickBtnRegister  )
    })


    const input_name     = document.getElementById("user_name")
    const input_phone    = document.getElementById("user_phone")

    const input_tg = document.getElementById("user_tg")
    const input_vk = document.getElementById("user_vk")
    input_name.value  = "2"
    input_phone.value = "2"
    input_tg.value    = "2"
    input_vk.value    = "2"

    function clickBtnRegister(){
        const current_page = parseInt(this.parentElement.getAttribute("data-page"))


        if (current_page == 1){
            if (input_name.value == "" || input_phone.value == "") {
                document.getElementById("div_reg_alert_1").style.display = "block"
                return;
            }
        }
        if (current_page == 2){
            if (input_tg.value == "" || input_vk.value == "" ) {
                document.getElementById("div_reg_alert_2").style.display = "block"
                return;
            } else {
                createUser()
            }
        }

        Array.from(document.getElementsByClassName("reg_pages")).forEach(function(element) {
            element.style.display = "none"
        })
        document.querySelector(`.reg_pages[data-page="${current_page + 1}"]`).style.display = "block"


    }



    function createUser(){

        let body = {
            name: input_name.value,
            phone: input_phone.value,
            tg: input_tg.value,
            vk: input_vk.value,
        }

        const headers = {
            'Authorization': 'Token token=123',// + cookie_token,
            'Content-type': 'text/plain',
        }

        fetch(`${api_url}create_user`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            setCookie(cookie_name_token, "1")
            console.log(response.json())
        })
    }

    async function getAllData(){

        sendRequest('post', 'get_all_data', {})
            .then(data => {
                main_data = data

                showStartPage()

            })
            .catch(err => console.log(err))

    }














    let last_page = "main"
    $(document).on('click', '.nav_bottom',  function () {
        $('.nav_bottom').removeClass("active")

        $(this).addClass("active")
        $('.nav_bottom.active div').css("display", "block")
        last_page = $(this).attr("data-page");

        showMainPage(last_page);
        window.history.pushState(last_page, "another page", "#" + last_page);
        addAction(`nav_bottom ${this.getAttribute("data-page")}`)
    });

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





    function checkRegister(){
        let result = true

        if (main_data.user.phone == ""){
            document.getElementById("page_parent").style.display = 'none'
            document.getElementById("page_register").style.display = 'flex'

            addAction("open_register_page")

            result = false
        }

        return result
    }




    function showAlert(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(2000).fadeOut(3000);
    }
    function showAlertLong(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(8000).fadeOut(3000);
    }



    function showError(){
        var error_text = "";
        var userLang = window.navigator.language;
        var lang = userLang.split("-")[0];

        if (main_data === "") {
            switch (lang){
                case 'ru':
                    error_text = " Если Вы видете это окно, то видимо возникли какие-то трудности :(\n" +
                        "        <br><br>Попробуйте следующие шаги в такой последовательности:\n" +
                        "        <br>1. Проверьте подключение к интернету\n" +
                        "        <br>2. Если интернет работает, но вы все ещё видите это - очистите кэш и файлы cookies браузера (или переустановите его)\n" +
                        "        <br>3. Если п1,2. не сработали - пишите @aashesh(Telegram)<br>. К сообщению сразу прикрепляйте свою почту\n";

                    break;
                case 'en':
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";
                    break;

                default:
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";

                    break;
            }

            $('#div_error').empty().append(error_text).show();

        }

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
            'Authorization': 'Token token=123',// + cookie_token,
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
