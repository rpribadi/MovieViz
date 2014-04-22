function setMenu() {
	var menu = $("<ul></ul>");
	menu.addClass("menu")
	
	var genre = $("<li><a href='../movieGenres/'>Genres</a></li>");
	menu.append(genre);
	
	var performance = $("<li><a href='../moviePerformances/'>Budget / Profit (Loss)</a></li>");
	menu.append(performance);

	var torrent = $("<li><a href='../movieOscars/'>Torrents</a></li>");
	menu.append(torrent);

	var celeb = $("<li><a href='../movieCelebs/'>Celebs</a></li>");
	menu.append(celeb);

	var release= $("<li><a href='../movieReleases/'>Release Dates</a></li>");
	menu.append(release);

	var production = $("<li><a href='../movieProductions/'>Productions</a></li>");
	menu.append(production);

	switch( activeMenu ) {
		case "genres": genre.addClass("active"); break;
		case "performance": performance.addClass("active"); break;
		case "torrent": torrent.addClass("active"); break;
		case "celeb": celeb.addClass("active"); break;
		case "release": release.addClass("active"); break;
		case "production": production.addClass("active"); break;
	}
	$("body").prepend(menu)
};

setMenu();

