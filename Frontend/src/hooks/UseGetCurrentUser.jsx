import { useEffect } from "react"
import { serverURL } from "../Components/Home"
import { useDispatch } from "react-redux"
import { addUser } from "../Utilities/authSlice";

export const UseGetCurrentUser = async () => {
    const dispatch = useDispatch();
    useEffect( () => {
        const fetchUser = async () => {
                try {
                    const res = await fetch(`${serverURL}/api/auth/user` , {
                        credentials: "include"
                    });
                    const result = await res.json();
                    console.log(result);
                    dispatch(addUser(result));
                } catch (error) {
                    console.log("Error in fetch user : " , error);
                }
            };
            fetchUser();
    },[])
}


