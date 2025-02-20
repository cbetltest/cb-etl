window.onload= select_theme();

var theme = "news" // default theme

// Select Theme and Set Default Keyword and Sentiment and SubKeyword and URL
function select_theme(){
    //Select theme from theme toggle
    var theme_element = document.getElementById("theme");
    var theme = theme_element.options[theme_element.selectedIndex].value; 
    console.log(theme)


    // Keyword
    fetch(`./json/${theme}_keyword_top50.json`)
    .then(response => {
        return response.json();
        })
    .then(keyword_top50_data => {
        // Change JSON data format
        keyword_top50_data = keyword_top50_data.map(function(obj){
            // Assign new key 
            obj['text'] = obj['keyword'];
            obj['weight'] = obj['percentage']; 
            // obj['weight'] = obj['weight'] * 100
            // Delete old key 
            delete obj['keyword'];
            delete obj['percentage']; 
            delete obj['theme'];
            return obj;
        });

        // LeaderBoard
        $(".keyword_leaderboard").empty();
        for (data in keyword_top50_data){
            if (data == 0){
                var keyword_selected = keyword_top50_data[data]["text"]; //default keyword
                var keyword_leaderboard_li = `<a href="#keyword_selected" onclick='select_keyword(this)'>
                                                <li class="top1_keyword active"><span>${keyword_selected}</span></li>
                                            </a>`
                $(".keyword_leaderboard").append(keyword_leaderboard_li);

                document.getElementById("keyword_text").textContent = `${keyword_selected}`;
                select_sentiment(keyword_selected, theme);
                select_subkeyword(keyword_selected, theme);
                select_url(keyword_selected, theme);
            }
            if (data > 0 && data <= 9){
                var keyword = keyword_top50_data[data]["text"];
                var keyword_leaderboard_li = `<a href="#keyword_selected" onclick='select_keyword(this)'>
                                                <li><span>${keyword}</span></li>
                                            </a>`
                $(".keyword_leaderboard").append(keyword_leaderboard_li);
            }
        };
        
        // Word Cloud
        $('#keyword_cloud').jQCloud(keyword_top50_data, {
            autoResize: true,
            // shape: "rectangular",
            // fontSize: [90,80,70,60,50,45,40,30,20,15,10,5,3],
            });
        $('#keyword_cloud').jQCloud('update', keyword_top50_data);

        console.log(keyword_top50_data);
        });
};

// Select Keyword -> set keyword, sentiment, subkeyword, url
function select_keyword(word){
    $("li").removeClass("active");
    $(word).find('> li').addClass("active");
    var keyword_span = word.getElementsByTagName("SPAN")[0];
    var keyword_selected = keyword_span.innerText || keyword_span.textContent;
    document.getElementById("keyword_text").textContent = `${keyword_selected}`;
    var theme_element = document.getElementById("theme");
    var theme = theme_element.options[theme_element.selectedIndex].value; 
    select_sentiment(keyword_selected, theme);
    select_subkeyword(keyword_selected, theme);
    select_url(keyword_selected, theme);
};

// Sentiment
function select_sentiment(keyword, theme){
    console.log("Sentiment")
    fetch(`./json/${theme}_keyword_sentiment.json`)
    .then(response => {
        console.log(response);
        return response.json();
        })
    .then(subkeyword_data => {
        $(".sentiment_progress").empty();
        for (data in subkeyword_data){
            if (keyword == subkeyword_data[data]["keyword"]){
                var sentiment_str = subkeyword_data[data]["sentiment"].replaceAll(`'`,`"`)
                var sentiment_json = JSON.parse(sentiment_str);
                console.log(sentiment_json)
                var pos = sentiment_json["positive"]
                var neu = sentiment_json["neutral"]
                var neg = sentiment_json["negative"]
                var mean = pos + neu + neg

                var progess_bar = `<h5>相關輿論情緒<br>(社群留言)</h5>
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width:${Number((pos/mean*100).toFixed(2))}%">正面</div>
                                        <div class="pull-right">${Number((pos/mean*100).toFixed(2))}%</div>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width:${Number((neu/mean*100).toFixed(2))}%">中立</div>
                                        <div class="pull-right">${Number((neu/mean*100).toFixed(2))}%</div>

                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width:${Number((neg/mean*100).toFixed(2))}%">負面</div>
                                        <div class="pull-right">${Number((neg/mean*100).toFixed(2))}%</div>
                                    </div>`
                                    
                $(".sentiment_progress").append(progess_bar);
            };
        };
    });
};

