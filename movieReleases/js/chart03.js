(function(window, $, d3) {

	"use strict";

	var Chart03 = function(element, filename1, filename2) {
		var svg = d3.select(element);
		var padding = {
			top: 50,
			bottom: 75,
			left: 100,
			right: 50
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
			.tickFormat(d3.time.format('%Y-%m-%d'))
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

		var format = d3.time.format("%Y-%m-%d");
		var movieToDates = {};
		var budgetToDates = {};
		d3.tsv(filename1, function( error, data ) {
			data.forEach( function( item, i ) {
				item.total = parseInt(item.total);
				movieToDates[ item.date ] = item.total;
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
				    return "rotate(-30)"
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
					   var text = "<h2>" + format( new Date( Date.parse( item.date) ) ) + "</h2>Total Movies: <strong>" + item.total+ "</strong>";
						   
					   if( item.date in budgetToDates ) {
						   text += "<br/><br />Top Budget Movie(s): <strong>"+ budgetToDates[item.date].movie.length +"</strong><br />" + budgetToDates[item.date].movie.join("<br />")
					   }
					   $(element + "-infobox").css({
							   	"display": "auto",
							   	"visibility": "visible",
								"left": x( new Date( Date.parse(item.date) ) ) + padding.left + 15,
								"top": y(item.total) + padding.top
				   		})
						.html(text);
					   
					   $(element + "-" + item.date).css("stroke", "#111").css("stroke-width", 3)
				   })
				   .on("mouseout", function( item ) {
					   $(element + "-infobox").css("display", "none");
					   
					   if( item.date in budgetToDates === false ) {
						   $(element + "-" + item.date).css("stroke", "none")
					   }
				   });

			
			d3.tsv(filename2, function( error, rawData ) {
				var data = [];
				var cleaned = {};
				var rectWidth = 5;
				var rectHeight = 20;
				rawData.forEach( function( item, i ) {
					item.total = parseInt(item.total);
					if( cleaned[ item.date ] === undefined ) {
						cleaned[ item.date ] = {
								date: item.date,
								total: 0,
								movie: []
						}
						
					}
					cleaned[ item.date ].total += 1;
					cleaned[ item.date ].movie.push( "&bull; " + item.title )
				});
				
				budgetToDates = cleaned;
				for( var key in cleaned ) {
					data.push( cleaned[key] );
					$(element + "-" + cleaned[key].date).css("stroke", "#111").css("stroke-width", 3)
				}

				chart.append("text")
				.text("Top Budget")
				.attr("y", y(87))
				.attr("x", -90)

				chart.append("g")
					.attr("transform", "translate(" + barWidth + ",0)")
					.selectAll("rect")
					   .data(data)
					   .enter()
					   .append("rect")
					   .attr("id", function(d, i) {
						   	
					   		return element.replace("#", "") + "-" + d.date;
					   })
					   .attr("class", function(d) { return "budget " + d.date; })
					   .attr("width", rectWidth)
					   .attr("height", rectHeight)
					   .attr("x", function(d, i) {
					   		return x( new Date( Date.parse(d.date) ) ) - ( rectWidth / 2);
					   })
					   .attr("y", function(d) {
					   		return y(90);
					   })
					   .attr("r", function(d) {return 10})
					   .attr("fill", function(d,i) { return colorScale(d.total); })
					   .on("mouseover", function( item, i ) {
						   $(element + "-infobox").css({
								   	"display": "auto",
								   	"visibility": "visible",
									"left": x( new Date( Date.parse(item.date) ) ) + padding.left + 15,
									"top": y(80)
					   		})
							.html("<h2>" + format( new Date( Date.parse( item.date) ) ) + "</h2>Total Movies: <strong>" + movieToDates[ item.date ]+ "</strong><br/><br />Top Budget Movie(s): <strong>"+ item.movie.length +"</strong><br />" + item.movie.join("<br />"));
						   
						   $(element + "-" + item.date).css("stroke", "red").css("stroke-width", 5)
						   $(element + "-" + item.date).attr("r", 15)
						   $("rect.budget").css("opacity", 0.4);
						   $("rect.budget." + item.date ).css("opacity", 1);
					   })
					   .on("mouseout", function( item ) {
						   $("rect.budget").css("opacity", 1);
						   $(element + "-infobox").css("display", "none");
						   if( item.date in budgetToDates === false) {
							   $(element + "-" + item.date).css("stroke", "none")
						   }
						   else {
							   $(element + "-" + item.date).css("stroke", "#111").css("stroke-width", 3)
						   }
						   $(element + "-" + item.date).attr("r", sizeScale(movieToDates[ item.date ]))
					   });
				
			})			
		});

	};

	window.Chart03 = Chart03;

}(window, $, d3));