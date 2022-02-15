import React from "react";
import { Query } from "../../types/anilist/anilist";
import "./MediaListSection.scss";
import MediaCard from "../MediaCard/MediaCard";
import LoadingCard from "../LoadingCard.scss/LoadingCard";
interface IProps {
  data: Query | null;
  sectionTitle: string;
}
const MediaListSection: React.FC<IProps> = ({ sectionTitle, data }) => {
  return (
    <section className="section">
      <h1>{sectionTitle}</h1>

      <div className="medialist">
        {!data
          ? new Array(10)
              .fill(null)
              .map((_, i) => <LoadingCard key={i.toString() + "_loading"} />)
          : data.Page?.media?.map((m) => {
              if (m) {
                return <MediaCard media={m} key={m.id.toString()} />;
              }
            })}
      </div>
    </section>
  );
};

export default MediaListSection;
