(function(window, $, d3) {

	"use strict";

	var Chart05 = function(element, filename) {
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
		    .y(function(d) { return y( d.percentage ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item ) {
				item.percentage = parseInt(item.percentage);
			});

			x.domain( data.map( function( d ) { return d.title; }));
			y.domain( d3.extent(data, function(d) { return d.percentage; }) );

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
			  .text("Revenue vs Budget (%)");

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
				   		return y(d.percentage);
				   })
				   .attr("r", 2);

			var format = d3.format("d,")
			//Create labels
			chart.append("g")
				.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
			.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return format(d.percentage) + '%';
			   })
			   .attr("x", function(d) {
			   		return x(d.title);
			   })
			   .attr("y", function(d) {
			   		return y(d.percentage) - 5;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "red");		

			chart.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", y(0))
			.attr("y2", y(0))
			.attr("stroke", "grey")
			.attr("stroke-dasharray", "5, 5")
		
		});

	};

	window.Chart05 = Chart05;

}(window, $, d3));