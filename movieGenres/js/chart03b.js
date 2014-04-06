(function(window, $, d3) {

	"use strict";

	var Chart03B = function(element, filename) {
		var container = d3.select(element);
		var padding = {
			top: 30,
			bottom: 90,
			left: 70,
			right: 30,
		};
		var outterWidth = 700;
		var outterHeight = 350;
		var width = outterWidth - padding.left - padding.right;
		var height = outterHeight - padding.top - padding.bottom;

		d3.tsv(filename, function( error, rawData ) {
			var dataDict = {};
			rawData.forEach( function( item ) {
				if( dataDict[ item.category ] === undefined ) {
					dataDict[ item.category ] = [];
				}
				dataDict[ item.category ].push({
					genre: item.genre,
					total: parseInt(item.total)
				});
			});


			for( var category in dataDict ) {
				var data = dataDict[ category ];

				container.append('h3').text(category);
				var svg = container.append('svg')

			    var x = d3.scale.ordinal()
					.rangeRoundBands( [ 0, width ] )
					.domain( data.map( function( d ) { return d.genre; }));

				var y = d3.scale.linear()
				    .range( [ height, 0 ] )
					.domain( [ 0, 2 + d3.max(data, function( d ) { return d.total; }) ] );
			
				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");
			
				var yAxis = d3.svg.axis()
				    .scale(y)
					.ticks(y.domain()[1] - 1)
					.tickFormat(d3.format("d"))
				    .tickSubdivide(0)				    
				    .orient("left");
			
				var line = d3.svg.line()
				    .x(function(d) { return x( d.genre ); })
				    .y(function(d) { return y( d.total ); });
	
				var chart = svg.append("g")
			    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
				
	
				chart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
				.selectAll("text")  
					.style("text-anchor", "end")
					.attr("dx", "-.2em")
					.attr("dy", ".3em")
					.attr("transform", function(d) {
					    return "rotate(-45)" 
				    });
	
				chart.select("g.x.axis")
					.append("text")
						.attr("y", -20)
						.attr("x", width + 25)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("Genre");
	
				chart.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Total Movies");
	
				chart.append("g")
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
	//				.attr("dx", x.rangeBand()/2)
				.append("path")
			      .datum(data)
			      .attr("class", "line")
			      .attr("d", line)
	
			    //Create circles
				chart.append("g")
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
				.selectAll("circle")
					   .data(data)
					   .enter()
					   .append("circle")
					   .attr("cx", function(d) {
					   		return x(d.genre);
					   })
					   .attr("cy", function(d) {
					   		return y(d.total);
					   })
					   .attr("r", 2);
	
				//Create labels
				chart.append("g")
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
				.selectAll("text")
				   .data(data)
				   .enter()
				   .append("text")
				   .text(function(d) {
				   		return d.total;
				   })
				   .attr("x", function(d) {
				   		return x(d.genre);
				   })
				   .attr("y", function(d) {
				   		return y(d.total) - 5;
				   })
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "11px")
				   .attr("fill", "red");		
				
			}

		});

	};

	window.Chart03B = Chart03B;

}(window, $, d3));