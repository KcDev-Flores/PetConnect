import Avatar from "./Avatar";

export default function PostCard({ post }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar emoji={post.avatar} size="sm" />
          <div>
            <h3 className="font-bold text-slate-800">{post.petName}</h3>
            <p className="text-sm text-slate-400">{post.time}</p>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>

        <div className="flex items-center gap-6 pt-3 border-t border-slate-50">
          <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium">
            <span>❤️</span> {post.likes}
          </button>
          <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-sky-500 transition-colors text-sm font-medium">
            <span>💬</span> {post.comments}
          </button>
          <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium ml-auto">
            <span>↗️</span> Compartir
          </button>
        </div>
      </div>
    </article>
  );
}
