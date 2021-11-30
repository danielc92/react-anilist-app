import React from "react";
import "./App.scss";
import { gql, useQuery } from "@apollo/client";
import { MediaSort, MediaTrendSort } from "./types/anilist/anilist";
import MediaListSection from "./sections/MediaListSeciton/MediaListSection";

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
  query getPageMedia($sort: [MediaSort], $perPage: Int) {
    Page(perPage: $perPage) {
      media(isAdult: false, type: ANIME, status: RELEASING, sort: $sort) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

interface IQueryVariables {
  sort: MediaSort;
  perPage: number;
}

function App() {
  const { loading: loadingTrending, data: dataTrending } = useQuery<
    any,
    IQueryVariables
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: MediaSort.TrendingDesc,
      perPage: 12,
    },
  });

  const { loading: loadingPopularity, data: dataPopularity } = useQuery<
    any,
    IQueryVariables
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: MediaSort.PopularityDesc,
      perPage: 12,
    },
  });
  const { loading: loadingFav, data: dataFav } = useQuery<any, IQueryVariables>(
    GET_PAGE_MEDIA,
    {
      variables: {
        sort: MediaSort.FavouritesDesc,
        perPage: 12,
      },
    }
  );

  return (
    <div>
      {/* popular anime */}
      <MediaListSection
        loading={loadingPopularity}
        data={dataPopularity}
        sectionTitle="Popular Anime"
      ></MediaListSection>

      {/* trending anime */}
      <MediaListSection
        loading={loadingTrending}
        data={dataTrending}
        sectionTitle="Trending Anime"
      ></MediaListSection>

      {/* latest anime */}
      <MediaListSection
        loading={loadingFav}
        data={dataFav}
        sectionTitle="Most Favourited"
      ></MediaListSection>
    </div>
  );
}

export default App;
