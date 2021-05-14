import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { UserContext } from "./UserProvider";

const UserProtect = ({ children }) => {
    const [user] = useContext(UserContext);
    const history = useHistory();
    if (user.privateKey) {
        return (
            <>
                {children}
            </>
        );
    }
    else {
        // history.push("/account");
        // return <></>;
        history.push("/");
        return null;
    }
    
}

export default UserProtect;
