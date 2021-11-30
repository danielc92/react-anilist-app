import React from "react";
import "./App.scss";
import { gql, useQuery } from "@apollo/client";
import { MediaSort, PageMediaArgs, Query } from "./types/anilist/anilist";
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
  query getPageMedia($sort: [MediaSort]) {
    Page(perPage: 10) {
      media(isAdult: false, type: ANIME, status: RELEASING, sort: $sort) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

function App() {
  const { loading: loadingTrending, data: dataTrending } = useQuery<
    Query,
    PageMediaArgs
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: [MediaSort.TrendingDesc],
    },
    onCompleted(data) {
      console.log(data);
    },
  });

  const { loading: loadingPopularity, data: dataPopularity } = useQuery<
    Query,
    PageMediaArgs
  >(GET_PAGE_MEDIA, {
    variables: {
      sort: [MediaSort.PopularityDesc],
    },
  });
  const { loading: loadingFav, data: dataFav } = useQuery<Query, PageMediaArgs>(
    GET_PAGE_MEDIA,
    {
      variables: {
        sort: [MediaSort.FavouritesDesc],
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
