import PostComposer from "./PostComposer";
import PostCard from "../ui/PostCard";

export default function SocialFeed({
  title = "Feed Social",
  subtitle = "Publicaciones de la comunidad PetConnect",
  posts = [],
  activePet,
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
  onComment,
  onShare,
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
      <PostComposer
        activePet={activePet}
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

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
}
