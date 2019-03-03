---
title: "Git Rebase destroyed your commit? Reflog to the Rescue!"
date: 2013-03-02
---

I admit I’m something of a newb when it comes to the distributed source control system, Git. This came as a shock to me because I consider myself fairly competent working with Mercurial. When I got a “rebase already started” error message while preparing to submit my latest changes, I didn’t much know what to do about it.

Thinking the message was a leftover from a particularly ornery merge I had just performed on a prior issue, I tried running

```bash
$ git rebase --abort
```

and submitted the command. The local changes, the revisions I pulled from the server, and the commit for my most recent issue were all gone. Notice that last bit? I didn’t want that. Wonderful. Ensue frantic Googling.

That’s how I discovered git reflog. A command whose help text summary suffers from Git’s notorious documentation:

```bash
$ git help reflog
git-reflog - Manage reflog information
```

As I understand it, the reflog is like an activity stream of changes that happen to your repository. Fortunately, this means that in almost every instance, you can use it as a way to recover commits that you’ve lost while navigating the myriad of history manipulating commands that see common usage in Git, such as rebase. In this case, I found my commit:

```bash
$ git reflog show
...
483f7d0 HEAD@{18}: commit: DEV-1297 - Expand last viewed widget on home page
...
```

Now what’s cool about this listing, is that you can checkout these refs as if they were branches. If you want, you can even give it a name.

```bash
$ git checkout 483f7d0
$ git checkout -b DEV-1297-recovered
And from this branch my commit is restored and I can get back to work!
```
