import React from "react";
import { Query } from "../../types/anilist/anilist";

interface IProps {
  data: Query;
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
      <div className="container">
        {data?.Page?.media
          ? data.Page.media.map((m: any) => (
              <div>
                <a className="container__img-wrap" href={m.siteUrl}>
                  <img src={m.coverImage.extraLarge} alt="anime cover" />
                  <p className="container__score">
                    <span>{m.meanScore}%</span>
                  </p>
                </a>
                <h2 className="container__heading">{m.title.english}</h2>

                {/* <div>{m.description}</div> */}
                <div className="container__tags">
                  {m.genres.map((g: any) => (
                    <p className="container__tag">{g}</p>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </section>
  );
};

export default MediaListSection;
