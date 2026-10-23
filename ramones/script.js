function new_count(word) {
	word = word.toLowerCase();
	// Strip punctuation from the ends ("Ph.D." -> "ph.d", "DDT," -> "ddt", "moonlight?" -> "moonlight")
	// so the special cases match and the silent-e rule below sees the real end of the word.
	word = word.replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');

  	//case-specific syllable corrections
  	if(word === "d.u.m.b" || word === "1-2-3-4" || word === "4-5-6-7") { return 4; }
  	else if (word === "ph.d" || word === "sla" || word === "pt-boat" || word === "somebody" || word === "lsd" || word === "ddt" || word === "cia" || word === "ooo-ooo-whee" || word === "53rd" || word === "everything's") { return 3; }
  	else if(word === "tryin'" || word === "moonlight" || word === "lovely" || word === "wanted" || word === "couldn't" || word === "basement" || word ==="real" || word === "somethin'" || word === "daughter" || word === "going" || word === "viet" || word === "lying" || word === "tv's" || word === "doing" || word === "gimme" || word === "tired" || word ==="cryin'" || word === "schatze" || word === "baseball") { return 2; }
  	else if(word.length <= 3 || word === "hand" || word === "there's" || word === "where's" || word === "future's" || word === "rule") { return 1; }

  	word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  	word = word.replace(/^y/, '');

  	// No vowels left: count it as one syllable rather than returning nothing.
  	var vowelGroups = word.match(/[aeiouy]{1,2}/g);
  	return vowelGroups === null ? 1 : vowelGroups.length;
  }


  function rollinHaiku(data) {
  	var randomIndex = Math.floor(Math.random() * data.length);
  	var syllableCount = 0;
  	var words = [];
  	var haiku = [];
  	var hitFive = false;
  	var hitTwelve = false;
  	while (syllableCount < 17)
  	{
  		// Wrap around to the start so a start near the end of the list can't run off it.
  		var word = data[randomIndex % data.length];
  		words.push(word);
  		var syllables = new_count(word)
  		syllableCount += syllables
  		if(syllableCount === 5) {
  			hitFive = true;
  			haiku.push(words);
  			words = [];
  		}
  		else if (syllableCount === 12) {
  			hitTwelve = true;
  			haiku.push(words);
  			words = [];
  		}
  		else if (syllableCount === 17) {
  			haiku.push(words);
  			words = [];
  		}
  		randomIndex++
  	}
  	if(syllableCount > 17 || hitFive === false || hitTwelve === false) {
  		return rollinHaiku(data)
  	}
  	else {
  		return haiku

  	}
  }

  
String.prototype.toTitleCase = function () {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
    if (index > 0 && index + p1.length !== title.length &&
      p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

  function getSyllableLines() {
  	$("body").addClass("syllable")
  	$.get('lyrics.txt', function(data) {
  		data = data.replace(/(\r\n|\n|\r)/gm," ").split(" ");
  		var haiku = rollinHaiku(data);
  		var firstLine = haiku[0].toString().replace(/,/g, " ");
  		var secondLine = haiku[1].toString().replace(/,/g, " ");
  		var thirdLine = haiku[2].toString().replace(/,/g, " ")
  		$(".first-line").text(firstLine.toTitleCase())
  		$(".second-line").text(secondLine.toTitleCase())
  		$(".third-line").text(thirdLine.toTitleCase())

  	});
  }

  function getRegularLines() {
  	$("body").removeClass("syllable")
  	$.get('lyrics.txt', function(data) {

  		data = data.split("\n");
  		var lines = []
  		var i = 0
  		while (i < 3) {
  			var lineNumber = Math.floor(Math.random() * data.length);
  			lines.push(data[lineNumber]);
  			i++
  		}

  		$(".first-line").text(lines[0].toTitleCase())
  		$(".second-line").text(lines[1].toTitleCase())
  		$(".third-line").text(lines[2].toTitleCase())	
  	})
  }

  $(document).ready(function() {
  	getRegularLines();
  	$("#more").click(function(e) {
  		e.preventDefault();

  		// .promise().done runs once after both elements finish, instead of once per element.
  		$(".haiku, #explanation").animate({
  			left: '-150%'
  		}, 'fast').promise().done(function() {
  			$("#explanation").hide();
  			$('body').removeClass('what')
  			$('.haiku').css("left","150%");

  			if($("#syllables").is(':checked')) {
  				getSyllableLines();			
  			}
  			else {
  				getRegularLines();
  			}

  			$('.haiku').animate({
  				left: '50%'
  			}, 'fast')
  		})

  	})

  	$("#what a").click(function(e) {
  		e.preventDefault();
  		if(!$('body').hasClass('what')) {
  			$(".haiku").animate({
  				left: '-150%'
  			}, 'fast', function() {
  				$('body').addClass('what')
  				$('#explanation').css("left","150%");
  				$("#explanation").show().animate({
  					left: '50%'
  				})
  			})
  		}
  	})

  })
