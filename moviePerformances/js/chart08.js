(function(window, $, d3) {

	"use strict";

	var Chart08 = function(element, filename) {
		var svg = d3.select(element);
		var padding = {
			top: 30,
			bottom: 50,
			left: 300,
			right: 50
		};

		var width = $( element ).width() - padding.left - padding.right;
		var height = $( element ).height() - padding.top - padding.bottom;


		var x = d3.scale.linear()
		    .range( [ 0, width ] );

		var y = d3.scale.ordinal()
			.rangeRoundBands( [ height, 0 ], .2 );
	
		var format = d3.format(",");
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
			.tickFormat( function( item ) { return format( Math.abs(item) ); } );
	
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
	
		var chart = svg.append("g")
	    	.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
		
		d3.tsv(filename, function( error, data ) {
			var minMax = [];
			data.forEach( function( item ) {
				item.budget = parseInt(item.budget);
				item.gross = parseInt(item.gross);
				item.revenue = parseInt(item.revenue);
				minMax = minMax.concat([ item.budget, item.gross, item.revenue ]);
			});

			x.domain( [ -250000000, 425000000 ] );
			y.domain( data.map( function(d) { return d.title; } ) );

		    yAxis.ticks( data.length );
			
			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
                .append("text")
                    .attr("y", -20)
                    .attr("x", width)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Amount (USD)");


			chart.append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Movies");

			chart.append("g")
				.attr("class", "budget")
				.selectAll("rect")
				.data( data )
				.enter()
				.append("rect")
					.attr("x", function( item ) { return x( -item.budget ); } )
					.attr("y", function( item ) { return y( item.title ); } )
					.attr("width", function( item ) { return Math.abs( x( item.budget ) - x(0) ); } )
					.attr("height", y.rangeBand() )
					.on("mouseover", function( item, i ) {
						mouseOver( item, i, "budget", this );
					})
					.on("mouseout", function( item, i ) {
						mouseOut( item, i, "budget", this );
					});

			chart.append("g")
				.attr("class", "gross")
				.selectAll("rect")
				.data( data )
				.enter()
				.append("rect")
					.attr("x", function( item ) { return x(0); } )
					.attr("y", function( item ) { return y( item.title ); } )
					.attr("width", function( item ) { return Math.abs( x( item.gross ) - x(0) ); } )
					.attr("height", y.rangeBand() )
					.on("mouseover", function( item, i, j, k ) {
						console.log( this, i, j, k)
						mouseOver( item, i, "gross", this );
					})
					.on("mouseout", function( item, i ) {
						mouseOut( item, i, "gross", this );
					});

			chart.append("g")
			.attr("class", "revenue")
			.selectAll("rect")
			.data( data )
			.enter()
			.append("rect")
				.attr("class", function( item ) {
					if( item.revenue > 0 ) {
						return "gain"; 
					}
					else {
						return "loss";
					}
				})
				.attr("x", function( item ) {
					if( item.revenue > 0 ) {
						return x(0); 
					}
					else {
						return x( item.revenue );
					}
				})
				.attr("y", function( item ) { return y( item.title ) + 3; } )
				.attr("width", function( item ) { return Math.abs( x( item.revenue ) - x(0) ); } )
				.attr("height", y.rangeBand() - 6 )
				.on("mouseover", function( item, i ) {
					mouseOver( item, i, "revenue", this );
				})
				.on("mouseout", function( item, i ) {
					mouseOut( item, i, "revenue", this );
				});

			var legend = chart.append("g").attr("class", "legend");
			var xPos = 350000000;

			legend.append("rect")
				.attr("class", "budget")
				.attr("width", y.rangeBand())
				.attr("height", y.rangeBand())
				.attr("x", x( xPos ))
				.attr("y", padding.top + ( 1 * y.rangeBand() ) )

			legend.append("text")
				.text("Budget")
				.attr("class", "budget")
				.attr("x", x( xPos ) + ( 2 * y.rangeBand() ))
				.attr("y", padding.top + ( 2 * y.rangeBand() ))
				
			legend.append("rect")
				.attr("class", "gross")
				.attr("width", y.rangeBand())
				.attr("height", y.rangeBand())
				.attr("x", x( xPos ))
				.attr("y", padding.top + ( 3 * y.rangeBand() ) )

			legend.append("text")
				.text("Gross")
				.attr("class", "gross")
				.attr("x", x( xPos ) + ( 2 * y.rangeBand() ))
				.attr("y", padding.top + ( 4 * y.rangeBand() ))
				
			legend.append("rect")
				.attr("class", "gain")
				.attr("width", y.rangeBand())
				.attr("height", y.rangeBand())
				.attr("x", x( xPos ))
				.attr("y", padding.top + ( 5 * y.rangeBand() ) )
				
			legend.append("text")
				.text("Profit")
				.attr("class", "gain")
				.attr("x", x( xPos ) + ( 2 * y.rangeBand() ))
				.attr("y", padding.top + ( 6 * y.rangeBand() ))
				
			legend.append("rect")
				.attr("class", "loss")
				.attr("width", y.rangeBand())
				.attr("height", y.rangeBand())
				.attr("x", x( xPos ))
				.attr("y", padding.top + ( 7 * y.rangeBand() ) )
			
			legend.append("text")
				.text("Loss")
				.attr("class", "loss")
				.attr("x", x( xPos ) + ( 2 * y.rangeBand() ))
				.attr("y", padding.top + ( 8 * y.rangeBand() ))
				
		});
		
		function mouseOver( item, i, type, target ) {
			var format = d3.format("$,")
			var text = "<h2>" + item.title + "</h2>";
			text += "<p>Budget:<br /><strong>USD " + format( item.budget ) + "</strong></p>";
			text += "<p>Gross:<br /><strong>USD " + format( item.gross ) + "</strong></p>";
			text += "<p>Revenue:<br /><strong>USD " + format( item.revenue) + "</strong></p>";

			console.log( type )
			var left = x(0);
			if( type === "gross") {
				left = x( item.gross );
				console.log("gross", left)
			}
			else if( type === "budget") {
				left = x( -item.budget )  - 175;
				console.log("budget", left)
			}
			else {
				if( item.revenue > 0 ) {
					left = x( item.gross );
				}
				else {
					left = x( -item.budget )  - 175;
				}
				console.log("revenue", left)
			}
			
			$(element + "-infobox").css({
			   	"display": "auto",
			   	"visibility": "visible",
				"left": padding.left + left,
				"top": padding.top + y( item.title )
	   		})
			.html(text);			

			console.log(target)
			target.setAttribute("stroke-width", 3)
			target.setAttribute("stroke", "#888")
		}
		
		function mouseOut( item, i, type, target ) {
			$(element + "-infobox").css("display", "none");
			target.setAttribute("stroke", "none")
		}
	};

	window.Chart08 = Chart08;

}(window, $, d3));