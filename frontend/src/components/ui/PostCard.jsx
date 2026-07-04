import Avatar from "../ui/Avatar";
import Icon from "../icons/Icons";

export default function PostCard({ post, onLike, onComment, onShare }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar icon={post.icon} size="sm" />
          <div>
            <h3 className="font-bold text-slate-800">{post.petName}</h3>
            <p className="text-sm text-slate-400">{post.time}</p>
          </div>
        </div>

        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-slate-100">
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>

        <div className="flex items-center gap-6 pt-3 border-t border-slate-50">
          <button
            type="button"
            onClick={() => onLike?.(post)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium"
          >
            <Icon name="heart" size={18} />
            {post.likes}
          </button>
          <button
            type="button"
            onClick={() => onComment?.(post)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-sky-500 transition-colors text-sm font-medium"
          >
            <Icon name="comment" size={18} />
            {post.comments}
          </button>
          <button
            type="button"
            onClick={() => onShare?.(post)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium ml-auto"
          >
            <Icon name="share" size={18} />
            Compartir
          </button>
        </div>
      </div>
    </article>
  );
}
