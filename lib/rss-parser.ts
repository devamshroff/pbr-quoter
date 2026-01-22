// import Parser from 'rss-parser';
// // this file contains functions that interact with rss feeds

// export interface Episode {
//     title: string;
//     audioUrl: string;
//     description: string;
//     publishDate: string;
//     episodeUrl: string;
//   }


// const parser = new Parser();

// export async function getRandomEpisode(): Promise<Episode> {
//     const RSS_FEED_URL = process.env.RSS_FEED_URL!;
//     console.log(`Pulling episodes from ${RSS_FEED_URL}`)
//     const feed = await parser.parseURL(RSS_FEED_URL);
//     console.log(`Found ${feed.items.length} episodes`)
//     // pick a random episode
//     const randomIndex = Math.floor(Math.random() * feed.items.length)
//     const episodeJson = feed.items.at(randomIndex)
//     console.log(`Picking ${episodeJson?.title}`)

//     // deserialize and return
//     return {
//         title: episodeJson?.title || '',
//         audioUrl: episodeJson?.enclosure?.url || '',
//         description: episodeJson?.contentSnippet || '',
//         publishDate: episodeJson?.isoDate || '',
//         episodeUrl: episodeJson?.link || ''
//     }
// }

  