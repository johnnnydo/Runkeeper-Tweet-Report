class Tweet {
  private text: string;
  time: Date;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    if (this.text.includes("completed") || this.text.includes("posted")) {
      return "completed_event";
    } else if (this.text.includes("Achieved") || this.text.includes("Goal")) {
      return "achievement";
    } else if (this.text.includes("Watch") || this.text.includes("right now")) {
      return "live_event";
    } else {
      return "miscellaneous";
    }
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    //TODO: identify whether the tweet is written
    if (this.text.includes("-")) {
      return true;
    } else {
      return false;
    }
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    } else {
      let UserWrittenPart = this.text.substring(
        this.text.indexOf("-"),
        this.text.indexOf("https")
      );
      return UserWrittenPart;
    }
    //TODO: parse the written text from the tweet
  }

  get activityType(): string {
    //have to use space in strings because of conflicting words such as 'ski' would show 'skinned'
    if (this.source != "completed_event") {
      return "unknown";
    }
    /*  let SentenceWords = this.text.split("");
    let activityPosition = this.text.search("-") - 1; */
    if (this.text.includes(" ski ") || this.text.includes(" run ")) {
      if (this.text.includes(" ski ") && !this.text.includes(" run ")) {
        return "skiing";
      } else if (this.text.includes(" run ") && !this.text.includes(" ski ")) {
        return "running";
      }
    } else if (this.text.includes(" bike ") || this.text.includes(" mtn ")) {
      if (this.text.includes(" bike ") && !this.text.includes(" mtn ")) {
        return "biking";
      } else if (this.text.includes(" mtn ")) {
        return "mountain biking";
      }
    } else if (
      this.text.includes(" walk ") ||
      this.text.includes(" walking ")
    ) {
      return "walking";
    } else if (this.text.includes(" activity ")) {
      return "activity";
    } else if (this.text.includes(" swim ")) {
      return "swimming";
    } else if (this.text.includes("workout")) {
      return "workout";
    } else if (this.text.includes("yoga")) return "yoga";
    return "";
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    if (this.text.includes(" mi ")) {
      const words = this.text.split(" ");
      let number = 0;
      for (const word of words) {
        const potentialNumber = parseFloat(word);
        if (!isNaN(potentialNumber)) {
          number = potentialNumber;
          break;
        }
      }

      return number;
    } else if (this.text.includes(" km ")) {
      const words = this.text.split(" ");
      let number = 0;
      for (const word of words) {
        const potentialNumber = parseFloat(word);
        if (!isNaN(potentialNumber)) {
          number = potentialNumber;
          break;
        }
      }
      let toMi = number * 0.621371;
      return toMi;
    } else if (this.text.includes("yoga")) {
      const words = this.text.split(" ");
      let number = 0;
      for (const word of words) {
        const potentialNumber = parseFloat(word);
        if (!isNaN(potentialNumber)) {
          number = potentialNumber;
          break;
        }
      }
      return number;
    }
    return 0;
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    return "<tr></tr>";
  }
}
