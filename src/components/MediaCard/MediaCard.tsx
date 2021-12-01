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
  return (
    <div>
      <a className="media-card__img-wrap" href={media.siteUrl || "#"}>
        <img src={media.coverImage?.extraLarge || "#"} alt="anime cover" />
        {media.meanScore && (
          <p className="media-card__score">
            <span>{media.meanScore}%</span>
          </p>
        )}
      </a>
      <h2 className="media-card__heading">{media.title?.english}</h2>

      {/* <div>{media.description}</div> */}
      <div className="media-card__tags">
        {media.genres?.map((tag, index) => {
          if (index < 2)
            return (
              <p className="media-card__tag" style={{ backgroundColor, color }}>
                {tag}
              </p>
            );
        })}
      </div>
    </div>
  );
};
export default MediaCard;
