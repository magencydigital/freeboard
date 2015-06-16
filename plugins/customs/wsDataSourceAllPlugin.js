// ## A Web Socket Datasource Plugin for the Freeboard Dashboard
 
(function() {
    var subs = [];

    function openConnection() {
        ws = new WebSocket("ws://"+MB_HOST+":"+MB_PORT);
 
        ws.onopen = function(evt) {
            console.log("ws : connected");
        };
 
        ws.onclose = function(evt) {
            console.log("ws : disconnected : "+evt.data);
        }
 
        ws.onmessage = function (evt) {
            try {
                if(evt.data == 'PING'){
                    ws.send('PONG');
                }
                else{
                    for(i=0; i<subs.length; i++){
                        subs[i].processMessage(evt.data);
                    }
                }
            } catch (e) {
                console.log(e.message);
                console.log("ws : bad parse",evt.data);
            }
        }
 
        ws.onerror = function(evt) {
            console.log("ws : error",evt);
        }

        return ws;
    }

    var ws = openConnection();
 
    var wsDatasource = function(settings, updateCallback) {
        var server = window.location.hostname;
        var topicName, subscription;
        subs[subs.length] = this;
        var self = this;
        var currentSettings = settings;

        function subscribe(){
            if (ws) {
                if (subscription == "stat") ws.send("STAT:"+topicName);
                else ws.send("SUB:"+topicName);
            } 
        }

        function getTopicName(statMessage){
            var fields = statMessage.split(":").slice(1).join(":");
            var json = JSON.parse(fields);
            return json["name"];
        }

        function checkSubscription(message){
            var forwardMessage = false;
            var res = message.split(":");
            if(res[0] == "STAT" && subscription == "stat"){
                if(getTopicName(message) == topicName){
                    forwardMessage = true;
            }
            }
            else if(res[0] == topicName){
                forwardMessage = true;
            }

            return forwardMessage;
        }

        this.processMessage = function(message){
            if(checkSubscription(message)){
                if(subscription == "stat" || topicName == "STATISTIC"){
                    var tmp = message.split(":").slice(1).join(":");

                    updateCallback(JSON.parse(tmp));
                }
                else{
                    updateCallback(message);
                }
            }
        }
 
        this.updateNow = function() {
            //this.onSettingsChanged(currentSettings);
        }
 
        this.onDispose = function() {
            subs.remove(self);
        }
 
        this.onSettingsChanged = function(newSettings) {
            currentSettings = newSettings;
            topicName = currentSettings.topic_name;
            subscription = currentSettings.sub_type;
            subscribe();
        }
 
        self.onSettingsChanged(settings);
    };

    freeboard.loadDatasourcePlugin({
        
        type_name   : "message_broker_plugin",
        display_name: "Subscriber",
        settings    : [
            {
                name        : "topic_name",
                display_name: "Topic",
                type        : "text",
                description : "Topic's name (case sensitive)"
            },          
            {
                name        : "sub_type",
                display_name: "Subscribe to",
                type        : "option",
                description : "Type of subscription",
                options     : [
                    {
                        name    : "Topic",
                        value   : "topic"
                    },
                    {
                        name    : "Topic's statistics",
                        value   : "stat"
                    }
                ]
            }
        ],
        newInstance : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new wsDatasource(settings, updateCallback));
        }
    });
}());
