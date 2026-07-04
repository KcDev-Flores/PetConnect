import PageHeader from "../ui/PageHeader";
import PostComposer from "./PostComposer";
import PostCard from "../ui/PostCard";

export default function SocialFeed({
  title = "Feed Social",
  subtitle = "Publicaciones de la comunidad PetConnect",
  posts = [],
  activePet,
  composerValue = "",
  onComposerChange,
  onPublish,
  onPhotoClick,
  onLocationClick,
  onLike,
  onComment,
  onShare,
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title={title} subtitle={subtitle} />

      <PostComposer
        activePet={activePet}
        value={composerValue}
        onChange={onComposerChange}
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
