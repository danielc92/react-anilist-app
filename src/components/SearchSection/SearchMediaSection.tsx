import React from "react";
import { ANILIST_GENRES } from "../../settings/data";
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  PageMediaArgs,
  Query,
} from "../../types/anilist/anilist";
import LoadingCard from "../LoadingCard.scss/LoadingCard";
//@ts-ignore
import MediaCard from "../MediaCard/MediaCard";
import "./SearchMediaSection.scss";
// import "./MediaListSection.scss";
interface IProps {
  data: Query | null | undefined;
  loading: boolean;
  sectionTitle: string;
  handleSearch: (page?: number) => void;
  updateSearch: (newSearch: string) => void;
  updatePageNumber: (page: number) => void;
  updateYear: (year: number) => void;
  updateSeason: (season: string) => void;
  updateFormat: (format: string) => void;
  updateStatus: (status: string) => void;
  updateSort: (sort: string) => void;
  searchOptions: PageMediaArgs;
  resetSearch: () => void;
  updateGenre: (genre: string) => void;
}

const maxYear = new Date().getFullYear() + 1;
const minYear = 2000;

const years = [
  0
]

for (let index = maxYear; index >= minYear; index--) {
  years.push(index)
}

const SearchMediaSection: React.FC<IProps> = ({
  sectionTitle,
  data,
  loading,
  handleSearch,
  updateSearch,
  updateSeason,
  updateYear,
  updateGenre,
  updateSort,
  updateStatus,
  updatePageNumber,
  resetSearch,
  updateFormat,
  searchOptions,
}) => {
  const hasNext =
    data &&
    data.Page &&
    data.Page.pageInfo &&
    data.Page.pageInfo.hasNextPage === true;

  const hasPrev =
    data &&
    data.Page &&
    data.Page.pageInfo &&
    data.Page.pageInfo.currentPage &&
    data.Page.pageInfo.currentPage > 1;

  const currentPage = data?.Page?.pageInfo?.currentPage || 1;

  return (
    <section className="section">
      <h1 className="search__title">Daniel's Anime App</h1>

      <div className="search">
        <div className="search__search">
          <input
            placeholder="Search for anime..."
            className="search__input"
            onChange={(event) => updateSearch(event.target.value)}
            type="text"
            value={searchOptions.search || ""}
          />
          <button
            className="search__button"
            onClick={() => handleSearch(1)}
            type="button"
          >
            Search
          </button>
          <button
            className="search__button search__button--secondary"
            onClick={() => resetSearch()}
            type="button"
          >
            Clear search
          </button>
        </div>
      </div>

      <div className="search__select-group">
        <div className="search__select-wrap">
          <label>Season</label>
          <select
            className="search__select"
            name="seasonPick"
            value={searchOptions.season || ""}
            onChange={(event) => {
              updateSeason(event.target.value);
            }}
          >
            <option
              // selected={searchOptions.season === ("ANY" as MediaSeason)}
              value={"ANY"}
            >
              Any
            </option>
            {Object.entries(MediaSeason).map((entry) => (
              <option
                key={entry[1]}
                // selected={searchOptions.season === entry[1]}
                value={entry[1]}
              >
                {entry[0]}
              </option>
            ))}
          </select>
        </div>
        <div className="search__select-wrap">
          <label>Year</label>
          <select
            className="search__select"
            value={searchOptions.seasonYear || 0}
            name="yearPick"
            onChange={(event) => updateYear(parseInt(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === 0 ? "Any" : year}
              </option>
            ))}
          </select>
        </div>

        <div className="search__select-wrap">
          <label>Genre</label>
          <select
            className="search__select"
            value={searchOptions.genre || ""}
            name="genrePick"
            onChange={(event) => updateGenre(event.target.value)}
          >
            {ANILIST_GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="search__select-wrap">
          <label>Status</label>
          <select
            className="search__select"
            value={searchOptions.status || ""}
            name="statusPick"
            onChange={(event) => updateStatus(event.target.value)}
          >
            <option value={"ANY"}>Any</option>
            {Object.entries(MediaStatus).map((g) => (
              <option key={g[1]} value={g[1]}>
                {g[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="search__select-wrap">
          <label>Sort by</label>
          <select
            className="search__select"
            //@ts-ignore
            value={searchOptions.sort || "POPULARITY_DESC"}
            name="sortPick"
            onChange={(event) => updateSort(event.target.value)}
          >
            {Object.entries(MediaSort).map((g) => (
              <option key={g[1]} value={g[1]}>
                {g[1].replaceAll("_", " ").toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="search__select-wrap">
          <label>Format</label>
          <select
            className="search__select"
            //@ts-ignore
            value={searchOptions.format || ""}
            name="sortFormat"
            onChange={(event) => updateFormat(event.target.value)}
          >
            <option value={"ANY"}>Any</option>
            {Object.entries(MediaFormat).map((g) => (
              <option key={g[1]} value={g[1]}>
                {g[1].replaceAll("_", " ").toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h1>
        {data?.Page?.pageInfo?.total === 0
          ? "No results found."
          : `${sectionTitle} (${data?.Page?.pageInfo?.total || "..."})`}
      </h1>

      <div className="medialist">
        {!data
          ? new Array(10)
              .fill(null)
              .map((_, index) => <LoadingCard key={index.toString()} />)
          : data.Page?.media?.map((media) => {
              if (media) {
                return <MediaCard key={media.id} media={media} />;
              }
              return null;
            })}
      </div>
      {data && data.Page && data.Page.pageInfo && data.Page?.pageInfo?.total ? (
        <div className="search__pagination">
          <button
            className="search__button search__button--pagination"
            disabled={!hasPrev}
            onClick={() => {
              updatePageNumber(currentPage - 1);
            }}
          >
            Previous page
          </button>
          {/* <p>current page: {data?.Page?.pageInfo?.currentPage}</p>
        <p>total results: {data?.Page?.pageInfo?.total}</p> */}
          <button
            className="search__button search__button--pagination"
            disabled={true}
          >
            {data?.Page?.pageInfo?.currentPage}
          </button>
          <button
            className="search__button search__button--pagination"
            disabled={!hasNext}
            onClick={() => {
              updatePageNumber(currentPage + 1);
            }}
          >
            Next page
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default SearchMediaSection;
