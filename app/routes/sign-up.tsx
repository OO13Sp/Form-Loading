// import { Form } from "react-router";
// import {  } from "@conform-to/react";

/*

  Convert this form to use react-router "Form" AND "@conform-to/react"
  
  Goals:
    1. Use the "Form" component and server actions from react-router:https://reactrouter.com/start/framework/actions#server-actions
    2. Use the "conform" package to handle the form: https://conform.guide/tutorial
    3. Use zod to validate the form data: https://zod.dev/ both on the client and server
      - To validate the form with zod, "@conform-to/zod" is the package you need to use: https://conform.guide/api/zod/parseWithZod
    4. Use zod to do more advanced validation of password and confirm password
*/

export function action() {
  return null;
}

export default function Component() {
  return (
    <div>
      <h1>Sign Up</h1>
      <p>To get started, please enter your details below.</p>
      <form method="POST">
        <div>
          <label htmlFor="name">Name</label>
          <input type="name" id="name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
