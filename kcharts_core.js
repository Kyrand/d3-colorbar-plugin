/* global $, _  */
(function(kcharts) {
    'use strict';
    
    // returns chainable setter + getter method
    var makeAPIMethod = function(chart, params, method) {
        return function(_){
            if(!arguments.length){
                return params[method];
            }
            params[method] = _;
            return chart;
        };
    };

    kcharts.BasicPlugin = function(params) {
        // the plugin has some default params
        this.params = {
            height:100, width:100, padding: 20, type: 'plugin', data:{}
        };
        // these are extended  
        for(var p in params){
            this.params[p] = params[p];
        }
        // we are going to return a plugin object ready to process a D3 selection 
        var plugin = function(selection) {
            selection.each(function(data) {
                // a few default measurements
                var el, g, height = plugin.height(), width = plugin.width(), padding = plugin.padding();
                // store the data for convenience
                plugin.data(data);
                plugin.container = d3.select(this);
                // we assume the selection is or contains an 'svg' tag
                el = plugin.container.select('svg');
                el = el.node()? el: plugin.container;
                // we'll use an svg group as our plugins container
                plugin.svg = el.selectAll('g.' + plugin.type()).data([data]);
                plugin.gEnter = plugin.svg.enter()
                    .append('g').attr('class', plugin.type());
                // now build the plugin
                plugin.build();
            });
        };
        // create plugin's getter+setter methods based on specfied parameters 
        for(var method in this.params){
            plugin[method] = makeAPIMethod(plugin, this.params, method);
        }
        // placeholder
        plugin.build = function() {};
         
        return plugin;
    };
    
    kcharts.BasicChart = function(params) {
        this.params = typeof params !== 'undefined'? params: {
            height:100, width:100
        };
        this.params.data = {};
 
        var method, that = this,
        
        chart = function(selection) {
            selection.each(function(data) {
                var g, height = chart.height(), width = chart.width();
                chart.data(data);
                chart.container = d3.select(this);
                chart.svg = d3.select(this)
                    .attr('width', width)
                    .attr('height', height)
                    .selectAll('g').data([data]);
                chart.gEnter = chart.svg.enter().append('g');
                chart.build();
            });
        };

        for(method in this.params){
            chart[method] = makeAPIMethod(chart, this, method);
        }
        
        chart.build = function() {
            
        };
        
        return chart;
    };

}(window.kcharts = window.kcharts || {}));

