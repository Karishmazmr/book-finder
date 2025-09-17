export default function BookCard({ book }) {
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : `https://via.placeholder.com/200x300?text=No+Cover`;

  const authors = book.author_name ? book.author_name.join(", ") : "Unknown author";
  const year = book.first_publish_year ? book.first_publish_year : "";

  return (
    <div className="book-card bg-white/80 p-4 rounded-xl shadow-md flex flex-col items-center text-center">
      <img src={cover} alt={book.title} className="w-40 h-56 object-cover mb-3 rounded-md" />
      <h3 className="font-semibold text-sm md:text-base leading-tight">{book.title}</h3>
      <p className="text-xs text-gray-600 mt-1">{authors}</p>
      <p className="text-xs text-gray-400 mt-1">{year}</p>
    </div>
  );
}
