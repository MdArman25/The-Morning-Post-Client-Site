import { Link } from "react-router-dom";
import useAdmin from "../../../Hook/useNews";
const Sport = () => {
  const { newsData: SportData, isLoading: SportDataLoading } =
    useAdmin("Sports");
  if (SportDataLoading) {
    return <span className="loading loading-spinner loading-lg mx-auto"></span>;
  }
  return (
    <div className="">
      <div className="">
        {" "}
        <h1 className="text-2xl font-bold py-5">Sports</h1>
        <div className="border border-gray-400 mb-10 "></div>
      </div>
      <div className="lg:flex gap-5">
        <div className="basis-3/4 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2">
              {SportData.slice(0, 1).map((item) => (
                <Link key={item?._id} to={`/newsdetails/${item?._id}`}>
                  <div>
                    <div className="overflow-hidden bg-white relative">
                      <div className="h-[400px]">
                        <img
                          className="object-cover w-full h-full overflow-hidden p-4 lg:p-0 md:p-4"
                          src={item.image}
                          alt=""
                        />
                      </div>

                      <div className="absolute bottom-0 p-5">
                        <a href="#">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                            {item.headline}
                          </h5>
                        </a>
                        <p className="mb-3 font-normal text-white">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div>
              {SportData.slice(1, 2).map((item) => (
                <Link key={item?._id} to={`/newsdetails/${item?._id}`}>
                  <div className=" h-full">
                    <div className="h-full bg-white  border-l pl-4 ">
                      <a href="#">
                        <img
                          className="w-full min-h-56 object-cover"
                          src={item.image}
                          alt=""
                        />
                      </a>
                      <div className="p-5 pl-0">
                        <a href="#">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {item.headline}
                          </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="border my-3  border-gray-300"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SportData.slice(1, 4).map((item) => (
              <Link key={item?._id} to={`/newsdetails/${item?._id}`}>
                <div className="bg-white  first:pr-4 last:pl-4 border-gray-200 first:border-r last:border-l">
                  <a href="#">
                    <img
                      className="w-full h-56 object-cover"
                      src={item?.image}
                      alt=""
                    />
                  </a>
                  <div className="p-5 pl-0">
                    <a href="#">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {item.headline}
                      </h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      <h1>{item.title && item.title?.substring(0, 70)}...</h1>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border border-gray-300"></div>

        <div className="border basis-3/12">
          <div className="">
            <h1 className="text-2xl text-center bg-green-700 block p-5 text-white">
              Summary
            </h1>
            <p>
              {SportData?.slice(0, 1).map((item) => {
                return (
                  <div key={item._id}>
                    <p className="m-2">{item.summary}</p>
                  </div>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sport;
