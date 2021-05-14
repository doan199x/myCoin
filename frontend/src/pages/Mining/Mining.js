import React, { useContext } from 'react'
import { UserContext } from "../../context/UserProvider";

export default function Mining() {
    const [state, dispatch] = useContext(UserContext);
    return (
        <div>
            Mining
        </div>
    )
}
