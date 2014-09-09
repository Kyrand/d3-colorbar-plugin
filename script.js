var createRandomColorbar = function() {
    var cols = ['Set3', 'YlGnBu', 'YlOrRd', 'BrBG', 'PRGn', 'PiYG', 'RdYlBu', 'Spectral', 'Pastel1'],
    col = cols[Math.floor(Math.random() * cols.length)];
    console.log('Color-set: ' + col);
    var crange = colorbrewer[col][9],
        numBars = parseInt((0.5 + Math.random()) * 50),
        cbar = new kcharts.ColorBar()
            .title('Foobar values')
            .height((0.5 + Math.random()) * 300)
            .width((0.5 + Math.random()) * 20)
            .numBars(numBars)
            .x(400 + (Math.random()-0.5) * 600)
            .y(400 + (Math.random()-0.5) * 400)
            .horizontal(Math.random() < 0.5?true:false)
            .colorScale(d3.scale.quantize()
                        .domain([0,Math.random() * 600]).range(crange))
            .labelIndices(d3.range(0, numBars-1, parseInt(numBars/(5 + Math.random()*5))))
    ;
    return cbar;
};

d3.select('#colorbar').selectAll('.colorbars').data(d3.range(30)).enter().append('svg').attr('class', 'colorbars');

d3.selectAll('.colorbars').each(function(d) {
    d3.select(this).call(createRandomColorbar()); 
});
