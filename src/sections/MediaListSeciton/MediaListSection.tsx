import React from "react";
import { Query } from "../../types/anilist/anilist";
//@ts-ignore
import contrast from "contrast";
import "./MediaListSection.scss";
interface IProps {
  data: Query | undefined;
  loading: boolean;
  sectionTitle: string;
}
const MediaListSection: React.FC<IProps> = ({
  sectionTitle,
  data,
  loading,
}) => {
  return (
    <section className="section">
      <h1>{sectionTitle}</h1>

      <div className="medialist">
        {loading
          ? new Array(10)
              .fill(null)
              .map((item) => <div className="medialist__loading"></div>)
          : data?.Page?.media
          ? data.Page.media.map((m) => {
              if (m) {
                // colour can be null from api response, set a fallback
                const backgroundColor = m.coverImage?.color || "#f4f4f4";
                const contrastValue = contrast(backgroundColor);

                const color = contrastValue === "light" ? "#000000" : "#f9f9f9";

                return (
                  <div>
                    <a className="medialist__img-wrap" href={m.siteUrl || "#"}>
                      <img
                        src={m.coverImage?.extraLarge || "#"}
                        alt="anime cover"
                      />
                      <p className="medialist__score">
                        <span>{m.meanScore}%</span>
                      </p>
                    </a>
                    <h2 className="medialist__heading">{m.title?.english}</h2>

                    {/* <div>{m.description}</div> */}
                    <div className="medialist__tags">
                      {m.genres?.map((tag, index) => {
                        if (index < 2)
                          return (
                            <p
                              className="medialist__tag"
                              style={{ backgroundColor, color }}
                            >
                              {tag}
                            </p>
                          );
                      })}
                    </div>
                  </div>
                );
              }
            })
          : null}
      </div>
    </section>
  );
};

export default MediaListSection;
