(function(window, $, d3) {

	"use strict";

	var Chart01 = function(element, filename, valueKey) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 80,
			left: 75,
			right: 300,
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
	
		var colorScale =  d3.scale.category10();
		
		var line = d3.svg.line()
			.interpolate("monotone")
		    .x(function(d) { return x( d.date ); })
		    .y(function(d) { return y( d[valueKey]); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, rawData ) {
			var data = {};
			rawData.forEach( function( item ) {
				if( data[ item.title ] === undefined ) {
					data[ item.title ] = [];
				};
				
				item.leecher = parseInt(item.leecher);
				item.seeder = parseInt(item.seeder);
				
				data[ item.title ].push( item );
			});


			var xAxisDomain = d3.set( rawData.map( function( d ) { return d.date; }) ).values();
			xAxisDomain.sort();

			var yAxisDomain= d3.extent( rawData, function( item ){ 
				if( item.leecher > item.seeder ) {
					return item.leecher;
				}
				else {
					return item.seeder;
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

			colorScale.domain( Object.keys( data ) );

			var index = 0;
			var keys = Object.keys( data );
			var legend = chart.append("g")
				.attr("class", "legend-container");

			var g = legend.selectAll("g")
				.data(keys)
				.enter()
					.append("g")
						.attr("id", function(key) { return valueKey + "-legend-" + data[key][0].id; })
						.attr("class", "legend")
						.on("mouseover", function(item) {
							mouseover(data[item][0].id, data[item]);
						})
						.on("mouseout", function(item) {
							mouseout(data[item][0].id);
						});
			g.append("text")
				.text(function(key) { return key; })
				.attr("fill", "#000")
				.attr("x", $( element ).width()-350)
				.attr("y", function(key, index) { return 10 + (index * 19); });

			g.append("rect")
				.attr("width", "15")
				.attr("height", "15")
				.attr("id", function(key){ return valueKey + "-rect-" + data[key][0].id; })
				.attr("fill", function( key ) { return colorScale( key ); })
				.attr("x", -20 + $( element ).width()-350)
				.attr("y", function(key, index) { return -4 + (index * 19); } );
			
			for( var key in data ) {
				chart.append("g")
						.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
					.append("path")
						.datum( data[key] )
						.attr("class", "line")
						.attr("d", line)
						.attr("id", valueKey + "-" + data[ key ][0].id)
						.style("stroke", colorScale( key ) )
						.on("mouseover", function( item ) { 
							mouseover(item[0].id, item)

						})
                        .on("mouseout", function( item ) { 
                        	mouseout(item[0].id);
                    	})

            	console.log(colorScale( key ));

			}

			function mouseover(id, data) {
				
				$("svg." + valueKey + " path.line").css("opacity", "0.4").css("stroke-width", "1")
				$("#"+valueKey+"-"+id).css("stroke-width", "5").css("opacity", "1")

				chart.append("g")
				.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
				.selectAll("circle")
				   .data( data )
				   .enter()
				   .append("circle")
				   .attr("class", "infobox")
				   .attr("cx", function(d) {
				   		return x(d.date);
				   })
				   .attr("cy", function(d) {
				   		return y(d[valueKey]);
				   })
				   .attr("r", 4);

				chart.append("g")
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
				.selectAll("text")
				   .data( data )
				   .enter()
				   .append("rect")
				   	   .attr("class", "infobox")
					   .attr("fill", "#CDEEEE")
					   .attr("width", function(d) { 
						   var text = "" + d[valueKey];
						   return text.length * 7;
					   })
					   .attr("height", 15)
					   .attr("x", function(d) {
					   		return x(d.date) - 	12;
					   })
					   .attr("y", function(d) {
					   		return y(d[valueKey]) - 16;
					   })
				   .append("text")
					   .attr("class", "infobox")
					   .text(function(d) {
					   		return d[valueKey];
					   })
					   .attr("x", function(d) {
					   		return x(d.date) - 	10;
					   })
					   .attr("y", function(d) {
					   		return y(d[valueKey]) - 5;
					   })
					   .attr("font-family", "sans-serif")
					   .attr("font-size", "11px")
					   .attr("fill", "black");		

				chart.append("g")
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
				.selectAll("text")
				   .data( data )
				   .enter()
				   .append("text")
				   .attr("class", "infobox")
				   .text(function(d) {
				   		return d[valueKey];
				   })
				   .attr("x", function(d) {
				   		return x(d.date) - 	10;
				   })
				   .attr("y", function(d) {
				   		return y(d[valueKey]) - 5;
				   })
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "11px")
				   .attr("fill", "red");				

				$("svg." + valueKey + " g.legend").css("opacity", "0.2");
				$("#" + valueKey + "-legend-" + id).css("opacity", "1");
				$("#" + valueKey + "-rect-" + id).css("stroke", "#333").css("stroke-width", "2px");
				
				console.log("ID", "#" + valueKey + "-legend-" + id)
			
			}

			function mouseout(id) {
				$("svg." + valueKey + " path.line").css("stroke-width", "2").css("opacity", "1")
				chart.selectAll(".infobox")
						.remove();
				$("#"+valueKey+"-"+id).css("stroke-width", "2");
				
				$("g.legend").css("opacity", "1");
				$("#" + valueKey + "-rect-" + id).css("stroke", "none");

			}
		});
		

	};

	window.Chart01 = Chart01;

}(window, $, d3));