# Authorization + Authentication (session-based + token-based) in Microservice Architecture

* References
  * [How to protect /signup API route from spam bots? Rate limiting, ...](https://stackoverflow.com/questions/26038191/protecting-user-sign-up-api)
  * [Authentication strategies in microservices architecture](https://alphacoder.xyz/microservices-architecture-authentication/)
* What you should do next
  * protect you API from spam bots that automatically create empty accounts:
    * implement rate limiting for API (in API gateway on better in Nginx)
    * implement reCaptcha for web users (much more important then rate limiting!)
    * do smth else

> To verify is everything secure, post the authentication flow you describe in this article to https://security.stackexchange.com/

## About project

This project implements authorization and authentication in application based on Microservice Architecture.

**Authentication:** the project uses session-based authentication for web browser users and token-based authentication for API users.

**Authorization:** as authorization doesn't need neither sessions nor tokens it is fundamentally the same in any architecture and in any approach

---

**Don't worry about these architectural details too much, read more about Microservice Architecture and you'll understand how to organize it properly. Maybe the stuff I write below is wrong yadayadayad, it's just a rough temporary plan. With experience you'll we know how to organiez it better.** Read this, btw: https://stackoverflow.com/questions/59289909/how-to-hide-multiple-websockets-services-behind-an-api-gateway

In this project I build everything as distributed system. We have several Docker containers, each deployed on a separate server; two of these servers put into one network and two other servers in another network. We do this to decrease the attack surface: "AUTHNET" network is hidden and not publicly available):
* FRONTNET: main app/API gateway container
* FRONTNET: database storing the stuff related to the application itself like text of notes in "Notes App" (we don't create this container, I mention it just as a reminder)
* FRONTNET: Redis for storing session data (we could have Redis on the same server as main app/API Gateway but we won't be able to scale the app. Imagine 3 servers all running instances of main app/API Gateway. All of them need access to the same session data, this we move Redis to separate server which will handle requests from all other 3 servers)
* AUTHNET: Authentication Microservice container
* AUTHNET: Users Database (stores registered users and their data + API tokens of signed in users)

> But if you deploy to your own server, forget about "FRONTNET" and "AUTHNET", everything will be on your single server and you will use a single database for storing both application data (like notes text in "Notes App") and Authentication Microservice data (users data including login/pass). 

---


![](./../../../img/microservice_architecture.svg)

* all communication is handled through HTTPS
* for tokens I use randomly generated unique strings (not JWT) (random string generation is using a cryptographically secure random function)
* I use microservice architecture

## Sign up

![](./../../../img/authentication_session-and-token_signup.png)


## Sign in

![](./../../../img/authentication_session-and-token_signin.png)

1. When a user logs in, the backend app sends the provided username/pass to my Authentication microservice
2. Auth. microservice verifies username/pass, generates token, saves it in its Users db (+associates the token with the current user). Then it returns the token to backend app.
3. Backend app creates a session (stores it in some in-memory db), saves this token in session, and responds to browser with a cookie.
4. On every subsequent request user sends cookie > backend app retrieves token from session data > sends it to Auth. microservice which verifies token and grants access.

## Upon each subsequent request (i.e. signed in user)

![](./../../../img/authentication_session-and-token_subsequent.png)

**Note.** In step 5, Authentication Microservice returns the object with `is_authenticated` property - we never save it in session, we use it in code just to verify if the user is allowed to call API, something like `if (is_authenticated) createUser();`

Don't confuse this property with the same property `is_authenticated` that is stored in session (check it above in "Sign in" flow at step 7) - the `is_authenticated` stored in session reflects the state of Web browser user, whether he is signed in or not, it has nothing to do with API authentication

## Sign out

![](./../../../img/authentication_session-and-token_signout.png)
