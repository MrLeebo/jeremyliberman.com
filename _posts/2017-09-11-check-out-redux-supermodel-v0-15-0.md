---
layout: post
title:  "Check out redux-supermodel v0.15.0!"
date:   2017-09-11
---
If you ever lurk in the [r/reactjs] subreddit, you will probably have noticed that questions about how to organize AJAX requests within your react application is a near-daily occurrence. A lot of people are enthusiastic to try and build a React application, and almost every one of them is going to want to render some AJAX data in their components eventually.

A lot of people will mention writing reducers and action creators, but I feel like those answers leave you in a place where you are basically copy/pasting the same reducers and fetch calls all over your app. Why does it have to be so hard?

I will save the story of my personal thoughts and revelations about successfully managing data in React applications for another time, but I will say that designing a easy-to-use and scale-able way to interact with a RESTful API was one of the first things my team struggled with when we first started using React. Having just come off of a BackboneJS application, I really wanted to interact with an API in React the way I was used to with Backbone.

Hmmm, has it really been 2 years since then?

[redux-supermodel] evolved from my original internal solution. The idea was that all you needed to provide was a URL and it would generate all of the reducers and action creators you needed based on that. From there, you can interact with it via the connect() higher-order component in [react-redux]. Since then I’ve dressed up the interface a lot, wrote unit tests, and of course published it on the internet so that other React enthusiasts can share it.

As I mentioned, I took a lot of inspiration from BackboneJS models and collections with the original implementation, possibly too much. I didn’t really appreciate Unidirectional data flow and ended up coming up with something that was a rip-off of Backbone, including event dispatcher wire-up, before realizing that it didn’t work in a React context.

I’m not the only person to make this kind of mistake, a lot of people start out by trying to use jQuery in their React applications, because those are the tools they are used to in their previous apps.

I digress, redux-supermodel represents my journey to understanding, transitioning from what I thought I knew based on my last web app, and learning how to organize RESTful data in React. It’s something I’m proud of, and I think you should [check it out][redux-supermodel].

[r/reactjs]: https://reddit.com/r/reactjs/
[redux-supermodel]: https://github.com/MrLeebo/redux-supermodel
[react-redux]: https://github.com/reactjs/react-redux
