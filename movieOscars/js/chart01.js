(function(window, $, d3) {

	"use strict";

	var Chart01 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 100,
			left: 120,
			right: 100,
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
		    .x(function(d) { return x( d.date ); })
		    .y(function(d) { return y( d.leecher); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, rawData ) {
			var data = {};
			rawData.forEach( function( item ) {
				if( data[ item.title ] === undefined ) {
					data[ item.title ] = [];
				};
				
				item.leecher = parseInt(item.leecher);
				item.leecher= parseInt(item.leecher);
				
				data[ item.title ].push( item );
			});


			var xAxisDomain = d3.set( rawData.map( function( d ) { return d.date; }) ).values();
			xAxisDomain.sort();

			var yAxisDomain= d3.extent( rawData, function( item ){ 
				if( item.leecher > item.leecher ) {
					return item.leecher;
				}
				else {
					return item.leecher;
				}
			});
			yAxisDomain[0] = 0;
			x.domain( xAxisDomain );
			y.domain( yAxisDomain );

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

			    chart.select("g.x.axis")
				.append("text")
					.attr("y", -20)
					.attr("x", width + 25)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Date");

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Total");

			var colorScale =  d3.scale.category20()
		    					.domain( Object.keys( data) );

			for( var key in data ) {
				chart.append("g")
						.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
					.append("path")
						.datum( data[key] )
						.attr("class", "line")
						.attr("d", line)
						.attr("id", data[ key ][0].id)
						.style("stroke", colorScale( key ) )
						.on("mouseover", function( item ) { 
							var last = item[ item.length - 1];
							
							console.log(last, x(last.date), y(last.leecher));
							svg.append("text")
								.text(last.title)
								.attr("class", "infobox")
								.attr("transform", "translate(" + x(last.date) + ", " + y(last.leecher) + ")")
								

							$("path.line").css("stroke-width", "0.15")
							$("#"+item[0].id).css("stroke-width", "5")
						})
                        .on("mouseout", function( item ) { 
							$("path.line").css("stroke-width", "2")
							svg.select(".infobox")
									.remove();
							$("#"+item[0].id).css("stroke-width", "2")
                    	})
				console.log(colorScale( key ));
			}

		});

	};

	window.Chart01 = Chart01;

}(window, $, d3));