(function() {

    var wsWidget = function(settings) {
        var self = this;
        var currentSettings = settings;
        
        var myElement = $('<div class="stw-display"></div>');
        var titleElement = $('<h2 class="stw-title"></h2>');
        var statElement = $('<div class="stw-stat"></div>'); 
                
        this.render = function(containerElement){
            $(containerElement).empty();

            $(myElement).append(titleElement);
            $(myElement).append(statElement);

            $(containerElement).append(myElement);
        }

        this.getHeight = function(){
           return 2; 
        }

        this.onSettingChanged = function(newSettings){
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function(settingName, newValue){
            if(settingName == "value"){
                var title = String(newValue["name"]);
                titleElement.html("Statistics of "+title.fontcolor("#ff2222")+"</br></br>");

                var color = "#1b85b8";
                statElement.html("<table>"+
                        "<tr><td>Number of Subscribers: </td><td align='right'>"+
                        String(newValue["subscribers_count"]).fontcolor(color)+"</td></tr>"+
                        "<tr><td>Published messages: </td><td align='right'>"+
                        String(newValue["messages_published_count"]).fontcolor(color)+"</td></tr>"+
                        "<tr><td>Delivered messages: </td><td align='right'>"+
                        String(newValue["messages_delivered_count"]).fontcolor(color)+"</td></tr>"+
                        "</table>");
            }
        }

        this.onDispose = function(){

        }

        this.onSettingChanged(settings);
    }

    freeboard.loadWidgetPlugin({
        
        type_name   : "message_broker_stat_widget",
        display_name: "Topic's statistics",
        fill_size   : "false",
        settings    : [
            {
                name        : "value",
                display_name: "Value",
                type        : "calculated",
                description : "Choose the subscription to the statistics of a topic"
            }
        ],
        newInstance : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new wsWidget(settings, updateCallback));
        }
    });
}());
