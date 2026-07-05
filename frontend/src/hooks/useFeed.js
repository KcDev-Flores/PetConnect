import { useState, useEffect } from "react";
import { getPosts, createPost } from "../services/api";
import { pets as mockPets } from "../data/mockData"; // using mock pets for activePet temporarily

const LOCAL_FEED_KEY = "petconnect_feed_posts";

function readLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_FEED_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveLocalPost(post) {
  const nextPosts = [post, ...readLocalPosts()].slice(0, 30);
  try {
    localStorage.setItem(LOCAL_FEED_KEY, JSON.stringify(nextPosts));
  } catch {
    try {
      const lightweightPosts = nextPosts.map((item) => ({
        ...item,
        image: null,
      }));
      localStorage.setItem(LOCAL_FEED_KEY, JSON.stringify(lightweightPosts));
    } catch {
      localStorage.removeItem(LOCAL_FEED_KEY);
    }
  }
}

function estimateMapPosition(locationName) {
  return {
    lat: 28 + (locationName.length * 7) % 52,
    lng: 22 + (locationName.length * 11) % 58,
  };
}

export function useFeed() {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Temporarily using the first mock pet as activePet for posting
  const activePet = mockPets[0];

  useEffect(() => {
    getPosts()
      .then((data) => {
        setFeedPosts([...readLocalPosts(), ...data]);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const publishPost = async (postDraft) => {
    const draft = typeof postDraft === "string" ? { content: postDraft } : postDraft;
    const content = draft.content?.trim() ?? "";
    const locationName = draft.location?.name?.trim() ?? "";
    if (!content && !draft.image) return;
    
    const mapPosition = locationName ? estimateMapPosition(locationName) : null;
    const newPost = {
      id: Date.now(),
      petName: activePet.name,
      icon: activePet.icon,
      content,
      image: draft.image ?? null,
      location: locationName
        ? {
            name: locationName,
            ...mapPosition,
          }
        : null,
      likes: 0,
      comments: 0,
      time: "Ahora",
    };

    saveLocalPost(newPost);
    setFeedPosts((currentPosts) => [newPost, ...currentPosts]);

    try {
      // In a real app we would get the petId from activePet
      await createPost({
        petId: activePet.id,
        content,
        imageUrl: draft.image,
        location: locationName,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return { feedPosts, loading, error, activePet, publishPost };
}
