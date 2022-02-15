import React from "react";
import { Media } from "../../types/anilist/anilist";
//@ts-ignore
import contrast from "contrast";
import "./MediaCard.scss";

interface IProps {
  media: Media;
}

const MediaCard: React.FC<IProps> = ({ media }) => {
  // colour can be null from api response, set a fallback
  const backgroundColor = media.coverImage?.color || "#f4f4f4";
  const contrastValue = contrast(backgroundColor);

  const color = contrastValue === "light" ? "#000000" : "#f9f9f9";

  const { averageScore, nextAiringEpisode, coverImage, siteUrl, title } = media;

  const secondsToDhms = (seconds: number, episode: number) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    // var s = Math.floor(seconds % 60);

    var dDisplay = d + "d ";
    var hDisplay = h + "h ";
    var mDisplay = m + "m.";
    // var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return (
      <p className="media-card__time-until">
        <strong>Next episode: </strong>
        {dDisplay + hDisplay + mDisplay}
      </p>
    );
  };

  return (
    <div>
      <a className="media-card__img-wrap" href={siteUrl || "#"}>
        <img src={coverImage?.large || "#"} alt={title?.romaji + " image"} />
        {averageScore && (
          <p className="media-card__score">
            <span>{averageScore}%</span>
          </p>
        )}
      </a>

      <h2 className="media-card__heading">{title?.romaji}</h2>
      {nextAiringEpisode &&
        secondsToDhms(
          nextAiringEpisode.timeUntilAiring,
          nextAiringEpisode.episode
        )}
      {/* <div>{media.description}</div> */}
      <div className="media-card__tags">
        {media.genres?.map((tag, index) => {
          // if (index < 2) {
          return (
            <p
              className="media-card__tag"
              style={{ backgroundColor, color }}
              key={tag + index.toString()}
            >
              {tag}
            </p>
          );
          // }
          // return null;
        })}
      </div>
    </div>
  );
};
export default MediaCard;
