import { Reel } from "@/components/ReelList";
import axios from "axios";

const API_URL = "https://api.coverr.co/videos?query=products";
const API_KEY = "51b0fb22ac895f3c82dfcba403cb19fe";

interface Video {
  playback_id: string;
  title: string;
  poster: string;
}

export const fetchVideos = async (): Promise<Reel[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    return response.data.hits
      .filter((video: Video) => video.playback_id)
      .map((video: Video, index: number) => ({
        id: (index + 1).toString(),
        videoUrl: `https://storage.coverr.co/videos/${video.playback_id}`,
        productName: video.title,
        productUrl: video.poster,
      }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};
