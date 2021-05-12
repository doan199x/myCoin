import React, { useReducer } from "react";

/**
 * UserContext
 * @author <name> [<emailAddress>]
 * @since <Added Date or Version>
 */

export const UserContext = React.createContext(null);


/**
 * export userprovider to config usercontext
 * @author <name> [<emailAddress>]
 * @since 1.0
 */

export const UserProvider = ({ reducer, initialState, children }) =>
  (
    <UserContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </UserContext.Provider>
  );
