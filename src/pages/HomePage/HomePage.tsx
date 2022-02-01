import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import qs, { ParsedUrlQueryInput } from "querystring";
import {
  MediaSort,
  MediaSeason,
  PageMediaArgs,
  Query,
  MediaStatus,
  MediaFormat,
} from "../../types/anilist/anilist";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import MediaListSection from "../../components/MediaListSection/MediaListSection";
import SearchMediaSection from "../../components/SearchSection/SearchMediaSection";
import { ANILIST_GENRES } from "../../settings/data";
import "./HomePage.scss";
import { GET_PAGE_MEDIA, GET_PAGE_WITH_SEARCH_MEDIA } from "../../queries";

interface PageMediaArgsExtended extends PageMediaArgs {
  page?: number;
}

const seasons = Object.entries(MediaSeason);
const statuses = Object.entries(MediaStatus);
const sorts = Object.entries(MediaSort);
const formats = Object.entries(MediaFormat);

const HomePage: React.FC = () => {
  const buildOptionsFromQuery = (url: string) => {
    const parsed = qs.parse(url.replace("?", ""));

    const { search, page, season, seasonYear, genre, status, sort, format } =
      parsed;

    const obj: PageMediaArgsExtended = {};

    if (genre) {
      const transformedGenres = ANILIST_GENRES.filter((x) => x !== "Any").map(
        (x) => x.toLocaleLowerCase()
      );
      if (transformedGenres.includes((genre as string).toLowerCase())) {
        obj.genre = genre as string;
      }
    }

    const parsedYear = parseInt(seasonYear as string);
    if (typeof parsedYear === "number" && parsedYear > 0) {
      obj.seasonYear = parsedYear;
    }

    if (seasons.some((s) => s[1] === season)) {
      obj.season = season as MediaSeason;
    }
    if (search) {
      obj.search = search as string;
    }

    if (statuses.some((s) => s[1] === status)) {
      obj.status = status as MediaStatus;
    }

    if (page) {
      obj.page = parseInt(page as string) || 1;
    }

    if (formats.some((s) => s[1] === format)) {
      obj.format = format as MediaFormat;
    }

    if (sorts.some((s) => s[1] === sort)) {
      obj.sort = [sort as MediaSort];
    } else {
      obj.sort = [MediaSort.PopularityDesc];
    }

    return obj;
  };
  const { push } = useHistory();
  const { search: locationSearch } = useLocation();

  const initialState = buildOptionsFromQuery(locationSearch);
  const [searchOptions, setSearchOptions] =
    useState<PageMediaArgsExtended>(initialState);

  useEffect(() => {
    console.log(locationSearch, "TRIGGERED SEARCH");
    const currentOptions = buildOptionsFromQuery(
      locationSearch.replace("?", "")
    );

    getSearchResults({ variables: currentOptions })
      .then((s) => console.log("finished fetching search results"))
      .catch((e) => console.error(e));
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

  const handleSearch = (page?: number) => {
    const queryString = qs.stringify({
      ...searchOptions,
      page: 1,
    } as ParsedUrlQueryInput);

    push(queryString.length ? `/?${queryString}` : "/");
  };

  const resetSearch = () => {
    setSearchOptions({ sort: [MediaSort.PopularityDesc] });
    push("/?sort=POPULARITY_DESC&page=1");
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
  const updateStatus = (status: string) => {
    setSearchOptions({ ...searchOptions, status: status as MediaStatus });
  };
  const updateSort = (sort: string) => {
    setSearchOptions({ ...searchOptions, sort: [sort as MediaSort] });
  };
  const updateGenre = (genre: string) =>
    setSearchOptions({ ...searchOptions, genre });
  const updateYear = (seasonYear: number) => {
    setSearchOptions({ ...searchOptions, seasonYear });
  };
  const updateFormat = (format: string) => {
    setSearchOptions({ ...searchOptions, format: format as MediaFormat });
  };
  const updatePageNumber = (page: number) => {
    const obj = buildOptionsFromQuery(locationSearch);
    obj.page = page;
    const queryString = qs.stringify(obj as ParsedUrlQueryInput);
    push(queryString.length ? `/?${queryString}` : "/");
  };

  return (
    <div>
      <SearchMediaSection
        updateStatus={updateStatus}
        updateSort={updateSort}
        updateYear={updateYear}
        updateSeason={updateSeason}
        updateFormat={updateFormat}
        searchOptions={searchOptions}
        updateSearch={updateSearch}
        resetSearch={resetSearch}
        updateGenre={updateGenre}
        handleSearch={handleSearch}
        updatePageNumber={updatePageNumber}
        loading={loadingSearchResults}
        data={dataSearchResults}
        sectionTitle="Search results"
      />

      <MediaListSection
        loading={loadingPopularity}
        data={dataPopularity}
        sectionTitle="Popular Anime 🏅"
      ></MediaListSection>

      <MediaListSection
        loading={loadingTrending}
        data={dataTrending}
        sectionTitle="Trending Anime 🔥"
      ></MediaListSection>

      <MediaListSection
        loading={loadingFav}
        data={dataFav}
        sectionTitle="Most Favourited ⭐"
      ></MediaListSection>

      <section className="footer">
        <p>
          Powered by the <strong>anilist API</strong>
        </p>
      </section>
    </div>
  );
};

export default HomePage;
