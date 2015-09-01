if (WebSocket) {

    var connected = false;
    
    function connect() {
    
        try {
            
            var ws = new WebSocket("ws://localhost:@port@/");

            ws.onopen = function()
            {
                connected = true;
                console.log("HotCSS is connected.");

            };

            ws.onmessage = function (evt) 
            {
                var received_msg = atob(evt.data);
                
                if (received_msg.indexOf("reload:") === 0) {
                    
                    received_msg.split(";").filter(function(file) {
                        
                        return /\.css$/.test(file);
                        
                    }).forEach(function(file) {
                        
                        reload(file.replace(/reload\:/, ""));
                        
                    });
                    

                } else if (received_msg.indexOf("build-success:") === 0) {
                    
                    onSuccess();
                
                } else if (received_msg.indexOf("build-error:") === 0) {
                    
                    onError(received_msg.replace("build-error:", ""));
                }

            };

            ws.onclose = function()
            {
                if (connected) {
                    
                    connected = false;
                    console.log("HotCSS : connection closed");
                
                }

            };
            
        } catch (error) {
            
            
            
        }
        
        
    }
    
    setInterval(function() { if (!connected) { connect(); }}, 2000);
    
}

function reload(file) {
    
    var links = document.getElementsByTagName("link");

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.rel === "stylesheet" && new RegExp(file+"\\?|$").test(link.href)) {
            
            link.href = link.href.replace(/\?.*|$/, "?"+Math.random());
            
        }
    }
    
}

function onSuccess() {
    
    var errorDiv = document.getElementById("hot-css-error-div");
    
    if (errorDiv) {
        
        errorDiv.parentNode.removeChild(errorDiv);
        
    }
    
}

function onError(error) {
    
    var errorDiv = document.getElementById("hot-css-error-div");
    
    if (!errorDiv) {
        
        document.body.innerHTML += "<div id=\"hot-css-error-div\"><span style=\"display:table-cell;vertical-align:middle;\"><b>Build error</b><br/>"+error+"</span></div>";
        errorDiv = document.getElementById("hot-css-error-div");
        
    }
    
    errorDiv.style.cssText = "position:fixed;z-index:9999;background-color:rgba(0, 0, 0, 0.5);color: white;width:100%;height:100%;top:0px;left:0px;display:table;text-align:center;";
    
}