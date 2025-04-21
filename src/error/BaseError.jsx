import React from "react";
import { useRouteError } from "react-router-dom";


export default function BaseError() {
    const error = useRouteError()
    return <div>{error.data}</div>
}