import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import qs, { ParsedUrlQueryInput } from "querystring";
import {
  MediaSort,
  MediaSeason,
  PageMediaArgs,
  Query,
} from "../../types/anilist/anilist";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import MediaListSection from "../../components/MediaListSection/MediaListSection";
import SearchMediaSection from "../../components/SearchSection/SearchMediaSection";

const MEDIA_FRAGMENT = `
        id
        status
        title {
          english
          romaji
          native
        }
        description
        coverImage {
          large
          extraLarge
          color
        }
        siteUrl
        startDate {
          year
          month
          day
        }
        genres
        tags {
          name
          category
          description
        }
        meanScore`;

const GET_PAGE_MEDIA = gql`
  query getPageMedia($sort: [MediaSort]) {
    Page(perPage: 10) {
      media(isAdult: false, type: ANIME, sort: $sort) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;
const GET_PAGE_WITH_SEARCH_MEDIA = gql`
  query getPageMedia($sort: [MediaSort], $status: MediaStatus, $search: String, $page: Int) {
    Page(perPage: 10, page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: false, type: ANIME, status: $status, sort: $sort, search: $search) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

interface PageMediaArgsExtended extends PageMediaArgs {
  page?: number;
}

const HomePage: React.FC = () => {
  const { push } = useHistory();
  const { search: locationSearch, state } = useLocation();

  const parsedSearch = qs.parse(locationSearch.replace("?", ""));

  const [searchOptions, setSearchOptions] = useState<PageMediaArgsExtended>({
    sort: [MediaSort.PopularityDesc],
    page: 1,
    ...parsedSearch,
  });

  useEffect(() => {
    const s: PageMediaArgsExtended = {};
    if (searchOptions.search) {
      s.search = searchOptions.search;
    }
    if (searchOptions.page) {
      s.page = searchOptions.page;
    }
    if (searchOptions.sort) {
      s.sort = searchOptions.sort;
    }

    getSearchResults({ variables: s })
      .then((s) => console.log("location searched.."))
      .catch((e) => console.log(e));
  }, [locationSearch]);

  const [
    getSearchResults,
    { loading: loadingSearchResults, data: dataSearchResults },
  ] = useLazyQuery<Query, PageMediaArgsExtended>(GET_PAGE_WITH_SEARCH_MEDIA, {
    variables: searchOptions,
  });
  const { loading: loadingTrending, data: dataTrending } = useQuery<
    Query,
    PageMediaArgsExtended
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: [MediaSort.TrendingDesc],
    },
  });

  const { loading: loadingPopularity, data: dataPopularity } = useQuery<
    Query,
    PageMediaArgsExtended
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: [MediaSort.PopularityDesc],
    },
  });
  const { loading: loadingFav, data: dataFav } = useQuery<
    Query,
    PageMediaArgsExtended
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: [MediaSort.FavouritesDesc],
    },
  });

  const resetSearch = () => {
    push("/");
  };

  const handleSearch = (page?: number) => {
    const searchOptsWithPage = page
      ? { ...searchOptions, page }
      : { ...searchOptions, page: 1 };
    console.log("Handle search");
    getSearchResults({ variables: searchOptsWithPage })
      .then((s) => console.log("s"))
      .catch((e) => console.log(e));

    const queryString =
      "?" + qs.stringify(searchOptsWithPage as ParsedUrlQueryInput);

    push(queryString.length ? `/${queryString}` : "/");
  };

  const updateSearch = (newSearch: string) => {
    const newSearchOptions = {
      ...searchOptions,
      search: newSearch,
    };
    setSearchOptions(newSearchOptions);
  };
  const updatePageNumber = (page: number) => {
    setSearchOptions({ ...searchOptions, page });
  };

  return (
    <div>
      <SearchMediaSection
        searchOptions={searchOptions}
        updateSearch={updateSearch}
        resetSearch={resetSearch}
        handleSearch={handleSearch}
        updatePageNumber={updatePageNumber}
        loading={loadingSearchResults}
        data={dataSearchResults}
        sectionTitle="Search results"
      />

      <MediaListSection
        loading={loadingPopularity}
        data={dataPopularity}
        sectionTitle="Popular Anime"
      ></MediaListSection>

      <MediaListSection
        loading={loadingTrending}
        data={dataTrending}
        sectionTitle="Trending Anime"
      ></MediaListSection>

      <MediaListSection
        loading={loadingFav}
        data={dataFav}
        sectionTitle="Most Favourited"
      ></MediaListSection>
    </div>
  );
};

export default HomePage;
