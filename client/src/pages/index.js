import { useState, useEffect } from 'react';
import Link from 'next/link';
import Select from 'react-select';
import BlogPost from './components/blogPost';

const POSTS_PER_PAGE = 12;



function Pagination({ page, totalPages, setPage }) {
  const handleChange = selectedOption => {
    setPage(selectedOption.value - 1);
    window.scrollTo(0, 0);
  };

  const options = Array.from({ length: totalPages }, (_, i) => ({ value: i + 1, label: i + 1 }));

  return (
    <div className="flex justify-center mt-6 mb-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        className="px-1 py-2 mx-1 bg-indigo-500 text-white rounded disabled:opacity-50"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.25 8.75L9.75 12L13.25 15.25"></path>
        </svg>
      </button>

      <div className="px-2 mx-1">
        <Select
          value={{ value: page + 1, label: page + 1 }}
          onChange={handleChange}
          options={options}
          isSearchable={false}
          className="my-1 rounded text-black"
          menuPlacement="auto"
        />
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages - 1}
        className="px-1 py-2 mx-1 bg-indigo-500 text-white rounded disabled:opacity-50"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.75 8.75L14.25 12L10.75 15.25"></path>
        </svg>
      </button>
    </div>
  )
}

function getSessionPage() {
  if (typeof window !== 'undefined') {
    const cachedPage = sessionStorage.getItem("currentPage");
    return cachedPage ? parseInt(cachedPage) : 0;
  } else {
    return 0;
  }
}

export default function Home() {
  const [blogPostsList, setBlogPostsList] = useState([]);
  const [page, setPage] = useState(getSessionPage());
  const [totalPages, setTotalPages] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  
// Fetching
const fetchPosts = async (pageNumber) => {
  const cachedPosts = sessionStorage.getItem(`posts-${pageNumber}`);
  const cachedTotalPages = sessionStorage.getItem('totalPages');

  if (cachedPosts && cachedTotalPages) {
    setBlogPostsList(JSON.parse(cachedPosts));
    setTotalPages(parseInt(cachedTotalPages));
    setDataLoaded(true);
  } else {
    const response = await fetch(`http://localhost:8000/posts?page=${pageNumber}`);
    if (!response.ok) {
      console.error("Error fetching posts:", response.statusText);
      return;
    }
    const posts = await response.json()
    console.log(posts)
    if (posts.length > 0) {

      setBlogPostsList(posts);
      setTotalPages(totalPages);
      setDataLoaded(true);

      sessionStorage.setItem(`posts-${pageNumber}`, JSON.stringify(posts));
      sessionStorage.setItem('totalPages', totalPages.toString());
  }
}
};

useEffect(() => {
  fetchPosts(page);
}, [page]);

// Prefetching
const prefetchPosts = async (pageNumber) => {
  const cachedPosts = sessionStorage.getItem(`posts-${pageNumber}`);
  
  if (cachedPosts) return;
  console.log("pre-fetching")
  const response = await fetch(`http://localhost:8000/posts?page=${pageNumber}`);
  if (!response.ok) {
    console.error("Error prefetching posts:", response.statusText);
    return;
  }
  const { data: posts } = await response.body.json();

  sessionStorage.setItem(`posts-${pageNumber}`, JSON.stringify(posts));
};


  useEffect(() => {
    const nextPage = page + 1;
    if (nextPage < totalPages) {
      prefetchPosts(nextPage);
    }
  
    const prevPage = page - 1;
    if (prevPage >= 0) {
      prefetchPosts(prevPage);
    }
  }, [page, totalPages]);

  

  return (
    <div className="font-berkeley m-8 md:m-10 pb-20">
      {/* Header */}
      <div className="flex text-center flex-col mb-4">
        <div className="font-bold text-4xl mb-2">engblogs</div>
        <div className="text-md">learn from your favorite tech companies</div>
      </div>


      {/* Content */}
      {dataLoaded && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {blogPostsList.map((post, index) => (
    <BlogPost
      key={index} // Use unique values for keys when possible.
      title={post.title}
      summary={post.summary}
      published_date={post.published_date}
      company={post.company}
    />
  ))}
</div>
      {dataLoaded && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}

      {/* Loading */}
      {!dataLoaded && (
          <div className="flex justify-center mt-8">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        )
      }

    </div>
  )
}
