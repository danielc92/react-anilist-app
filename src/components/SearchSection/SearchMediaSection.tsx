import React from "react";
import { PageMediaArgs, Query } from "../../types/anilist/anilist";
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
  searchOptions: PageMediaArgs;
  resetSearch: () => void;
}

const SearchMediaSection: React.FC<IProps> = ({
  sectionTitle,
  data,
  loading,
  handleSearch,
  updateSearch,
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
              handleSearch(currentPage - 1);
            }}
          >
            Previous page
          </button>
          {/* <p>current page: {data?.Page?.pageInfo?.currentPage}</p>
        <p>total results: {data?.Page?.pageInfo?.total}</p> */}
          <button
            className="search__button search__button--pagination"
            disabled={true}
            onClick={() => {
              updatePageNumber(currentPage + 1);
              handleSearch(currentPage + 1);
            }}
          >
            {data?.Page?.pageInfo?.currentPage}
          </button>
          <button
            className="search__button search__button--pagination"
            disabled={!hasNext}
            onClick={() => {
              updatePageNumber(currentPage + 1);
              handleSearch(currentPage + 1);
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
