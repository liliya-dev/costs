import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex justify-center p-8">
      <RotatingLines
        visible={true}
        width="96"
        strokeColor="#3d3d3d"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loader;
