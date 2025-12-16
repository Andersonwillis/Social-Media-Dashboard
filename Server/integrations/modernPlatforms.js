// Modern Free API Integration Examples
// Copy these to Server/integrations/

// 1. TWITCH INTEGRATION
export async function getTwitchStats(username) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const accessToken = process.env.TWITCH_ACCESS_TOKEN;
  
  try {
    // Get user data
    const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const userData = await userResponse.json();
    const user = userData.data[0];
    
    // Get follower count
    const followersResponse = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`,
      {
        headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const followersData = await followersResponse.json();
    
    return {
      id: 'twitch',
      platform: 'Twitch',
      username: user.display_name,
      count: followersData.total,
      today: Math.floor(Math.random() * 50), // Would need historical data
      trend: 'up',
      profileImage: user.profile_image_url,
      description: user.description
    };
  } catch (error) {
    console.error('Twitch API Error:', error);
    return null;
  }
}

// 2. GITHUB INTEGRATION  
export async function getGitHubStats(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: process.env.GITHUB_TOKEN ? {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      } : {}
    });
    
    const data = await response.json();
    
    // Get total stars across all repos
    const reposResponse = await fetch(data.repos_url);
    const repos = await reposResponse.json();
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    return {
      id: 'github',
      platform: 'GitHub',
      username: data.login,
      count: data.followers,
      today: Math.floor(Math.random() * 20),
      trend: 'up',
      extra: {
        repos: data.public_repos,
        stars: totalStars,
        gists: data.public_gists
      },
      profileImage: data.avatar_url
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return null;
  }
}

// 3. REDDIT INTEGRATION (No auth needed!)
export async function getRedditStats(username) {
  try {
    const response = await fetch(`https://www.reddit.com/user/${username}/about.json`);
    const data = await response.json();
    const user = data.data;
    
    return {
      id: 'reddit',
      platform: 'Reddit',
      username: user.name,
      count: user.total_karma,
      today: Math.floor(Math.random() * 100),
      trend: user.link_karma > 0 ? 'up' : 'down',
      extra: {
        postKarma: user.link_karma,
        commentKarma: user.comment_karma
      },
      profileImage: user.icon_img
    };
  } catch (error) {
    console.error('Reddit API Error:', error);
    return null;
  }
}

// 4. SPOTIFY INTEGRATION
export async function getSpotifyArtistStats(artistId) {
  try {
    // Get access token
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });
    
    const { access_token } = await tokenResponse.json();
    
    // Get artist data
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const artist = await artistResponse.json();
    
    return {
      id: 'spotify',
      platform: 'Spotify',
      username: artist.name,
      count: artist.followers.total,
      today: Math.floor(Math.random() * 500),
      trend: 'up',
      extra: {
        popularity: artist.popularity,
        genres: artist.genres.join(', ')
      },
      profileImage: artist.images[0]?.url
    };
  } catch (error) {
    console.error('Spotify API Error:', error);
    return null;
  }
}

// 5. MASTODON INTEGRATION
export async function getMastodonStats(instance, username) {
  try {
    const response = await fetch(`https://${instance}/api/v1/accounts/lookup?acct=${username}`);
    const data = await response.json();
    
    return {
      id: 'mastodon',
      platform: 'Mastodon',
      username: data.username,
      count: data.followers_count,
      today: Math.floor(Math.random() * 30),
      trend: 'up',
      extra: {
        following: data.following_count,
        posts: data.statuses_count,
        instance: instance
      },
      profileImage: data.avatar
    };
  } catch (error) {
    console.error('Mastodon API Error:', error);
    return null;
  }
}

// 6. DEV.TO INTEGRATION
export async function getDevToStats(username) {
  try {
    const userResponse = await fetch(`https://dev.to/api/users/by_username?url=${username}`);
    const user = await userResponse.json();
    
    const articlesResponse = await fetch(`https://dev.to/api/articles?username=${username}`);
    const articles = await articlesResponse.json();
    
    const totalReactions = articles.reduce((sum, article) => sum + article.public_reactions_count, 0);
    
    return {
      id: 'devto',
      platform: 'Dev.to',
      username: user.username,
      count: totalReactions,
      today: Math.floor(Math.random() * 50),
      trend: 'up',
      extra: {
        articles: articles.length,
        followers: user.followers_count || 0
      },
      profileImage: user.profile_image
    };
  } catch (error) {
    console.error('Dev.to API Error:', error);
    return null;
  }
}

// USAGE EXAMPLE:
export async function getAllStats() {
  const [youtube, twitch, github, reddit] = await Promise.all([
    getYouTubeStats('UC-lHJZR3Gqxm24_Vd_AJ5Yw'), // PewDiePie
    getTwitchStats('ninja'),
    getGitHubStats('torvalds'), // Linus Torvalds
    getRedditStats('spez') // Reddit CEO
  ]);
  
  return [youtube, twitch, github, reddit].filter(Boolean);
}

/*
ENVIRONMENT VARIABLES NEEDED:

# YouTube
YOUTUBE_API_KEY=your_key_here

# Twitch
TWITCH_CLIENT_ID=your_client_id
TWITCH_ACCESS_TOKEN=your_access_token

# GitHub (optional, increases rate limit)
GITHUB_TOKEN=your_personal_access_token

# Spotify
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# Reddit - No auth needed!
# Mastodon - No auth needed!
# Dev.to - No auth needed!
*/
