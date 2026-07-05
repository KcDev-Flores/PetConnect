import { useState, useEffect } from "react";
import { getPosts, createPost } from "../services/api";
import { currentUser, pets as mockPets } from "../data/mockData";
import { loadDeletedOwnedPetIds, loadOwnedPets } from "../data/localPets";

const LOCAL_FEED_KEY = "petconnect_feed_posts";
const LOCAL_FEED_INTERACTIONS_KEY = "petconnect_feed_interactions";

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

function readLocalInteractions() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_FEED_INTERACTIONS_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveLocalInteractions(interactions) {
  localStorage.setItem(LOCAL_FEED_INTERACTIONS_KEY, JSON.stringify(interactions));
}

function applyPostInteractions(post, interactions) {
  const interaction = interactions[String(post.id)] ?? {};
  const commentsList = interaction.commentsList ?? [];

  return {
    ...post,
    liked: Boolean(interaction.liked),
    likes: Math.max(0, (post.likes ?? 0) + (interaction.likeDelta ?? 0)),
    comments: (post.comments ?? 0) + commentsList.length,
    commentsList,
  };
}

function estimateMapPosition(locationName) {
  return {
    lat: 28 + (locationName.length * 7) % 52,
    lng: 22 + (locationName.length * 11) % 58,
  };
}

function getOwnedFeedPets() {
  const deletedPetIds = loadDeletedOwnedPetIds();
  const basePets = mockPets.filter((pet) =>
    currentUser.pets.includes(pet.id) && !deletedPetIds.some((id) => String(id) === String(pet.id))
  );

  return [...basePets, ...loadOwnedPets()];
}

export function useFeed() {
  const [ownedPets, setOwnedPets] = useState(() => getOwnedFeedPets());
  const [selectedPetId, setSelectedPetId] = useState(() => getOwnedFeedPets()[0]?.id ?? null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activePet = ownedPets.find((pet) => String(pet.id) === String(selectedPetId)) ?? ownedPets[0] ?? null;

  useEffect(() => {
    getPosts()
      .then((data) => {
        const interactions = readLocalInteractions();
        setFeedPosts([...readLocalPosts(), ...data].map((post) => applyPostInteractions(post, interactions)));
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const refreshOwnedPets = () => {
      const nextOwnedPets = getOwnedFeedPets();
      setOwnedPets(nextOwnedPets);
      setSelectedPetId((currentId) =>
        nextOwnedPets.some((pet) => String(pet.id) === String(currentId))
          ? currentId
          : nextOwnedPets[0]?.id ?? null
      );
    };

    window.addEventListener("focus", refreshOwnedPets);
    window.addEventListener("storage", refreshOwnedPets);

    return () => {
      window.removeEventListener("focus", refreshOwnedPets);
      window.removeEventListener("storage", refreshOwnedPets);
    };
  }, []);

  const publishPost = async (postDraft) => {
    const draft = typeof postDraft === "string" ? { content: postDraft } : postDraft;
    const content = draft.content?.trim() ?? "";
    const locationName = draft.location?.name?.trim() ?? "";
    const postPet = ownedPets.find((pet) => String(pet.id) === String(draft.petId)) ?? activePet;
    if ((!content && !draft.image) || !postPet) return;
    
    const mapPosition = locationName ? estimateMapPosition(locationName) : null;
    const newPost = {
      id: Date.now(),
      petId: postPet.id,
      petName: postPet.name,
      icon: postPet.icon,
      color: postPet.color,
      petPhotoUrl: postPet.photoUrl ?? "",
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
      commentsList: [],
      liked: false,
      time: "Ahora",
    };

    saveLocalPost(newPost);
    setFeedPosts((currentPosts) => [newPost, ...currentPosts]);

    try {
      await createPost({
        petId: postPet.id,
        content,
        imageUrl: draft.image,
        location: locationName,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePostLike = (post) => {
    const interactions = readLocalInteractions();
    const interaction = interactions[String(post.id)] ?? { liked: false, likeDelta: 0, commentsList: [] };
    const nextLiked = !interaction.liked;
    const nextInteraction = {
      ...interaction,
      liked: nextLiked,
      likeDelta: (interaction.likeDelta ?? 0) + (nextLiked ? 1 : -1),
    };

    saveLocalInteractions({
      ...interactions,
      [String(post.id)]: nextInteraction,
    });

    setFeedPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        String(currentPost.id) === String(post.id)
          ? {
              ...currentPost,
              liked: nextLiked,
              likes: Math.max(0, (currentPost.likes ?? 0) + (nextLiked ? 1 : -1)),
            }
          : currentPost
      )
    );
  };

  const addPostComment = (post, text) => {
    const body = text.trim();
    if (!body) return;

    const comment = {
      id: Date.now(),
      author: currentUser.name,
      text: body,
      time: "Ahora",
    };
    const interactions = readLocalInteractions();
    const interaction = interactions[String(post.id)] ?? { liked: false, likeDelta: 0, commentsList: [] };
    const nextInteraction = {
      ...interaction,
      commentsList: [...(interaction.commentsList ?? []), comment],
    };

    saveLocalInteractions({
      ...interactions,
      [String(post.id)]: nextInteraction,
    });

    setFeedPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        String(currentPost.id) === String(post.id)
          ? {
              ...currentPost,
              comments: (currentPost.comments ?? 0) + 1,
              commentsList: [...(currentPost.commentsList ?? []), comment],
            }
          : currentPost
      )
    );
  };

  return {
    feedPosts,
    loading,
    error,
    ownedPets,
    activePet,
    selectedPetId,
    setSelectedPetId,
    publishPost,
    togglePostLike,
    addPostComment,
  };
}
