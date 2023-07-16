export default function BlogPost({ title, summary, published_at, company }) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {/* You can put an image here if you like */}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{published_at}</div>
            <div className="block mt-1 text-lg leading-tight font-medium text-black">{title}</div>
            <p className="mt-2 text-gray-500">{company}</p>
            <p className="mt-2 text-gray-500">{summary}</p>

          </div>
        </div>
      </div>
    );
  }