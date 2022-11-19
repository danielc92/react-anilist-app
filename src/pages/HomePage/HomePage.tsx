import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import qs, { ParsedUrlQueryInput } from "querystring";
import {
  MediaSort,
  MediaSeason,
  Query,
  MediaStatus,
  MediaFormat,
} from "../../types/anilist/anilist";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import MediaListSection from "../../components/MediaListSection/MediaListSection";
import SearchMediaSection from "../../components/SearchSection/SearchMediaSection";
import { ANILIST_GENRES } from "../../settings/data";
import { fetcherSingleton, PageMediaArgsExtended } from "../../fetchers";

const seasons = Object.entries(MediaSeason);
const statuses = Object.entries(MediaStatus);
const sorts = Object.entries(MediaSort);
const formats = Object.entries(MediaFormat);

const HomePage: React.FC = () => {
  const [dataFavourites, setFavouritesResults] = useState<Query | null| undefined>(null);
  const [dataCurrent, setCurrentSeasonResults] = useState<Query | null| undefined>(null);
  const [dataTrending, setTrendingResults] = useState<Query | null| undefined>(null);
  const [dataPopular, setPopularResults] = useState<Query | null| undefined>(null);
  const [dataSearch, setSearchResults] = useState<Query | null | undefined>(null);

  const buildOptionsFromQuery = (url: string) => {
    const parsed = qs.parse(url.replace("?", ""));
console.log(parsed)
    const { search, page, season, seasonYear, genre, status, sort, format } =
      parsed;

    const obj: PageMediaArgsExtended = {
      perPage: fetcherSingleton.perPage,
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

    const fetchData = async () => {
      const searchArgs = buildOptionsFromQuery(
        locationSearch.replace("?", "")
      );
      const results = await fetcherSingleton.fetchSearchResults(searchArgs)
      setSearchResults(results)
    }
    fetchData()
  }, [locationSearch]);

  useEffect(() => {
    // Fetch all data on inital page load
      const fetchData = async () => {
        const favourites = await fetcherSingleton.fetchFavourites()
        setFavouritesResults(favourites)
        const trending = await fetcherSingleton.fetchTrending()
        setTrendingResults(trending)
        const currentSeason = await fetcherSingleton.fetchCurrentSeason()
        setCurrentSeasonResults(currentSeason)
        const popular = await fetcherSingleton.fetchPopular()
        setPopularResults(popular)
      }
      fetchData()
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
    push(`/?sort=POPULARITY_DESC&page=1&perPage=${fetcherSingleton.perPage}`);
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
        sectionTitle={`Popular anime for ${fetcherSingleton.currentYear} (${fetcherSingleton.currentMediaSeason})`}
      ></MediaListSection>
      <MediaListSection
        data={dataTrending}
        sectionTitle="Trending now 🔥"
      ></MediaListSection>
      <MediaListSection
        data={dataPopular}
        sectionTitle="All time popular 🏅"
      ></MediaListSection>
      <MediaListSection
        data={dataFavourites}
        sectionTitle="All time favourited ⭐"
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
