// YouTube Data API v3 - Free tier example
// Get channel statistics for celebrities

import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Free from Google Cloud Console

// Example: Get subscriber count, view count, video count
export async function getYouTubeStats(channelId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'statistics,snippet',
        id: channelId,
        key: YOUTUBE_API_KEY
      }
    });

    const channel = response.data.items[0];
    
    return {
      platform: 'YouTube',
      username: channel.snippet.title,
      subscribers: parseInt(channel.statistics.subscriberCount),
      views: parseInt(channel.statistics.viewCount),
      videos: parseInt(channel.statistics.videoCount),
      thumbnail: channel.snippet.thumbnails.default.url
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

// Example celebrity channels:
const CELEBRITY_CHANNELS = {
  mrBeast: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
  pewdiepie: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
  tseries: 'UCq-Fj5jknLsUf-MWSy4_brA',
  // Add more...
};

// Usage:
// const stats = await getYouTubeStats(CELEBRITY_CHANNELS.mrBeast);

/*
FREE TIER LIMITS:
- 10,000 quota units per day
- 1 channel query = ~3 units
- Can query ~3,000 channels per day
- Completely free forever
*/
