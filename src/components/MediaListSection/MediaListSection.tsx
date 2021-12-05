import React from "react";
import { Query } from "../../types/anilist/anilist";
import "./MediaListSection.scss";
import MediaCard from "../MediaCard/MediaCard";
import LoadingCard from "../LoadingCard.scss/LoadingCard";
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
              .map((_, i) => <LoadingCard key={i.toString()} />)
          : data?.Page?.media
          ? data.Page.media.map((m) => {
              if (m) {
                return <MediaCard media={m} key={m.id.toString()} />;
              }
              return null;
            })
          : null}
      </div>
    </section>
  );
};

export default MediaListSection;
