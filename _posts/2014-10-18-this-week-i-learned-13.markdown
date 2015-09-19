---
title: "This Week I Learned #13"
date: 2014-10-18 08:24 EDT
tags:
  - css
  - git
---

Replacing jQuery's fade functions with silky-smooth CSS transitions both in and out of hover states, a Git strategy for extracting individual commits from a branch's tree, and how to search a Git repo for a commit by name (which Github unfortunately doesn't support).

<!--more-->

## Smooth CSS Transitions to Replace `.fadeIn()` and `.fadeOut()`

With broad support for CSS transitions, it's no longer necessary to depend on something like jQuery for animation. And there are plenty of reasons not to. One of the nice things about pure-CSS transitions is that they obey media queries, making it simple to enable and disable transitions based on screen size. Also, for something as mission-critical as the site's navigation, I prefer not to rely on JavaScript: not all users have it, and a single error can render an entire file inoperable.

To that end, I found myself this week refactoring a drop-down menu which relied on needlessly complicated JavaScript for its functionality. Most important was replacing `.hover()` events used to add classes with a simple `:hover` pseudo-class in the CSS. I also replaced all of the calls to jQuery's `.fadeIn()` and `.fadeOut()` with CSS transitions. But here I ran into trouble. I wanted the drop-down menu to fade into and out of hover using `opacity`, but in order to keep content below the menu clickable it's necessary to use `visibility: hidden`, which can't be transitioned (it's applied immediately). As a result, the menu may fade in nicely, as it's made visible before the `opacity` transitions to `1.0`, but instead of fading out it simple disappears, as its `visibility` is set back to `hidden` before its `opacity` can transition back to `0`.

If this sounds confusing, [Greg Wyvern does a great job of explaining](http://www.greywyvern.com/?post=337) (and illustrating) the problem, and has a fantastically clever solution which uses the selective application of `transition-delay` to time everything perfectly. And the transitions aren't just eye-candy, he points out that they add some important usability to drop-downs, making them more forgiving if the user's cursor unintentionally exits the menu.

## Extracting Commits From The Middle Of a Branch

I found myself in a familiar situation this week. In gearing up for the launch of a new feature, and thus with extra eyes on the website, some unrelated tweaks and requests came in. Expecting the new feature to me merged and launched in the very near future, I absent-mindedly included those commits in my feature branch while continuing development on the new feature. Then I was asked to hold off on deploying the feature, but could I deploy those unrelated tweaks and requests? Of course I could. But I would have to extract them from my feature branch.

This is how I learned about some handy behavior of `git rebase`: it will remove any commits on the branch you're rebasing if they occur earlier in the history. To illustrate, I started out with commits A-D all on my feature branch, but needed to extract and deploy commit C:

    D (feature)
    |
    C
    |
    B
    |
    A (master)

First I checked out master and ran `git cherry-pick C`, which copied commit C to my master branch and updated the HEAD. 

    D (feature)
    |
    C
    |
    B  C' (master)
    | /
    A 

Then, by checking out my feature branch and running `git rebase master`, Git rebased the feature branch on to master, removing the duplicate commit C:

    D (feature)
    |
    B
    |
    C' (master)
    |
    A 

This example is simple, but with multiple commits to extract, it's handy to just `cherry-pick` what you need now and `rebase` what you don't, knowing that `rebase` will clean up any duplicate commits.

## Searching for Commits By Name

Lastly, I needed to find out when and why a colleague had added and removed the [Hirefire](http://hirefire.io/) gem from a project. Github's search interface searches only the current version of a project, so it couldn't help me search for something that was no longer part of the codebase. My next thought was to use Github's "History" view to see all commits to the Gemfile, but there were a lot of them, and the Hirefire change may have been years ago, so I went looking for a better way.

I didn't have to look far to learn that Git's `log` command takes a `--grep=` argument which will limit the log to only commits which contain a search term. `git log --grep=hirefire` instantly showed me the commits which added and removed Hirefire (over 2 years old). Of course, this only works if your team uses descriptive commit messages (`git commit -m "Updates"`, anyone?), so here's another great reason to do so.
