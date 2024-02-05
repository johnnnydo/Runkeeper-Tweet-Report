let tweetInfoArray = [];
function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  //TODO: Filter to just the written tweets
  tweet_array = runkeeper_tweets.map(function (tweet) {
    //have to get the tweets i just copied this part form other areas
    return new Tweet(tweet.text, tweet.created_at);
  });

  let tweetIndex = 1;
  for (let i = 0; i < tweet_array.length; i++) {
    const currentTweet = tweet_array[i];
    if (currentTweet.written) {
      tweetInfoArray.push({
        tweetNumber: tweetIndex,
        activityType: currentTweet.activityType,
        UserTweet: currentTweet.text,
      });
      tweetIndex++;
    }
  }
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table\
  document.getElementById("searchText").textContent =
    document.getElementById("textFilter").value;

  let search = document.getElementById("searchText").textContent;

  let currentUserFilter = [];
  for (i = 0; i < tweetInfoArray.length; i++) {
    if (tweetInfoArray[i].UserTweet.includes(search)) {
      currentUserFilter.push(tweetInfoArray[i]);
    }
  }
  //filter the array to have the included text

  document.getElementById("searchCount").textContent = currentUserFilter.length;

  let tweetTable = document.getElementById("tweetTable");
  //we have to clear table before updating
  tweetTable.innerHTML = "";

  currentUserFilter.forEach((element) => {
    let row = document.createElement("tr"); // creates a row

    let tweetNum = document.createElement("td");
    tweetNum.textContent = element.tweetNumber;
    //each row has a tweet num
    row.appendChild(tweetNum);

    let ActivityType = document.createElement("td");
    ActivityType.textContent = element.activityType;
    row.appendChild(ActivityType);

    // add the tweet itself
    let TweetWritten = document.createElement("td");
    TweetWritten.innerHTML = element.UserTweet;
    row.appendChild(TweetWritten);

    tweetTable.appendChild(row);
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
});
