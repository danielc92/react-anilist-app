
// export single instance of fetch

import { GraphQLClient } from "graphql-request";
import { PageMediaArgs, MediaFormat, MediaSeason, MediaSort, MediaType, Query } from "../types/anilist/anilist";
import { GET_PAGE_MEDIA, GET_PAGE_WITH_SEARCH_MEDIA } from "./graphql-fragments";


export interface PageMediaArgsExtended extends PageMediaArgs {
    page?: number;
    perPage?: number;
  }

class AniListApiFetcher {

    graphClient: GraphQLClient;
    perPage: number
    currentMediaSeason: MediaSeason
    currentYear: number

    constructor() {
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

            this.currentYear = currentYear
            this.currentMediaSeason = currentSeason
        this.perPage = 10
        this.graphClient =  new GraphQLClient("https://graphql.anilist.co/", { mode: "cors" });
    }

    

    fetchSearchResults = async (args: PageMediaArgsExtended) => {
        try {
            return this.graphClient.request<Query>(GET_PAGE_WITH_SEARCH_MEDIA, args)
        } catch (e) {
            console.log(e)
        }
    }

    fetchFavourites = async () => {

        try {
            return this.graphClient.request<Query>(GET_PAGE_MEDIA, {
                sort: [MediaSort.FavouritesDesc],
                perPage: this.perPage,
              })
        } catch (e) {
            console.log(e)
        }
    }
    
    fetchPopular= async () => {
        try {
            return this.graphClient.request<Query>(GET_PAGE_MEDIA, {
                sort: [MediaSort.PopularityDesc],
                perPage: this.perPage,
              })
        } catch (e) {
            console.log(e)
        }
    }

    fetchTrending= async () => {
        try {
            return this.graphClient.request<Query>(GET_PAGE_MEDIA, {
                sort: [MediaSort.TrendingDesc],
                perPage: this.perPage,
              })
        } catch (e) {
            console.log(e)
        }
    }

    fetchCurrentSeason = async () => {
        try {
            return this.graphClient.request<Query>(GET_PAGE_WITH_SEARCH_MEDIA, {
        seasonYear: this.currentYear,
        season: this.currentMediaSeason,
        type: MediaType.Anime,
        format: MediaFormat.Tv,
        sort: [MediaSort.ScoreDesc],
        perPage: this.perPage * 4,
      })
        }
      catch(e) {console.log(e)}  
    }

}

const fetcherSingleton = new AniListApiFetcher()

export {fetcherSingleton}