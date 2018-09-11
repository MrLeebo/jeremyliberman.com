---
layout: post
title:  "Participating in the White House’s Summer Jobs+ Code Sprint"
date:   2012-04-15
---

Two weeks ago I read about the [Code Sprint](http://www.whitehouse.gov/codesprint) being put forth by the White House asking developers to write cool applications demonstrating their new [Summer Jobs+ API](http://developer.dol.gov/DOL-SUMMERJOBS-SERVICE.htm). The sprint officially ends tomorrow, April 16th, but regretfully I won’t be submitting an application. This post is a story about the application would have been if I did have a submission.

#### The Summer Jobs+ Code Sprint

Two weeks ago, I read the post on the White House’s [blog](http://www.whitehouse.gov/blog/) challenging developers to participate in the code sprint. And it’s not like I make a habit of reading a blog about the residence of the first family and looking for programmer stuff–I had been directed there by an article about the code sprint from the [Associated Press](http://www.ap.org/).

My coworkers helped me brainstorm the initial idea for the proejct, which was to connect the job listings from the [Summer Jobs+ Bank](http://www.dol.gov/summerjobs/) with the NYC public transportation information available through [NYC OpenData](https://nycopendata.socrata.com/). I wanted to make the assumption that there would be youths that would not have access to a car and needed information about job listings that would be “within walking distance of your house” or “this is the bus route you would take”.

I know it seems a little weird for a dude based out of Kansas City, Missouri who has never even been to New York to select this kind of project. However, I was already aware of NYC’s efforts to provide a great deal of city information to the public through the OpenData project, including up-to-date statistics on bus and subway routes. New York City seemed like a good city to set up a demonstration and, if the idea had traction, more cities could be added over time.

The idea for the site was meant to be simple. You would enter your address and a keyword or two about the kind of job you were looking for. The server would pull the matching listings from the Summer Jobs+ Bank and annotate them with recommendations about how to reach the listing based on NYC’s OpenData information.

The working title for the application was NY Jobs+.

#### Designing my Application

I set out to write a demo application to see what it would look like. This gave me an opportunity to practice jQuery and JavaScript, as I do very little front-end web development at work. I also took the opportunity to try out PHP. Even though I work professionally in a Microsoft stack, I chose PHP for the demo because I wanted to learn something new and I wanted the final result to be a site I could easily zip up and email to somebody without a lot of fuss about deployments. The code sprint lasted for two weeks (it had been extended from one and I feel that even two was too short), but there were only four days that I worked on it in, the evenings after I got off of work.

The goal of the first evening was to authorize successfully and be able to make a basic request and print out the raw JSON to the screen. I didn’t anticipate much trouble implementing their [authorization scheme](http://developer.dol.gov/req-auth.htm), as it is similar to APIs I’ve integrated with at work. Though I was certain that I had followed the specification to the letter, I was always getting error responses from the server. Exhausted from debugging the issue, I emailed the site administrator. Turns out the API had been taken off-line for an update.

The next day, my site came to life because the API was back online. The Department of Labor’s [documentation](http://developer.dol.gov/DOL-SUMMERJOBS-SERVICE.htm) is well-formatted when it comes to formatting the request, but there is absolutely nothing about the payload you get back. So the second evening was spent figuring out how to parse the resulting JSON for some pieces of information that I wanted to display and render it on my page as a table.

By the end of the third evening, I had a style sheet and could search for jobs in New York based on a keyword entered by the user, displaying the results in a template-driven accordion widget using jQuery UI.

On the fourth day, I wanted to render the location of the job listing on a map. That was, unfortunately, when the whole thing began falling apart. While the schema for the job listings [states that the jobLocation is a required field](http://www.dol.gov/summerjobs/employers-step2.htm), the actual data only provides the City, State, and Zip Code. No street address. The data wasn’t actually there. The entire premise of the application was not achievable.

<img src="/assets/NYJobsPlus.png" alt="Web application screenshot">

#### Retrospective

What could I have done differently? Surely more due diligence while requirements gathering to confirm that the information I needed would be present. But in my own defense, the schema does contain entries for street addresses. Heck, the schema has entries for GPS coordinates!

Even though I didn’t accomplish the goal I wanted to with this project, it’s not a complete loss. At work, I mostly deal with server-side code in C#. So I got a chance to refresh my memory on web development and I got the chance to explore technologies I’m not as familiar with, such as jQuery and PHP.

I’m making the source code available as an attachment at the bottom of this post.

To run it, you’ll need a web server that supports PHP (The built-in server, started from the command-line switch, “php.exe -S localhost:80” works just fine for testing) and to enable the cURL extension in your PHP configuration file if it isn’t already enabled.

<a href="/assets/NYJobsPlus.zip">NYJobsPlus.zip</a>
