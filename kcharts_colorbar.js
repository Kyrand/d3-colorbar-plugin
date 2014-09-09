/* global $, _  */
(function(kcharts) {
    'use strict';
    kcharts.COLS = {'blue': '#4575b4', 'yellow': '#ffffbf', 'red': '#a50026'};
    var COLOR_BARS = 50;
    kcharts.ColorBar = function(){
        var cbar = new kcharts.BasicPlugin({
            type: 'colorbar',
            title: '',
            horizontal: false,
            width: 10,
            height: false,
            padding:30,
            barHeight:2,
            x: 0,
            y: 0,
            numBars: COLOR_BARS,
            domain: [0, COLOR_BARS/2, COLOR_BARS],
            crange: [kcharts.COLS.blue, kcharts.COLS.yellow, kcharts.COLS.red],
            range: [0, 100],
            colorScale: d3.scale.linear().interpolate(d3.interpolateHcl),
            labelIndices:false,
            bounds: false
        });

        cbar.setScales = function() {
            var domain;
            // cbar.colorScale()
            //     .domain(cbar.domain());
            domain = cbar.colorScale().domain();
            cbar.bounds([domain[0], domain[domain.length-1]]);
            cbar.cbarscale = d3.scale.linear()
                .domain([0, cbar.numBars()-1]).range(cbar.bounds());
            // cbar.cbarscale.domain([0, cbar.numBars()-1]).range(cbar.bounds());
            if(!cbar.labelIndices()){
                cbar.labelIndices([0, cbar.numBars()/2, cbar.numBars()-1]);
            }
        };
        
        cbar.build = function() {
            var cEnter, bars, cbars;
            // scale to map colorbar domain to data domain (range) 
            cbar.setScales();
            if(cbar.height()){cbar.barHeight(cbar.height()/cbar.numBars());} 
                
            // ADD COLORBAR ELEMENTS
            cbars = cbar.svg.selectAll('.colorbar')
                .data([d3.range(cbar.numBars())]);

            cEnter = cbars.enter().append('g')
                .attr('class', 'colorbar')
                // .attr('transform', 'rotate(90)');
            ;

            bars = cEnter.append('g').attr('class', 'bars');
            
            bars.append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'cbar-title')
            ;
            
            bars = bars.selectAll('.bar')
                .data(function(d) {
                    return d;
                }).enter()
                .append('g')
                .attr('class', 'bar');
            
            bars.append('rect').attr('shape-rendering', 'crispEdges');
            
            bars.append('text')
                .attr("dy", cbar.horizontal()?'.6em':'.3em')
                .attr('text-anchor', 'middle')
                .attr('class', 'cb-text');

            // NOW UPDATE THE ELEMENTS' ATTRIBUTES
            var crot = cbar.horizontal()? 'rotate(90)':'',
                trot = cbar.horizontal()?'rotate(-90)':'rotate(-90)',
                rot = cbar.horizontal()?'rotate(-90)':'';
            
            cbar.svg.select('.colorbar')
                .attr("transform", "translate(" + cbar.x() + "," + cbar.y() + ")" + crot);
            
            cbar.svg.select('.cbar-title')
                .text(cbar.title())
                .attr('transform', "translate(" + (-7) + "," + (-cbar.barHeight() * cbar.numBars()/2) + ')' + trot)
            ;
            
            cbar.svg.selectAll('.bar')
                .attr('transform', function(d,i) {
                    return 'translate(0' + (-i*cbar.barHeight()) + ')';
                });
            
            cbar.svg.selectAll('.bar rect')
                .attr('width', cbar.width())
                .attr('height', cbar.barHeight())
                .attr('fill', function(d) {
                    return cbar.colorScale()(cbar.cbarscale(d));
                });

            var colorbarText = function(d, i) {
                var bounds = cbar.bounds();
                if(cbar.labelIndices().indexOf(i) != -1){
                    return parseInt(bounds[0] + (bounds[1]-bounds[0]) * i/(cbar.numBars()-1), 10); 
                    //return parseFloat(i*1.0/cbar.COLOR_BARS, 10).toFixed(1);
                }
            };
            
            cbar.svg.selectAll('.bar text').text(colorbarText)
                // .attr("x", cbar.width() + 5)
                .attr('transform', 'translate(' + (cbar.width()+10) + ')' + rot);
                // .attr("y", function(d, i) { return -i * cbar.barHeight();});
                
        };

        return cbar;
    };

}(window.kcharts = window.kcharts || {}));

