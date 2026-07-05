import { useState, useEffect } from "react";
import { addComment, createPost, getComments, getPosts, getPublicPets, getUserPets } from "../services/api";
import { createSessionProfile, getSessionUserId } from "../utils/sessionUser";

const LOCAL_FEED_INTERACTIONS_KEY = "petconnect_feed_interactions";

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

  return {
    ...post,
    liked: Boolean(interaction.liked),
    likes: Math.max(0, (post.likes ?? 0) + (interaction.likeDelta ?? 0)),
    comments: post.commentsList?.length ?? post.comments ?? 0,
    commentsList: post.commentsList ?? [],
  };
}

async function attachCommentsToPosts(posts) {
  const commentResults = await Promise.allSettled(
    posts.map((post) => getComments(post.id))
  );

  return posts.map((post, index) => {
    const result = commentResults[index];
    const commentsList = result.status === "fulfilled" ? result.value : post.commentsList ?? [];

    return {
      ...post,
      commentsList,
      comments: commentsList.length || post.comments || 0,
    };
  });
}

function estimateMapPosition(locationName) {
  return {
    lat: 28 + (locationName.length * 7) % 52,
    lng: 22 + (locationName.length * 11) % 58,
  };
}

export function useFeed() {
  const currentUser = createSessionProfile();
  const userId = getSessionUserId();
  const [ownedPets, setOwnedPets] = useState([]);
  const [publicPets, setPublicPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activePet = ownedPets.find((pet) => String(pet.id) === String(selectedPetId)) ?? ownedPets[0] ?? null;

  useEffect(() => {
    let isActive = true;

    Promise.allSettled([
      getPosts().then(attachCommentsToPosts),
      getUserPets(userId),
      getPublicPets(),
    ])
      .then(([postsResult, userPetsResult, publicPetsResult]) => {
        if (!isActive) return;

        const interactions = readLocalInteractions();
        const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
        const nextOwnedPets = userPetsResult.status === "fulfilled" ? userPetsResult.value : [];
        const nextPublicPets = publicPetsResult.status === "fulfilled" ? publicPetsResult.value : [];

        setOwnedPets(nextOwnedPets);
        setSelectedPetId((currentId) =>
          nextOwnedPets.some((pet) => String(pet.id) === String(currentId))
            ? currentId
            : nextOwnedPets[0]?.id ?? ""
        );
        setPublicPets(nextPublicPets);
        setFeedPosts(posts.map((post) => applyPostInteractions(post, interactions)));
        setError(postsResult.status === "rejected" ? postsResult.reason.message : null);
        setLoading(false);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

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
      location: locationName ? { name: locationName, ...mapPosition } : null,
      likes: 0,
      comments: 0,
      commentsList: [],
      liked: false,
      time: "Ahora",
    };

    setFeedPosts((currentPosts) => [newPost, ...currentPosts]);

    try {
      await createPost({
        userId,
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
    const interaction = interactions[String(post.id)] ?? { liked: false, likeDelta: 0 };
    const nextLiked = !interaction.liked;
    const nextInteraction = {
      ...interaction,
      liked: nextLiked,
      likeDelta: (interaction.likeDelta ?? 0) + (nextLiked ? 1 : -1),
    };

    saveLocalInteractions({ ...interactions, [String(post.id)]: nextInteraction });

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

  const addPostComment = async (post, text) => {
    const body = text.trim();
    if (!body) return;

    const comment = {
      id: Date.now(),
      postId: post.id,
      author: currentUser.name,
      text: body,
      time: "Ahora",
    };

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

    try {
      await addComment({
        postId: post.id,
        userId,
        author: currentUser.name,
        text: body,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    feedPosts,
    loading,
    error,
    ownedPets,
    publicPets,
    activePet,
    selectedPetId,
    setSelectedPetId,
    publishPost,
    togglePostLike,
    addPostComment,
  };
}
