import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hook/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaDeleteLeft } from "react-icons/fa6";
interface HandleType {
    _id: string;
    headline: string;
    image: string;
    summary: string;
    date: string;
    section: string;
    jobUrl: string;
}
const Jobspost = () => {
    const AxiosPublic = useAxiosPublic();
    const { data: jobsData = [], refetch } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const response = await AxiosPublic("/api/v1/jobs")
            return response.data
        }
    })


    const handleJobDelete = async (_id: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            })
            if (result.isConfirmed) {
                const response = await AxiosPublic.delete(`/api/v1/jobs/${_id}`)
            
                if (response.data.deletedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${_id} has been deleted`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } 
            }

        } catch (error) {
            console.error('Job item did not delete', error)
        }



    }
    return (
        <div className='py-5 px-5'>
            <div>
                <h1 className='text-2xl font-bold text-center'>Total Jobs: {jobsData.length}</h1>
                <div className='border mt-5 mb-5 text-black'></div>
            </div>
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className='text-lg py-5'>
                            <tr>
                                <th>Image</th>
                                <th>Job heading</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                jobsData?.map((job : HandleType) => {
                                    const { _id, headline } = job
                                    return (
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
                                            <td className="text-lg">
                                                {headline}

                                            </td>
                                            <td> <Link to={`/daseboard/updateJobs/${_id}`}>
                                                <button className='btn bg-green-500 text-white hover:bg-green-700' ><FaArrowUpRightFromSquare /></button>
                                            </Link>
                                            </td>
                                            <th>
                                                <button onClick={() => handleJobDelete(_id)} className="btn bg-red-800 text-white hover:bg-red-900"><FaDeleteLeft /></button>
                                            </th>
                                        </tr>
                                    )
                                }
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

};

export default Jobspost;