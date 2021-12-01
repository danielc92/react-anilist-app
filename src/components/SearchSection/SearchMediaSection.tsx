import React from "react";
import { MediaSeason, PageMediaArgs, Query } from "../../types/anilist/anilist";
import LoadingCard from "../LoadingCard.scss/LoadingCard";
//@ts-ignore
import MediaCard from "../MediaCard/MediaCard";
import "./SearchMediaSection.scss";
// import "./MediaListSection.scss";
interface IProps {
  data: Query | undefined;
  loading: boolean;
  sectionTitle: string;
  handleSearch: (page?: number) => void;
  updateSearch: (newSearch: string) => void;
  updatePageNumber: (page: number) => void;
  updateYear: (year: number) => void;
  updateSeason: (season: string) => void;
  searchOptions: PageMediaArgs;
  resetSearch: () => void;
}

const SearchMediaSection: React.FC<IProps> = ({
  sectionTitle,
  data,
  loading,
  handleSearch,
  updateSearch,
  updateSeason,
  updateYear,
  updatePageNumber,
  resetSearch,
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
            className="search__button"
            onClick={() => resetSearch()}
            type="button"
          >
            Clear search
          </button>
        </div>
      </div>

      <select
        className="search__select"
        name="seasonPick"
        value={searchOptions.season || ""}
        onChange={(event) => {
          console.log(event.target.value);
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
            // selected={searchOptions.season === entry[1]}
            value={entry[1]}
          >
            {entry[0]}
          </option>
        ))}
      </select>

      <select
        className="search__select"
        value={searchOptions.seasonYear || 2021}
        name="yearPick"
        onChange={(event) => updateYear(parseInt(event.target.value))}
      >
        {[
          -9999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2010,
          2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
          2022,
        ].map((year) => (
          <option value={year}>{year === -9999 ? "Any" : year}</option>
        ))}
      </select>

      <h1>
        {data?.Page?.pageInfo?.total === 0 ? "No results found." : sectionTitle}
      </h1>

      <div className="medialist">
        {loading
          ? new Array(10).fill(null).map((item) => <LoadingCard />)
          : data?.Page?.media
          ? data.Page.media.map((media) => {
              if (media) {
                return <MediaCard media={media} />;
              }
            })
          : null}
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
