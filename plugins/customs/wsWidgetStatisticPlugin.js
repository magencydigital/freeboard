(function() {
        var colors = ["#1b85b8", "#559e83", "#ae5a41", "#c3cb71", "#845422", "#885159", "#645188", "#886451", "#528881", "#4d7358", "#a47c48", "#d64d4d", "#0c457d", "#e8702a"];

    var wsWidget = function(settings) {
        var self = this;
        var currentSettings = settings;

        var lines = 0;
        var myElement = $('<div class="stpw-display"></div>');
        var titleElement = $('<h2 class="stpw-title"></h2>');
        var statElement = $('<div class="stpw-stat"></div>');

        function topicParser(string){
            return "&emsp;&emsp;"+string.split("\"").join("");
        }

        this.render = function(containerElement){
            $(containerElement).empty();

            $(myElement).append(titleElement);
            $(myElement).append(statElement);

            $(containerElement).append(myElement);
        }

        this.getHeight = function(){
            return 5; 
        }

        this.onSettingChanged = function(newSettings){
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function(settingName, newValue){
            if(settingName == "value"){
                var title = "Message Broker, v"+newValue["version"]+"<br/><br/>";
                titleElement.html(title.fontcolor("#ff2222"));
                statElement.html("<table>"+
                        "<tr><td>Number of Topics: </td><td align='right'>"+
                        String(newValue["topics_count"]).fontcolor(colors[0])+"</td></tr>"+
                        "<tr><td>Number of Subscribers: </td><td align='right'>"+
                        String(newValue["subs_count"]).fontcolor(colors[0])+"</td></tr>"+
                        "<tr><td>Number of Publishers: </td><td align='right'>"+
                        String(newValue["pubs_count"]).fontcolor(colors[0])+"</td></tr>"+
                        "<tr><td>Number of Subcriptions: </td><td align='right'>"+
                        String(newValue["subscription_count"]).fontcolor(colors[1])+"</td></tr>"+
                        "<tr><td>Published Messages: </td><td align='right'>"+
                        String(newValue["published_message_count"]).fontcolor(colors[1])+"</td></tr>"+
                        "<tr><td>Delivered Messages: </td><td align='right'>"+
                        String(newValue["delivered_message_count"]).fontcolor(colors[1])+"</td></tr>"+
                        "</table><br/>"+
                        "Average Subscribers per Topic: <div align='right'>"+
                        String(newValue["subs_per_topic"]).fontcolor(colors[2])+"</div>"+
                        "Average Topic subscriptions per Subscriber: <div align='right'>"+
                        String(newValue["topics_per_subs"]).fontcolor(colors[2])+"</div>");
            }
        }

        this.onDispose = function(){

        }
 
        this.getHeight();
        freeboard.addStyle('.sbw-display',
            'max-height: '+lines*18+'px;' +
            'overflow: auto;');

    }

    freeboard.loadWidgetPlugin({
        
        type_name   : "message_broker_statistic_widget",
        display_name: "STATISTIC",
        fill_size   : "false",
        settings    : [
            {
                name        : "value",
                display_name: "Value",
                type        : "calculated",
                description : "Choose the subscription to the 'STATISTIC' topic"
            }
        ],
        newInstance : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new wsWidget(settings, updateCallback));
        }
    });
}());
