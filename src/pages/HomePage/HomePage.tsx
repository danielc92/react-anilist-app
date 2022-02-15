import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import qs, { ParsedUrlQueryInput } from "querystring";
import {
  MediaSort,
  MediaSeason,
  PageMediaArgs,
  Query,
  MediaStatus,
  MediaFormat,
  MediaType,
} from "../../types/anilist/anilist";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import MediaListSection from "../../components/MediaListSection/MediaListSection";
import SearchMediaSection from "../../components/SearchSection/SearchMediaSection";
import { ANILIST_GENRES } from "../../settings/data";
import { GET_PAGE_MEDIA, GET_PAGE_WITH_SEARCH_MEDIA } from "../../queries";
import { GraphQLClient } from "graphql-request";
import {
  BASE_URL,
  DEFAULT_PER_PAGE,
  SEASONAL_PER_PAGE,
} from "../../settings/api";
const graphQLClient = new GraphQLClient(BASE_URL, {
  mode: "cors",
});

interface PageMediaArgsExtended extends PageMediaArgs {
  page?: number;
  perPage?: number;
}

const seasons = Object.entries(MediaSeason);
const statuses = Object.entries(MediaStatus);
const sorts = Object.entries(MediaSort);
const formats = Object.entries(MediaFormat);

const HomePage: React.FC = () => {
  const [dataFavourites, setFavouritesResults] = useState<Query | null>(null);
  const [dataCurrent, setCurrentSeasonResults] = useState<Query | null>(null);
  const [dataTrending, setTrendingResults] = useState<Query | null>(null);
  const [dataPopular, setPopularResults] = useState<Query | null>(null);
  const [dataSearch, setSearchResults] = useState<Query | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentSeason =
    now.getMonth() <= 2
      ? MediaSeason.Winter
      : now.getMonth() <= 5
      ? MediaSeason.Spring
      : now.getMonth() <= 8
      ? MediaSeason.Summer
      : MediaSeason.Fall;
  const buildOptionsFromQuery = (url: string) => {
    const parsed = qs.parse(url.replace("?", ""));

    const { search, page, season, seasonYear, genre, status, sort, format } =
      parsed;

    const obj: PageMediaArgsExtended = {
      perPage: DEFAULT_PER_PAGE,
    };

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
    const currentOptions = buildOptionsFromQuery(
      locationSearch.replace("?", "")
    );
    // search results
    graphQLClient
      .request<Query>(GET_PAGE_WITH_SEARCH_MEDIA, currentOptions)
      .then((results) => {
        setSearchResults(results);
      })
      .catch((err) => console.log("Failed fetching (favourites)."));
  }, [locationSearch]);

  useEffect(() => {
    // favourites
    graphQLClient
      .request<Query>(GET_PAGE_MEDIA, {
        sort: [MediaSort.FavouritesDesc],
        perPage: DEFAULT_PER_PAGE,
      })
      .then((results) => {
        setFavouritesResults(results);
      })
      .catch((err) => console.log("Failed fetching (favourites)."));
    // favourites
    graphQLClient
      .request<Query>(GET_PAGE_MEDIA, {
        sort: [MediaSort.PopularityDesc],
        perPage: DEFAULT_PER_PAGE,
      })
      .then((results) => {
        setPopularResults(results);
      })
      .catch((err) => console.log("Failed fetching (popular)."));
    // favourites
    graphQLClient
      .request<Query>(GET_PAGE_MEDIA, {
        sort: [MediaSort.TrendingDesc],
        perPage: DEFAULT_PER_PAGE,
      })
      .then((results) => {
        setTrendingResults(results);
      })
      .catch((err) => console.log("Failed fetching (trending)."));

    // current season
    graphQLClient
      .request<Query>(GET_PAGE_MEDIA, {
        seasonYear: currentYear,
        season: currentSeason,
        type: MediaType.Anime,
        format: MediaFormat.Tv,
        sort: [MediaSort.ScoreDesc],
        perPage: SEASONAL_PER_PAGE,
      })
      .then((results) => {
        setCurrentSeasonResults(results);
      })
      .catch((err) => console.log("Failed fetching (current season)"));
  }, []);

  const handleSearch = (page?: number) => {
    const queryString = qs.stringify({
      ...searchOptions,
      page: 1,
    } as ParsedUrlQueryInput);

    push(queryString.length ? `/?${queryString}` : "/");
  };

  const resetSearch = () => {
    setSearchOptions({ sort: [MediaSort.PopularityDesc] });
    push(`/?sort=POPULARITY_DESC&page=1&perPage=${DEFAULT_PER_PAGE}`);
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
        loading={false}
        data={dataSearch}
        sectionTitle="Search results"
      />

      <MediaListSection
        data={dataCurrent}
        sectionTitle={`Most highly rated anime for ${currentSeason}, ${currentYear}`}
      ></MediaListSection>
      <MediaListSection
        data={dataPopular}
        sectionTitle="Popular Anime 🏅"
      ></MediaListSection>
      <MediaListSection
        data={dataTrending}
        sectionTitle="Trending Anime 🔥"
      ></MediaListSection>
      <MediaListSection
        data={dataFavourites}
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
