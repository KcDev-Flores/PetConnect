import { useState, useEffect } from "react";
import { getPosts, createPost } from "../services/api";
import { pets as mockPets } from "../data/mockData"; // using mock pets for activePet temporarily

export function useFeed() {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Temporarily using the first mock pet as activePet for posting
  const activePet = mockPets[0];

  useEffect(() => {
    getPosts()
      .then((data) => { setFeedPosts(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const publishPost = async (content) => {
    if (!content.trim()) return;
    
    // In a real app we would get the petId from activePet
    await createPost({ petId: activePet.id, content });
    
    // Optimistic update
    setFeedPosts([{
      id: Date.now(),
      petName: activePet.name,
      icon: activePet.icon,
      content,
      likes: 0,
      comments: 0,
      time: "Ahora",
    }, ...feedPosts]);
  };

  return { feedPosts, loading, error, activePet, publishPost };
}
