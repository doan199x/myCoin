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
    history.push("/");
    return <></>;
}

export default UserProtect;
