(function(window, $, d3) {

	"use strict";

	var Chart02 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 175,
			left: 120,
			right: 30,
		};
		var width = $( element ).width() - padding.left - padding.right;
		var height = $( element ).height() - padding.top - padding.bottom;


		var x = d3.scale.ordinal()
			.rangeRoundBands( [ 0, width ] );

		var y = d3.scale.linear()
		    .range( [ height, 0 ] );
	
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
	
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
	
		var line = d3.svg.line()
			.interpolate("monotone")
		    .x(function(d) { return x( d.title ); })
		    .y(function(d) { return y( d.gross ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item ) {
				item.gross = parseInt(item.gross);
			});

			x.domain( data.map( function( d ) { return d.title; }));
			y.domain( [ 0, 180000000 ] );

			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
			.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "-.2em")
				.attr("dy", ".3em")
				.attr("transform", function(d) {
				    return "rotate(-35)" 
			    });

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Opening Week Gross ($) M");

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
				   		return x(d.title);
				   })
				   .attr("cy", function(d) {
				   		return y(d.gross);
				   })
				   .attr("r", 2);

			var format = d3.format(".2f,")
			//Create labels
			chart.append("g")
				.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
			.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return format(d.gross/1000000.0);
			   })
			   .attr("x", function(d) {
			   		return x(d.title);
			   })
			   .attr("y", function(d) {
			   		return y(d.gross) - 5;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "red");		
		});

	};

	window.Chart02 = Chart02;

}(window, $, d3));