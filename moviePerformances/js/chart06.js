(function(window, $, d3) {

	"use strict";

	var Chart06 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 200,
			left: 120,
			right: 30,
		};
		var oscarMovies = [];
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
		    .y(function(d) { return y( d.budget ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item ) {
				item.budget = parseInt(item.budget);
				if( item.is_oscar === "1" ) {
					oscarMovies.push(item.title);
				}
			});

			x.domain( data.map( function( d ) { return d.title; }));
			y.domain( d3.extent(data, function(d) { return d.budget; }) );

			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
			.selectAll("text")
				.attr("class", function(title, i) { 
				   if( oscarMovies.indexOf(title) < 0 ) {
					   return "hidden";
				   }
				   return "";
				})
				.style("text-anchor", "end")
				.text(function(title, i) {
					return (i+1) + ". " + title;
				})
				.attr("font-size", "12px")
				.attr("dx", "-.2em")
				.attr("dy", ".3em")
				.attr("transform", function(d) {
				    return "rotate(-55)" 
			    });

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Budget ($) M");

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
				   .style("display", function(d) { 
					   if( d.is_oscar === "0" ) {
						   return "none";
					   }
					   return "normal";
				   })
				   .attr("cx", function(d) {
				   		return x(d.title);
				   })
				   .attr("cy", function(d) {
				   		return y(d.budget);
				   })
				   .attr("r", 2);

			var format = d3.format(",")
			//Create labels
			chart.append("g")
				.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
			.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
				   if( d.is_oscar === "1" ) {
			   		return "" + format(d.budget / 1000000);
				   }
				   else {
					   return "";
				   }
			   })
			   .attr("x", function(d) {
			   		return x(d.title);
			   })
			   .attr("y", function(d) {
			   		return y(d.budget) - 5;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "red");		
		});

	};

	window.Chart06 = Chart06;

}(window, $, d3));