(function(window, $, d3) {

	"use strict";

	var Chart01 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 50,
			bottom: 50,
			left: 50,
			right: 50,
		};
		var width = $( element ).width() - padding.left - padding.right;
		var height = $( element ).height() - padding.top - padding.bottom;

		var sizeScale = d3.scale.linear()
			.range([2, 10]);

		var colorScale =   d3.scale.log()
	        .interpolate(d3.interpolateHsl)
	        .range(["hsl(176, 100%, 50%)","hsl(340, 100%, 50%)"]);
		
		var x = d3.time.scale()
			.range( [ 0, width ] );
		
		var y = d3.scale.linear()
		    .range( [ height, 0 ] );
	
		var xAxis = d3.svg.axis()
//			.ticks( d3.time.months, 2)
			.tickFormat(d3.time.format('%b %d'))
			.ticks(function() { return [
			     new Date( Date.parse("2013-01-31") ),
			     new Date( Date.parse("2013-02-28") ),
			     new Date( Date.parse("2013-03-31") ),
			     new Date( Date.parse("2013-04-30") ),
			     new Date( Date.parse("2013-05-31") ),
			     new Date( Date.parse("2013-06-30") ),
			     new Date( Date.parse("2013-07-31") ),
			     new Date( Date.parse("2013-08-31") ),
			     new Date( Date.parse("2013-09-30") ),
			     new Date( Date.parse("2013-10-31") ),
			     new Date( Date.parse("2013-11-30") ),
			     new Date( Date.parse("2013-12-31") )
			     ]
			})
		    .scale(x)
		    .orient("bottom");
	
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
	
		var line = d3.svg.line()
			.interpolate("monotone")
		    .x(function(d) { return x( new Date(Date.parse(d.date)) ); })
		    .y(function(d) { return y( d.total ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item, i ) {
				item.total = parseInt(item.total);
			});
			
			var maxTotal = d3.max(data, function(d) { return d.total; });
			x.domain( [ new Date(Date.parse("2013-01-01")), new Date(Date.parse("2013-12-31")) ] );
			y.domain( [ 0, maxTotal + 5 ] );
			sizeScale.domain([ 0, maxTotal ]);

			
//			console.log(x.domain(), x.rangeRoundBands())

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
			  .text("Total");

			var barWidth = width/data.length;
		    //Create circles
			chart.append("g")
				.attr("transform", "translate(" + barWidth + ",0)")
			.selectAll("circle")
				   .data(data)
				   .enter()
				   .append("circle")
				   .attr("id", function(d, i) {
					   	
				   		return element.replace("#", "") + "-" + d.date;
				   })
				   .attr("cx", function(d, i) {
				   		return x( new Date( Date.parse(d.date) ) );
				   })
				   .attr("cy", function(d) {
				   		return y(d.total);
				   })
				   .attr("r", function(d) { return sizeScale(d.total)})
				   .attr("fill", function(d,i) { return colorScale(d.total); })
				   .on("mouseover", function( item, i ) {
					   console.log( item );
					   $("#chart-01-infobox").css({
							   	"display": "auto",
							   	"visibility": "visible",
								"left": x( new Date( Date.parse(item.date) ) ) + 60,
								"top": y(item.total)
					   		})
							.html("<strong>" + item.date + "</strong><br />Total: " + item.total);
					   
					   $(element + "-" + item.date).css("stroke", "#666").css("stroke-width", 2)
				   })
				   .on("mouseout", function( item ) {
					   $("#chart-01-infobox").css("display", "none");
					   $(element + "-" + item.date).css("stroke", "none")
				   });

		});

	};

	window.Chart01 = Chart01;

}(window, $, d3));