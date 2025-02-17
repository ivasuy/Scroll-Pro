## Scroll Pro - Next.js Project

### Thought Process & Design Choices

#### 1. Scrolling Experience (Vertical Reel Navigation)

**Objective:** The reels should provide a smooth, Instagram-like vertical scrolling experience.

**Solution:**

- Used CSS snap scrolling (`snap-y snap-mandatory`) to enable a clean, intuitive transition between reels.
- Intersection Observer API ensures that when a reel enters the viewport, it starts playing, and when it leaves, it pauses.
- Implemented custom scroll control (`handleWheel`) to enable seamless navigation via mouse scroll.

#### 2. Autoplay & Pause Functionality

**Objective:** Ensure that videos automatically play when they enter the viewport and pause when they exit.

**Solution:**

- Used `isActive` state to determine which reel is currently in focus.
- Integrated `useEffect` in the Reels component:

```tsx
useEffect(() => {
  if (videoRef.current) {
    if (isActive) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }
}, [isActive]);
```

This ensures that only one video plays at a time while others remain paused.

#### 3. Video Controls (Play/Pause, Mute/Unmute)

**Objective:** Provide essential controls for a user-friendly experience.

**Solution:**

- Implemented mute/unmute toggle using state:

```tsx
useEffect(() => {
  if (videoRef.current) videoRef.current.muted = isMuted;
}, [isMuted]);
```

- Play/pause button allows users to interact with the video:

```tsx
const togglePlayPause = () => {
  if (videoRef.current) {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  }
};
```

#### 4. Smooth Transitions Between Reels

**Objective:** Enable smooth transitions when switching between reels.

**Solution:**

- Implemented smooth scrolling with `scrollIntoView()` inside `scrollToReel()`:

```tsx
const scrollToReel = (index: number) => {
  if (isScrolling) return;
  setIsScrolling(true);
  const element = document.getElementById(`reel-${index}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveReelIndex(index);
    setShowScrollMessage(false);
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }
};
```

#### 5. Responsiveness & Adaptive Design

**Objective:** Ensure usability across mobile, tablet, and desktop.

**Solution:**

- Used CSS flexbox/grid layouts for dynamic content structuring.
- Leveraged Tailwind CSS classes (`h-screen w-full object-cover`) for responsive scaling.
- `overflow-y-hidden` prevents unintended page scrolling outside the component.

#### 6. Dynamic Data Handling

**Objective:** Support API data integration while maintaining modularity for future updates.

**Solution:**

- Used `fetchVideos()` to retrieve video content dynamically.
- Implemented error handling in case of API failures:

```tsx
export const fetchVideos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

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
```

- **Lazy loading & infinite scroll:** Implemented Intersection Observer to detect the last reel and load more dynamically.

#### 7. Modularity & Scalability

**Objective:** Ensure that the design can be easily extended.

**Solution:**

- Separated concerns by creating a reusable `Reels` component.
- Used TypeScript interface `Reel` for type safety.
- Implemented `ReelProps` to maintain strong typing and component flexibility.

#### 8. Additional Enhancements

(i) **Like & Share Feature**

- Users can like reels using the heart icon (`isLiked` state).
- Users can share the product link via clipboard copying:

```tsx
const handleShare = async () => {
  await navigator.clipboard.writeText(productUrl);
  setShowPopup(true);
  setTimeout(() => setShowPopup(false), 2000);
};
```

- Provides instant user feedback via a toast notification.

(ii) **Product Tagging with Animation**
**Objective:** Make product details visually engaging.

**Solution:**

- Implemented a button overlay for product details (`productName`).
- Used animation effects (`animate-fade-in`) for a smoother appearance.

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/reel-viewer.git
cd reel-viewer
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Future Improvements

### 1. Better Video API Integration

- Replace the placeholder API (`https://api.coverr.co/videos?query=products`) with a more relevant video source.

### 2. User Authentication

- Add a login system so users can save their liked reels.

### 3. Persistent Likes & Shares

- Store likes and shares in a backend database or local storage.

### 4. Lazy Loading and Caching

- Implement better lazy loading techniques for improved performance.
