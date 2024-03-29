import { useQuery } from "@tanstack/react-query";
import { News } from "../../../Hook/useNews";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const NewsPost = () => {
  const axiosSecure = useAxiosSecure();
  const { data, refetch } = useQuery({
    queryKey: ["News"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/News`);
      // Set news data to state
      return res.data;
    },
  });

  const handleDeleteVlog = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/AllNews/${id}`).then((res: any) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className="py-5 px-5 ">
      <div>
        <h1 className="text-2xl font-bold text-center">News</h1>
        <div className="border mt-5 mb-5 text-black"></div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-lg py-5">
              <tr>
                <th>Image</th>
                <th>News</th>
                <th>Category</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((job: News) => (
                <tr key={job._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={job?.image} alt="jobs" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-lg">{job?.headline}</td>
                  <td className="text-lg">{job?.section}</td>
                  <td>
                    <Link to={`/daseboard/editnews/${job?._id}`}>
                      <button className=" text-lg bg-blue-400 px-3 py-1 font-semibold hover:bg-blue-800 hover:text-white rounded-md ">Update</button>
                    </Link>
                  </td>
                  <th>
                    <button
                      onClick={() => handleDeleteVlog(job._id)}
                    >
                      <FaTrash className="text-xl text-red-400 hover:text-red-800"></FaTrash>
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
            {/* foot */}
          </table>
        </div>
      </div>
    </div>
  );
};
export default NewsPost;
