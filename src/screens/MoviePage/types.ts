export interface RatingPoint {
  source: string;
  value: number;
}

export interface MovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Runtime: string;
  Rated: string;
  imdbRating: string;
  Ratings: { Source: string; Value: string }[];
  Language: string;
  Country: string;
  Awards: string;
  BoxOffice: string;
  Metascore: string;
  imdbVotes: string;
  Released: string;
}
