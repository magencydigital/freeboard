(function() {
   

    var wsWidget = function(settings) {
        var self = this;
        var currentSettings = settings;
        var lines = 0;

        var colorCt = 0;       
        var colors = ["#1b85b8", "#559e83", "#ae5a41", "#c3cb71", "#845422", "#885159", "#645188", "#886451", "#528881", "#4d7358", "#a47c48", "#d64d4d", "#0c457d", "#e8702a"];
        var topicColors = new Array(); 


        var myText = $('<div class="sbw-text"></div>');
        var myTitle =  $('<div class="sbw-title"></div>');
        var myListElements = new Array();
        var myList = $('<div class="sbw-display-'+currentSettings.size+'"></div>');
        
        function idParser(i){
            var id = i+"&emsp;&emsp;";
            return id.fontcolor("#ff2222");
        }
        
        function topicParser(topic){
            if(topicColors[topic] == null){
                topicColors[topic] = colors[colorCt];
                colorCt = (colorCt+1)%colors.length;
            }

            return topic.fontcolor(topicColors[topic]);
        }

        this.render = function(containerElement){
            $(myText).append(myTitle);
            $(myText).append(myList);
            $(containerElement).append(myText);
        }

        this.getHeight = function(){
            lines = 5;
            height = 2;
            
            if(currentSettings.size == "xlarge"){
                lines = 29;
                height = 10;
            }
            else if (currentSettings.size == "large"){
                lines = 17;
                height = 6;
            }
            else if (currentSettings.size == "regular"){
                lines = 11;
                height = 4;
            }

            return height
        }

        this.onSettingChanged = function(newSettings){
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function(settingName, newValue){
            if(settingName == "value"){
                var html, i;
                var tab = newValue.split(ITEM_SEPARATOR, 1);
                if(tab.length < 1){
                    return 1;
                }
                var topic = tab[0];
                var rest = newValue.substring(topic.length + ITEM_SEPARATOR.length);
                if (topic == TOPICS_NAME_ALL){
                    tab = rest.split(ITEM_SEPARATOR, 1);
                    subTopic = tab[0];
                    message = rest.substring(subTopic.length + ITEM_SEPARATOR.length);
                    line = topicParser(subTopic)+": "+message;
                }
                else{
                    line = rest;
                } 

                myListElements[myListElements.length] = line;
                var size = myListElements.length+"";
                topic = topic.fontcolor("#ff2222");
                $(myTitle).html("Messages received from "+topic+": "+size.fontcolor("#ff2222"));

                html = "";
                for(i=0; i< myListElements.length; i++) {
                    html += "<tr><td>"+idParser(i+1)+"</td><td>"+myListElements[i]+"</td></tr>";
                }
                    
                $(myList).html("<table>"+html+"</table>");
                $(myList).scrollTop($(myList)[0].scrollHeight);
            
            }
        }

        this.onDispose = function(){

        }
        
        this.getHeight();
        freeboard.addStyle('.sbw-display-'+currentSettings.size,
            'max-height: '+lines*20+'px;' +
            'overflow: auto;');

    }

    freeboard.loadWidgetPlugin({
        
        type_name       : "message_broker_sub_widget",
        display_name    : "Topic",
        fill_size       : "false",
        settings        : [
            {
                name        : "size",
                display_name: "Size",
                type        : "option",
                options     : [
                    {
                        name    : "Small",
                        value   : "small"
                    },
                    {
                        name    : "Regular",
                        value   : "regular"
                    },
                    {
                        name    : "Large",
                        value   : "large"
                    },
                    {
                        name    : "Extra Large",
                        value   : "xlarge"
                    }

                ]
            },
            {
                name        : "value",
                display_name: "Value",
                type        : "calculated",
                description : "Choose the subscription to a topic (neither 'TOPICS' nor 'STATISTIC')" 
            }
        ],
        newInstance : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new wsWidget(settings, updateCallback));
        }
    });
}());
