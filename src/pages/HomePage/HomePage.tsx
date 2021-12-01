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
import { useLocation as useLocation2 } from "react-router";
import { useHistory } from "react-router";
import MediaListSection from "../../components/MediaListSection/MediaListSection";
import SearchMediaSection from "../../components/SearchSection/SearchMediaSection";
import { createNoSubstitutionTemplateLiteral } from "typescript";

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
  query getPageMedia($sort: [MediaSort], $status: MediaStatus, $search: String, $page: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(perPage: 10, page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: false, season: $season, seasonYear: $seasonYear, type: ANIME, status: $status, sort: $sort, search: $search) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

interface PageMediaArgsExtended extends PageMediaArgs {
  page?: number;
}

const seasons = Object.entries(MediaSeason);
const defaultYear = 2021;

const HomePage: React.FC = () => {
  const buildOptionsFromQuery = (url: string) => {
    const parsed = qs.parse(url.replace("?", ""));

    const { search, page, season, seasonYear } = parsed;

    const obj: PageMediaArgsExtended = {};

    if (seasonYear) {
      obj.seasonYear = parseInt(seasonYear as string) || defaultYear;
    }

    if (seasons.some((s) => s[1] === season)) {
      obj.season = season as MediaSeason;
    }
    if (search) {
      obj.search = search as string;
    }

    if (page) {
      obj.page = parseInt(page as string) || 1;
    }

    return obj;
  };
  const { push } = useHistory();
  const { search: locationSearch } = useLocation();
  const { search: locationSearch2 } = useLocation2();

  const initialState = buildOptionsFromQuery(locationSearch);
  const [searchOptions, setSearchOptions] =
    useState<PageMediaArgsExtended>(initialState);

  useEffect(() => {
    console.log(locationSearch, locationSearch2);

    const currentOptions = buildOptionsFromQuery(
      locationSearch.replace("?", "")
    );

    getSearchResults({ variables: currentOptions })
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
    const queryString = qs.stringify(searchOptions as ParsedUrlQueryInput);

    console.log(queryString, "QUERYSTRING");
    push(queryString.length ? `/?${queryString}` : "/");
  };

  const updateSearch = (newSearch: string) => {
    const newSearchOptions = {
      ...searchOptions,
      search: newSearch,
    };
    setSearchOptions(newSearchOptions);
  };

  const updateSeason = (season: string) => {
    setSearchOptions({ ...searchOptions, season: season as MediaSeason });
  };
  const updateYear = (seasonYear: number) => {
    setSearchOptions({ ...searchOptions, seasonYear });
  };
  const updatePageNumber = (page: number) => {
    const obj = buildOptionsFromQuery(locationSearch);
    obj.page = page;
    const queryString = qs.stringify(obj as ParsedUrlQueryInput);
    console.log(obj, queryString, page, "Updating page ");
    push(queryString.length ? `/?${queryString}` : "/");
  };

  return (
    <div>
      <SearchMediaSection
        updateYear={updateYear}
        updateSeason={updateSeason}
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
