import PostComposer from "./PostComposer";
import FriendSuggestions from "./FriendSuggestions";
import PostCard from "../ui/PostCard";

export default function SocialFeed({
  title = "Feed Social",
  subtitle = "Publicaciones de la comunidad PetConnect",
  posts = [],
  activePet,
  ownedPets = [],
  selectedPetId,
  onPetChange,
  composerValue = "",
  composerImage = "",
  composerLocation = "",
  onComposerChange,
  onPhotoSelect,
  onPhotoRemove,
  onLocationChange,
  onPublish,
  onPhotoClick,
  onLocationClick,
  onLike,
  onAddComment,
  showComposer = true,
  friendSuggestions = [],
  followedPetIds = [],
  onToggleFollow,
}) {
  return (
    <div className="mx-auto max-w-[620px] space-y-5">
      {(title || subtitle) && (
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
      )}
      {showComposer && (
        <PostComposer
          activePet={activePet}
          ownedPets={ownedPets}
          selectedPetId={selectedPetId}
          onPetChange={onPetChange}
          value={composerValue}
          imagePreview={composerImage}
          locationValue={composerLocation}
          onChange={onComposerChange}
          onPhotoSelect={onPhotoSelect}
          onPhotoRemove={onPhotoRemove}
          onLocationChange={onLocationChange}
          onSubmit={onPublish}
          onPhotoClick={onPhotoClick}
          onLocationClick={onLocationClick}
        />
      )}

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="space-y-4">
            <PostCard
              post={post}
              onLike={onLike}
              onAddComment={onAddComment}
            />
            {index === 0 && (
              <FriendSuggestions
                pets={friendSuggestions}
                followedIds={followedPetIds}
                onToggleFollow={onToggleFollow}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
