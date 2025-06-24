interface FullScreenImageProps {
  imageUrl?: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ imageUrl }) => {
  return (
    <div className="w-screen h-screen">
      <img
        src={imageUrl}
        alt="Full screen"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FullScreenImage;
