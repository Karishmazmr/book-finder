import { useEffect, useState } from "react";
import BookCard from "./components/BookCard";
import Loader from "./components/Loader";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  // fetch function
  const fetchBooks = async (q) => {
    if (!q) {
      setBooks([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=30`);
      const data = await res.json();
      if (!data.docs || data.docs.length === 0) {
        setBooks([]);
        setError("No books found. Try another search.");
      } else {
        setBooks(data.docs.slice(0, 24));
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // debounce input (auto-search while typing)
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => {
      if (query.trim()) fetchBooks(query.trim());
      else {
        setBooks([]);
        setError("");
      }
    }, 550);
    setDebounceTimer(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearchClick = () => {
    fetchBooks(query.trim());
  };

  return (
    <div className="app-shell font-sans text-gray-900">
      {/* animated background */}
      <div className="animated-bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-3">📚 Book Finder</h1>
          <p className="text-sm text-white/90">Search titles from the Open Library. Try “Pride and Prejudice”, “Harry Potter”, etc.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              aria-label="Search books by title"
              placeholder="Enter book title (e.g. 'Harry Potter')..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 input-glass focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchClick(); }}
            />
            <button
              onClick={handleSearchClick}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-white/80 mt-2">Auto-search is enabled while typing (debounced). Press Enter or click Search for an immediate request.</p>
        </div>

        {/* results */}
        <div className="max-w-6xl mx-auto">
          {loading && <Loader />}
          {error && !loading && <p className="text-center text-red-300 mb-6">{error}</p>}

          {!loading && !error && books.length === 0 && query.trim() === "" && (
            <p className="text-center text-white/80">Start typing a book title to search the Open Library.</p>
          )}

          {!loading && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((b) => (
                <BookCard key={b.key || `${b.cover_i}-${b.title}`} book={b} />
              ))}
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-white/70">
          Data from Open Library · Built with React + Tailwind
        </footer>
      </div>
    </div>
  );
}
