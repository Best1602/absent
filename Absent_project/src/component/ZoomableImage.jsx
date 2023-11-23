import React from 'react';
import ImageMagnify from 'react-image-magnify';

const ZoomableImage = ({ imageUrl }) => {
    return (
        <ImageMagnify
            enlargedImagePosition="over"
            smallImage={{
                src: imageUrl,
                alt: 'Zoomable Image',
                isFluidWidth: true,
            }}
            largeImage={{
                src: imageUrl,
                width: 1200, // กำหนดความกว้างของรูปภาพที่มากขึ้น
                height: 1800, // กำหนดความสูงของรูปภาพที่มากขึ้น
            }}
        />
    );
};

export default ZoomableImage;
