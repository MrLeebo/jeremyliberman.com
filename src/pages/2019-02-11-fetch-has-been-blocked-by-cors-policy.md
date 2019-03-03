---
title: "Fetch has been blocked by CORS policy"
description: "This is a high-level primer on what CORS policies are, and a FAQ answering common issues people experience related to CORS."
date: 2019-02-11
---

Today we're going to talk about CORS policy errors. Why they appear, and a few things you can do about them.

I wrote this brief movie script as an introduction:

INT. OFFICE:

A software DEVELOPER appears to be struggling with a problem at her computer. The project on-screen is a single-page application. Soda cans and discarded poptarts wrappers are scattered around, as is their custom.

<center>DEVELOPER</center>
<center>(flustered)</center>
<center>I don't get it. I've never had this issue in my server-rendered templates.</center>

<div><div style="float: right;">CUT TO:</div><br/></div>
DEVELOPER POV:

The computer monitor is aglow with HTML and JAVASCRIPT. None of the syntax is correct because this is [HOLLYWOOD](https://www.youtube.com/watch?v=u8qgehH3kEQ). There is a loud POP as DEVELOPER opens a fresh can of Dr. Pepper. At the bottom of the screen, a debugger has logged an error in red text.

<center>DEVELOPER</center>
<center>I only wanted to make a call to my API. Why is this happening?</center>
<br/>
<br/>
<img src="/assets/CorsError.png" alt="Example of a CORS error">
<center>Hitchcock, eat your heart out</center>
<hr>

Our intrepid protagonist has encountered a CORS policy error. If you've found this post, then there's a chance you have too. They crop up sometimes when you try to fetch data from an API in your JavaScript application.

```js
// Fetch the weather conditions in Kansas City, Missouri
fetch("https://www.metaweather.com/api/location/2430683/");

/* Error:
  Access to fetch at 'https://www.metaweather.com/api/location/2430683/'
  from origin 'http://localhost:4000' has been blocked by CORS policy: No
  'Access-Control-Allow-Origin' header is present on the requested
  resource. If an opaque response serves your needs, set the request's
  mode to 'no-cors' to fetch the resource with CORS disabled.
*/
```

[CORS](https://devdocs.io/http/cors) stands for Cross-Origin Resource Sharing. If we break that term down, it's a bit like saying "how different websites agree to share data with each other". See, that's not so bad. When you get a CORS policy error, it's because the website you were trying to fetch from (the "at" URL in the snippet above) didn't permit its data to be shared with the website that executed the JavaScript (the "origin" URL in the same snippet). If the server doesn't provide any rules for who it will share with, your browser will assume the worst and will block the request.

### So why don't all origins allow sharing by default?

This is one tool in your browser's toolbox to keep your private information safe from theft by malicious actors. <em>Y'see</em>, the internet can be a wild place. Sometimes <em>banditos</em> ride into town, looking to steal personal data from the friendly townsfolk of these parts.

These [internet banditos](https://en.wikipedia.org/wiki/Cross-site_scripting) try to take advantage of the fact that you may still be logged into another website, to try to steal information. If you have `fetch("facebook.com")` in your client-side JavaScript and the user has an active Facebook session, their <b>session cookie will be included as part of the request</b>. Without CORS, a malicious actor could learn a great deal about you by scraping your facebook page if you happen to be logged in at the time that you visit a website under their control.

### The API is one I control and I'm still getting errors. What should I do?

Conceptually, you want to use three access control headers in your server's response to permit/deny your requests.

```
Access-Control-Allow-Origin: http://permitted.origin.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

I'll briefly expand on these headers below, but you can read more about them [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS):

- <i>Access-Control-Allow-Origin</i> can be `null`, an origin, or `*` meaning all origins. Notice that you cannot permit a list of origins. Instead, you should check to see if the request's origin is in the list and, if it is, set the value to that origin, otherwise use `null`.
- <i>Access-Control-Allow-Methods</i> is a comma separated list of HTTP methods the server permits.
- <i>Access-Control-Allow-Headers</i> is a comma separated list of headers that can be included in the request. If you use a custom authentication header, it should be included here.

If your server is running `node` and `express`, there is the [cors](https://expressjs.com/en/resources/middleware/cors.html) middleware for you to use. Otherwise, I can't enumerate all of the possibly server implementations in this post, but [this may help](https://enable-cors.org/server.html).

### What if I really need to fetch data from an API that won't whitelist my origin?

CORS policies only affect requests coming from browsers. You can setup another server to make the request on your behalf, and then have your `fetch` request talk to that server instead. This is called a [proxy](https://devdocs.io/http/proxy_servers_and_tunneling). Your proxy should probably run in the same origin as your client app, or have its own CORS policy in place.

You can easily build a proxy in express, or you may already be hosting your client-side app from a web server that can act as your proxy. Either way, this is a step you only have to do once. You can reuse the same proxy for any number of APIs.

### I am getting CORS errors in local development. Help!

Okay I'm going to let it slide but just so you know, that wasn't actually a question.

It is a good idea to put your CORS configurations into your `.env` or environment-specific configuration files. If you have separate environments for development/staging/production, it makes sense for them to have different CORS configurations. Your development server can just `Access-Control-Allow-Origin: *` for simplicity, your staging servers can permit staging origins, and your production servers should only permit production origins. You shouldn't (and likely won't be allowed to) permit sharing with your development environment in Production.

If you don't have a development instance of your server, and your local environment must connect to the production server itself, you still have a few options. You can setup a proxy, as discussed earlier. If you're using `webpack-dev-server` to run your local development environment, it has a [proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy) config option.

### Does a CORS policy block the request from reaching my server?

<b>No.</b> CORS restricts access to the request's response via client-side JavaScript, but it doesn't prevent the request from reaching the server. If you investigate the network response in your debugging tool of choice, you will find that it actually has some metadata in it, such as the HTTP response code. If you follow along with how CORS is implemented, this should become clear. The server can permit sharing by sending back `Access-Control-*` headers in the response. For that to work, the request MUST reach the server so that the headers can be sent back!

This means that CORS policies won't protect your API from side effects of those requests. CORS alone won't protect your data from a request to delete your account, where the damage might be done even though the response message has been blocked by the browser. To safeguard against these kinds of vulnerabilities, any endpoints that "do something" besides just return data should be protected by [CSRF tokens](<https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Primary_Defense_Techniques>) and/or via authentication beyond a mere session cookie.

### When should my server allow sharing?

If your server uses session cookies, you <b>shouldn't</b> allow sharing. Unless it's with a friend who would never abuse your trust and whose website is secure enough that it won't be hijacked. You also should not allow cross-origin requests if your API is authenticated using a private developer's Secret Token. If you did, then inevitably some developer will try to use it client-side. If they do that, and any one of their users checks out their network traffic, the users could steal the secret token and impersonate the developer.

If your API is public and has no authentication, or client-side JavaScript is how you intend for people to use your API, then you should allow sharing.

### Does this only affect `fetch`? What if I use `axios` or something else?

CORS policies are enforced by all modern web browsers, regardless of what flavor of web client you use. CORS policies won't affect requests from non-XHR sources, such as `<form>` actions. CORS won't apply to `<img>` or `<script>` tags unless you set the [crossorigin](https://devdocs.io/html/cors_settings_attributes) attribute.

### What about the `no-cors` option?

This is one of those moments where the suggested solution in the error message is rarely ever the course of action you should actually take. `no-cors` suppresses the error message, but it doesn't change the situation; the request still gets sent and you still can't read the response. Perhaps you want to send a message but you don't care whether or not the message was received or accepted. That's not usually the case.

### Conclusion

I hope this has been a helpful primer on CORS policy errors. If you have questions or just want to chat, you can reach me [@MrLeebo](https://twitter.com/MrLeebo).
