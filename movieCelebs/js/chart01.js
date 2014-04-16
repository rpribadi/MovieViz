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
			.range([0, 20]);

		var colorScale =   d3.scale.log()
	        .interpolate(d3.interpolateHsl)
	        .range(["hsl(176, 100%, 50%)","hsl(340, 100%, 50%)"]);
		
		var x = d3.scale.linear()
			.range( [ 0, width ] );

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
		    .x(function(d) { return x( d.id ); })
		    .y(function(d) { return y( d.total ); });

		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			data.forEach( function( item, i ) {
				item.total = parseInt(item.total);
			});
			
			var maxTotal = d3.max(data, function(d) { return d.total; });
			x.domain( [ 0, data.length ] );
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
				.text("")
				.attr("transform", function(d) {
				    return "rotate(-35)" 
			    });

			chart.select("g.x.axis")
				.append("text")
					.attr("y", -20)
					.attr("x", width + 5)
					.attr("dy", "2.71em")
					.style("text-anchor", "end")
					.text("Celeb");

            chart.select("g.x.axis")
                .selectAll("g.tick")
                .attr("style", "opacity: 0;")

			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Total Movies");

			var barWidth = width/data.length;
		    //Create circles
			chart.append("g")
				.attr("transform", "translate(" + barWidth + ",0)")
			.selectAll("circle")
				   .data(data)
				   .enter()
				   .append("circle")
				   .attr("id", function(d, i) {
					   	
				   		return element.replace("#", "") + "-" + d.id;
				   })
				   .attr("cx", function(d, i) {
				   		return x(i);
				   })
				   .attr("cy", function(d) {
				   		return y(d.total);
				   })
				   .attr("r", function(d) { return sizeScale(d.total)})
				   .attr("fill", function(d,i) { return colorScale(d.total); })
				   .on("mouseover", function( item, i ) {
					   function checkImage(src) {
						     var img = new Image();
						     img.onload = function() {
						    	 console.log("EXISTS", src)
							     $("#chart-01-infobox").prepend(img);
						     };
						     img.onerror = function() {
						    	 console.log("MISSING", src)
						     };

						     img.src = src; // fires off loading of image
					   }
					   
					   checkImage("img/" + item.name.replace(/ /g, "_") + ".jpg");
					   
					   $("#chart-01-infobox").css({
							   	"display": "auto",
							   	"visibility": "visible",
								"left": x(i) + 60,
								"top": y(item.total)
					   		})
							.html("<h2>" + item.name + "</h2><p>Total Movie(s): <strong>" + item.total + "</strong></p>");
					   
					   $(element + "-" + item.id).css("stroke", "#666").css("stroke-width", 2)
				   })
				   .on("mouseout", function( item ) {
					   $("#chart-01-infobox").css("display", "none");
					   $(element + "-" + item.id).css("stroke", "none")
				   });

		});

	};

	window.Chart01 = Chart01;

}(window, $, d3));