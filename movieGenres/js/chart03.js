(function(window, $, d3) {

	"use strict";

	var Chart03 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 90,
			left: 70,
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
		    .x(function(d) { return x( d.genre ); })
		    .y(function(d) { return y( d.total ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item ) {
				item.total = parseInt(item.total);
			});

			x.domain( data.map( function( d ) { return d.genre; }));
			y.domain( d3.extent( data, function( d ) { return d.total; }));
//			y.domain( [ 0, 5000 ] );

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
		});

	};

	window.Chart03 = Chart03;

}(window, $, d3));