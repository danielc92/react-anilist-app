import { gql } from "@apollo/client";

export const MEDIA_FRAGMENT = `
        id
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        status
        title {
          english
          romaji
          native
        }
        description
        coverImage {
          medium
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
        averageScore
        meanScore`;

export const GET_PAGE_MEDIA = gql`
  query getPageMedia($sort: [MediaSort]) {
    Page(perPage: 5) {
      media(isAdult: false, type: ANIME, sort: $sort) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;
export const GET_PAGE_WITH_SEARCH_MEDIA = gql`
  query getPageMedia($sort: [MediaSort], $format: MediaFormat, $genre: String, $status: MediaStatus, $search: String, $page: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(perPage: 10, page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(format: $format, isAdult: false, genre: $genre, season: $season, seasonYear: $seasonYear, type: ANIME, status: $status, sort: $sort, search: $search) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;
