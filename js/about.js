function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	
	//source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
	var options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	//have to make variables can't put numbertweets-1 directly
	let firstdate;
	let lastdate;
	//the tweet array is reversed latest ot oldest
	lastdate = tweet_array[0].time;
	firstdate = tweet_array[tweet_array.length-1].time;
	/* document.getElementById('firstDate').innerText = firstdate.toLocaleDateString('en-US',options ); 
	document.getElementById('lastDate').innerText = lastdate.toLocaleDateString('en-US',options );  */
 	$('#firstDate').text(firstdate.toLocaleDateString('en-US',options ));
	$('#lastDate').text(lastdate.toLocaleDateString('en-US',options));

	let completedCount = 0;
	let achievementCount = 0;
	let liveEventCount = 0;
	let miscellaneousCount = 0;

	for (let i = 0; i < tweet_array.length; i++) { 
		let temp = tweet_array[i].source;
		if (temp == "completed_event") {
			completedCount++;
		} else if (temp == "live_event") {
			liveEventCount++;
		} else if (temp == "achievement") {
			achievementCount++;
		} else if (temp == "miscellaneous") {
			miscellaneousCount++;
		}
	}
	

	
	let NumofTweets = tweet_array.length;
	$(".completedEvents").text(completedCount);
	$('.liveEvents').text(liveEventCount);
	$('.achievements').text(achievementCount);
	$('.miscellaneous').text(miscellaneousCount);
	let completedCountPerc = math.format((completedCount/NumofTweets)*100, 4);
	let achievementCountPerc = math.format((achievementCount/NumofTweets)*100, 2);
	let liveEventCountPerc = math.format((liveEventCount/NumofTweets)*100, 3);
	let miscellaneousPerc = math.format((miscellaneousCount/NumofTweets)*100, 2);

	$('.completedEventsPct').text(completedCountPerc+"%");
	$('.liveEventsPct').text(liveEventCountPerc+"%");
	$('.achievementsPct').text(achievementCountPerc+"%");
	$('.miscellaneousPct').text(miscellaneousPerc+"%");
	let writtenCount = 0;
	for (let i = 0; i < tweet_array.length; i++) { 
		if (tweet_array[i].written) {
			writtenCount++;
		}
	}
	$('.written').text(writtenCount);
	let writtenCountPerc = math.format((writtenCount/NumofTweets)*100, 4);
	$('.writtenPct').text(writtenCountPerc+'%');
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
//changing just to test.