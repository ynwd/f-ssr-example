import React from "https://esm.sh/react@18.2.0";

// The props value will be injected from the server handler
export default function App(props: { data: string }) {
  return <h1>Hello, User #{props.data}</h1>;
}
