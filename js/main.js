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
    api_url = "https://ro-api-fly.fly.dev/"
    let work_mode = 'dev'


    const input_name     = document.getElementById("user_name")
    const input_phone    = document.getElementById("user_phone")
    const input_password    = document.getElementById("user_password")

    const input_messenger    = document.getElementById("user_messenger")
    const input_social_media = document.getElementById("user_social_media")
    input_name.value  = "2"
    input_phone.value = "2"
    input_messenger.value    = "2"
    input_social_media.value    = "2"

    if (window.location.href.includes("teremok")) {
        work_mode = 'prod'
    }
    if (work_mode == 'prod') {
       // api_url = "https:dd//intense-chamber-90745-66882628bd57.herokuapp.com/"
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

        if (typeof cookie_token == 'undefined' || cookie_token == 'undefined' || cookie_token == '') {
            document.getElementById("page_load").style.display = 'none'
            document.getElementById("page_register").style.display = 'flex'

            showRegPage(1)
        } else {
            //openAdminPage()
            getAllData()

        }
    }


    document.getElementById('btn_register_1').addEventListener('click', function(){
        if (input_name.value == "" || input_phone.value == "" || input_password.value == "") {
            document.getElementById("div_reg_alert_1").style.display = "block"
            return;
        }


        const headers = {
            'Authorization': 'Token token=123',// + cookie_token,
            'Content-type':  'application/json',
        }

        let body = {
            name:     input_name.value,
            phone:    input_phone.value,
            password: input_password.value,
        }


        fetch(`${api_url}reg_user`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        }).then( response => response.json() )
            .then( data => {
                console.log(data)
                cookie_token = data.token
                setCookie(cookie_name_token, cookie_token, 3600)


                showRegPage(2)

            })
            .catch( error => console.error('error:', error) );
    })

    document.getElementById('btn_register_2').addEventListener('click', function(){
        if (input_messenger.value == "" || input_social_media.value == "" ) {
            document.getElementById("div_reg_alert_2").style.display = "block"
            return;
        }


        sendRequest('post', 'reg_step_2', {
            messenger:     input_messenger.value,
            social_media:  input_social_media.value,
        })
            .then(data => {
                showRegPage(3)
            })
            .catch(err => console.log(err))

    })


    let test_questions = [
        {question: "Вопрос 1",
         answers:  [{text: "Ответ 1", result: 0},
                    {text: "Ответ 2", result: 0},
                    {text: "Ответ 3!", result: 1},
                    {text: "Ответ 4", result: 0}]
        },
        {question: "Вопрос 2",
         answers:  [{text: "Ответ 1", result: 0},
                    {text: "Ответ 2", result: 0},
                    {text: "Ответ 3!", result: 1},
                    {text: "Ответ 4", result: 0}]
        },
        {question: "Вопрос 3",
         answers:  [{text: "Ответ 1", result: 0},
                    {text: "Ответ 2", result: 0},
                    {text: "Ответ 3!", result: 1},
                    {text: "Ответ 4", result: 0}]
        },
    ]
    let test_num    = 0
    let test_result = 0

    document.getElementById('btn_register_3').addEventListener('click', function(){
        showRegPage(4)
        setNewTestQuestion()
    })

    function setNewTestQuestion(){
        if (test_num == test_questions.length){
            let result = 100 * test_result / test_questions.length
            if (result >= 80){
                sendRequest('post', 'reg_test', {test_result: result})
                    .then(data => {  })
                    .catch(err => console.log(err))
                showRegPage(5)
            } else {
                alert("Ваше результат менее 80%, пройдите тест ещё раз")
                test_num    = 0
                test_result = 0
                setNewTestQuestion()
            }

            return
        }


        let current = test_questions[test_num]

        document.getElementById("reg_question_text").innerText = current.question

        let html = ''
        current.answers.forEach(item => {
            html += `<div class="test_answer" data-result="${item.result}">${item.text}</div>`
        })
        document.getElementById("reg_question_answers").innerHTML = html


        Array.from(document.getElementsByClassName("test_answer")).forEach(function(element) {
            element.addEventListener('click', clickTestAnswer  )
        })
        function clickTestAnswer(){
            test_num += 1
            test_result += parseInt(this.getAttribute("data-result"))

            setNewTestQuestion()
        }

    }


    let user_actions = [
        {header: "Дружина", description: "Силовой блок. Выезд на сигнал SOS. Помощь силовикам."},
        {header: "Поддержка СВО", description: "Разбор, подготовка и отправка гуманитарной помощи, прием гуманитарной помощи от населения и т.д."},
        {header: "Благотворительность", description: "Участие в волонтерской деятельности, не требующей больших физических усилий"},
        {header: "Юридическое подразделение", description: "Оказание поддержики в юридической плоскости"},
        {header: "Секретариат", description: "Мониторинг и модерация чатов общины"},
        {header: "Медиа отдел", description: "Написание текстов, обработка фото и видео материалов работа с графикой"},
        {header: "Бизнес клуб", description: "Закрытое сообщество предпринимателей. Есть обязательный взнос"},

    ]

    setUserActions()
    function setUserActions(){

        let html = ''
        user_actions.forEach(item => {
            html += `<div class="user_action">
                       <div class="header">${item.header}</div>
                       <div class="descr">${item.description}</div>
                    </div>`
        })

        document.getElementById('div_user_actions').innerHTML = html

        Array.from(document.getElementsByClassName("user_action")).forEach(function(element) {
            element.addEventListener('click',  selectUserAction )
        })

        function selectUserAction(){
            if (this.classList.contains("active")) {
                this.classList.remove("active")
            } else {
                this.classList.add("active")
            }
        }
    }



    document.getElementById('btn_register_5').addEventListener('click', function(){
        let interests = []
        Array.from(document.getElementsByClassName("user_action")).forEach(function(element) {
            if (element.classList.contains("active")) {
                interests.push(element.querySelector('.header').innerText)
            }
        })

        sendRequest('post', 'reg_interests', {interests: interests})
            .then(data => {
                showRegPage(6)
            })
            .catch(err => console.log(err))
    })





    function showRegPage(num){
        Array.from(document.getElementsByClassName("reg_pages")).forEach(function(element) {
            element.style.display = "none"
        })
        document.querySelector(`.reg_pages[data-page="${num}"]`).style.display = "block"
    }



    Array.from(document.getElementsByClassName("container_info")).forEach(function(element) {
        element.addEventListener('click', openInfoBlock  )
    })
    function openInfoBlock(){
        const content_block = this.querySelector('.content')

        if (content_block.style.display == "none") {
            content_block.style.display = "block"
        } else {
            content_block.style.display = "none"
        }
    }


    async function getAllData(){

        sendRequest('post', 'get_all_data', {})
            .then(data => {
                main_data = data

                showStartPage()

            })
            .catch(err => console.log(err))

    }

    function showStartPage(){

        let page = 1

        if (main_data.user.interests.length > 0) {
            page = 6
        }
        if (main_data.user.test_result > 0 &&  main_data.user.interests.length == 0) {
            page = 5
        }
        if (main_data.user.test_result == 0 &&  main_data.user.messenger != null) {
            page = 3
        }
        if (main_data.user.messenger == null && main_data.user.name != null) {
            page = 2
        }

        document.querySelector(`.reg_pages[data-page="${page}"]`).style.display = 'block'




        document.getElementById("page_load").style.display = 'none'
        if (main_data.user.approved){
            document.getElementById("page_main").style.display = 'flex'
        } else {
            document.getElementById("page_register").style.display = 'flex'
        }

    }

    Array.from(document.querySelectorAll(".btn_sos_instruction")).forEach(function(element) {
        element.addEventListener('click', showSosInstruction )
    })
    function showSosInstruction(){
        Array.from(document.querySelectorAll(".div_sos_instruction")).forEach(function(element) {
            element.style.display = "none"
        })

        console.log("click")
        console.log("click ", this.getAttribute("data-platform"))
        document.querySelector(`.div_sos_instruction[data-platform="${this.getAttribute("data-platform")}"]`).style.display = "block"
    }



    let logo_click = 0
    let logo_click_timer = null
    Array.from(document.getElementsByClassName("logo_big")).forEach(function(element) {
        element.addEventListener('click', clickLogo )
    })
    function clickLogo(){
        logo_click += 1

        console.log("logo click ", logo_click)
        if (logo_click_timer !== null){
            clearTimeout(logo_click_timer)
        }

        if (logo_click >= 5){
            openAdminPage()
        }

        logo_click_timer = setTimeout(() => {
            logo_click = 0
        }, 1000)
    }


    let admin_info = null
    function openAdminPage(){
        sendRequest('post', 'get_admin_info', {})
            .then(data => {
                document.getElementById("page_register").style.display = 'none'
                document.getElementById("page_main").style.display = 'none'
                document.getElementById("page_admin").style.display = 'flex'
                admin_info = data
                setAdminRegistered(data.registered)
            })
            .catch(err => console.log(err))
    }

    Array.from(document.querySelectorAll(".admin_tab_selector .tab")).forEach(function(element) {
        element.addEventListener('click', clickAdminTab )
    })
    function clickAdminTab(){
        Array.from(document.querySelectorAll(".admin_tab_selector .tab")).forEach(function(element) {
            element.classList.remove("active")
        })
        this.classList.add("active")

        if (this.getAttribute("data-type") == "registered") {
            setAdminRegistered(admin_info.registered)
        } else {
            setAdminApproved(admin_info.approved)
        }
    }

    function setAdminRegistered(users){
        let html = ''
        users.forEach(item => {
            html += `
                        <div class="row_user">
                            <div class="main">
                                <div class="header">
                                    <div>${item.name}</div>
                                    <div class="time">${parseTime(item.updated_at)}</div>
                                </div>
                                <div class="descr">${item.interests}</div>
                            </div>

                            <div class="second">
                                <div><b>Телефон:</b> ${item.phone}</div>
                                <div><b>WA/TG:</b> ${item.messenger}</div>
                                <div><b>Соц.сеть:</b> ${item.social_media}</div>

                                <div data-user-id="${item.id}" class="btn_approve btn_main">Подтвердить</div>
                            </div>
                        </div>
                        `
        })

        const table = document.getElementById("users_table")
        table.innerHTML = html

        Array.from(table.getElementsByClassName("main")).forEach(function(element) {
            console.log("set")
            element.addEventListener('click', showUserInfo )
        })
        function showUserInfo(){
            console.log("click")
            const div_info = this.parentElement.querySelector('.second')
            div_info.style.display = div_info.style.display === "block" ? "none" : "block"
        }

        Array.from(table.getElementsByClassName("btn_approve")).forEach(function(element) {
            element.addEventListener('click', btnApproveUser )
        })

        function btnApproveUser(){
            const element = this.parentElement.parentElement
            const user_id = this.getAttribute("data-user-id")

            sendRequest('post', 'approve_user', {user_id: user_id})
                .then(data => {
                    element.style.display = "none"
                })
                .catch(err => console.log(err))
        }
    }
    function setAdminApproved(users){
        let html = ''
        users.forEach(item => {
            html += `
                        <div class="row_user">
                            <div class="main">
                                <div class="header">
                                    <div>${item.name}</div>
                                    <div class="time">${parseTime(item.updated_at)}</div>
                                </div>
                                <div class="descr">${item.interests}</div>
                            </div>

                            <div class="second">
                                <div><b>Телефон:</b> ${item.phone}</div>
                                <div><b>WA/TG:</b> ${item.messenger}</div>
                                <div><b>Соц.сеть:</b> ${item.social_media}</div>
                                <div class="div_sos"><b>Контактов SOS:</b> <input class="input_sos_contact" type="number" value="${item.sos_contact}"/></div>

                                <div data-user-id="${item.id}" class="btn_save_sos btn_main">Сохранить</div>
                            </div>
                        </div>
                        `
        })

        const table = document.getElementById("users_table")
        table.innerHTML = html

        Array.from(table.querySelectorAll(".main")).forEach(function(element) {
            console.log("set")
            element.addEventListener('click', showUserInfo )
        })
        function showUserInfo(){
            console.log("click")
            const div_info = this.parentElement.querySelector('.second')
            div_info.style.display = div_info.style.display === "block" ? "none" : "block"
        }

        Array.from(table.getElementsByClassName("input_sos_contact")).forEach(function(element) {
            element.addEventListener('change', showSaveSOS )
        })

        function showSaveSOS(){
            this.parentElement.parentElement.querySelector(".btn_save_sos").style.display = "block"
        }



        Array.from(table.getElementsByClassName("btn_save_sos")).forEach(function(element) {
            element.addEventListener('click', btnSaveSos )
        })

        function btnSaveSos(){
            const element     = this
            const sos_contact = this.parentElement.querySelector('.input_sos_contact').value
            const user_id     = this.getAttribute("data-user-id")

            sendRequest('post', 'save_new_sos', {user_id: user_id, sos_contact: sos_contact})
                .then(data => {
                    element.style.display = "none"
                })
                .catch(err => console.log(err))
        }
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



    function parseTime(str){
        let date = str.split("T")[0].split("-")
        let time = str.split("T")[1].split(":")

        return time[0] + ":" + time[1] + " " + date[2] + "." + date[1] + "." + date[0]
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