// SubKeyword
function select_subkeyword(keyword, theme){
    fetch(`./json/${theme}_subkeyword.json`)
    .then(response => {
        return response.json();
        })
    .then(subkeyword_data => {
        var cloud_data = [];
        for (data in subkeyword_data){
            if (keyword == subkeyword_data[data]["keyword"]){
                var subkeyword = subkeyword_data[data]["subkeyword"];
                var weight = subkeyword_data[data]["weight"];
                cloud_data.push(JSON.parse(`{"text": "${subkeyword}", "weight": ${weight}}`))
            };
        };

        // LeaderBoard
        $(".keyword_subkeyword_leaderboard").empty();
        for (data in cloud_data){
            if (data <= 9){
                var subkeyword = cloud_data[data]["text"];
                var subkeyword_leaderboard_li = `<li><span>${subkeyword}</span></li>`
                $(".keyword_subkeyword_leaderboard").append(subkeyword_leaderboard_li);
            }
        };
        
        // Word Cloud
        $('#subkeyword_cloud').jQCloud(cloud_data, {
            autoResize: true,
            // shape: "rectangular",
            // fontSize: [90,80,70,60,50,45,40,30,20,15,10,5,3],
            colors: [
                '#e0876a',
                '#f4a688',
                '#f9ccac',
                '#fbefcc',
                '#d9ad7c',
                '#a2836e',
                '#674d3c'
            ],
            });
        $('#subkeyword_cloud').jQCloud('update', cloud_data);

        console.log(cloud_data);
    });
};


// URL
// API key 
var key = "11a60440155ee44551f3ab7b7f7aad18",
    key1 = "ad7353749a449d713dfa52264f0a369a",
    key2 = "be16d1e359c20f951efce2cf786fd700";

