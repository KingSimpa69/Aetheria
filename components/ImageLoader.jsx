import { useState } from 'react';
import Image from 'next/image';

const ImageLoader = ({ customClass, src, alt, width, height, fill }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`${customClass} glassContainer ${!loading && 'hidden'}`} style={{ position: 'relative', display: 'inline-block' }}>
      {loading && (
        <div className="glass"/>
      )}
      <Image
        fill={fill ? true : false}
        sizes="100%"
        src={src}
        width={width}
        height={height}
        alt={alt}
        onLoad={handleLoad}
        style={fill && { position: "absolute" }}
      />
    </div>
  );
};

export default ImageLoader;
