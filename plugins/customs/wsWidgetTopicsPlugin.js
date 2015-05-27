(function() {
    var wsWidget = function(settings) {
        var self = this;
        var currentSettings = settings;

        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;

        var lines = 0;
        var myText = $('<div class="tpw-text"></div>');
        var myTitle =  $('<div class="tpw-title"></div>');
        var myList = $('<div class="tpw-display-'+currentSettings.size+'"></div>');

        function topicParser(string){
            topic = "&emsp;&emsp;"+string.split("\"").join("").trim();
            return topic;
        }

        function sortAlphaNum(a,b) {
            var aA = a.replace(reA, "");
            var bA = b.replace(reA, "");
            if(aA === bA) {
                var aN = parseInt(a.replace(reN, ""), 10);
                var bN = parseInt(b.replace(reN, ""), 10);
                return aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
                return aA > bA ? 1 : -1;
            }
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
                lines = 32;
                height = 10;
            }
            else if (currentSettings.size == "large"){
                lines = 19;
                height = 6;
            }
            else if (currentSettings.size == "regular"){
                lines = 12;
                height = 4;
            }

            return height
        }

        this.onSettingChanged = function(newSettings){
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function(settingName, newValue){
            if(settingName == "value"){
                var tmp = newValue.split(":");
                var array = tmp[1].substring(1, tmp[1].length-1).split(",");    
                var nb = array.length+""; 
                $(myTitle).html("TOPICS : "+nb.fontcolor("#ff2222"));
                array.sort(sortAlphaNum);

                html = topicParser(array[0]);
                for(i=1; i<array.length; i++){
                    html += "<br/>"+topicParser(array[i]);
                }
                
                $(myList).html(html);
                $(myList).scrollTop($(myList)[0].scrollHeight);
            }
        }

        this.onDispose = function(){

        }
 
        this.getHeight();
        freeboard.addStyle('.tpw-display-'+currentSettings.size,
            'max-height: '+lines*18+'px;' +
            'overflow: auto;');

    }

    freeboard.loadWidgetPlugin({
        
        type_name   : "message_broker_topic_widget",
        display_name: "TOPICS",
        fill_size   : "false",
        settings    : [
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
                description : "Choose the subscrition to the 'TOPICS' topic"
            }
        ],
        newInstance : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new wsWidget(settings, updateCallback));
        }
    });
}());
