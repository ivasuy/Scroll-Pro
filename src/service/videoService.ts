import axios from "axios";

const API_URL = "https://api.coverr.co/videos?query=products";
const API_KEY = "51b0fb22ac895f3c82dfcba403cb19fe";

export const fetchVideos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    // console.log("videos", JSON.stringify(response.data, null, 2));

    return response.data.hits
      .filter((video: any) => video.playback_id)
      .map((video: any, index: number) => ({
        id: index + 1,
        videoUrl: `https://storage.coverr.co/videos/${video.playback_id}`,
        productName: video.title,
        productUrl: video.poster,
      }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};
