
(function () {

    //Replace primitive functions
    var _nativeLogs = {
        log: console.log,
        error: console.error,
        warn: console.warn
    }


    console.log = function (e) {
        document.querySelector(".console").insertAdjacentHTML("beforeend", "<p>" + (new Date()).toISOString() + " " + e + "</p>")
        try { _nativeLogs.log(e) }
        catch (e) {
        }
    }

    console.success = function (e) {
        //document.querySelector(".console").insertAdjacentHTML("beforeend", "<p style='color:green'>" + (new Date()).toISOString() + " " + e + "</p>")
        try { _nativeLogs.log(e) }
        catch (e) {
        }
    }

    console.error = function (e) {
        document.querySelector(".console").insertAdjacentHTML("beforeend", "<p style='color:red'>" + (new Date()).toISOString() + " " + e + "</p>")
        try { _nativeLogs.error(e) }
        catch (e) {
        }

    }

    console.warn = function (e) {
        document.querySelector(".console").insertAdjacentHTML("beforeend", "<p style='color:yellow'>" + (new Date()).toISOString() + " " + e + "</p>")
        try { _nativeLogs.warn(e) }
        catch (e) {
        }
    }
    window.location.hash = "#/ping"
    console.log("Hello user, i'm the embed console. This is important for error reporting :)")

    var isEdge = new Boolean(window.__BROWSERTOOLS_CONSOLE && !window.hasOwnProperty("ActiveXObject")).valueOf();
    var isIE = new Boolean(window.hasOwnProperty("ActiveXObject") && window.__BROWSERTOOLS_CONSOLE).valueOf()
    var isOpera = new Boolean(window.opr && window.chrome).valueOf();
    var isChrome = new Boolean(window.chrome && !window.opr).valueOf();
    var isFirefox = new Boolean(window.mozPaintCount && !window.chrome).valueOf()

    var columns = 3;

    var browserName = {
        "edge": "Microsoft Edge",
        "ie": "Internet Explorer",
        "opera": "Opera",
        "chrome": "Google Chrome",
        "firefox": "Mozilla Firefox"
    }

    if (document.body.clientWidth < 768) {
        document.body.classList.add("mobile")
        columns = 1;
    }

    //Variables
    var base = "https://alicescfernandes-projects.000webhostapp.com/singtome/" //window.location.origin + window.location.pathname + "php/";
    var audioService = "deezer"
    var height = 0;


    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    var notSupported = false;

    try {
        var recognition = new SpeechRecognition();
    } catch (err) {
        notSupported = true;
    }


    var errors = {
        "network": "Some network communication that was required to complete the recognition failed. <br>Please try again later.",
        "no-speech": "I can't detect any speech at all, instead of singing try just to speak close to your microfone",
        "aborted": "The speech recognition was aborted by you!",
        "audio-capture": "Couldn't not capture any audio, are you using your microfone for something else?",
        "not-allowed": "Your browser is not allowing me to accesss your microfone. Please reload the page and allow the page to access your microfone.",
        "service-not-allowed": "Your browser is not allowing me to connect to the speech recognition service. Please allow any permission that i may ask.",
        "bad-grammar": "There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.",
        "language-not-supported": "The language you chose is not supported.",
        "no-server": "Cannot reach server at this time. Please try again later."
    }

    if (notSupported) {
        document.querySelector(".not-compatible").style.display = "inline-block"
        // return;
    } else {
        document.querySelector(".main").style.display = "inline-block"
    }

    var recognition = new SpeechRecognition();

    recognition.interimResults = false;

    recognition.onstart = function (e) {
        console.log("[Recognition] Recognition Started")
        recognition.addEventListener("end", recognition.start)
    }

    recognition.onsoundstart = function () {
        console.log("[Recognition] Sound Detected")
    }
    recognition.onerror = function (e) {
        if (e.error == "no-speech" || e.error == "aborted") return;
        sessionStorage.error = e.error
        window.location.hash = "#/error"

    }

    recognition.onaudiostart = function () {
        console.log("[Recognition] Audio Detected")
    }

    sessionStorage.recognition = "stop"

    var spotify = {
        auth: function () {
            return new Promise(function (resolve, reject) {

                var data = new FormData();
                data.append("auth", "");

                var xhr = new XMLHttpRequest();

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        resolve();
                    }
                });

                xhr.open("GET", base + "spotify/auth");
                xhr.send(data);

            }
            )

        },
        search: function (a, t) {
            return new Promise(function (resolve, reject) {
                var artist = encodeURI(a.toLowerCase());
                var track = encodeURI(t.toLowerCase());

                var xhr = new XMLHttpRequest();

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        resolve(JSON.parse(this.responseText));
                    }
                });

                xhr.open("GET", base + "spotify/search?artist=" + artist + "&track=" + track);
                xhr.send();
            }
            )
        }
    }

    var deezer = {
        search: function (a, t) {
            return new Promise(function (resolve, reject) {
                var artist = encodeURI(a.toLowerCase());
                var track = encodeURI(t.toLowerCase());

                var xhr = new XMLHttpRequest();

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        resolve(JSON.parse(this.responseText));
                    }
                });

                xhr.open("GET", base + "deezer/search?artist=" + artist + "&track=" + track);
                xhr.send();
            }
            )
        }
    }

    var musicxmatch = {
        search: function (string) {
            return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var response = JSON.parse(this.responseText);
                        if (response.message.header.available > 0) {
                            resolve(response.message.body.track_list)
                        } else {
                            reject('')
                        }
                    }
                });

                console.log(base)

                xhr.open("GET", base + "musicxmatch/search?q=" + encodeURI(string));
                xhr.send()
            }
            )
        }
    }

    var ping = function () {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status == 200) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            });


            xhr.open("GET", base + "ping");
            xhr.send()
        }
        )
    }


    var resultModel = '<div onfocusin="focus()" tabindex=2 id="{{id}}" data-musixmatch="{{m-id}}" style="animation-delay:{{delay}}s" class="result fade-in"><div data-play="false" data-is-playing="false" class="player"><img src="{{imageSource}}">{{audioSource}}</div><div class="music-info"><p class="song-title">{{songTitle}}</p><p class="song-artist">{{songBand}}</p><p class="song-distributor">{{distributor}}, {{year}}</p></div></div>';
    var resultsDiv = Array.prototype.slice.call(document.querySelectorAll(".results-div"));

    var search = [];

    if (audioService.hasOwnProperty("auth"))
        audioService.auth()

    //Events

    document.querySelector("button").addEventListener("click", start)
    var manualType = Array.prototype.slice.call(document.querySelectorAll(".type"));

    manualType.forEach(function (el) {
        el.addEventListener("click", manual)
    })
    recognition.addEventListener("end", recognition.start)
    recognition.onresult = function (e) {
        onResult(e)
    }
    document.querySelector("input[type='text']").addEventListener("change", onChange)
    document.querySelector(".select ul").addEventListener("click", function (e) {
        onSelect(e)
    })

    document.querySelector(".select").addEventListener("focus", onFocus)

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 123) {
            e.preventDefault();
            if (document.querySelector(".console").style.display == "inline-block") {
                console.log("[Embed Console] Console hidden")
                document.querySelector(".console").style.display = "none"
            } else {
                console.log("[Embed Console] Console shown")
                document.querySelector(".console").style.display = "inline-block"
            }
        }
    })

    resultsDiv.forEach(function (resultDiv) {
        resultDiv.onmousemove = function (e) {
            onMouseMove(e)
        }
    })


    document.body.addEventListener("focusin", function (e) {
        if (e.target.classList.contains("result")) {
            if (e.target.querySelector("audio")) e.target.querySelector("audio").play()

        }
    })

    document.body.addEventListener("focusout", function (e) {
        if (e.target.classList.contains("result")) {
            if (!e.target.querySelector("audio")) return
            e.target.querySelector("audio").pause();
            e.target.querySelector("audio").parentElement.dataset.isPlaying = false;
            e.target.querySelector("audio").currentTime = 0;
        }
    })
    window.onhashchange = function (e) {
        var hash = window.location.hash.split("/")[1];

        var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
        screens.forEach(function (screen) {
            screen.style.display = "none"
        })

        switch (hash) {
            case "ping":
                console.log("[Server] Pinging server for avaliability")
                ping().then(function (data) {
                    window.location.hash = "#/home"
                    console.log("[Server] Application can run")
                }).catch(function (err) {
                    sessionStorage.error = "no-server"
                    window.location.hash = "#/error";
                })
                break;
            case "speech":
                console.log("[Application] User initiated speech recognition")
                recognition.start();
                document.querySelector(".working").style.display = "inline-block"
                break;
            case "type":
                console.log("[Application] User initiaded manual recognition")
                document.querySelector(".manual-type").style.display = "inline-block"
                break;
            case "home":
                recognition.removeEventListener("end", recognition.start)
                recognition.stop();
                console.log("[Application] User went home")
                document.querySelector(".main").style.display = "inline-block"
                break;
            case "error":
                recognition.removeEventListener("end", recognition.start)
                console.error("[Recognition] Error Detected: " + "" + e.error + "<br>" + errors[sessionStorage.error])
                recognition.stop()

                var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
                screens.forEach(function (screen) {
                    screen.style.display = "none"
                })
                document.querySelector(".error").style.display = "inline-block"
                document.querySelector("[data-error]").innerHTML = errors[sessionStorage.error]
                break;
            default:
                window.location.hash = "#/home"
                break;
        }
    }
    //Helpers
    function start() {
        window.location.hash = "#/speech"
    }

    function manual() {
        window.location.hash = "#/type"
    }

    function onResult(e) {
        console.log("[Recognition] Speech Recongition found words")
        var results = Array.prototype.slice.call(e.results)

        var transcript = results.map(function (result) {
            return result[0]
        }).map(function (result) {
            return result.transcript
        });
        search.push(transcript)
        var string = search.join(" ");
        searchAndParse(string, ".results", "voice")
    }

    function onChange() {
        console.log("[Application] User changed search input")

        var string = this.value;
        var words = string.split(" ");
        if (words.length >= 3)
            searchAndParse(string, ".manual-type", "type")
    }

    function onMouseMove(e) {
        if (e.target.dataset.play == "true") {
            if (!document.querySelector("[data-is-playing='true']")) {
                var audio = e.target.querySelector("audio");

                if (audio) {
                    audio.play();
                    e.target.dataset.isPlaying = true;

                    document.querySelector("[data-is-playing='true']").addEventListener("mouseleave", function () {
                        document.querySelector("[data-is-playing='true'] audio").pause();
                    })

                    audio.onended = function () {
                        audio.parentElement.dataset.isPlaying = false;
                    }

                    audio.onpause = function () {
                        audio.parentElement.dataset.isPlaying = false;
                        audio.currentTime = 0;
                    }

                }
            }
        }
    }

    function searchAndParse(string, resultsPlace, type) {
        console.log("[Application] Searching Musixmatch for <strong>" + string + "</strong>")
        document.querySelector(resultsPlace + " .status").innerHTML = '<ul class="loader">\
                    <li></li>\
                    <li></li>\
                    <li></li>\
                </ul>'
        //max-height: 310px;
        if (type == "voice") {
            document.querySelector(".working").style.display = "none"
            document.querySelector(".results").style.display = "inline-block"
        }
        musicxmatch.search(string).then(function (tracks) {
            debugger;
            console.success("[Application] Musixmatch returned " + tracks.length + " results")
            document.querySelector(resultsPlace + " .status").innerText = "Found something :)"

            var tracks = tracks;
            var delay = 0;
            var requestDelay = 0;
            var resultHeight = 147
            var counter = 0;



            //console.table({"calculated height":height, "tracks length":tracks.length, "dividing number":Math.ceil(tracks.length / 3), "result height":resultHeight})

            if (type == "voice") {
                document.querySelector(".working").style.display = "none"
                document.querySelector(".results").style.display = "inline-block"
            }

            if (document.querySelector(resultsPlace + " .results-space").style.maxHeight == "0px") {
                document.querySelector(resultsPlace + " .results-space").style.maxHeight = 310 + "px";
                document.querySelector(resultsPlace + " .results-space").style.height = document.querySelector(resultsPlace + " .results-space").style.maxHeight;
            }

            tracks.forEach(function (track) {
                if (window.location.hash != "#/type" && window.location.hash != "#/speech") return;

                track = track.track

                if (!document.querySelector("[data-musixmatch='" + track.track_id + "']")) {

                    requestDelay += 250;

                    window.setTimeout(function () {
                        if (window.location.hash != "#/type" && window.location.hash != "#/speech") return;

                        deezer.search(track.artist_name.replace("feat.", ""), track.track_name).then(function (results) {
                            console.log("[Application] Searching deezer for " + track.artist_name + " " + track.track_name)

                            //delay += 0.05
                            counter++


                            if (columns == 1) {
                                height += resultHeight

                                if (height > 310) {
                                    document.querySelector(resultsPlace + " .results-space").style.maxHeight = height + "px";
                                    document.querySelector(resultsPlace + " .results-space").style.height = document.querySelector(resultsPlace + " .results-space").style.maxHeight;
                                }
                            } else {
                                if (counter % 3 == 1) {
                                    height += resultHeight

                                    if (height > 310) {
                                        console.log(height)
                                        document.querySelector(resultsPlace + " .results-space").style.maxHeight = height + "px";
                                        document.querySelector(resultsPlace + " .results-space").style.height = document.querySelector(resultsPlace + " .results-space").style.maxHeight;
                                    }
                                }
                            }



                            var trackSource = false
                            var trackCover = false
                            if (results.data.length > 0) {

                                trackSource = results.data["0"].preview || false
                                trackCover = results.data["0"].album.cover || false;
                                console.warn("[Application] Deezer returned 0 results for " + track.artist_name + " " + track.track_name)

                            } else {
                                console.success("[Application] Deezer returned 1 result for " + track.artist_name + " " + track.track_name)
                            }

                            var html = resultModel
                            var id = "t" + (new Date()).getTime();

                            if (track.track_name.length >= 32)
                                track.track_name = track.track_name.substr(0, 29) + "..."
                            if (track.album_name.length >= 52)
                                track.album_name = track.album_name.substr(0, 45) + "..."
                            if (track.artist_name.length >= 45)
                                track.artist_name = track.artist_name.substr(0, 48) + "..."

                            var model = {
                                "{{imageSource}}": trackCover || track.album_coverart_100x100,
                                "{{audioSource}}": trackSource ? "<audio  src=" + trackSource + "></audio>" : "",
                                "{{songTitle}}": track.track_name,
                                "{{songBand}}": track.artist_name,
                                "{{distributor}}": track.album_name,
                                "{{year}}": (new Date(track.first_release_date)).getFullYear(),
                                "{{id}}": id,
                                "{{delay}}": delay,
                                "{{m-id}}": track.track_id

                            }

                            for (var a in model)
                                html = html.replace(a, model[a])
                            document.querySelector(resultsPlace + " .results-space").insertAdjacentHTML("beforeend", html)
                            resultHeight = parseFloat(getComputedStyle(document.querySelector(".result")).height) + 72;
                            console.log("result height " + resultHeight)


                            if (trackSource) {
                                document.querySelector("#" + id + " audio").addEventListener("canplay", function () {
                                    document.querySelector("#" + id + " audio").parentElement.dataset.play = "true"
                                })
                            }
                        })

                        /*spotify.search(track.artist_name, track.track_name).then(function (results) {
                    var trackSource = false
                    var trackCover = false
                    if (results.tracks.items.length > 0) {
 
                        trackSource = results.tracks.items["0"].preview_url || false
                        trackCover = results.tracks.items["0"].album.images[1].url || false;
                    }
 
                    var html = resultModel
                    var id = "t" + (new Date()).getTime();
                    var model = {
                        "{{imageSource}}": trackCover || track.album_coverart_100x100,
                        "{{audioSource}}": "<audio  src=" + trackSource + "></audio>" || "",
                        "{{songTitle}}": track.track_name,
                        "{{songBand}}": track.artist_name,
                        "{{distributor}}": track.album_name,
                        "{{year}}": (new Date(track.first_release_date)).getFullYear(),
                        "{{id}}": id
                    }
 
                    for (var a in model) html = html.replace(a, model[a])
                    document.querySelector(".results-space").insertAdjacentHTML("beforeend", html)
 
                    document.querySelector("#" + id + " audio").addEventListener("canplay", function () {
                        document.querySelector("#" + id + " audio").parentElement.dataset.play = "true"
                    })
                })*/
                    }, requestDelay)
                } else {
                    console.success("[Application] Track already printed on the page")
                    console.info("this track is already here")

                }

            })

        }).catch(function (err) {
            search = []
            console.error("[Application] Search for <strong>" + string + "</strong> return no results")
            document.querySelector(resultsPlace + " .status").innerText = "Search return no results. If you are singing, please just speak the lyrics"

        })
    }

    function onSelect(e) {

        var selectElement = document.querySelector(".select")
        var clickedItem = e.target;
        selectElement.querySelector("span").dataset.value = clickedItem.dataset.value
        selectElement.querySelector("span").textContent = clickedItem.textContent
        selectElement.blur()
        document.body.classList.remove("select-open")

        console.log("[Application] Recognition language changed from " + recognition.lang + " to " + selectElement.querySelector("span").dataset.value)
        recognition.lang = selectElement.querySelector("span").dataset.value;

    }

    function onFocus() {
        document.body.classList.add("select-open")
        if (document.body.classList.contains("mobile")) return;
        var width = 240;
        var spanWidth = parseInt(window.getComputedStyle(document.querySelector(".select span")).width)
        console.log("-" + ((spanWidth - width) / 2) + "px")
        document.querySelector(".select-options").style.marginLeft = ((spanWidth - width) / 2) + "px";
    }

})()

