// File: components/Navbar/SearchBar.tsx

import React, { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"

type SearchResult = {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
}

type Props = {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

const SearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
    const [results, setResults] = useState<SearchResult[]>([])

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchTerm.length <= 1) return setResults([])
            fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=fdc04ec6`)
                .then(r => r.json())
                .then(d => setResults(d.Search ?? []))
                .catch(() => setResults([]))
        }, 500)
        return () => clearTimeout(delay)
    }, [searchTerm])

    return (
        <div className="relative w-full sm:flex-grow sm:max-w-md sm:mx-4">
            <div className="flex">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1 bg-white rounded-l border-2 border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <button className="bg-yellow-400 text-black px-3 py-2 rounded-r border border-yellow-400 flex items-center">
                    <FaSearch className="text-lg" />
                </button>
            </div>

            {results.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 z-50 text-black max-h-64 overflow-y-auto mt-1 rounded shadow">
                    {results.map(m => (
                        <Link
                            key={m.imdbID}
                            to={`/movie/${m.imdbID}`}
                            onClick={() => setSearchTerm("")}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-100"
                        >
                            <img
                                src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/40x60?text=N/A"}
                                alt={m.Title}
                                className="w-10 h-16 object-cover rounded-sm"
                            />
                            <div>
                                <p className="font-medium text-sm">{m.Title}</p>
                                <p className="text-xs text-gray-600">{m.Year}</p>
                            </div>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchBar
