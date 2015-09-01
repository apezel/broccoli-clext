if (WebSocket) {

    var connected = false;
    
    function connect() {
    
        try {
            
            var ws = new WebSocket("ws://localhost:3210/");

            ws.onopen = function()
            {
                connected = true;
                console.log("HotCSS : listening");

            };

            ws.onmessage = function (evt) 
            {
                var received_msg = evt.data;

                if (received_msg.indexOf("reload:") === 0) {
                    
                    received_msg.split(";").filter(function(file) {
                        
                        return /\.css$/.test(file);
                        
                    }).forEach(function(file) {
                        
                        reload(file.replace(/reload\:/, ""));
                        
                    });
                    

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