function select_url(keyword, theme){
    console.log(keyword);

    fetch(`./json/${theme}_keyword_url.json`)
    .then(response => {
        return response.json();
        })
    .then(subkeyword_data => {
        var url_count = 0;

        $(`.grid`).empty();
        $(`.grid`).append(`<div class="grid-sizer col-sm-4"></div>`);
        // init masonry
        $('.grid').masonry();
        // destroy masonry
        $('.grid').masonry('destroy');
        $('.grid').removeData('masonry'); // This line to remove masonry's data

        for (data in subkeyword_data){

            if (keyword == subkeyword_data[data]["keyword"] && url_count < 3){ //restrict to 9 articles(urls) 
                url_count += 1;
                var url = subkeyword_data[data]["url"];

                // Rotate key
                [key, key1, key2] = [key1, key2, key];
                [key1, key2, key] = [key2, key, key1];
                
                // https://my.linkpreview.net
                var api = `http://api.linkpreview.net/?key=${key}&q=${url}`;

                $.ajax({
                    url: api,
                    type:"GET",
                    crossDomain : true,
                    async: true,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    jsonpCallback: "myJsonMethod",
                    success: function(json) {

                        var card = `<div class="grid-item col-sm-4 sm-4 box">
                                        <a href="${json["url"]}">
                                        <div class="card" >
                                            <img src="${json["image"]}" class="card-img-top" alt="${json["title"]}">
                                            <div class="card-body">
                                                <h5 class="card-title">${json["title"]}</h5>
                                                <p class="card-text">${json["description"].substring(0, 200)} ...</p>
                                                <a href="${json["url"]}" class="card-link" target="_blank">${json["url"].split("/")[2]}</a>
                                            </div>
                                        </div>
                                    </a>
                                    </div>`;
                        $(`.grid`).append(card);

                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            };
        };

        //test Data
        // var json_array = [
        //     {
        //         "title": "Jaguar 小改款 F-Type P300 R-Dynamic 試駕｜美型依舊，2.0T動力表現恰到好處！ - Mobile01",
        //         "description": "如果外型的美可以用數據表示，那麼F-Type肯定是我認為C/P值最高的一輛車。於上週公佈雙車型定價的小改款F-Type，改以2.0升四缸渦輪增壓與5.0升八缸機械增壓作為首發車型，定價分別是366萬元與486萬元。P300四缸車型與過往六缸車型價格差異不大，倒是八缸低輸出版本P450...(Jaguar 第1頁)",
        //         "image": "https://attach.mobile01.com/attach/202101/mobile01-0237c5de51f2ba7ae46199e815a5c4da.jpg",
        //         "url": "https://www.mobile01.com/topicdetail.php?f=603\u0026t=6274801"
        //     },
        //     {
        //         "title": "觀察站／誰讓民進黨丟失了旗幟？ | 聯合新聞網：最懂你的新聞網站",
        //         "description": "昨晚「守護食安之夜」，資深社運人楊祖珺身子很小，站在台上，話卻說得很凶，口裡批評國民黨辦反萊豬晚會，竟因為疫情，臨時取消...",
        //         "image": "https://pgw.udn.com.tw/gw/photo.php?u=https://uc.udn.com.tw/photo/2020/12/24/realtime/9880620.jpg\u0026s=Y\u0026x=114\u0026y=0\u0026sw=1050\u0026sh=700\u0026exp=3600",
        //         "url": "https://udn.com/news/story/9750/5117418"
        //     },
        //     {
        //         "title": "一黨獨大情勢已過？ 民進黨反譏國民黨支持度首度跌破2成",
        //         "description": "國民黨智庫今天(23日)公布最新民調，在政黨支持度方面，民進黨支持度跌至22.6％，國民黨支持度19％，雙方差距僅3.6％，代表民進黨今年上半年一黨獨大的情勢已經結束。對使，民進黨發言人劉康彥回應指出，支持度是對政黨「總體表現」最直接的反應，國民黨今天公布的最新民調顯示，從8月以來，國民黨這5個月來...",
        //         "image": "https://static.rti.org.tw/assets/thumbnails/2020/11/18/045db56c6e6275e4cd86082e1bb4946b.jpg",
        //         "url": "https://www.rti.org.tw/news/view/id/2087464"
        //     },
        //     {
        //         "title": "民進黨：國民黨支持度跌破兩成 反映民眾不滿 | 政治 | 中央社 CNA",
        //         "description": "民進黨發言人劉康彥表示，國民黨今天公布的最新民調顯示，從8月以來，國民黨的政黨支持度首度跌破兩成，支持度是對政黨「總體表現」最直接的反應，反映民眾對國民黨這5個月表現的不滿。",
        //         "image": "https://imgcdn.cna.com.tw/www/images/pic_fb.jpg",
        //         "url": "https://www.cna.com.tw/news/aipl/202012230175.aspx"
        //     },
        //     {
        //         "title": "民進黨：國民黨支持度跌破兩成 反映民眾不滿",
        //         "description": "（中央社記者葉素萍台北23日電）民進黨發言人劉康彥表示，國民黨今天公布的最新民調顯示，從8月以來，國民黨的政黨支持度首度跌破兩成，支持度是對政黨「總體表現」最直接的反應，反映民眾對國民黨這5個月表現的不滿。",
        //         "image": "https://s.yimg.com/cv/apiv2/social/images/yahoo_default_logo-1200x1200.png",
        //         "url": "https://tw.news.yahoo.com/%E6%B0%91%E9%80%B2%E9%BB%A8-%E5%9C%8B%E6%B0%91%E9%BB%A8%E6%94%AF%E6%8C%81%E5%BA%A6%E8%B7%8C%E7%A0%B4%E5%85%A9%E6%88%90-%E5%8F%8D%E6%98%A0%E6%B0%91%E7%9C%BE%E4%B8%8D%E6%BB%BF-064733968.html"
        //     },
        //     {
        //         "title": "飛碟聯播網《飛碟早餐 唐湘龍時間》2020.12.23 民進黨面有「蔡」色！台灣人好不「蘇」服！",
        //         "description": "主持人：唐湘龍 節目時間：週一至週五 08:00-09:00 ◎節目內容大綱： ●「飛碟早餐 唐湘龍時間」，網路直播 ● 民進黨面有「蔡」色！台灣人好不「蘇」服！ ▶ 飛碟聯播網Youtube頻道 http://bit.ly/2Pz4Qmo ▶ 飛碟早餐唐湘龍時間 https://www.facebook.com/ufobreakfast/ ▶ 飛碟聯播網FB粉絲團 https://www.facebook.com/ufonetwork921/ ▶ 網路線上收聽 http://www.uforadio.com.tw/stream/str... ▶ 飛碟APP，讓你收聽零距離 Android：https://reurl.cc/j78ZKm iOS：https://reurl.cc/ZOG3LA ▶ 飛碟Podcast SoundOn : https://bit.ly/30Ia8Ti Apple Podcasts : https://apple.co/3jFpP6x Spotify : https://spoti.fi/2CPzneD Google 播客：https://bit.ly/3gCTb3G #民進黨 #台灣人 #唐湘龍",
        //         "image": "https://i.ytimg.com/vi/h_k87WHKo9k/maxresdefault.jpg",
        //         "url": "https://www.youtube.com/watch?v=h_k87WHKo9k"
        //     },
        //     ];
        

        // for (json in json_array){
        //         var json = json_array[json];
        //         var card = `<div class="grid-item col-sm-4 sm-4 box">
        //                     <a href="${json["url"]}">
        //                         <div class="card" >
        //                             <img src="${json["image"]}" class="card-img-top" alt="${json["title"]}">
        //                             <div class="card-body">
        //                                 <h5 class="card-title">${json["title"]}</h5>
        //                                 <p class="card-text">${json["description"].substring(0, 200)} ...</p>
        //                                 <a href="${json["url"]}" class="card-link" target="_blank">${json["url"].split("/")[2]}</a>
        //                             </div>
        //                         </div>
        //                     </a>
        //                     </div>`;
        //         $(`.grid`).append(card);
        //     };
        // test data end

        // re-initialize Masonry after all cards have been loaded.
        var $grid = $('.grid').masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
        });
        // $('.grid').masonry({
        //     itemSelector: '.grid-item',
        //     columnWidth: '.grid-sizer',
        //     percentPosition: true
        //     });
        $grid.imagesLoaded().progress( function() {
            $grid.masonry('layout');
        });
    });
};

$( document ).ajaxComplete(function() {
    $('.grid').removeData('masonry'); // This line to remove masonry's data
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
});


// Masonry grid will have to change size when bootstrap card changes
window.onresize = resize_grid;
function resize_grid(){
    $('.grid').removeData('masonry'); // This line to remove masonry's data

    // re-initialize Masonry after all cards have been loaded.
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
        });
    // $('.grid').masonry({
    //     itemSelector: '.grid-item',
    //     columnWidth: '.grid-sizer',
    //     percentPosition: true
    //     });
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
}