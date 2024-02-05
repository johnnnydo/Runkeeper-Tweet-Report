function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  document.getElementById("numberActivities").textContent = "9";
  document.getElementById("firstMost").textContent = "running";
  document.getElementById("secondMost").textContent = "biking";
  document.getElementById("thirdMost").textContent = "walking";

  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
  let numTweetPerActivity = new Map();
  for (let i = 0; i < tweet_array.length; i++) {
    let activ = tweet_array[i].activityType;
    if (!numTweetPerActivity.has(activ)) {
      numTweetPerActivity.set(activ, 1);
    } else {
      let countCurrActivity = numTweetPerActivity.get(activ);
      numTweetPerActivity.set(activ, countCurrActivity + 1);
    }
  }
  //this is to get largest distance
  let numTotalDistance = new Map(); //hhave to do total distance because we are making graphs based on the top 3 distance
  for (let i = 0; i < tweet_array.length; i++) {
    let activ = tweet_array[i].activityType;
    if (!numTotalDistance.has(activ)) {
      numTotalDistance.set(activ, tweet_array[i].distance);
    } else {
      let currAcitivyDistance = numTotalDistance.get(activ);
      numTotalDistance.set(
        activ,
        currAcitivyDistance + tweet_array[i].distance
      );
    }
  }
  /* console.log(numTotalDistance); */
  let activityData = [];
  numTweetPerActivity.forEach((count, activity) => {
    activityData.push({ activity: activity, tweets: count });
  });
  /* console.log(activityData); */
  //nnow have to find the longest activity and shortest out of the top three

  document.getElementById("longestActivityType").textContent = "run";
  document.getElementById("shortestActivityType").textContent = "walk";

  /* let RunningWeek = [Sun:0, Mon:0, Tues:0,Wed:0,Thur:0,Fri:0,Sat:0]; */
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let RunningDic = new Map();
  let BikingDic = new Map();
  let WalkingDic = new Map();
  RunningDic.set("Sun", []);
  RunningDic.set("Mon", []);
  RunningDic.set("Tue", []);
  RunningDic.set("Wed", []);
  RunningDic.set("Thu", []);
  RunningDic.set("Fri", []);
  RunningDic.set("Sat", []);

  BikingDic.set("Sun", []);
  BikingDic.set("Mon", []);
  BikingDic.set("Tue", []);
  BikingDic.set("Wed", []);
  BikingDic.set("Thu", []);
  BikingDic.set("Fri", []);
  BikingDic.set("Sat", []);

  WalkingDic.set("Sun", []);
  WalkingDic.set("Mon", []);
  WalkingDic.set("Tue", []);
  WalkingDic.set("Wed", []);
  WalkingDic.set("Thu", []);
  WalkingDic.set("Fri", []);
  WalkingDic.set("Sat", []);
  //after having 3 maps of days mapping to arrays we put the distances for each activity per day for the top 3
  //which is runnign bikingand walking
  for (let i = 0; i < tweet_array.length; i++) {
    if (tweet_array[i].activityType == "running") {
      let day = weekDays[tweet_array[i].time.getDay()];
      let NewArray = RunningDic.get(day); //this is an array
      NewArray.push(tweet_array[i].distance);
      RunningDic.set(day, NewArray);
    } else if (tweet_array[i].activityType == "biking") {
      let day = weekDays[tweet_array[i].time.getDay()];
      let NewArray = BikingDic.get(day);
      NewArray.push(tweet_array[i].distance);
      BikingDic.set(day, NewArray);
    } else if (tweet_array[i].activityType == "walking") {
      let day = weekDays[tweet_array[i].time.getDay()];
      let NewArray = WalkingDic.get(day);
      NewArray.push(tweet_array[i].distance);
      WalkingDic.set(day, NewArray);
    }
  }

  document.getElementById("weekdayOrWeekendLonger").textContent = "Sunday";
  //we have to put it in arrays because vega only takes arays
  let runningData = [];
  RunningDic.forEach((distance, day) => {
    runningData.push({ day: day, distance: distance, activity: "running" });
  });

  let bikingData = [];
  BikingDic.forEach((distance, day) => {
    bikingData.push({ day: day, distance: distance, activity: "biking" });
  });

  let walkingData = [];
  WalkingDic.forEach((distance, day) => {
    walkingData.push({ day: day, distance: distance, activity: "walking" });
  });
  let combinedActivityData = [];
  combinedActivityData = combinedActivityData.concat(runningData);
  combinedActivityData = combinedActivityData.concat(bikingData);
  combinedActivityData = combinedActivityData.concat(walkingData);
  /* 
  console.log(combinedActivityData); */
  let expandedActivityData = [];

  combinedActivityData.forEach((entry) => {
    entry.distance.forEach((distanceValue) => {
      expandedActivityData.push({
        day: entry.day,
        activity: entry.activity,
        distance: distanceValue,
      });
    });
  });
  //this just combined the arrays
  /*   console.log(expandedActivityData); */
  let activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: activityData,
    },
    mark: "bar",
    encoding: {
      x: {
        field: "activity",
        type: "nominal",
        axis: { title: "Activity Type" },
      },
      y: {
        field: "tweets",
        type: "quantitative",
        axis: { title: "Number of Tweets" },
      },
    },

    //TODO: Add mark and encoding
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });
  let distancePerActivity = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A graph of distances for activities by day of the week.",
    width: 400,
    height: 300,
    data: {
      values: expandedActivityData,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "ordinal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axis: { title: "Day of the Week" },
      },
      y: {
        field: "distance",
        type: "quantitative",
        axis: { title: "Distance" },
      },
      color: {
        field: "activity",
        type: "nominal",
        scale: {
          domain: ["running", "walking", "biking"],
          range: ["#4287f5", "#f55d42", "#42f57b"],
        },
        legend: { title: "Activity Type" },
      },
      tooltip: [
        //fun little feature for hovering which shows data
        { field: "day", type: "ordinal" },
        { field: "distance", type: "quantitative" },
        { field: "activity", type: "nominal" },
      ],
    },
  };
  vegaEmbed("#distanceVis", distancePerActivity, { actions: false });
  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
  let distancePerActivityAggregated = {
    //this function the same as above, but using mean
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "An aggregated graph of average distances for activities by day of the week.",
    width: 500,
    height: 400,
    data: {
      values: expandedActivityData,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "ordinal",
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axis: { title: "Day of the Week" },
      },
      y: {
        field: "distance",
        type: "quantitative",
        aggregate: "mean",
        axis: { title: "Average Distance" },
      },
      color: {
        field: "activity",
        type: "nominal",
        scale: {
          domain: ["running", "walking", "biking"],
          range: ["#4287f5", "#f55d42", "#42f57b"],
        },
        legend: { title: "Activity Type" },
      },
      tooltip: [
        //implemented the same hover
        { field: "day", type: "ordinal" },
        { field: "distance", type: "quantitative", aggregate: "mean" },
        { field: "activity", type: "nominal" },
      ],
    },
  };

  vegaEmbed("#distanceVisAggregated", distancePerActivityAggregated, {
    actions: false,
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
  //hide the means graph first
  distanceVisAggregated.style.display = "none";
  document
    //this create a function that hids and changes the box dpeending on what is clicked.
    .getElementById("aggregate")
    .addEventListener("click", function (event) {
      var elem = event.target;

      if (elem.textContent === "Show means") {
        elem.textContent = "Show all activities";
        document.getElementById("distanceVis").style.display = "none";
        document.getElementById("distanceVisAggregated").style.display =
          "block";
      } else if (elem.textContent === "Show all activities") {
        elem.textContent = "Show means";
        document.getElementById("distanceVis").style.display = "block";
        document.getElementById("distanceVisAggregated").style.display = "none";
      }
    });
});
