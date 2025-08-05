import React from "react";
import { useEffect } from "react";
import Companies from "./companies";


const Community = () => {

    useEffect(() => {
        console.log("Community component mounted");
    }, []);

    return (
        <div>
            <Companies/>
        </div>
    );

};


export default Community;