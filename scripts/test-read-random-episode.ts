// scripts/test-rss.ts
import { Episode, getRandomEpisode } from '../lib/read-random-episode';

let episode : Episode = getRandomEpisode();

console.log(`Picked ${episode.title}!`)


